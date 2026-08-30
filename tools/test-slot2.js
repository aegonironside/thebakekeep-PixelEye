const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2500));
  console.log(await c.evalJS(`(async()=>{
    document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1100));
    const log=[];
    const centre=()=>document.querySelector('.car-slide.is-on img').getAttribute('src').split('/').pop();
    const find8=()=>[...document.querySelectorAll('.car-slide')].find(x=>/\\/8\\.jpg/.test(x.querySelector('img').src));
    log.push('centre at rest: '+centre());
    // first tap on the neighbour should centre it
    find8().dispatchEvent(new MouseEvent('click',{bubbles:true}));
    await new Promise(r=>setTimeout(r,800));
    log.push('after tapping the birthday piece: centre is '+centre()
      +' | lightbox open: '+!document.querySelector('#lb').hidden);
    // second tap, now that it is centred, should open it
    find8().dispatchEvent(new MouseEvent('click',{bubbles:true}));
    await new Promise(r=>setTimeout(r,600));
    const open=!document.querySelector('#lb').hidden;
    const src=document.querySelector('#lbI').getAttribute('src');
    const cap=document.querySelector('#lbC').textContent;
    document.querySelector('#lbX').click();
    log.push('tapping it again: '+(open?'opens full screen -> '+src+' ("'+cap+'")':'DID NOT OPEN'));
    return log.join('\\n  ');
  })()`));
  console.log('\nerrors: ' + (c.consoleErrors().length?c.consoleErrors().join('\n'):'none'));
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
