const { CDP } = require('./cdp.js');
const OUT = '/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  await c.metrics(1440, 900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r => setTimeout(r, 2600));
  const range = await c.evalJS(`(()=>{const h=document.querySelector('#hero');return h.offsetHeight-innerHeight})()`);
  const marks = [['b1',0.10],['b2',0.40],['b3',0.66],['b4',0.92]];
  for (const [n, f] of marks) {
    await c.evalJS(`(async()=>{window.scrollTo({top:${Math.round(range*f)},behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));return 1})()`);
    await c.shot(`${OUT}/hero-${n}.png`);
  }
  console.log('hero shots done');
  c.close();
})().catch(e => { console.error(e.message); process.exit(1) });
