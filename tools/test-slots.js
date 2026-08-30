const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2500));

  console.log('WHAT SITS IN EACH SLOT AT REST (read off the actual painted page)');
  console.log(await c.evalJS(`(async()=>{
    document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1200));
    const vis=[...document.querySelectorAll('.car-slide')]
      .map(s=>({s,o:+getComputedStyle(s).opacity,x:s.getBoundingClientRect().left+s.getBoundingClientRect().width/2}))
      .filter(v=>v.o>0.05)
      .sort((a,b)=>a.x-b.x);
    const mid=innerWidth/2;
    const name=v=>v.s.querySelector('img').getAttribute('src').split('/').pop()
      +'  "'+v.s.querySelector('img').alt.split(',')[0]+'"';
    const slotOf=(v,i,arr)=>{
      const c=arr.findIndex(z=>z.s.classList.contains('is-on'));
      const d=i-c; return d===0?1:d===-1?2:d===1?3:d===-2?4:5;
    };
    return vis.map((v,i,arr)=>'  slot '+slotOf(v,i,arr)+'   '+name(v)).join('\\n');
  })()`));

  console.log('\nTHE NEW PIECE');
  console.log('  ' + await c.evalJS(`(()=>{
    const im=[...document.querySelectorAll('.car-slide img')].find(i=>/\\/8\\.jpg/.test(i.src));
    return im ? 'in the carousel: yes  ('+im.naturalWidth+'x'+im.naturalHeight+', alt "'+im.alt+'")'
              : 'MISSING from the carousel';
  })()`));
  console.log('  ' + await c.evalJS(`(async()=>{
    const s=[...document.querySelectorAll('.car-slide')].find(x=>/\\/8\\.jpg/.test(x.querySelector('img').src));
    s.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    await new Promise(r=>setTimeout(r,400));
    const open=!document.querySelector('#lb').hidden;
    const src=document.querySelector('#lbI').getAttribute('src');
    const cap=document.querySelector('#lbC').textContent;
    document.querySelector('#lbX').click();
    return 'tapping it: '+(open?'opens full screen -> '+src+' ("'+cap+'")':'DID NOT OPEN');
  })()`));

  console.log('\nCOUNTS AND LOADING');
  console.log('  ' + await c.evalJS(`(()=>{
    const im=[...document.querySelectorAll('.car-slide img')];
    const bad=im.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());
    return 'paintings '+im.length+' | dots '+document.querySelectorAll('.car-dots button').length
      +' | broken: '+(bad.length?bad.join(','):'none');
  })()`));

  await c.shot(`${OUT}/SLOT-desktop.png`);
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));
  await c.evalJS(`(async()=>{document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1100));return 1})()`);
  await c.shot(`${OUT}/SLOT-phone.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
