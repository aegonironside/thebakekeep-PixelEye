const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));
  console.log(await c.evalJS(`(async()=>{
    document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,900));
    const lb=document.querySelector('#lb');
    const log=[];
    log.push('before: hidden='+lb.hidden+' display='+getComputedStyle(lb).display);
    const s=document.querySelector('.car-slide.is-on');
    s.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    log.push('immediately after click: hidden='+lb.hidden+' display='+getComputedStyle(lb).display);
    await new Promise(r=>setTimeout(r,80));
    log.push('after 80ms: hidden='+lb.hidden);
    await new Promise(r=>setTimeout(r,500));
    log.push('after 580ms: hidden='+lb.hidden+' display='+getComputedStyle(lb).display);
    log.push('src='+document.querySelector('#lbI').getAttribute('src'));
    log.push('body overflow='+document.body.style.overflow);
    log.push('activeElement='+document.activeElement.className);
    return log.join('\\n  ');
  })()`));
  console.log('\nerrors: ' + (c.consoleErrors().length?c.consoleErrors().join('\n'):'none'));
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
