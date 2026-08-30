const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  console.log('CLICK THE FIELD (real mouse, anywhere on it, not just the icon)');
  const box = await c.evalJS(`(async()=>{
    document.querySelector('#order').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,700));
    const r=document.querySelector('#f-date').getBoundingClientRect();
    return JSON.stringify({x:r.left+30,y:r.top+r.height/2});   // left side, far from the icon
  })()`);
  const {x,y} = JSON.parse(box);
  await c.mouse('mousePressed', x, y); await c.mouse('mouseReleased', x, y);
  await new Promise(r=>setTimeout(r,600));
  console.log('  ' + await c.evalJS(`(()=>{
    const cal=document.querySelector('#cal');
    return 'calendar open: '+cal.classList.contains('open')
      +' | visible: '+(getComputedStyle(cal).visibility==='visible')
      +' | aria-expanded: '+document.querySelector('#f-date').getAttribute('aria-expanded')
      +' | month shown: '+document.querySelector('#calTitle').textContent;
  })()`));

  console.log('\nWHICH DAYS ARE BLOCKED (today is ' + await c.evalJS(`new Date().toDateString()`) + ')');
  console.log('  ' + await c.evalJS(`(()=>{
    const bs=[...document.querySelectorAll('#calGrid button')];
    const off=bs.filter(b=>b.disabled).map(b=>b.textContent);
    const on=bs.filter(b=>!b.disabled).map(b=>b.textContent);
    const min=document.querySelector('#f-date').dataset.min;
    return 'earliest bookable (min): '+min
      +'\\n  blocked in this month: '+(off.length?off.join(', '):'none')
      +'\\n  first selectable: '+on[0]+'  | selectable count: '+on.length;
  })()`));

  console.log('\n  ' + await c.evalJS(`(()=>{
    const t=document.querySelector('#calGrid button.today');
    const p=document.querySelector('#calPrev');
    return 'today is marked: '+!!t+' | today clickable: '+(t?!t.disabled:'n/a')
      +' | prev-month disabled at earliest month: '+p.disabled;
  })()`));

  await c.shot(`${OUT}/C-open.png`);

  console.log('\nPICK A DATE (click the first available day)');
  console.log('  ' + await c.evalJS(`(async()=>{
    const b=[...document.querySelectorAll('#calGrid button')].find(x=>!x.disabled);
    const n=b.textContent;
    b.click(); await new Promise(r=>setTimeout(r,400));
    const i=document.querySelector('#f-date');
    return 'clicked day '+n+' -> field shows "'+i.value+'" | stored: '+i.dataset.iso
      +' | calendar closed: '+!document.querySelector('#cal').classList.contains('open');
  })()`));

  console.log('\nTRY TO BOOK TOO SOON (force an early date past the UI)');
  console.log('  ' + await c.evalJS(`(async()=>{
    const i=document.querySelector('#f-date');
    i.value='Mon, 1 Jan 2020'; i.dataset.iso='2020-01-01';
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,300));
    return 'rejected: '+i.closest('.field').classList.contains('bad')
      +' | message: "'+document.querySelector('[data-for="f-date"]').textContent+'"';
  })()`));

  console.log('\nKEYBOARD');
  console.log('  ' + await c.evalJS(`(async()=>{
    const i=document.querySelector('#f-date');
    i.dataset.iso=''; i.value='';
    i.focus();
    i.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));
    await new Promise(r=>setTimeout(r,350));
    const open=document.querySelector('#cal').classList.contains('open');
    const focused=document.activeElement;
    const wasDay=focused && focused.hasAttribute('data-d') ? focused.getAttribute('data-d') : 'none';
    focused.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
    await new Promise(r=>setTimeout(r,300));
    const moved=document.activeElement.getAttribute('data-d');
    document.querySelector('#cal').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
    await new Promise(r=>setTimeout(r,300));
    return 'ArrowDown opened: '+open+' | focus landed on '+wasDay
      +' | ArrowRight moved to '+moved+' | Escape closed: '+!document.querySelector('#cal').classList.contains('open');
  })()`));

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
