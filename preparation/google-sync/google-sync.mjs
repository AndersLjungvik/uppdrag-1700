// Preparation only: no SDK loads and no student data leaves the browser until configured.
export function createGoogleSync({config, sdk, now = () => Date.now()}) {
  let auth, db, user = null, revision = null;
  const ready = () => {
    if (!config?.enabled || !config?.firebase?.projectId || !config?.allowedDomain)
      throw new Error('Google-synkning är inte aktiverad.');
  };
  const requireUser = () => {
    if (!user) throw new Error('Logga in först.');
    return sdk.doc(db, 'players', user.uid, 'saves', 'adventure-v2');
  };
  return {
    async init() {
      ready();
      const app = sdk.initializeApp(config.firebase);
      auth = sdk.getAuth(app); db = sdk.getFirestore(app);
      await auth.authStateReady();
      // Require explicit account selection; do not silently adopt a shared computer's session.
    },
    async signIn() {
      ready();
      if (!auth) throw new Error('Initiera synkningen först.');
      const provider = new sdk.GoogleAuthProvider();
      provider.setCustomParameters({hd: config.allowedDomain, prompt: 'select_account'});
      const result = await sdk.signInWithPopup(auth, provider);
      const candidate = result.user;
      if (!candidate.emailVerified || candidate.email?.split('@')[1]?.toLowerCase() !== config.allowedDomain.toLowerCase()) {
        await sdk.signOut(auth);
        throw new Error('Använd ett tillåtet skolkonto.');
      }
      // The database rules must independently enforce the domain and ownership.
      user = candidate; revision = null;
      return {uid: user.uid};
    },
    async load() {
      const snap = await sdk.getDoc(requireUser());
      const data = snap.exists() ? snap.data() : null;
      if (data && (data.schema !== 1 || !Number.isInteger(data.revision)))
        throw new Error('Sparläget har ett okänt format.');
      revision = data?.revision ?? 0;
      return data;
    },
    async save(state, practice = {}) {
      const ref = requireUser();
      if (revision === null) throw new Error('Hämta sparläget före första skrivningen.');
      if (!state || state.version !== 2) throw new Error('Ogiltigt sparläge.');
      // Never copy a free-text player name into the cloud preparation.
      const {name, ...game} = JSON.parse(JSON.stringify(state));
      const cleanPractice = JSON.parse(JSON.stringify(practice));
      const expected = revision;
      const next = await sdk.runTransaction(db, async transaction => {
        const snap = await transaction.get(ref);
        const remote = snap.exists() ? snap.data() : null;
        if ((remote?.revision ?? 0) !== expected)
          throw new Error('En annan enhet har ändrat sparläget. Hämta det innan du fortsätter.');
        const timestamp = now();
        const data = {schema: 1, revision: expected + 1, game, practice: cleanPractice,
          firstSeenAt: remote?.firstSeenAt ?? timestamp,
          lastSeenAt: timestamp, updatedAt: sdk.serverTimestamp()};
        transaction.set(ref, data);
        return expected + 1;
      });
      revision = next;
      return {revision};
    },
    async signOut() {
      user = null; revision = null;
      if (auth) await sdk.signOut(auth);
    }
  };
}

export async function loadFirebaseSdk() {
  const base = 'https://www.gstatic.com/firebasejs/13.0.0/';
  const modules = await Promise.all(['app', 'auth', 'firestore'].map(name => import(`${base}firebase-${name}.js`)));
  return Object.assign({}, ...modules);
}
