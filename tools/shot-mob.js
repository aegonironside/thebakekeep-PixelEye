const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2800));
  const range = await c.evalJS(`(()=>{const h=document.querySelector('#hero');return h.offsetHeight-innerHeight})()`);
  const marks=[['m1',0.06],['m2',0.40],['m3',0.66],['m4',0.93]];
  for (const [n,f] of marks) {
    await c.evalJS(`(async()=>{window.scrollTo({top:${Math.round(range*f)},behavior:'instant'});
      await new Promise(r=>setTimeout(r,1000));return 1})()`);
    await c.shot(`${OUT}/${n}.png`);
  }
  console.log('mobile hero shots done');
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
