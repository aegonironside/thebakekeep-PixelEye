const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));

  console.log('THE DUST');
  console.log('  ' + await c.evalJS(`(()=>{
    const all=[...document.querySelectorAll('.mote')];
    const vis=all.filter(m=>getComputedStyle(m).display!=='none');
    const tier=t=>all.filter(m=>m.classList.contains(t)).length;
    const ops=vis.map(m=>+m.style.getPropertyValue('--o')).sort((a,b)=>a-b);
    const durs=vis.map(m=>parseFloat(m.style.getPropertyValue('--dur'))).sort((a,b)=>a-b);
    const delays=vis.map(m=>parseFloat(m.style.getPropertyValue('--delay')));
    return 'total '+all.length+' (far '+tier('far')+', mid '+tier('mid')+', near '+tier('near')+')'
      +'\\n  opacity range '+ops[0]+' to '+ops[ops.length-1]
      +'  | drift time '+durs[0]+'s to '+durs[durs.length-1]+'s'
      +'\\n  all start mid-drift (negative delays): '+delays.every(d=>d<0);
  })()`));

  console.log('\nSEEDED, SO EVERY LOAD LOOKS THE SAME');
  const a = await c.evalJS(`[...document.querySelectorAll('.mote')].map(m=>m.style.left).join(',')`);
  await c.goto('http://127.0.0.1:4173/'); await new Promise(r=>setTimeout(r,1800));
  const b = await c.evalJS(`[...document.querySelectorAll('.mote')].map(m=>m.style.left).join(',')`);
  console.log('  identical across two loads: ' + (a===b));

  console.log('\nARE THEY ACTUALLY MOVING, AND DO THEY REACH THE LOWER SECTIONS?');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#how').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,400));
    const m=document.querySelector('.mote');
    const t1=getComputedStyle(m).transform;
    await new Promise(r=>setTimeout(r,1500));
    const t2=getComputedStyle(m).transform;
    const band=getComputedStyle(document.querySelector('#how')).backgroundImage;
    return 'moving: '+(t1!==t2)+' | the darker bands are translucent now: '+(band.indexOf('gradient')>-1);
  })()`));

  console.log('\nFRAME RATE WITH THE DUST RUNNING');
  console.log('  ' + await c.evalJS(`new Promise(res=>{
    let n=0; const t0=performance.now();
    const l=()=>{n++; performance.now()-t0<2000 ? requestAnimationFrame(l)
      : res('frames in 2s: '+n+'  (~'+Math.round(n/2)+' fps)')};
    requestAnimationFrame(l)})`));

  console.log('\n  ' + await c.evalJS(`(()=>{
    document.body.classList.add('paused');
    const s=getComputedStyle(document.querySelector('.mote')).animationPlayState;
    document.body.classList.remove('paused');
    return 'pause on hidden tab reaches them: '+(s==='paused');
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('#how').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,600));return 1})()`);
  await c.shot(`${OUT}/M-how.png`);
  await c.evalJS(`(async()=>{document.querySelector('#gallery').scrollIntoView({block:'start',behavior:'instant'});await new Promise(r=>setTimeout(r,600));return 1})()`);
  await c.shot(`${OUT}/M-gallery.png`);

  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/'); await new Promise(r=>setTimeout(r,2000));
  console.log('\n  phone shows ' + await c.evalJS(`[...document.querySelectorAll('.mote')].filter(m=>getComputedStyle(m).display!=='none').length`) + ' of 20');

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
