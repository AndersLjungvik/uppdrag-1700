import test from 'node:test';
import assert from 'node:assert/strict';
import {createGoogleSync} from './google-sync.mjs';
function setup(email = 'student@school.example') {
  let record = null, reads = 0;
  const sdk = {initializeApp: () => ({}), getAuth: () => ({authStateReady: async () => {}}), getFirestore: () => ({}),
    GoogleAuthProvider: class {setCustomParameters() {}}, signInWithPopup: async () => ({user: {uid: 'u1', email, emailVerified: true}}),
    signOut: async () => {}, doc: (...args) => args.slice(1).join('/'), serverTimestamp: () => 'SERVER_TIME',
    getDoc: async () => {reads++; return {exists: () => record !== null, data: () => structuredClone(record)};},
    runTransaction: async (_, fn) => fn({get: async () => ({exists: () => record !== null, data: () => structuredClone(record)}), set: (_, value) => {record = value;}})};
  const sync = createGoogleSync({config: {enabled: true, firebase: {projectId: 'test'}, allowedDomain: 'school.example'}, sdk, now: () => 1234});
  return {sync, getRecord: () => record, setRecord: v => {record = v;}, reads: () => reads};
}
test('disabled configuration cannot initialize or contact the provider', async () => {
  await assert.rejects(createGoogleSync({config: {enabled: false}, sdk: {}}).init(), /inte aktiverad/);
});
test('unauthenticated reads are rejected', async () => {
  const {sync, reads} = setup(); await sync.init(); await assert.rejects(sync.load(), /Logga in/); assert.equal(reads(), 0);
});
test('school domain is checked', async () => {
  const {sync} = setup('other@gmail.com'); await sync.init(); await assert.rejects(sync.signIn(), /skolkonto/);
});
test('load precedes save, names omitted, history and game survive', async () => {
  const {sync, getRecord} = setup(); await sync.init(); await sync.signIn();
  await assert.rejects(sync.save({version: 2}), /Hämta/); assert.equal(await sync.load(), null);
  await sync.save({version: 2, name: 'Private name', scene: 'harbor', coins: 8, completed: ['trade']}, {trade: {lastReviewedAt: 1000}});
  assert.equal(getRecord().game.name, undefined); assert.equal(getRecord().game.scene, 'harbor');
  assert.equal(getRecord().practice.trade.lastReviewedAt, 1000); assert.equal(getRecord().firstSeenAt, 1234);
});
test('concurrent device updates cannot overwrite newer progress', async () => {
  const {sync, getRecord, setRecord} = setup(); await sync.init(); await sync.signIn(); await sync.load();
  await sync.save({version: 2, coins: 8}); setRecord({...getRecord(), revision: 2, game: {version: 2, coins: 12}});
  await assert.rejects(sync.save({version: 2, coins: 9}), /annan enhet/); assert.equal(getRecord().game.coins, 12);
});
test('logout prevents further access', async () => {
  const {sync} = setup(); await sync.init(); await sync.signIn(); await sync.load(); await sync.signOut();
  await assert.rejects(sync.save({version: 2}), /Logga in/);
});
