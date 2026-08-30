const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));

  console.log('SECTION PRESENT');
  console.log('  ' + await c.evalJS(`(()=>{
    const s=document.querySelector('#art');
    return 'exists: '+!!s+' | paintings: '+document.querySelectorAll('#artGal button').length
      +' | steps: '+document.querySelectorAll('.astep').length
      +' | sizes: '+document.querySelectorAll('.size').length
      +' | nav link: '+!!document.querySelector('a[href="#art"]');
  })()`));

  console.log('\nTHE SCROLL WIPE');
  console.log(await c.evalJS(`(async()=>{
    const f=document.querySelector('#reveal'), out=[];
    const top=f.getBoundingClientRect().top+scrollY;
    for(const off of [-700,-400,-150,0,180,360,560]){
      window.scrollTo({top:Math.max(0,Math.round(top+off)),behavior:'instant'});
      await new Promise(r=>setTimeout(r,320));
      out.push('  offset '+String(off).padStart(5)+'  --rv = '+(f.style.getPropertyValue('--rv')||'unset'));
    }
    return out.join('\\n');
  })()`));

  console.log('\nSIZE PICKER');
  console.log(await c.evalJS(`(async()=>{
    const out=[];
    for(const i of [0,1,2]){
      document.querySelectorAll('.size')[i].click();
      await new Promise(r=>setTimeout(r,180));
      out.push('  '+document.querySelector('.price-lbl').textContent.padEnd(18)
        +' -> '+document.querySelector('#priceVal').textContent);
    }
    return out.join('\\n');
  })()`));

  console.log('\nORDERING A PAINTING (the cake fields must step aside)');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelectorAll('.size')[1].click();
    document.querySelector('#artOrder').click();
    await new Promise(r=>setTimeout(r,400));
    const ty=document.querySelector('#f-type');
    ty.dispatchEvent(new Event('change',{bubbles:true}));
    await new Promise(r=>setTimeout(r,250));
    return 'type set to: "'+ty.value+'"'
      +'\\n  size prefilled: "'+document.querySelector('#f-size').value+'"'
      +'\\n  flavour field hidden: '+document.querySelector('#f-flavour').closest('.field').hidden
      +'\\n  size label now: "'+document.querySelector('label[for=f-size]').textContent.trim()+'"'
      +'\\n  date hint now: "'+document.querySelector('#f-date').closest('.field').querySelector('.hint').textContent+'"';
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    const set=(id,v)=>{const e=document.querySelector(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))};
    set('#f-name','Malith'); set('#f-phone','0712345678'); set('#f-service','Delivery');
    document.querySelector('#f-date').click(); await new Promise(r=>setTimeout(r,500));
    const d=[...document.querySelectorAll('#calGrid button')].filter(b=>!b.disabled)[5]; d.click();
    await new Promise(r=>setTimeout(r,300));
    let opened=null; window.open=(u)=>{opened=u;return null};
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,400));
    if(!opened) return 'submit blocked, fields flagged: '+document.querySelectorAll('.field.bad').length;
    const m=decodeURIComponent(opened.split('text=')[1]);
    return 'message sent:\\n    '+m.split('\\n').filter(Boolean).join('\\n    ');
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('#art').scrollIntoView({block:'start',behavior:'instant'});await new Promise(r=>setTimeout(r,1200));return 1})()`);
  await c.shot(`${OUT}/A-top.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
