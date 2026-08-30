const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open();
  await c.metrics(1440, 900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r => setTimeout(r, 2500));
  const range = await c.evalJS(`(()=>{const h=document.querySelector('#hero');return h.offsetHeight-innerHeight})()`);
  console.log('hero scroll range: ' + range + 'px\n');
  for (const step of [120, 240, 360]) {
    const count = Math.ceil(range / step) + 2;
    const res = await c.evalJS(`(async()=>{
      window.scrollTo({top:0,behavior:'instant'}); await new Promise(r=>setTimeout(r,600));
      const out=[];
      for(let i=0;i<${count};i++){
        window.scrollBy({top:${step},behavior:'instant'});
        await new Promise(r=>setTimeout(r,320));
        out.push([...document.querySelectorAll('.band')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2)));
      }
      return JSON.stringify(out);
    })()`);
    const rows = JSON.parse(res);
    const runs = [0,1,2,3].map(bi => { let best=0,cur=0;
      rows.forEach(r => { if (r[bi] > 0.97) { cur++; best=Math.max(best,cur) } else cur=0 }); return best });
    const peaks = [0,1,2,3].map(bi => Math.max(...rows.map(r=>r[bi])));
    const verdict = [0,1,2,3].map(bi => {
      if (peaks[bi] < 0.97) return 'SKIPPABLE';
      if (step === 120 && runs[bi] < 5) return 'TOO SHORT';
      return 'ok';
    });
    console.log(`step ${step}px over ${count} flicks`);
    console.log('  full-opacity run per band : [' + runs.join(', ') + ']');
    console.log('  peak opacity per band     : [' + peaks.map(p=>p.toFixed(2)).join(', ') + ']');
    console.log('  verdict                   : [' + verdict.join(', ') + ']\n');
  }
  c.close();
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1) });
