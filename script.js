/* ARAT interactive components — no analytics or third-party form collector is used by this script. */
(() => {
  const ready=()=>{
    document.getElementById('year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
    const mobile=document.getElementById('mobile-nav');
    const menuToggle=document.getElementById('menu-toggle');
    const drops=[...document.querySelectorAll('.nav-item')];
    function closeAll(){drops.forEach(d=>{d.classList.remove('is-open');d.querySelector('.nav-drop-trigger')?.setAttribute('aria-expanded','false')})}
    menuToggle?.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open'); menuToggle.setAttribute('aria-expanded',String(open));
      menuToggle.textContent=open?'Close ✕':'Menu ☰';
      if(!open) closeAll();
    });
    drops.forEach(drop=>{
      const trigger=drop.querySelector('.nav-drop-trigger');
      trigger?.addEventListener('click',e=>{e.preventDefault();const wasOpen=drop.classList.contains('is-open');closeAll();drop.classList.toggle('is-open',!wasOpen);trigger.setAttribute('aria-expanded',String(!wasOpen));});
    });
    document.addEventListener('click',e=>{if(!e.target.closest('.site-header')){closeAll();if(window.innerWidth>960){mobile?.classList.remove('open')}}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.activeElement?.blur();closeAll();mobile?.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');if(menuToggle)menuToggle.textContent='Menu ☰';}});
    document.documentElement.classList.add('js-ready');
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}})},{threshold:.1,rootMargin:'0px 0px 30px 0px'});
      document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    } else {document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));}
    const enquiry=document.getElementById('growth-form');
    if(enquiry){
      const status=document.getElementById('form-status');
      const makeMessage=()=>{
        const f=new FormData(enquiry);
        const services=f.getAll('service');
        return ['Hello ARAT, I would like a growth review.','','Name: '+(f.get('name')||''),'Email: '+(f.get('email')||''),'Phone: '+(f.get('phone')||''),'Business / website: '+(f.get('website')||'Not provided'),'Services: '+(services.join(', ')||'Not sure yet'),'Monthly marketing budget: '+(f.get('budget')||'Not provided'),'My business goals: '+(f.get('message')||'')].join('\n');
      };
      enquiry.addEventListener('submit',e=>{
        e.preventDefault();if(!enquiry.reportValidity())return;
        if(!enquiry.querySelector('[name="privacy"]').checked){alert('Please accept the privacy notice first.');return;}
        const text=makeMessage();const link='https://wa.me/9779844430480?text='+encodeURIComponent(text);
        status.textContent='WhatsApp will open with your completed enquiry. Press Send in WhatsApp to deliver it. If it does not open, use the backup link below.';
        status.classList.add('show');
        const backup=document.getElementById('wa-backup');if(backup){backup.href=link;backup.hidden=false;}
        // A real WhatsApp hand-off: no false claim that the message was sent.
        const opened=window.open(link,'_blank','noopener,noreferrer');
        if(!opened)window.location.href=link;
      });
      document.getElementById('copy-enquiry')?.addEventListener('click',async()=>{
        if(!enquiry.reportValidity())return;
        const message=makeMessage();
        try{await navigator.clipboard.writeText(message);status.textContent='Enquiry copied. Paste it into WhatsApp or email to send.';status.classList.add('show');}
        catch{status.textContent='Copy is unavailable in this browser. Please use the WhatsApp button instead.';status.classList.add('show');}
      });
    }
    const money=(v)=>Number.isFinite(v)?'NPR '+Math.round(v).toLocaleString('en-IN'):'—';
    const asNum=(id)=>Number(document.getElementById(id)?.value||0);
    const seoCalculator=document.getElementById('seo-calculator');
    if(seoCalculator){
      const render=()=>{
        const visits=Math.max(0,asNum('seo-visits'));
        const rate=Math.max(0,asNum('seo-rate'))/100;
        const close=Math.max(0,asNum('seo-close'))/100;
        const order=Math.max(0,asNum('seo-value'));
        const cost=Math.max(0,asNum('seo-cost'));
        const leads=visits*rate,customers=leads*close,revenue=customers*order;
        document.getElementById('seo-out-leads').textContent=leads.toFixed(1);
        document.getElementById('seo-out-customers').textContent=customers.toFixed(1);
        document.getElementById('seo-out-revenue').textContent=money(revenue);
        document.getElementById('seo-out-roi').textContent=cost>0?((revenue-cost)/cost*100).toFixed(0)+'%':'Add a cost';
      };
      seoCalculator.querySelectorAll('input').forEach(i=>i.addEventListener('input',render));render();
    }
    const adsCalculator=document.getElementById('ads-calculator');
    if(adsCalculator){
      const render=()=>{
        const spend=asNum('ads-spend'),clicks=asNum('ads-clicks'),leads=asNum('ads-leads'),sales=asNum('ads-sales'),revenue=asNum('ads-revenue');
        document.getElementById('ads-out-cpc').textContent=clicks>0?money(spend/clicks):'—';
        document.getElementById('ads-out-cpl').textContent=leads>0?money(spend/leads):'—';
        document.getElementById('ads-out-cpa').textContent=sales>0?money(spend/sales):'—';
        document.getElementById('ads-out-roas').textContent=spend>0?(revenue/spend).toFixed(2)+'×':'—';
      };adsCalculator.querySelectorAll('input').forEach(i=>i.addEventListener('input',render));render();
    }
    const checks=[...document.querySelectorAll('.audit-check')];
    if(checks.length){
      const done=document.getElementById('audit-done'),bar=document.getElementById('audit-bar');
      const update=()=>{const n=checks.filter(x=>x.checked).length;done.textContent=n+' / '+checks.length+' reviewed';bar.style.width=(n/checks.length*100)+'%';};
      checks.forEach(c=>c.addEventListener('change',update));update();
      document.getElementById('audit-reset')?.addEventListener('click',()=>{checks.forEach(c=>c.checked=false);update();});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
