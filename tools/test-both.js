const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2500));

  console.log('SECTION');
  console.log('  ' + await c.evalJS(`(async()=>{
    const s=document.querySelector('#both');
    s.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1300));
    const imgs=[...s.querySelectorAll('.pair-visual img')];
    return 'exists: '+!!s+' | headline: "'+s.querySelector('.pair-h').textContent+'"'
      +'\\n  images loaded: '+imgs.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+imgs.length
      +' | ampersand badge: '+!!s.querySelector('.pair-amp')
      +'\\n  facts: '+[...s.querySelectorAll('.pair-facts span')].map(x=>x.textContent).join(' / ')
      +'\\n  entrance played: '+([...s.querySelectorAll('.rise')].every(e=>+getComputedStyle(e).opacity>0.9));
  })()`));

  console.log('\nTHREE ORDER SHAPES (the form must adapt to each)');
  console.log(await c.evalJS(`(async()=>{
    const ty=document.querySelector('#f-type');
    const out=[];
    for(const want of ['Custom Celebration Cake','Oil Art Portrait (Pixel Eye)','Cake and painting together']){
      [...ty.options].forEach(o=>{if(o.textContent===want)ty.value=o.value||o.textContent});
      ty.dispatchEvent(new Event('change',{bubbles:true}));
      await new Promise(r=>setTimeout(r,200));
      out.push('  '+want.padEnd(30)
        +' flavour '+(document.querySelector('#f-flavour').closest('.field').hidden?'hidden':'shown ')
        +' | size label: "'+document.querySelector('label[for=f-size]').textContent.trim()+'"'
        +'\\n'+' '.repeat(34)+' hint: "'+document.querySelector('#f-date').closest('.field').querySelector('.hint').textContent+'"');
    }
    return out.join('\\n');
  })()`));

  console.log('\nTHE "ORDER BOTH" BUTTON');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#f-details').value='';
    document.querySelector('#bothOrder').click();
    await new Promise(r=>setTimeout(r,400));
    return 'type set to: "'+document.querySelector('#f-type').value+'"'
      +'\\n  flavour visible again: '+!document.querySelector('#f-flavour').closest('.field').hidden
      +'\\n  details seeded: "'+document.querySelector('#f-details').value+'"';
  })()`));

  console.log('\nA REAL COMBINED ORDER');
  console.log('  ' + await c.evalJS(`(async()=>{
    const set=(id,v)=>{const e=document.querySelector(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))};
    set('#f-name','Malith'); set('#f-phone','0712345678');
    set('#f-size','1 kg cake, 12 x 18 painting'); set('#f-flavour','chocolate');
    set('#f-service','Delivery'); set('#f-town','Minuwangoda');
    set('#f-details','Birthday for Amma. Chocolate cake, and a portrait from the photo I will send.');
    document.querySelector('#f-date').click(); await new Promise(r=>setTimeout(r,500));
    [...document.querySelectorAll('#calGrid button')].filter(b=>!b.disabled)[7].click();
    await new Promise(r=>setTimeout(r,300));
    let opened=null; window.open=(u)=>{opened=u;return null};
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,400));
    if(!opened) return 'BLOCKED, fields flagged: '+document.querySelectorAll('.field.bad').length;
    return 'message:\\n    '+decodeURIComponent(opened.split('text=')[1]).split('\\n').filter(Boolean).join('\\n    ');
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('#both').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1000));return 1})()`);
  await c.shot(`${OUT}/PAIR-d.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
