import {createGoogleSync, loadFirebaseSdk} from './google-sync.mjs';
const config = window.UPPDRAG_CLOUD_CONFIG;
const bridge = window.UPPDRAG_GAME_CLOUD;
const dialog = document.getElementById('cloudDialog');
const status = document.getElementById('cloudStatus');
const login = document.getElementById('cloudLogin');
const logout = document.getElementById('cloudLogout');
const retry = document.getElementById('cloudRetry');
let sync, account = null, timer, pending = false, running = false, conflict = false;
const message = text => {status.textContent = text;};
const errorMessage = error => {
  if (/annan enhet/.test(error.message || '')) return 'En annan enhet har ett nyare sparläge. Dina ändringar finns lokalt. Logga ut och in för att hämta det nyare sparläget.';
  if (error.code === 'auth/popup-closed-by-user') return 'Inloggningen avbröts. Du spelar fortfarande lokalt.';
  return 'Synkningen kunde inte slutföras. Dina framsteg finns lokalt. Kontrollera anslutningen och försök igen.';
};
function queue() {
  if (!account || conflict) return;
  pending = true; clearTimeout(timer); timer = setTimeout(flush, 1800);
}
async function flush() {
  if (!pending || running || !account || conflict) return;
  const currentAccount = account;
  running = true; pending = false; let succeeded = false;
  try {
    await sync.save(bridge.snapshot(), bridge.snapshot().practice || {});
    succeeded = true; if (account === currentAccount) message('Sparat till ditt konto.');
  } catch (error) {
    pending = true;
    conflict = /annan enhet/.test(error.message || '');
    message(errorMessage(error));
  } finally {
    running = false;
    if (pending && !conflict && account === currentAccount) {if(succeeded) timer=setTimeout(flush,1800);else retry.hidden=false;}
  }
}
window.addEventListener('uppdrag-save', queue);
window.addEventListener('online', () => {if (!conflict) flush();});
document.addEventListener('visibilitychange', () => {if (document.hidden) flush();});
document.getElementById('accountBtn').onclick = () => {
  if (!bridge.pause()) return;
  dialog.showModal();
  if (!config?.enabled) message('Google-inloggning är förberedd men inte aktiverad. Framstegen sparas på denna enhet.');
  else if (!account) message('Logga in med skolans Google-konto. Första inloggningen startar ett eget sparläge; din lokala gästversion behålls.');
  login.hidden = !config?.enabled || !!account; logout.hidden = !account;
};
document.getElementById('cloudClose').onclick = () => {dialog.close(); bridge.resume();};
dialog.addEventListener('cancel', () => bridge.resume());
login.onclick = async () => {
  login.disabled = true;
  try {
    sync ||= createGoogleSync({config, sdk: await loadFirebaseSdk()});
    await sync.init();
    const candidate = await sync.signIn();
    const remote = await sync.load();
    account = candidate.uid; pending = false; conflict = false;
    bridge.enter(account, remote?.game || null);
    login.hidden = true; logout.hidden = false; retry.hidden = true;
    message(remote ? 'Ditt sparläge har hämtats. Fortsätt äventyret.' : 'Ditt konto är klart. Ett nytt äventyr kan börja.');
    queue();
  } catch (error) {
    if (sync) await sync.signOut().catch(() => {});
    account = null; message(errorMessage(error));
  } finally {login.disabled = false;}
};
logout.onclick = async () => {
  logout.disabled = true;
  try {
    if (running) {message('Vänta tills pågående sparning är klar.'); return;}
    if (pending && !conflict) await flush();
    await sync.signOut(); clearTimeout(timer); account = null; pending = false; conflict = false;
    bridge.leave(); logout.hidden = true; login.hidden = !config?.enabled; retry.hidden = true;
    message('Du är utloggad. Den lokala gästversionen är återställd.');
  } catch {message('Utloggningen kunde inte slutföras. Försök igen.');}
  finally {logout.disabled = false;}
};
retry.onclick = () => {retry.hidden = true; if (!conflict) flush();};
