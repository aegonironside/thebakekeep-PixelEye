const { CDP } = require('./cdp.js');
const URL = 'http://127.0.0.1:4173/';
(async () => {
  const c = await CDP.open();
  await c.watchErrors();
  await c.metrics(1440, 900);
  await c.goto(URL);
  await new Promise(r => setTimeout(r, 2500)); // let the blob land

  const setup = await c.evalJS(`(() => {
    const v=document.querySelector('#vid'), s=document.querySelector('#stage'), h=document.querySelector('#hero');
    return JSON.stringify({stage:s.className, src:!!v.src, dur:+(v.duration||0).toFixed(3),
      heroH:h.offsetHeight, vh:innerHeight, range:h.offsetHeight-innerHeight, hidden:document.hidden});
  })()`);
  console.log('SETUP  ' + setup);

  // rAF alive?
  const raf = await c.evalJS(`new Promise(res=>{let n=0;const t0=performance.now();
    const l=()=>{n++;if(performance.now()-t0<800)requestAnimationFrame(l);else res(n)};requestAnimationFrame(l)})`);
  console.log('rAF frames in 800ms: ' + raf);

  console.log('\n--- SCRUB PROBE (frac | scrollY | video time | band opacities | band --k) ---');
  const probe = await c.evalJS(`(async()=>{
    const v=document.querySelector('#vid'),h=document.querySelector('#hero');
    const range=h.offsetHeight-innerHeight, out=[];
    for(const f of [0,0.12,0.28,0.44,0.60,0.76,0.90,1.0]){
      window.scrollTo({top:Math.round(range*f),behavior:'instant'});
      await new Promise(r=>setTimeout(r,600));
      out.push(f.toFixed(2)+'  y='+String(Math.round(scrollY)).padStart(5)
        +'  t='+(v.currentTime||0).toFixed(2)
        +'  op=['+[...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' ')+']'
        +'  k=['+[...document.querySelectorAll('.band')].map(b=>(b.style.getPropertyValue('--k')||'0').trim().slice(0,4)).join(' ')+']');
    }
    window.scrollTo({top:0,behavior:'instant'});
    return out.join('\\n');
  })()`);
  console.log(probe);

  console.log('\n--- FLICK TEST ---');
  for (const [step, count] of [[120,14],[240,9],[360,7]]) {
    const res = await c.evalJS(`(async()=>{
      window.scrollTo({top:0,behavior:'instant'}); await new Promise(r=>setTimeout(r,500));
      const out=[];
      for(let i=0;i<${count};i++){
        window.scrollBy({top:${step},behavior:'instant'});
        await new Promise(r=>setTimeout(r,400));
        out.push([...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' '));
      }
      return out.join('\\n');
    })()`);
    console.log('step ' + step + 'px:');
    console.log(res.split('\n').map((l,i)=>'  '+String(i+1).padStart(2)+'  '+l).join('\n'));
    // count consecutive full-opacity steps per band
    const rows = res.split('\n').map(r => r.split(' ').map(Number));
    const runs = [0,1,2,3].map(bi => {
      let best=0, cur=0;
      rows.forEach(r => { if (r[bi] > 0.97) { cur++; best=Math.max(best,cur) } else cur=0 });
      return best;
    });
    const peaks = [0,1,2,3].map(bi => Math.max(...rows.map(r=>r[bi])).toFixed(2));
    console.log('  max consecutive full-opacity steps per band: [' + runs.join(' ') + ']   peak opacity: [' + peaks.join(' ') + ']');
  }

  const errs = c.consoleErrors();
  console.log('\nCONSOLE ERRORS: ' + (errs.length ? '\n' + errs.join('\n') : 'none'));
  c.close();
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1) });
