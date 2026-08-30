const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));
  const box = await c.evalJS(`(async()=>{
    const b=document.querySelector('.board-ways');
    b.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,900));
    const r=b.getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height)});
  })()`);
  const d=JSON.parse(box);
  await c.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:4,mobile:false});
  await new Promise(r=>setTimeout(r,400));
  await c.shot(`${OUT}/ICON-hi.png`);
  console.log(JSON.stringify(d));
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
