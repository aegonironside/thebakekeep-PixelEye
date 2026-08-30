const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));
  // complete the piping so the seal is showing
  await c.evalJS(`(async()=>{
    document.querySelector('#name').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,900));
    const i=document.querySelector('#pipeInput'); i.value='Sandashi';
    i.dispatchEvent(new Event('input',{bubbles:true}));
    document.querySelector('#pipeStage').style.setProperty('--p','1');
    document.querySelector('#pipeDone').classList.add('on');
    await new Promise(r=>setTimeout(r,600)); return 1})()`);
  await c.shot(`${OUT}/T-piping.png`);
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2000));
  await c.shot(`${OUT}/T-phone.png`);
  console.log('done');
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
