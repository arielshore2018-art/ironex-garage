/* IRONEX Garage — Main JavaScript */
(function(){
'use strict';

/* --- Mobile Menu --- */
const toggle=document.getElementById('mobileToggle');
const mobileNav=document.getElementById('mobileNav');
if(toggle&&mobileNav){
  toggle.addEventListener('click',()=>{
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow=mobileNav.classList.contains('open')?'hidden':'';
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    toggle.classList.remove('active');mobileNav.classList.remove('open');document.body.style.overflow='';
  }));
}

/* --- Smooth Scroll --- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* --- FAQ Accordion --- */
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.parentElement;
    const ans=item.querySelector('.faq-answer');
    const inner=ans.querySelector('.faq-answer-inner');
    const isOpen=item.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(i=>{
      i.classList.remove('active');i.querySelector('.faq-answer').style.maxHeight='0';
    });
    if(!isOpen){item.classList.add('active');ans.style.maxHeight=inner.scrollHeight+'px';}
  });
});

/* --- Scroll Animations --- */
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

/* --- Hidden Form Fields --- */
function fillHidden(){
  const url=window.location.href;
  const params=new URLSearchParams(window.location.search);
  ['formPageUrl','pFormPageUrl'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=url;});
  ['formUtmSource','pFormUtmSource'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=params.get('utm_source')||'';});
  const m=document.getElementById('formUtmMedium');if(m)m.value=params.get('utm_medium')||'';
  const c=document.getElementById('formUtmCampaign');if(c)c.value=params.get('utm_campaign')||'';
  ['formTimestamp','pFormTimestamp'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=new Date().toISOString();});
}
fillHidden();

/* --- Form Validation --- */
function validateForm(form){
  let valid=true;
  form.querySelectorAll('[required]').forEach(inp=>{
    if(!inp.value.trim()){inp.style.borderColor='#c0392b';valid=false;}
    else{inp.style.borderColor='';}
  });
  return valid;
}
['quoteForm','popupForm'].forEach(id=>{
  const f=document.getElementById(id);
  if(f)f.addEventListener('submit',e=>{
    e.preventDefault();
    if(validateForm(f)){
      alert('Thank you! Your request has been received. (Form connection placeholder — connect to email/CRM before launch.)');
      f.reset();fillHidden();
      if(id==='popupForm')closeModal();
    }
  });
});

/* --- Lead Popup Modal --- */
const modal=document.getElementById('leadModal');
const closeBtn=document.getElementById('modalClose');
let modalShown=false;

function openModal(){
  if(modalShown||sessionStorage.getItem('ironex_popup_shown'))return;
  modalShown=true;sessionStorage.setItem('ironex_popup_shown','1');
  modal.classList.add('open');document.body.style.overflow='hidden';
  modal.querySelector('input,select,textarea')?.focus();
}
function closeModal(){
  modal.classList.remove('open');document.body.style.overflow='';
}
if(closeBtn)closeBtn.addEventListener('click',closeModal);
if(modal){
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});
}

/* Popup triggers */
// 45 second timer
setTimeout(openModal,45000);
// 50% scroll
let scrollTriggered=false;
window.addEventListener('scroll',()=>{
  if(!scrollTriggered&&window.scrollY/(document.body.scrollHeight-window.innerHeight)>0.5){
    scrollTriggered=true;openModal();
  }
},{passive:true});
// Exit intent (desktop only)
if(window.innerWidth>768){
  document.addEventListener('mouseout',e=>{
    if(e.clientY<5&&e.relatedTarget===null)openModal();
  });
}

/* --- Analytics Tracking Hooks --- */
document.querySelectorAll('[data-track]').forEach(el=>{
  el.addEventListener('click',()=>{
    const action=el.getAttribute('data-track');
    if(window.dataLayer)window.dataLayer.push({event:'ironex_cta',action:action});
    // console.log('IRONEX Track:',action);
  });
});

})();
