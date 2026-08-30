const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  console.log('EMPTY SUBMIT');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,300));
    return 'fields flagged: '+document.querySelectorAll('.field.bad').length
      +' | date message: "'+document.querySelector('[data-for="f-date"]').textContent+'"';
  })()`));

  console.log('\nFULL ORDER, DATE PICKED FROM THE REAL CALENDAR');
  console.log('  ' + await c.evalJS(`(async()=>{
    const set=(id,v)=>{const e=document.querySelector(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))};
    set('#f-name','Malith'); set('#f-phone','0712345678'); set('#f-type','Custom Celebration Cake');
    set('#f-size','1 kg'); set('#f-flavour','chocolate'); set('#f-service','Delivery');
    set('#f-town','Minuwangoda'); set('#f-details','Birthday cake for Sandaru, gold and burgundy.');
    // open the calendar and click a real day, like a visitor
    document.querySelector('#f-date').click();
    await new Promise(r=>setTimeout(r,700));
    const days=[...document.querySelectorAll('#calGrid button')].filter(b=>!b.disabled);
    days[3].click();                       // fourth available day
    await new Promise(r=>setTimeout(r,400));
    const shown=document.querySelector('#f-date').value;
    const stored=document.querySelector('#f-date').dataset.iso;
    let opened=null; window.open=(u)=>{opened=u;return null};
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,400));
    const msg=opened?decodeURIComponent(opened.split('text=')[1]):'';
    const dateLine=msg.split('\\n').find(l=>l.indexOf('Date needed')===0);
    return 'field shows: "'+shown+'"  stored: '+stored
      +'\\n  success state: '+!!document.querySelector('.sent')
      +'\\n  WhatsApp line: "'+dateLine+'"';
  })()`));

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
