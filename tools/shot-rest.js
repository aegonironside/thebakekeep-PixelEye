const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  for (const [w,h,name] of [[1440,900,'REST-d'],[375,812,'REST-p']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2500));
    await c.evalJS(`(async()=>{
      document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,1400));return 1})()`);
    await c.shot(`${OUT}/${name}.png`);
  }
  console.log('clean at-rest shots taken');
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
