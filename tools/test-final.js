const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  console.log('ENTRANCES (scroll each section into view, confirm it actually animates in)');
  console.log('  ' + await c.evalJS(`(async()=>{
    const secs=['#bake','#name','#gallery','#how','#questions','#order','#contact'];
    const out=[];
    for(const s of secs){
      document.querySelector(s).scrollIntoView({block:'start',behavior:'instant'});
      await new Promise(r=>setTimeout(r,1500));
      const sec=document.querySelector(s);
      const anim=[...sec.querySelectorAll('.rise, .stagger>*')];
      const on=anim.filter(e=>+getComputedStyle(e).opacity>0.9 &&
        getComputedStyle(e).transform.indexOf('matrix(1, 0, 0, 1, 0, 0)')===0 || +getComputedStyle(e).opacity>0.9).length;
      out.push(s+' '+on+'/'+anim.length);
    }
    return out.join('   ');
  })()`));

  console.log('\nSTAGGER DELAY RETIREMENT (hover the 2nd and 3rd cards after the entrance finished)');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#bake').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,2200));
    const g=document.querySelector('.bake-grid');
    const kids=[...g.children];
    return 'grid has .done: '+g.classList.contains('done')
      +' | transition-delay per card: ['+kids.map(k=>getComputedStyle(k).transitionDelay).join(', ')+']';
  })()`));

  console.log('\nDESCENDER / CLIPPING CHECK (a name full of tails in the piped script)');
  console.log('  ' + await c.evalJS(`(async()=>{
    const i=document.querySelector('#pipeInput');
    i.value='Nayanajayagi'; i.dispatchEvent(new Event('input',{bubbles:true}));
    const s=document.querySelector('#pipeStage'); s.style.setProperty('--p','1');
    await new Promise(r=>setTimeout(r,400));
    const n=document.querySelector('#pipeName'), art=document.querySelector('.pipe-art');
    const nr=n.getBoundingClientRect(), sr=s.getBoundingClientRect();
    return 'name box '+Math.round(nr.top-sr.top)+'..'+Math.round(nr.bottom-sr.top)
      +' inside stage 0..'+Math.round(sr.height)
      +' | clipped: '+((nr.top<sr.top)||(nr.bottom>sr.bottom))
      +' | overflow on name: '+getComputedStyle(n).overflow;
  })()`));

  console.log('\nHEADING / TEXT OVERFLOW SWEEP (any element wider than its parent?)');
  console.log('  ' + await c.evalJS(`(()=>{
    const bad=[];
    document.querySelectorAll('h1,h2,h3,p,a.btn,summary').forEach(e=>{
      if(e.scrollWidth > e.clientWidth+2 && getComputedStyle(e).overflow!=='visible') bad.push(e.tagName+'.'+e.className);
    });
    return bad.length? bad.join(', ') : 'none overflowing their own box';
  })()`));

  /* full page shots */
  for (const [w,h,name] of [[1440,900,'full-desktop'],[375,812,'full-phone']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2400));
    await c.evalJS(`(async()=>{
      const H=document.body.scrollHeight;
      for(let y=0;y<H;y+=${h}*0.8){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,220))}
      window.scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,600));return 1})()`);
    await c.shot(`${OUT}/${name}.png`, true);
    console.log('\nfull-page shot: ' + name);
  }

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
