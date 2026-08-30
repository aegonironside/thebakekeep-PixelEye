const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
const [w,h,touch,name,scroll] = [+process.argv[2],+process.argv[3],process.argv[4]==='1',process.argv[5],+(process.argv[6]||0)];
(async () => {
  const c = await CDP.open();
  await c.metrics(w,h,touch,touch);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));
  if(scroll) await c.evalJS(`(async()=>{window.scrollTo({top:${scroll},behavior:'instant'});await new Promise(r=>setTimeout(r,700));return 1})()`);
  await c.shot(`${OUT}/${name}.png`);
  console.log('shot ' + name);
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
