const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
const URL='http://127.0.0.1:4173/';

(async () => {
  const c = await CDP.open(); await c.watchErrors();

  /* ---- 1. reduced motion from load: static hero, no video request ---- */
  await c.metrics(1440,900);
  await c.media([{name:'prefers-reduced-motion',value:'reduce'}]);
  await c.send('Network.enable');
  await c.goto(URL); await new Promise(r=>setTimeout(r,1800));
  console.log('1. REDUCED MOTION FROM LOAD');
  console.log('   ' + await c.evalJS(`(()=>{
    const req=performance.getEntriesByType('resource').filter(e=>/hero-scrub|hero-poster/.test(e.name)).length;
    const stat=getComputedStyle(document.querySelector('.static-hero')).display!=='none';
    const risen=[...document.querySelectorAll('.rise')].filter(e=>+getComputedStyle(e).opacity>0.9).length;
    const tot=document.querySelectorAll('.rise').length;
    const pipe=document.querySelector('#pipeDone').classList.contains('on');
    return 'video/poster requests: '+req+' (want 0) | static hero: '+stat
      +' | .rise elements visible: '+risen+'/'+tot+' | piping shown complete: '+pipe;
  })()`));
  await c.shot(`${OUT}/state-reduced.png`);

  /* ---- 2. flip reduced motion OFF mid-session: scrub must re-arm ---- */
  await c.media([]);
  await new Promise(r=>setTimeout(r,1600));
  console.log('\n2. REDUCED MOTION FLIPPED OFF MID-SESSION (scrub must re-arm)');
  console.log('   ' + await c.evalJS(`(async()=>{
    const h=document.querySelector('#hero'), v=document.querySelector('#vid');
    const range=h.offsetHeight-innerHeight;
    window.scrollTo({top:Math.round(range*0.5),behavior:'instant'});
    await new Promise(r=>setTimeout(r,1800));
    return 'scrub visible: '+(getComputedStyle(document.querySelector('.scrub-only')).display!=='none')
      +' | video src: '+(!!v.src)+' | currentTime at 50%: '+(v.currentTime||0).toFixed(2)
      +' | body still pinned: '+document.body.classList.contains('pinned');
  })()`));

  /* ---- 3. flip reduced motion ON mid-session: everything pins ---- */
  await c.media([{name:'prefers-reduced-motion',value:'reduce'}]);
  await new Promise(r=>setTimeout(r,1200));
  console.log('\n3. REDUCED MOTION FLIPPED ON MID-SESSION (everything must pin)');
  console.log('   ' + await c.evalJS(`(()=>{
    const risen=[...document.querySelectorAll('.rise')].filter(e=>+getComputedStyle(e).opacity>0.9).length;
    return 'pinned class: '+document.body.classList.contains('pinned')
      +' | .rise visible: '+risen+'/'+document.querySelectorAll('.rise').length
      +' | piping complete: '+document.querySelector('#pipeDone').classList.contains('on');
  })()`));
  await c.media([]);

  /* ---- 4. video blocked: page must still be complete ---- */
  await c.block(['*hero-scrub.mp4']);
  await c.goto(URL);
  await new Promise(r=>setTimeout(r,3000));
  console.log('\n4. VIDEO BLOCKED AT THE NETWORK (complete-without-video)');
  console.log('   ' + await c.evalJS(`(()=>{
    const s=document.querySelector('#stage');
    return 'stage classes: "'+s.className+'" | poster painted: '
      +(getComputedStyle(document.querySelector('#poster')).backgroundImage!=='none')
      +' | scroll cue shown: '+!!document.querySelector('.chev')
      +' | gallery items: '+document.querySelectorAll('.gal button').length
      +' | form present: '+!!document.querySelector('#orderForm');
  })()`));
  await c.shot(`${OUT}/state-novideo.png`);
  await c.block([]);

  console.log('\nCONSOLE ERRORS ACROSS ALL STATES: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
