/* Shams Medical - shared logic + page controllers (vanilla JS, no build) */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem('sm_'+k))??d}catch{return d}},set(k,v){try{localStorage.setItem('sm_'+k,JSON.stringify(v))}catch{}}};
const money=v=>'EGP '+Math.round(v).toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byId=id=>PRODUCTS.find(p=>p.id===id);
const params=new URLSearchParams(location.search);
const cart=()=>store.get('cart',{}),wish=()=>store.get('wish',[]);
const HUES={skincare:'#E8D5BE',makeup:'#D9B8A0',haircare:'#CDB89A',bodycare:'#E2CDB0',perfumes:'#C9A67E',personalcare:'#DDD0BC',sunscreen:'#EBD9A8',tools:'#D2BFA9'};
/* Placeholder product art (SVG). Swap p.image for real photography when available. */
function art(c,seed=0){const h=HUES[c]||'#E8D5BE',w=34+seed%3*8;
return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${h}"/><circle cx="200" cy="170" r="130" fill="#FFFCF7" opacity=".35"/><rect x="${200-w}" y="120" width="${w*2}" height="190" rx="${14+seed%2*20}" fill="#FFFCF7"/><rect x="${200-w/2}" y="86" width="${w}" height="40" rx="6" fill="#382820"/><rect x="${200-w+10}" y="190" width="${w*2-20}" height="60" rx="4" fill="#B78A62" opacity=".8"/></svg>`)}
const img=(p,i=0)=>art(p.category,(+p.id.slice(2))+i);
const stars=r=>'★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));
function toast(m){let t=$('.toasts');if(!t){t=document.createElement('div');t.className='toasts';t.setAttribute('role','status');document.body.append(t)}const e=document.createElement('div');e.className='toast';e.textContent=m;t.append(e);setTimeout(()=>e.remove(),2400)}
function card(p){const w=wish().includes(p.id);return `<article class="card"><a href="product.html?id=${p.id}"><img loading="lazy" src="${img(p)}" alt="${esc(p.name)}, ${esc(p.brand)}"></a>
${p.discount?`<span class="tag">-${p.discount}%</span>`:p.isNew?'<span class="tag">New</span>':''}
<button class="wish ${w?'on':''}" data-wish="${p.id}" aria-label="Toggle wishlist for ${esc(p.name)}" aria-pressed="${w}">${w?'♥':'♡'}</button>
<div class="b"><span class="brand">${esc(p.brand)}</span><h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
<div class="stars" title="Sample rating">${stars(p.rating)} <small>(${p.reviews})</small></div>
<div class="price">${money(p.price)}${p.original?`<span class="old">${money(p.original)}</span>`:''}</div>
<button class="btn sm" data-add="${p.id}" ${p.stock?'':'disabled'}>${p.stock?'Add to bag':'Out of stock'}</button></div></article>`}
const grid=(el,list)=>{el.innerHTML=list.length?list.map(card).join(''):''};
/* Cart + wishlist state */
function addCart(id,q=1){const p=byId(id);if(!p||!p.stock)return;const c=cart();c[id]=Math.min((c[id]||0)+q,Math.min(10,p.stock));store.set('cart',c);badges();toast('Added to your bag')}
function setQty(id,q){const c=cart(),p=byId(id);q=Math.max(0,Math.min(q,10,p.stock));q?c[id]=q:delete c[id];store.set('cart',c);badges()}
function toggleWish(id){let w=wish();const on=w.includes(id);w=on?w.filter(x=>x!==id):[...w,id];store.set('wish',w);badges();toast(on?'Removed from wishlist':'Saved to wishlist');
$$(`[data-wish="${id}"]`).forEach(b=>{b.classList.toggle('on',!on);b.textContent=on?'♡':'♥';b.setAttribute('aria-pressed',!on)})}
function badges(){const cn=Object.values(cart()).reduce((a,b)=>a+b,0);$$('[data-cart-n]').forEach(e=>{e.textContent=cn;e.hidden=!cn});$$('[data-wish-n]').forEach(e=>{e.textContent=wish().length;e.hidden=!wish().length});if(window.pageRefresh)pageRefresh()}
function totals(){const c=cart();let sub=0;for(const id in c)sub+=byId(id).price*c[id];const code=store.get('code',''),pct=CONFIG.codes[code]||0,disc=Math.round(sub*pct/100),after=sub-disc,fee=!sub||after>=CONFIG.freeOver?0:CONFIG.deliveryFee;return{sub,disc,fee,total:after+fee,code:pct?code:''}}
document.addEventListener('click',e=>{const a=e.target.closest('[data-add]'),w=e.target.closest('[data-wish]');if(a)addCart(a.dataset.add);if(w)toggleWish(w.dataset.wish)});
/* Shared header / footer */
const MENU=[['Home','index.html'],['Shop All','shop.html'],['Skincare','skincare.html',['Cleansers','Moisturizers','Serums']],['Makeup','makeup.html',['Lips','Face','Eyes']],['Haircare','haircare.html',['Shampoo','Masks','Oils']],['Body Care','bodycare.html',['Lotions','Scrubs','Hand care']],['Perfumes','perfumes.html',['Parfum','Body mists','Colognes']],['Personal Care','personalcare.html'],['Brands','brands.html'],['Offers','offers.html'],['About Us','about.html'],['Contact Us','contact.html']];
function chrome(){const pg=document.body.dataset.nav||'';
$('#site-header').innerHTML=`<div class="bar">Free delivery over ${money(CONFIG.freeOver)} · Demo store: sample products and prices</div>
<header class="site"><div class="hrow"><button class="burger btn ghost sm" aria-label="Menu" aria-expanded="false" id="burger">☰</button>
<a class="logo" href="index.html"><svg viewBox="0 0 32 32" fill="none" stroke="#B78A62" stroke-width="1.8"><circle cx="16" cy="16" r="6"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5L26 26M6 26l3.5-3.5M22.5 9.5L26 6"/></svg>Shams Medical</a>
<form class="search" role="search" action="shop.html"><label class="sr" for="q" hidden>Search</label><input id="q" name="q" type="search" placeholder="Search products or brands" autocomplete="off" value="${esc(params.get('q')||'')}"><div class="sugg" id="sugg"></div></form>
<div class="icons"><a href="account.html" aria-label="Account">👤</a><a href="wishlist.html" aria-label="Wishlist">♡<span class="badge-n" data-wish-n hidden></span></a><a href="cart.html" aria-label="Shopping bag">🛍<span class="badge-n" data-cart-n hidden></span></a></div></div>
<nav class="main" id="nav" aria-label="Main"><ul>${MENU.map(([t,h,sub])=>`<li><a href="${h}" class="${h===pg?'on':''}">${t}</a>${sub?`<div class="mega"><img src="${art(h.replace('.html',''),sub.length)}" alt="" loading="lazy">${sub.map(s=>`<a href="shop.html?cat=${h.replace('.html','')}&q=${encodeURIComponent(s.split(' ')[0])}">${s}</a>`).join('')}<a href="${h}"><b>View all</b></a></div>`:''}</li>`).join('')}</ul></nav></header>`;
$('#site-footer').innerHTML=`<footer class="site"><div class="wrap"><div class="cols"><div><h3>Shams Medical</h3><p>Premium cosmetics, skincare and personal care.</p><p class="note" style="color:var(--taupe)">Address, phone and email: to be added by the store.</p></div>
<div><h3>Shop</h3>${Object.entries(CATS).map(([k,v])=>`<a href="${k=='sunscreen'||k=='tools'?'shop.html?cat='+k:k+'.html'}">${v}</a>`).join('')}</div>
<div><h3>Help</h3><a href="faq.html">FAQ</a><a href="shipping-returns.html">Shipping &amp; returns</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="contact.html">Contact</a></div>
<div><h3>Newsletter</h3><form data-news class="form" novalidate><input type="email" name="email" placeholder="Email address" aria-label="Email"><span class="err"></span><button class="btn gold sm">Subscribe</button></form><p class="note" style="color:var(--taupe)">Frontend demo: nothing is sent or stored.</p></div></div>
<div class="legal"><span>© Shams Medical. Demo website.</span><span>Cash on delivery · Card (demo) · WhatsApp order</span></div></div></footer><button id="top" aria-label="Back to top">↑</button>`;
$('#burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.target.setAttribute('aria-expanded',o)};
const top=$('#top');onscroll=()=>top.style.display=scrollY>500?'block':'none';top.onclick=()=>scrollTo({top:0});
const q=$('#q'),sg=$('#sugg');q.oninput=()=>{const v=q.value.trim().toLowerCase();const r=v?PRODUCTS.filter(p=>(p.name+p.brand).toLowerCase().includes(v)).slice(0,5):[];sg.style.display=r.length?'block':'none';sg.innerHTML=r.map(p=>`<a href="product.html?id=${p.id}"><span>${esc(p.name)}</span><span>${money(p.price)}</span></a>`).join('')};
document.addEventListener('click',e=>{if(!e.target.closest('.search'))sg.style.display='none'});
$('[data-news]').onsubmit=e=>{e.preventDefault();const f=e.target,ok=/^\S+@\S+\.\S+$/.test(f.email.value);f.querySelector('.err').textContent=ok?'':'Enter a valid email address.';if(ok){f.reset();toast('Thanks! (Demo: no email was saved)')}}}
const crumbs=(...a)=>`<nav class="bc" aria-label="Breadcrumb"><a href="index.html">Home</a>${a.map(([t,h])=>' / '+(h?`<a href="${h}">${t}</a>`:t)).join('')}</nav>`;
const empty=(t,m,h,b)=>`<div class="empty"><h2>${t}</h2><p>${m}</p><a class="btn" href="${h}">${b}</a></div>`;
/* Page controllers */
const pages={
home(){const $g=(s,l)=>grid($(s),l);$g('#best',PRODUCTS.filter(p=>p.bestseller).slice(0,8));$g('#new',PRODUCTS.filter(p=>p.isNew).slice(0,4));
$('#cats').innerHTML=Object.entries(CATS).map(([k,v])=>`<a class="cat" href="${k=='sunscreen'||k=='tools'?'shop.html?cat='+k:k+'.html'}"><img loading="lazy" src="${art(k,1)}" alt="">${v}</a>`).join('');
$('#brandgrid').innerHTML=BRANDS.map(b=>`<a class="brandtile" href="shop.html?brand=${encodeURIComponent(b)}">${b}</a>`).join('');
$g('#routine',['skincare','skincare','sunscreen'].map((c,i)=>PRODUCTS.filter(p=>p.category==c)[i*2]))},
shop(){const f={cat:document.body.dataset.cat||params.get('cat')||'',brand:params.get('brand')||'',q:params.get('q')||'',min:'',max:'',rate:'',sort:'pop'},offers=document.body.dataset.offers;let shown=CONFIG.perPage;
const F=$('#filters');F.innerHTML=`<div><label for="fc">Category</label><select id="fc"><option value="">All</option>${Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v}</option>`)}</select></div>
<div><label for="fb">Brand</label><select id="fb"><option value="">All</option>${BRANDS.map(b=>`<option>${b}</option>`)}</select></div>
<div class="row2"><div><label for="fmin">Min EGP</label><input id="fmin" type="number" min="0"></div><div><label for="fmax">Max EGP</label><input id="fmax" type="number" min="0"></div></div>
<div><label for="fr">Rating</label><select id="fr"><option value="">Any</option><option value="4">4★ &amp; up</option><option value="4.5">4.5★ &amp; up</option></select></div>
<div><label for="fs">Sort by</label><select id="fs"><option value="pop">Popularity</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="new">Newest</option></select></div>
<button class="btn ghost sm" id="clr">Clear all filters</button>`;
const map={fc:'cat',fb:'brand',fmin:'min',fmax:'max',fr:'rate',fs:'sort'};
const sync=()=>{for(const id in map)$('#'+id).value=f[map[id]]};
for(const id in map)$('#'+id).onchange=e=>{f[map[id]]=e.target.value;shown=CONFIG.perPage;draw()};
$('#clr').onclick=()=>{Object.assign(f,{cat:document.body.dataset.cat||'',brand:'',q:'',min:'',max:'',rate:'',sort:'pop'});shown=CONFIG.perPage;sync();draw()};
function draw(){let l=PRODUCTS.filter(p=>(!offers||p.discount)&&(!f.cat||p.category==f.cat)&&(!f.brand||p.brand==f.brand)&&(!f.q||(p.name+p.brand+p.desc).toLowerCase().includes(f.q.toLowerCase()))&&(!f.min||p.price>=+f.min)&&(!f.max||p.price<=+f.max)&&(!f.rate||p.rating>=+f.rate));
l.sort({pop:(a,b)=>b.reviews-a.reviews,lo:(a,b)=>a.price-b.price,hi:(a,b)=>b.price-a.price,new:(a,b)=>b.order-a.order}[f.sort]);
$('#count').textContent=l.length+(l.length==1?' product':' products')+(f.q?` for “${f.q}”`:'');
grid($('#list'),l.slice(0,shown));$('#empty').innerHTML=l.length?'':empty('No products found','Try different keywords or clear the filters.','shop.html','Browse all products');
$('#more').hidden=l.length<=shown}
$('#more').onclick=()=>{shown+=CONFIG.perPage;draw()};sync();draw();window.pageRefresh=null},
product(){const p=byId(params.get('id')),el=$('#pd');if(!p){el.innerHTML=empty('Product not found','This product may have been removed.','shop.html','Shop all');return}
document.title=p.name+' | Shams Medical';let rv=store.get('recent',[]).filter(x=>x!==p.id);rv.unshift(p.id);store.set('recent',rv.slice(0,9));let q=1,cur=0;
el.innerHTML=crumbs([CATS[p.category],p.category+'.html'],[p.name])+`<div class="pd"><div><div class="main"><img id="big" src="${img(p)}" alt="${esc(p.name)}"></div><div class="thumbs">${[0,1,2].map(i=>`<img class="${i?'':'on'}" src="${img(p,i)}" alt="View ${i+1}" tabindex="0" data-i="${i}">`).join('')}</div></div>
<div><span class="brand">${esc(p.brand)}</span><h1 style="font-size:2.4rem">${esc(p.name)}</h1><div class="stars">${stars(p.rating)} <small>${p.rating} (${p.reviews} sample reviews)</small></div>
<p class="price" style="font-size:1.5rem;margin:10px 0">${money(p.price)}${p.original?`<span class="old">${money(p.original)}</span> <span class="tag" style="position:static">-${p.discount}%</span>`:''}</p>
<p>${esc(p.desc)}</p><p style="margin:10px 0"><b>Size:</b> ${p.size} · <b>${p.stock?(p.stock<8?'Only '+p.stock+' left':'In stock'):'Out of stock'}</b></p>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin:18px 0"><div class="qty"><button id="m" aria-label="Decrease">−</button><span id="qn">1</span><button id="pl" aria-label="Increase">+</button></div>
<button class="btn gold" data-add-qty ${p.stock?'':'disabled'}>Add to bag</button><button class="btn ghost" data-wish="${p.id}">Save to wishlist</button></div>
<details open><summary>Details &amp; ingredients</summary><p>${p.ingredients}</p></details><details><summary>How to use</summary><p>${p.usage}</p></details><details><summary>Shipping &amp; returns</summary><p>See our <a href="shipping-returns.html"><u>shipping and returns page</u></a>.</p></details></div></div>`;
const wb=$('[data-wish]',el);wb.className='btn ghost';$('#m').onclick=()=>$('#qn').textContent=q=Math.max(1,q-1);$('#pl').onclick=()=>$('#qn').textContent=q=Math.min(q+1,10,p.stock);
$('[data-add-qty]').onclick=()=>addCart(p.id,q);$$('.thumbs img').forEach(t=>t.onclick=()=>{$('#big').src=t.src;$$('.thumbs img').forEach(x=>x.classList.toggle('on',x==t))});
grid($('#related'),PRODUCTS.filter(x=>x.category==p.category&&x.id!=p.id).slice(0,4));const r=rv.slice(1,5).map(byId);$('#recent-wrap').hidden=!r.length;grid($('#recent'),r)},
cart(){window.pageRefresh=()=>{const c=cart(),ids=Object.keys(c),L=$('#lines');if(!ids.length){L.innerHTML=empty('Your bag is empty','Add something you love to get started.','shop.html','Continue shopping');$('#sum').hidden=true;return}
$('#sum').hidden=false;L.innerHTML=ids.map(id=>{const p=byId(id);return `<div class="line"><img src="${img(p)}" alt=""><div><a href="product.html?id=${id}"><b>${esc(p.name)}</b></a><br><small>${esc(p.brand)} · ${money(p.price)}</small><br><button class="btn ghost sm" data-rm="${id}">Remove</button></div><div class="qty"><button data-q="${id}" data-d="-1" aria-label="Decrease">−</button><span>${c[id]}</span><button data-q="${id}" data-d="1" aria-label="Increase">+</button></div></div>`}).join('');
const t=totals();$('#tot').innerHTML=`<div><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.disc?`<div><span>Code ${t.code}</span><span>−${money(t.disc)}</span></div>`:''}<div><span>Delivery</span><span>${t.fee?money(t.fee):'Free'}</span></div><div class="t"><span>Total</span><span>${money(t.total)}</span></div>`};
document.addEventListener('click',e=>{const q=e.target.closest('[data-q]'),r=e.target.closest('[data-rm]');if(q)setQty(q.dataset.q,(cart()[q.dataset.q]||0)+ +q.dataset.d);if(r)setQty(r.dataset.rm,0)});
$('#codef').onsubmit=e=>{e.preventDefault();const v=$('#code').value.trim().toUpperCase();if(CONFIG.codes[v]){store.set('code',v);toast('Code applied')}else toast('Invalid code. Demo codes: SHAMS10, WELCOME15');pageRefresh()};pageRefresh()},
wishlist(){window.pageRefresh=()=>{const l=wish().map(byId).filter(Boolean);$('#wl').innerHTML=l.length?l.map(p=>card(p)+'').join(''):'';$('#wl').style.display=l.length?'':'block';if(!l.length)$('#wl').innerHTML=empty('Your wishlist is empty','Tap the heart on any product to save it here.','shop.html','Discover products');
$$('#wl .card').forEach((c,i)=>{const b=document.createElement('button');b.className='btn ghost sm';b.textContent='Move to bag';b.onclick=()=>{addCart(l[i].id);toggleWish(l[i].id)};c.querySelector('.b').append(b)})};pageRefresh()},
checkout(){const c=cart();if(!Object.keys(c).length){$('#co').innerHTML=empty('Your bag is empty','Add products before checking out.','shop.html','Shop all');return}
const sm=()=>{const t=totals();$('#cos').innerHTML=Object.keys(c).map(i=>`<div><span>${byId(i).name} × ${c[i]}</span><span>${money(byId(i).price*c[i])}</span></div>`).join('')+`<div><span>Delivery</span><span>${t.fee?money(t.fee):'Free'}</span></div><div class="t"><span>Total</span><span>${money(t.total)}</span></div>`};sm();
const F=$('#cof'),rules={name:v=>v.trim().length>2,phone:v=>/^(\+?20|0)?1[0125]\d{8}$/.test(v.replace(/\s/g,'')),email:v=>/^\S+@\S+\.\S+$/.test(v),gov:v=>v,city:v=>v.trim(),address:v=>v.trim().length>8};
const msgs={name:'Enter your full name',phone:'Enter a valid Egyptian mobile number',email:'Enter a valid email',gov:'Choose a governorate',city:'Enter your city or area',address:'Enter a detailed address'};
const check=()=>{let ok=true;for(const k in rules){const good=rules[k](F[k].value);F[k].setAttribute('aria-invalid',!good);F[k].parentNode.querySelector('.err').textContent=good?'':msgs[k];ok=ok&&good}return ok};
const data=()=>({id:'DEMO-'+Date.now().toString(36).toUpperCase(),date:new Date().toLocaleString(),customer:Object.fromEntries(new FormData(F)),items:Object.keys(c).map(i=>({id:i,name:byId(i).name,qty:c[i],price:byId(i).price})),totals:totals()});
F.onsubmit=e=>{e.preventDefault();if(!check()){toast('Please fix the highlighted fields');return}const o=data();
/* TODO: replace with fetch('/api/orders',{method:'POST',body:JSON.stringify(o)}) when a backend exists */
store.set('order',o);store.set('cart',{});store.set('code','');location.href='order-confirmation.html'};
$('#wa').onclick=()=>{if(!check())return;if(!CONFIG.whatsapp){toast('Set the store WhatsApp number in js/products.js (CONFIG.whatsapp)');return}const o=data(),t=o.items.map(i=>`• ${i.name} × ${i.qty}`).join('\n');
open(`https://wa.me/${CONFIG.whatsapp}?text=`+encodeURIComponent(`New order\n${t}\nTotal: ${money(o.totals.total)}\n${o.customer.name} - ${o.customer.phone}\n${o.customer.gov}, ${o.customer.city}, ${o.customer.address}`))}},
confirm(){const o=store.get('order');$('#oc').innerHTML=o?`<div class="empty"><h1>Thank you, ${esc(o.customer.name.split(' ')[0])}</h1><p><b>Demo order ${o.id}</b> · ${o.date}</p><p>This is a simulated confirmation. No payment was taken and no order was sent to the store.</p><p>Total: <b>${money(o.totals.total)}</b> · ${o.customer.pay=='cod'?'Cash on delivery':'Online payment (demo)'}</p><a class="btn" href="shop.html">Continue shopping</a></div>`:empty('No recent order','Place an order to see its confirmation here.','shop.html','Shop all')},
brands(){$('#bl').innerHTML=BRANDS.map(b=>`<a class="brandtile" href="shop.html?brand=${encodeURIComponent(b)}">${b}<br><small style="font-family:Jost;font-size:.85rem">${PRODUCTS.filter(p=>p.brand==b).length} products</small></a>`).join('')}};
document.addEventListener('DOMContentLoaded',()=>{chrome();badges();const k=document.body.dataset.page;if(pages[k])pages[k]();
$$('[data-contact]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const ok=f.checkValidity();if(!ok)return f.reportValidity();f.reset();toast('Message received (demo: not actually sent)')})});
