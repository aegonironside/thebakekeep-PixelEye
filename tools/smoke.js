const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2600));
  console.log(await c.evalJS(`(()=>{
    const fails=[...performance.getEntriesByType('resource')].filter(e=>e.transferSize===0&&e.decodedBodySize===0);
    return 'video loaded: '+document.querySelector('#stage').classList.contains('video-ready')
      +'\\ngallery photos: '+document.querySelectorAll('.gal button').length
      +'\\ndust motes: '+document.querySelectorAll('.mote').length
      +'\\nnames on strip: '+new Set([...document.querySelectorAll('#track span')].map(s=>s.textContent)).size
      +'\\ncalendar present: '+!!document.querySelector('#cal')
      +'\\nfailed downloads: '+(fails.length?fails.map(f=>f.name.split('/').pop()).join(', '):'none');
  })()`));
  await c.shot(`${OUT}/S-live.png`);
  console.log('console errors: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
