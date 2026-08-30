const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));

  console.log('BUILD');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,900));
    const s=document.querySelectorAll('.car-slide'), d=document.querySelectorAll('.car-dots button');
    const on=document.querySelector('.car-slide.is-on');
    return 'slides '+s.length+' | dots '+d.length+' | one marked current: '+(document.querySelectorAll('.car-slide.is-on').length===1)
      +' | current is index '+(on?on.dataset.i:'none');
  })()`));

  console.log('\nLAYOUT (centre big, neighbours smaller and dimmer, far ones hidden)');
  console.log(await c.evalJS(`(()=>{
    return [...document.querySelectorAll('.car-slide')].map(s=>{
      const cs=getComputedStyle(s);
      const m=cs.transform.match(/matrix\\(([^)]+)\\)/);
      const sc=m?parseFloat(m[1].split(',')[0]).toFixed(2):'?';
      return '  slide '+s.dataset.i+'  scale '+sc+'  opacity '+(+cs.opacity).toFixed(2)
        +'  z '+cs.zIndex;
    }).join('\\n');
  })()`));

  console.log('\nCONTROLS');
  console.log('  ' + await c.evalJS(`(async()=>{
    const cur=()=>document.querySelector('.car-slide.is-on').dataset.i;
    const out=[];
    out.push('start '+cur());
    document.querySelector('#carNext').click(); await new Promise(r=>setTimeout(r,700));
    out.push('next -> '+cur());
    document.querySelector('#carPrev').click(); await new Promise(r=>setTimeout(r,700));
    document.querySelector('#carPrev').click(); await new Promise(r=>setTimeout(r,700));
    out.push('prev twice -> '+cur()+' (wraps past zero)');
    document.querySelectorAll('.car-dots button')[4].click(); await new Promise(r=>setTimeout(r,700));
    out.push('dot 5 -> '+cur());
    const car=document.querySelector('#artCar'); car.focus();
    car.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
    await new Promise(r=>setTimeout(r,700));
    out.push('ArrowRight -> '+cur());
    return out.join('\\n  ');
  })()`));

  console.log('\nSWIPE (real pointer drag across the stage)');
  const box = await c.evalJS(`(()=>{const r=document.querySelector('#carStage').getBoundingClientRect();
    return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2})})()`);
  const {x,y} = JSON.parse(box);
  const before = await c.evalJS(`document.querySelector('.car-slide.is-on').dataset.i`);
  await c.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1,buttons:1});
  for (let i=1;i<=6;i++) await c.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:x-i*30,y,button:'left',buttons:1});
  await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:x-180,y,button:'left',buttons:0});
  await new Promise(r=>setTimeout(r,800));
  const after = await c.evalJS(`document.querySelector('.car-slide.is-on').dataset.i`);
  console.log('  dragged left 180px: '+before+' -> '+after+(before!==after?'  (advanced)':'  DID NOT MOVE'));

  console.log('\nTAP THE CENTRE OPENS FULL SCREEN');
  console.log('  ' + await c.evalJS(`(async()=>{
    const s=document.querySelector('.car-slide.is-on');
    s.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    await new Promise(r=>setTimeout(r,500));
    const lb=document.querySelector('#lb');
    const wasOpen=!lb.hidden;                       // read BEFORE closing it
    const src=document.querySelector('#lbI').getAttribute('src');
    const cap=document.querySelector('#lbC').textContent;
    const locked=document.body.style.overflow==='hidden';
    document.querySelector('#lbX').click(); await new Promise(r=>setTimeout(r,300));
    return 'opened: '+wasOpen+' -> '+src+' ("'+cap+'") | page scroll locked: '+locked
      +' | closed after: '+lb.hidden+' | scroll restored: '+(document.body.style.overflow==='');
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    const cur=()=>document.querySelector('.car-slide.is-on').dataset.i;
    const b=cur();
    const side=[...document.querySelectorAll('.car-slide')].find(s=>!s.classList.contains('is-on')&&+getComputedStyle(s).opacity>0.3);
    side.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    await new Promise(r=>setTimeout(r,700));
    return 'tapping a side painting navigates to it: '+b+' -> '+cur()+' (lightbox stayed shut: '+document.querySelector('#lb').hidden+')';
  })()`));

  await c.shot(`${OUT}/CAR-desktop.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
