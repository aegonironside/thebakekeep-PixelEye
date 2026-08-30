const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  for (const [w,h,n] of [[1440,900,'P2-d'],[375,812,'P2-p']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2300));
    await c.evalJS(`(async()=>{document.querySelector('#both').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1300));return 1})()`);
    await c.shot(`${OUT}/${n}.png`);
  }
  console.log('done'); c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
