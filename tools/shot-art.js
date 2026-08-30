const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));
  const top = await c.evalJS(`document.querySelector('#reveal').getBoundingClientRect().top+scrollY`);
  // mid-wipe
  await c.evalJS(`(async()=>{window.scrollTo({top:${Math.round(top-430)},behavior:'instant'});await new Promise(r=>setTimeout(r,600));return 1})()`);
  await c.shot(`${OUT}/A-wipe.png`);
  for (const [sel,name] of [['.art-pick','A-pick'],['.art-gal','A-gal'],['.art-steps','A-steps']]) {
    await c.evalJS(`(async()=>{document.querySelector('${sel}').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1300));return 1})()`);
    await c.shot(`${OUT}/${name}.png`);
  }
  console.log('shots done');
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
