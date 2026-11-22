/* ATRIUM interactive demo | all content is local demo data. */
const PRODUCTS=[{"id":1,"slug":"mira-vase","title":"گلدان سرامیکی میرا","en":"Mira Ceramic Vase","category":"دکوری","categorySlug":"decor","price":1280000,"oldPrice":1540000,"color":"کرم مات","material":"سرامیک دست‌ساز","size":"ارتفاع ۲۸ سانتی‌متر","badge":"پرفروش","art":"vase","scene":"آثار کوچک، تأثیر بزرگ"},{"id":2,"slug":"arco-floor-lamp","title":"آباژور ایستاده آرکو","en":"Arco Floor Lamp","category":"نورپردازی","categorySlug":"lighting","price":4980000,"oldPrice":0,"color":"برنجی مات","material":"فلز و پارچه","size":"ارتفاع ۱۵۰ سانتی‌متر","badge":"جدید","art":"lamp","scene":"نور به سبک زندگی"},{"id":3,"slug":"luna-chair","title":"صندلی راحتی لونا","en":"Luna Lounge Chair","category":"مبلمان","categorySlug":"furniture","price":12450000,"oldPrice":13900000,"color":"کرم و گردویی","material":"چوب و پارچه بوکله","size":"۷۸ × ۸۰ × ۷۳ سانتی‌متر","badge":"ویژه","art":"chair","scene":"آرامش در هر گوشه"},{"id":4,"slug":"nord-side-table","title":"میز عسلی نورد","en":"Nord Side Table","category":"مبلمان","categorySlug":"furniture","price":3690000,"oldPrice":0,"color":"گردویی","material":"چوب بلوط","size":"۴۵ × ۴۵ × ۵۲ سانتی‌متر","badge":"","art":"table","scene":"سادگی با اصالت"},{"id":5,"slug":"moss-cushion","title":"کوسن مخملی موس","en":"Moss Velvet Cushion","category":"منسوجات","categorySlug":"textile","price":890000,"oldPrice":0,"color":"سبز زیتونی","material":"مخمل نرم","size":"۴۵ × ۴۵ سانتی‌متر","badge":"جدید","art":"cushion","scene":"بافت‌های آرام"},{"id":6,"slug":"solis-mirror","title":"آینه دیواری سولیس","en":"Solis Wall Mirror","category":"دکوری","categorySlug":"decor","price":2890000,"oldPrice":0,"color":"برنز","material":"فلز و آینه","size":"قطر ۶۵ سانتی‌متر","badge":"","art":"mirror","scene":"بازتاب نور"},{"id":7,"slug":"terra-tray","title":"سینی چوبی ترا","en":"Terra Wooden Tray","category":"دکوری","categorySlug":"decor","price":1120000,"oldPrice":0,"color":"چوب طبیعی","material":"چوب گردو","size":"۳۸ × ۲۴ سانتی‌متر","badge":"","art":"tray","scene":"جزئیات خاص"},{"id":8,"slug":"haze-pendant","title":"چراغ آویز هِیز","en":"Haze Pendant Lamp","category":"نورپردازی","categorySlug":"lighting","price":4250000,"oldPrice":4900000,"color":"شیری","material":"شیشه و فلز","size":"قطر ۳۵ سانتی‌متر","badge":"پرفروش","art":"pendant","scene":"نور گرم"},{"id":9,"slug":"atlas-rug","title":"قالیچه بافت اطلس","en":"Atlas Woven Rug","category":"منسوجات","categorySlug":"textile","price":6750000,"oldPrice":0,"color":"کرم و آجری","material":"پشم و پنبه","size":"۱۶۰ × ۲۳۰ سانتی‌متر","badge":"","art":"rug","scene":"گرمای زمین"},{"id":10,"slug":"soma-sculpture","title":"مجسمه دکوراتیو سوما","en":"Soma Sculpture","category":"دکوری","categorySlug":"decor","price":1980000,"oldPrice":0,"color":"سنگ طبیعی","material":"کامپوزیت سنگی","size":"ارتفاع ۳۲ سانتی‌متر","badge":"جدید","art":"sculpture","scene":"هنر در خانه"},{"id":11,"slug":"olive-sofa","title":"مبل دونفره اولیو","en":"Olive Two-seat Sofa","category":"مبلمان","categorySlug":"furniture","price":32700000,"oldPrice":0,"color":"سبز خاکی","material":"چوب و کتان","size":"۱۷۵ × ۸۶ × ۷۵ سانتی‌متر","badge":"ویژه","art":"sofa","scene":"مکثی برای زندگی"},{"id":12,"slug":"sienna-candle","title":"شمع معطر سینا","en":"Sienna Scented Candle","category":"دکوری","categorySlug":"decor","price":690000,"oldPrice":0,"color":"آجری","material":"موم طبیعی","size":"۲۲۰ گرم","badge":"","art":"candle","scene":"عطر لحظه‌ها"}];
const IMAGE={"hero-room":"/images/atrium-2a3f4dac911af171.svg","living-room":"/images/atrium-f3e81fe276514560.svg","terra-tray":"/images/atrium-6a1dd002ef6febdb.svg","mira-vase":"/images/atrium-bf87bf7772358e08.svg","dining-room":"/images/atrium-2a3f4dac911af171.svg","nord-side-table":"/images/atrium-f42b811f8b6bfe60.svg","sienna-candle":"/images/atrium-01c3cc4334214448.svg","arco-floor-lamp":"/images/atrium-8b182cb3d396a00b.svg","haze-pendant":"/images/atrium-bde3ead45264fafd.svg","olive-sofa":"/images/atrium-d9741ff939eaea2a.svg","soma-sculpture":"/images/atrium-97b501118887035e.svg","bedroom":"/images/atrium-2a3f4dac911af171.svg","solis-mirror":"/images/atrium-8f7fbbc20d75e3d2.svg","atlas-rug":"/images/atrium-ba15ed102efc3470.svg","luna-chair":"/images/atrium-35e723622e9d9bf1.svg","moss-cushion":"/images/atrium-ad00ac57357d9b9f.svg"};

(() => {
 const fmt=n=>new Intl.NumberFormat("fa-IR").format(n)+" تومان";
 const el=id=>document.getElementById(id);
 let page="home",category="all",query="",sort="featured",lookId=4,currentProduct=null,quantity=1;
 let cart=[];
 try{cart=JSON.parse(localStorage.getItem("atrium-preview-cart")||"[]");if(!Array.isArray(cart))cart=[];}catch{cart=[];}
 const find=id=>PRODUCTS.find(x=>x.id===Number(id));
 const getProduct=slug=>PRODUCTS.find(p=>p.slug===slug);
 const save=()=>{try{localStorage.setItem("atrium-preview-cart",JSON.stringify(cart));}catch{}}
 const total=()=>cart.reduce((sum,item)=>sum+(find(item.id)?.price||0)*item.quantity,0);
 function updateCount(){const count=cart.reduce((s,c)=>s+c.quantity,0);el("cart-counter").textContent=count;el("cart-counter").hidden=count===0;}
 const closeModal=()=>{el("preview-overlays").innerHTML="";document.body.style.overflow="";}
 function showModal(html){el("preview-overlays").innerHTML=html;document.body.style.overflow="hidden";}
 function drawCart(){
  const count=cart.reduce((s,c)=>s+c.quantity,0);
  showModal(`<div class="drawer-backdrop" data-backdrop><aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="سبد خرید"><div class="drawer-top"><div><span class="eyebrow">YOUR BAG</span><h2>سبد خرید <span class="muted">(${count.toLocaleString("fa-IR")})</span></h2></div><button class="icon-button" data-close aria-label="بستن">×</button></div><div class="drawer-content">
  ${cart.length?cart.map(x=>{let p=find(x.id);return `<div class="cart-line"><a href="#" data-product="${p.slug}" class="cart-thumb"><img src="${IMAGE[p.slug]}" alt="${p.title}"/></a><div class="cart-line-info"><a href="#" data-product="${p.slug}" class="cart-line-title">${p.title}</a><span class="tiny muted">${p.color}</span><strong class="cart-price">${fmt(p.price)}</strong><div class="cart-controls"><div class="quantity"><button data-dec="${p.id}" aria-label="کاهش تعداد">−</button><span>${x.quantity.toLocaleString("fa-IR")}</span><button data-inc="${p.id}" aria-label="افزایش تعداد">+</button></div><button class="delete-button" data-delete="${p.id}" aria-label="حذف">⌫</button></div></div></div>`}).join(""):`<div class="empty-cart"><span style="font-size:44px">♧</span><h3>سبدت هنوز خالیه!</h3><p>یه انتخاب زیبا برای خانه‌ات پیدا کن.</p><button class="btn btn-dark" data-nav="shop">مشاهده محصولات ←</button></div>`}
  </div>${cart.length?`<div class="cart-summary"><div class="summary-row"><span>جمع سبد خرید</span><strong>${fmt(total())}</strong></div><p class="tiny muted">درگاه پرداخت در این نسخه نمایشی فعال نیست.</p><button id="preview-checkout" class="btn btn-dark btn-wide">ادامه جهت پرداخت ←</button><div id="demo-message" class="demo-message" hidden>این نسخه نمایشی است و برای خرید واقعی باید بک‌اند و درگاه پرداخت متصل شود.</div></div>`:""}</aside></div>`);
 }
 function add(id,qty=1){
  id=Number(id);const p=find(id);if(!p)return;
  const item=cart.find(x=>x.id===id);
  if(item)item.quantity=Math.min(50,item.quantity+qty);
  else cart.push({id,quantity:Math.min(50,qty)});
  save();updateCount();drawCart();
 }
 function navigate(next,slug){
  closeModal();page=next;
  ["home","shop","product"].forEach(p=>el("page-"+p).hidden=p!==next);
  if(next==="product"&&slug)showProduct(slug);
  if(next==="shop")renderShop();
  window.scrollTo({top:0,behavior:"instant"});
  document.title=next==="home"?"آتریوم | خانه‌ای برای زندگی زیباتر":next==="shop"?"فروشگاه | آتریوم":`${currentProduct?.title||"محصول"} | آتریوم`;
 }
 function chooseCategory(cat){category=cat;query="";navigate("shop");}
 function renderShop(){
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("selected",b.dataset.filter===category));
  const input=el("shop-query");if(input)input.value=query;
  const collator=new Intl.Collator("fa");
  let results=PRODUCTS.filter(p=>(category==="all"||p.categorySlug===category)&&(`${p.title} ${p.en} ${p.category}`.toLowerCase().includes(query.toLowerCase())));
  if(sort==="price-asc")results.sort((a,b)=>a.price-b.price);
  if(sort==="price-desc")results.sort((a,b)=>b.price-a.price);
  if(sort==="name")results.sort((a,b)=>collator.compare(a.title,b.title));
  el("shop-products").innerHTML=results.map(p=>{const node=document.createElement("div");node.innerHTML="";return `${productTemplate(p)}`;}).join("");
  el("shop-results-count").textContent=`${results.length.toLocaleString("fa-IR")} محصول پیدا شد`;
  el("shop-empty").hidden=!!results.length;
 }
 function productTemplate(p){
  return `<article class="product-card"><div class="product-image-wrap"><a href="#" class="product-photo" data-product="${p.slug}"><img src="${IMAGE[p.slug]}" alt="${p.title}"/></a>${p.badge?`<span class="product-badge">${p.badge}</span>`:""}<button class="favorite-button" data-fav="${p.id}" aria-label="علاقه‌مندی‌ها">♡</button><button class="quick-add" data-add="${p.id}">＋ افزودن به سبد</button></div><div class="product-details-mini"><div class="product-card-meta"><span>${p.category}</span><span>ATRIUM EDITION</span></div><a href="#" class="product-title" data-product="${p.slug}">${p.title}</a><div class="price-line"><strong>${fmt(p.price)}</strong>${p.oldPrice?`<del>${fmt(p.oldPrice)}</del>`:""}</div></div></article>`
 }
 function showProduct(slug){
  const p=getProduct(slug);if(!p)return navigate("shop");
  currentProduct=p;quantity=1;
  const related=PRODUCTS.filter(x=>x.id!==p.id&&x.categorySlug===p.categorySlug).slice(0,3);
  for(let i=0;related.length<4&&i<PRODUCTS.length;i++){if(PRODUCTS[i].id!==p.id&&!related.some(x=>x.id===PRODUCTS[i].id))related.push(PRODUCTS[i]);}
  el("page-product").innerHTML=`<main id="main" class="product-page"><div class="container"><nav class="breadcrumbs"><a href="#" data-nav="home">خانه</a> ‹ <a href="#" data-nav="shop">فروشگاه</a> ‹ <span>${p.title}</span></nav><div class="product-layout"><div class="product-gallery"><div class="product-main-visual"><img src="${IMAGE[p.slug]}" alt="${p.title}"/><span class="product-gallery-stamp">ATRIUM COLLECTION / ${String(p.id).padStart(2,"0")}</span></div><div class="product-gallery-note"><span>✳</span><p>زیبایی در جزئیاتی‌ست که هر روز با ما زندگی می‌کنند.</p><span>OBJECTS FOR LIVING</span></div></div><div class="product-information"><span class="eyebrow">ATRIUM EDITION / ${p.en.toUpperCase()}</span><h1>${p.title}</h1><span class="product-en-title">${p.en}</span><div class="product-price">${fmt(p.price)} ${p.oldPrice?`<del>${fmt(p.oldPrice)}</del>`:""}</div><p class="product-lead">یک انتخاب فکرشده برای فضایی که دوستش داری. با فرمی ساده، بافتی دلنشین و جزئیاتی که هر روز بیشتر به چشم می‌آیند.</p><div class="product-info-row"><span>رنگ</span><strong>${p.color}</strong></div><div class="product-info-row"><span>جنس</span><strong>${p.material}</strong></div><div class="product-quantity-line"><span>تعداد</span><div class="quantity quantity-large"><button data-product-dec aria-label="کاهش تعداد">−</button><span id="detail-qty">۱</span><button data-product-inc aria-label="افزایش تعداد">+</button></div></div><button class="btn btn-dark btn-wide product-add-button" data-detail-add>افزودن به سبد خرید ♧</button><p class="product-demo-notice">قیمت‌ها و موجودی در این نسخه نمایشی هستند؛ پرداخت واقعی فعال نیست.</p><div class="product-accord"><div class="tab-buttons"><button class="selected">توضیحات</button><button>مشخصات</button></div><div class="tab-content"><p>برای چیدمانی گرم، شخصی و ماندگار طراحی شده. این محصول با رویکرد مینیمال و توجه به کیفیت متریال، به‌راحتی با دیگر عناصر فضای شما ترکیب می‌شود.</p><p>جنس: ${p.material} | رنگ: ${p.color} | اندازه: ${p.size}</p></div></div></div></div><section class="related-section"><div class="section-heading"><div><span class="eyebrow">YOU MAY ALSO LOVE</span><h2>کنار هم <i>زیباترند.</i></h2></div><a href="#" data-nav="shop" class="text-arrow-link">همه محصولات ←</a></div><div class="product-grid">${related.map(productTemplate).join("")}</div></section></div></main>`;
 }
 function renderTip(id){
  const p=find(id);const tip=el("hero-tip");
  if(!p){tip.hidden=true;return;}
  tip.hidden=false;
  tip.innerHTML=`<button class="tip-close" data-close-tip aria-label="بستن">×</button><img src="${IMAGE[p.slug]}" alt="" width="68" height="76"/><div><small>SHOP THE SCENE</small><a href="#" data-product="${p.slug}">${p.title}</a><b>${fmt(p.price)}</b></div><button class="tip-plus" data-add="${p.id}" aria-label="افزودن به سبد">+</button>`;
 }
 function renderLook(id){
  lookId=id;const p=find(id);
  document.querySelectorAll("[data-look]").forEach(b=>b.classList.toggle("active",Number(b.dataset.look)===id));
  el("look-bar").innerHTML=`<div class="look-product-thumb"><img src="${IMAGE[p.slug]}" alt=""/></div><div class="look-product-info"><span>SELECTED PIECE</span><a href="#" data-product="${p.slug}">${p.title}</a><strong>${fmt(p.price)}</strong></div><button class="look-product-add" data-add="${p.id}" aria-label="افزودن">＋</button>`;
 }
 function drawSearch(){
  showModal(`<div class="search-backdrop" data-backdrop><div class="search-modal" role="dialog" aria-modal="true"><div class="search-top"><div><span class="eyebrow">FIND YOUR PIECE</span><h2>دنبال چه چیزی هستی؟</h2></div><button class="icon-button" data-close aria-label="بستن">×</button></div><form id="search-form" class="search-input-wrap"><span>⌕</span><input id="main-search" autofocus aria-label="جست‌وجو" placeholder="جست‌وجوی مبل، گلدان، آباژور..."/><button type="submit">←</button></form><div id="search-suggestions" class="search-results"></div></div></div>`);
  el("main-search").focus();
 }
 function drawMenu(){
  showModal(`<div class="overlay-backdrop" data-backdrop><aside class="mobile-nav" role="dialog" aria-modal="true"><div class="mobile-nav-top"><strong>آتـــریوم.</strong><button class="icon-button" data-close>×</button></div><nav><a href="#" data-nav="home">صفحه اصلی</a><a href="#" data-nav="shop">همه محصولات</a><a href="#" data-category-link="furniture">مبلمان</a><a href="#" data-category-link="decor">دکوراتیو</a><a href="#" data-category-link="lighting">نورپردازی</a><a href="#" data-category-link="textile">منسوجات</a></nav></aside></div>`);
 }
 document.addEventListener("click",event=>{
  const btn=event.target.closest("button,a");
  if(!btn)return;
  if(btn.dataset.nav){event.preventDefault();navigate(btn.dataset.nav);return;}
  if(btn.dataset.categoryLink){event.preventDefault();chooseCategory(btn.dataset.categoryLink);return;}
  if(btn.dataset.product){event.preventDefault();navigate("product",btn.dataset.product);return;}
  if(btn.dataset.add){event.preventDefault();add(btn.dataset.add);return;}
  if(btn.dataset.cart!==undefined){drawCart();return;}
  if(btn.dataset.search!==undefined){drawSearch();return;}
  if(btn.dataset.menu!==undefined){drawMenu();return;}
  if(btn.dataset.close!==undefined){closeModal();return;}
  if(btn.dataset.closeTip!==undefined){el("hero-tip").hidden=true;return;}
  if(btn.dataset.spot){renderTip(Number(btn.dataset.spot));return;}
  if(btn.dataset.look){renderLook(Number(btn.dataset.look));return;}
  if(btn.dataset.fav){btn.classList.toggle("is-saved");btn.textContent=btn.classList.contains("is-saved")?"♥":"♡";return;}
  if(btn.dataset.filter){category=btn.dataset.filter;renderShop();return;}
  if(btn.dataset.inc){const item=cart.find(x=>x.id===Number(btn.dataset.inc));if(item)item.quantity=Math.min(50,item.quantity+1);save();updateCount();drawCart();return;}
  if(btn.dataset.dec){const item=cart.find(x=>x.id===Number(btn.dataset.dec));if(item){item.quantity--;if(!item.quantity)cart=cart.filter(x=>x!==item);}save();updateCount();drawCart();return;}
  if(btn.dataset.delete){cart=cart.filter(x=>x.id!==Number(btn.dataset.delete));save();updateCount();drawCart();return;}
  if(btn.dataset.productInc!==undefined){quantity=Math.min(50,quantity+1);el("detail-qty").textContent=quantity.toLocaleString("fa-IR");return;}
  if(btn.dataset.productDec!==undefined){quantity=Math.max(1,quantity-1);el("detail-qty").textContent=quantity.toLocaleString("fa-IR");return;}
  if(btn.dataset.detailAdd!==undefined){add(currentProduct.id,quantity);return;}
  if(btn.id==="preview-checkout"){el("demo-message").hidden=false;return;}
  if(btn.id==="reset-filter"){category="all";query="";renderShop();return;}
  if(btn.id==="room-next"){el("room-scroller").scrollBy({left:420,behavior:"smooth"});return;}
  if(btn.id==="room-prev"){el("room-scroller").scrollBy({left:-420,behavior:"smooth"});return;}
  if(btn.getAttribute("href")?.startsWith("#")&&btn.getAttribute("href")!=="#"){
    if(page!=="home"){navigate("home");}
  }
 });
 document.addEventListener("mousedown",e=>{if(e.target.hasAttribute("data-backdrop"))closeModal();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
 document.addEventListener("input",e=>{
  if(e.target.id==="shop-query"){query=e.target.value;renderShop();el("shop-query").focus();el("shop-query").setSelectionRange(query.length,query.length);}
  if(e.target.id==="main-search"){
   const q=e.target.value.toLowerCase();
   const found=PRODUCTS.filter(p=>p.title.includes(q)||p.en.toLowerCase().includes(q)||p.category.includes(q)).slice(0,5);
   el("search-suggestions").innerHTML=q?found.map(p=>`<a href="#" data-product="${p.slug}" class="search-result"><img src="${IMAGE[p.slug]}" width="58" height="62" alt=""><div><strong>${p.title}</strong><span class="tiny muted">${fmt(p.price)}</span></div><span>←</span></a>`).join(""):"";
  }
 });
 document.addEventListener("change",e=>{if(e.target.id==="shop-sort"){sort=e.target.value;renderShop();}});
 document.addEventListener("submit",e=>{if(e.target.id==="search-form"){e.preventDefault();query=el("main-search").value.trim();category="all";navigate("shop");}});
 renderLook(4);updateCount();
})();
