const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          slide WxH    sharp 2x   nav in view   no hScroll   swipe   dots tappable');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[1024,768,'laptop 1024'],[768,1024,'tablet 768'],[375,812,'phone 375'],[320,700,'narrow 320']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2200));
    const r = await c.evalJS(`(async()=>{
      const car=document.querySelector('#artCar');
      car.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const s=document.querySelector('.car-slide.is-on');
      const b=s.getBoundingClientRect();
      const img=s.querySelector('img');
      const prev=document.querySelector('#carPrev').getBoundingClientRect();
      const next=document.querySelector('#carNext').getBoundingClientRect();
      const dot=document.querySelector('.car-dots button').getBoundingClientRect();
      const before=s.dataset.i;
      // simulate a finger swipe via pointer events
      const st=document.querySelector('#carStage'), r2=st.getBoundingClientRect();
      const cx=r2.left+r2.width/2, cy=r2.top+r2.height/2;
      const pe=(t,x)=>st.dispatchEvent(new PointerEvent(t,{bubbles:true,clientX:x,clientY:cy,pointerId:1,isPrimary:true}));
      pe('pointerdown',cx); for(let i=1;i<=6;i++)pe('pointermove',cx-i*28); pe('pointerup',cx-170);
      await new Promise(r=>setTimeout(r,700));
      const after=document.querySelector('.car-slide.is-on').dataset.i;
      return JSON.stringify({
        w:Math.round(b.width),h:Math.round(b.height),
        nat:img.naturalWidth, sharp:img.naturalWidth>=b.width*2,
        navIn:(prev.left>=0 && next.right<=innerWidth+1),
        hs:document.documentElement.scrollWidth>innerWidth+1,
        moved:before!==after,
        dotH:Math.round(dot.height)
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)
      + (d.w+'x'+d.h).padEnd(13)
      + (d.sharp?'yes':'no ('+d.nat+')').padEnd(11)
      + (d.navIn?'yes':'NO').padEnd(14)
      + (d.hs?'NO':'yes').padEnd(13)
      + (d.moved?'yes':'NO').padEnd(8)
      + d.dotH+'px');
    if (w===375) await c.shot(`${OUT}/CAR-phone.png`);
    if (w===1440) await c.shot(`${OUT}/CAR-d.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
