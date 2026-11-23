"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {
  ArrowLeft, ArrowLeftRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight,
  CreditCard, Headphones, Heart, Instagram, Mail, MapPin, Menu, Minus, PackageCheck,
  Phone, Plus, Search, ShieldCheck, ShoppingBag, ShoppingCart, SlidersHorizontal,
  Sparkles, Trash2, Truck, X
} from "lucide-react";
import HouseLightIntro from "./HouseLightIntro";

type Product={ id:number; name:string; description:string; price:number; image:string; category:string; label?:string; oldPrice?:number };
const categories=[
 {id:"living",name:"مبلمان نشیمن",image:"/images/categories/living.webp",short:"مبلمان"},
 {id:"dining",name:"میز و صندلی غذاخوری",image:"/images/categories/dining.webp",short:"غذاخوری"},
 {id:"bedroom",name:"تخت‌خواب و سرویس خواب",image:"/images/categories/bedroom.webp",short:"اتاق خواب"},
 {id:"storage",name:"کمد و کنسول",image:"/images/categories/storage.webp",short:"کنسول"},
];
const products:Product[]=[
 {id:1,name:"آباژور ایستاده آرکا",description:"نورپردازی گرم و مدرن برای منزل",price:8490000,image:"/images/products/arca-lamp.webp",category:"living",label:"پرفروش"},
 {id:2,name:"کنسول چوبی روما",description:"فضای ذخیره‌سازی شیک و جادار",price:12980000,image:"/images/products/roma-sideboard.webp",category:"storage",label:"منتخب"},
 {id:3,name:"مبل تک‌نفره لیورا",description:"ترکیب راحتی، طراحی و سبک مدرن",price:19980000,image:"/images/products/liora-chair.webp",category:"living",oldPrice:21980000},
 {id:4,name:"میز کنار مبلی نوا",description:"مکمل زیبا برای فضای نشیمن",price:4980000,image:"/images/products/nova-table.webp",category:"dining"},
];
const spaces=[
 {title:"اتاق نشیمن",desc:"گرم، صمیمی و مناسب دورهمی‌های دلنشین",image:"/images/spaces/living.webp",filter:"living"},
 {title:"اتاق خواب",desc:"آرامشی که هر شب در انتظار شماست",image:"/images/spaces/bedroom.webp",filter:"bedroom"},
 {title:"فضای غذاخوری",desc:"برای لحظه‌های شیرین دور یک میز",image:"/images/spaces/dining.webp",filter:"dining"},
];
const articles=[
 {title:"چطور از چوب در دکوراسیون مدرن استفاده کنیم؟",desc:"ایده‌هایی کاربردی برای ترکیب متریال‌های طبیعی و ساختن فضایی گرم.",image:"/images/journal/wood-care.webp"},
 {title:"راهنمای انتخاب تخت‌خواب مناسب",desc:"از ابعاد اتاق تا رنگ و جنس، قبل از خرید این نکات را بدانید.",image:"/images/journal/choose-bed.webp"},
 {title:"۷ اصل چیدمان نشیمن گرم و دعوت‌کننده",desc:"با چند تغییر کوچک، تعادل و آرامش بیشتری به خانه بیاورید.",image:"/images/journal/warm-living.webp"},
];
const rial=(n:number)=>`${n.toLocaleString("fa-IR")} تومان`;
function go(id:string){document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
function SectionTitle({eyebrow,title,subtitle,action}:{eyebrow?:string;title:string;subtitle?:string;action?:React.ReactNode}){return <div className="section-heading" data-reveal><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>}

export default function HouseWoodHome(){
 const [ready,setReady]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [cartOpen,setCartOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false);
 const [search,setSearch]=useState("");
 const [filter,setFilter]=useState("all");
 const [cart,setCart]=useState<Record<number,number>>({});
 const [favs,setFavs]=useState<number[]>([]);
 const [details,setDetails]=useState<Product|null>(null);
 const [article,setArticle]=useState<(typeof articles)[number]|null>(null);
 const [subscribe,setSubscribe]=useState("");
 const [formNote,setFormNote]=useState("");
 const mainRef=useRef<HTMLDivElement>(null);
 const onIntroDone=useCallback(()=>setReady(true),[]);
 const count=Object.values(cart).reduce((a,v)=>a+v,0);
 const total=products.reduce((a,p)=>a+p.price*(cart[p.id]||0),0);
 const shown=useMemo(()=>products.filter(p=>(filter==="all"||p.category===filter)&&p.name.includes(search.trim())),[filter,search]);
 const add=(id:number)=>{setCart(old=>({...old,[id]:(old[id]||0)+1}));setDetails(null);setCartOpen(true)};
 const selectCategory=(id:string)=>{setFilter(id);setMenuOpen(false);setSearchOpen(false);window.setTimeout(()=>go("products"),80)};
 const navigate=(id:string)=>{setMenuOpen(false);window.setTimeout(()=>go(id),80)};
 useEffect(()=>{
   const closed=!(menuOpen||cartOpen||searchOpen||details||article);
   document.body.style.overflow=closed?"":"hidden";
   const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMenuOpen(false);setCartOpen(false);setSearchOpen(false);setDetails(null);setArticle(null)}};
   window.addEventListener("keydown",key);return ()=>{document.body.style.overflow="";window.removeEventListener("keydown",key)};
 },[menuOpen,cartOpen,searchOpen,details,article]);
 useEffect(()=>{
   if(!ready||!mainRef.current||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
   gsap.registerPlugin(ScrollTrigger);
   const ctx=gsap.context(()=>{
     gsap.fromTo(".hero-copy>*",{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:1,stagger:.13,ease:"power3.out",delay:.15});
     gsap.fromTo(".service-strip",{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.85,ease:"power3.out",delay:.6});
     gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el)=>{
       gsap.fromTo(el,{autoAlpha:0,y:38},{autoAlpha:1,y:0,duration:.83,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%",once:true}});
     });
     gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((grid)=>{
       gsap.fromTo([...grid.children],{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.72,stagger:.1,ease:"power3.out",scrollTrigger:{trigger:grid,start:"top 89%",once:true}});
     });
     gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el)=>{
       gsap.fromTo(el,{y:-16,scale:1.04},{y:16,scale:1.04,ease:"none",scrollTrigger:{trigger:el.parentElement,start:"top bottom",end:"bottom top",scrub:1.3}})
     });
   },mainRef);
   return ()=>{ctx.revert();};
 },[ready]);
 return <>
 {!ready&&<HouseLightIntro onComplete={onIntroDone}/>}
 <div className={`site ${ready?"site--ready":""}`} ref={mainRef}>
  <header className="site-header" id="top">
   <div className="header-inner container">
    <a className="brand" href="#top" aria-label="خانه چوب، صفحه اصلی"><span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M5 19 20 6l15 13v15H5V19Z" stroke="currentColor" strokeWidth="2.7" strokeLinejoin="round"/><path d="M14 34V22h12v12" stroke="currentColor" strokeWidth="2.3"/></svg></span><span>خانه چوب</span></a>
    <nav className="desktop-nav" aria-label="ناوبری اصلی"><a className="active" href="#top">صفحه اصلی</a><button onClick={()=>navigate("products")}>محصولات <ChevronDown size={15}/></button><button onClick={()=>navigate("categories")}>دکوراسیون منزل</button><button onClick={()=>navigate("journal")}>مجله و ایده‌ها</button><button onClick={()=>navigate("about")}>درباره ما</button><button onClick={()=>navigate("footer")}>تماس با ما</button></nav>
    <div className="header-tools"><button aria-label="جست‌وجو" onClick={()=>setSearchOpen(true)}><Search size={21}/></button><button className="cart-head" aria-label="سبد خرید" onClick={()=>setCartOpen(true)}><ShoppingCart size={21}/>{count>0&&<span>{count.toLocaleString("fa-IR")}</span>}</button><button className="mobile-toggle" aria-label="باز کردن منوی موبایل" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={24}/></button></div>
   </div>
  </header>
  <main>
   <section className="hero" aria-labelledby="hero-title">
    <picture className="hero-picture"><source srcSet="/images/hero-mobile.webp" media="(max-width: 700px)"/><img src="/images/hero-scene.webp" alt="فضای نشیمن گرم با مبل کرم، میز چوبی، آباژور و گلدان در یک صحنه یکپارچه" fetchPriority="high" width="1672" height="941"/></picture>
    <div className="hero-copy"><span className="hero-kicker">مبلمان و دکوراسیون خانگی <span className="tiny-rule"/></span><h1 id="hero-title">دکوراسیون مدرن منزل<br/><em>با مبلمانی شیک و ماندگار</em></h1><p>مجموعه‌ای از مبلمان مدرن، راحت و باکیفیت برای خلق فضایی گرم، زیبا و هماهنگ در خانه شما.</p><button className="solid-btn" onClick={()=>navigate("products")}>مشاهده و خرید محصولات <ArrowLeft size={20}/></button></div>
   </section>
   <div className="service-strip container" aria-label="مزایای فروشگاه"><div><Truck/><span><strong>ارسال سریع و مطمئن</strong><small>به سراسر کشور</small></span></div><div><ShieldCheck/><span><strong>تضمین اصالت کالا</strong><small>و کیفیت بالا</small></span></div><div><CreditCard/><span><strong>پرداخت امن</strong><small>و آسان</small></span></div><div><Headphones/><span><strong>پشتیبانی تخصصی</strong><small>در تمام مراحل خرید</small></span></div></div>

   <section id="categories" className="section categories container">
    <SectionTitle eyebrow="برای هر گوشه از خانه" title="دسته‌بندی محصولات" subtitle="مجموعه‌ای متنوع از مبلمان و اکسسوری‌های خانه برای هر سلیقه و نیاز" action={<button className="text-link" onClick={()=>navigate("products")}>مشاهده همه دسته‌بندی‌ها <ArrowLeft size={17}/></button>}/>
    <div className="category-grid" data-stagger>{categories.map(c=><button key={c.id} className="category-card" onClick={()=>selectCategory(c.id)} aria-label={`مشاهده ${c.name}`}><span className="category-photo"><img src={c.image} alt="" loading="lazy" width="500" height="360"/></span><span className="category-caption"><b>{c.name}</b><span><ArrowLeft size={19}/></span></span></button>)}</div>
   </section>

   <section id="products" className="section product-section container">
    <SectionTitle eyebrow="منتخب خانه چوب" title="محبوب‌ترین محصولات" subtitle="منتخب پرفروش‌ترین و محبوب‌ترین مبلمان و اکسسوری‌های خانه"/>
    <div className="catalog-layout">
     <div className="products-side"><div className="filters" role="group" aria-label="فیلتر محصولات"><button className={filter==="all"?"is-active":""} onClick={()=>setFilter("all")}>همه</button>{categories.map(c=><button key={c.id} className={filter===c.id?"is-active":""} onClick={()=>setFilter(c.id)}>{c.short}</button>)}</div><div className="product-grid" data-stagger>{shown.map(p=><article className="product-card" key={p.id}><div className="product-image"><button className={`heart-btn ${favs.includes(p.id)?"liked":""}`} aria-label={`علاقه‌مندی ${p.name}`} onClick={()=>setFavs(old=>old.includes(p.id)?old.filter(x=>x!==p.id):[...old,p.id])}><Heart size={18} fill={favs.includes(p.id)?"currentColor":"none"}/></button>{p.label&&<span className="product-label">{p.label}</span>}<button className="product-image-click" onClick={()=>setDetails(p)} aria-label={`جزئیات ${p.name}`}><img src={p.image} loading="lazy" alt={p.name} width="420" height="310"/></button></div><div className="product-content"><button className="product-title" onClick={()=>setDetails(p)}>{p.name}</button><p>{p.description}</p><div className="product-bottom"><strong>{rial(p.price)}</strong><button className="add-small" onClick={()=>add(p.id)} aria-label={`افزودن ${p.name} به سبد خرید`}><ShoppingCart size={18}/></button></div></div></article>)}</div>{shown.length===0&&<p className="empty-results">در این دسته‌بندی فعلاً محصول نمایشی وجود ندارد.</p>}</div>
     <div className="collection-card" data-reveal><img src="/images/autumn-collection.webp" alt="مبل تک‌نفره روشن با میز کنار مبلی در اتاقی گرم" loading="lazy" width="609" height="446"/><div className="collection-shade"/><div className="collection-copy"><span>منتخب فصل</span><h3>کالکشن پاییزه<br/>خانه چوب</h3><button onClick={()=>{setFilter("all");navigate("products")}}>مشاهده مجموعه <ArrowLeft size={19}/></button></div></div>
    </div>
   </section>

   <section id="spaces" className="section spaces-section"><div className="container"><div className="spaces-heading" data-reveal><span className="eyebrow">الهام برای خانه‌ای زیباتر</span><h2>خرید بر اساس فضا</h2><p>برای هر بخش از خانه، مجموعه‌ای از مبلمان و اکسسوری‌های هماهنگ را کشف کنید و فضایی دلنشین‌تر بسازید.</p></div><div className="spaces-grid" data-stagger>{spaces.map((s,i)=><article key={s.title} className={`space-card space-card--${i+1}`}><div className="space-img"><img src={s.image} alt={`دکوراسیون ${s.title}`} loading="lazy" width="530" height="440" data-parallax/></div><div className="space-details"><h3>{s.title}</h3><p>{s.desc}</p><button onClick={()=>selectCategory(s.filter)}>مشاهده محصولات این فضا <ArrowLeft size={17}/></button></div></article>)}</div></div></section>

   <section id="about" className="section about-section container" data-reveal><div className="about-photo"><img src="/images/about-brand.webp" alt="فضای داخلی چوبی با مبلمان روشن و نورپردازی آرام" loading="lazy" width="760" height="380"/></div><div className="about-text"><span className="eyebrow">داستان خانه چوب</span><h2>درباره خانه چوب</h2><p>خانه چوب با عشق به طراحی و هنر مبلمان، فضایی برای زندگی زیباتر و آرام‌تر می‌سازد. ما به کیفیت، دوام و هماهنگی در خانه شما باور داریم.</p><button className="solid-btn" onClick={()=>navigate("journal")}>بیشتر آشنا شوید <ArrowLeft size={18}/></button></div></section>

   <section id="journal" className="section journal-section container"><SectionTitle eyebrow="ایده‌ها و الهام" title="مجله و ایده‌ها" subtitle="داستان‌ها و راهنماهایی برای خانه‌ای گرم‌تر و زیباتر"/><div className="journal-grid" data-stagger>{articles.map(a=><article className="journal-card" key={a.title}><button className="journal-image" onClick={()=>setArticle(a)} aria-label={`خواندن ${a.title}`}><img src={a.image} alt={a.title} loading="lazy" width="430" height="190"/></button><div className="journal-body"><h3>{a.title}</h3><p>{a.desc}</p><button onClick={()=>setArticle(a)}>مطالعه مقاله <ArrowLeft size={16}/></button></div></article>)}</div></section>

   <section className="section testimonials container"><SectionTitle eyebrow="تجربه همراهان ما" title="نظر مشتریان"/><div className="testimonial-grid" data-stagger><article className="testimonial"><span className="quote-mark">“</span><p>کیفیت ساخت و جزئیات مبلمان دقیقاً همون چیزی بود که برای خونه‌مون می‌خواستیم.</p><div><span className="testimonial-avatar">م</span><span><b>مریم نادری</b><small>نمونه دیدگاه نمایشی</small></span></div></article><article className="testimonial"><span className="quote-mark">“</span><p>طراحی ساده و شیک محصولات کمک کرد فضای نشیمنمون خیلی گرم‌تر و هماهنگ‌تر بشه.</p><div><span className="testimonial-avatar">ع</span><span><b>علی رستمی</b><small>نمونه دیدگاه نمایشی</small></span></div></article></div></section>
  </main>
  <footer id="footer" className="footer"><div className="container footer-main"><div className="footer-brand"><a href="#top" className="brand"><span className="brand-icon"><svg viewBox="0 0 40 40" fill="none"><path d="M5 19 20 6l15 13v15H5V19Z" stroke="currentColor" strokeWidth="2.7"/><path d="M14 34V22h12v12" stroke="currentColor" strokeWidth="2.3"/></svg></span><span>خانه چوب</span></a><p>مبلمان و دکوراسیون خانگی با الهام از زیبایی، آرامش و اصالت چوب.</p><span className="footer-demo">نسخه نمایشی فروشگاه — قیمت‌ها و سفارش‌ها واقعی نیستند.</span></div><div className="footer-links"><strong>دسترسی سریع</strong><button onClick={()=>navigate("top")}>صفحه اصلی</button><button onClick={()=>navigate("products")}>محصولات</button><button onClick={()=>navigate("journal")}>مجله و ایده‌ها</button><button onClick={()=>navigate("about")}>درباره ما</button></div><div className="footer-links"><strong>راهنمای خرید</strong><button onClick={()=>setCartOpen(true)}>سبد خرید</button><button onClick={()=>navigate("categories")}>دسته‌بندی‌ها</button><button onClick={()=>navigate("spaces")}>خرید بر اساس فضا</button></div><div className="footer-news"><strong>از ایده‌های جدید باخبر شو</strong><p>ایمیل خودت رو وارد کن تا در نسخه نهایی خبرهای خانه چوب رو دریافت کنی.</p><form onSubmit={e=>{e.preventDefault();setFormNote("فرم در نسخه نمایشی فعال نیست.")}}><input aria-label="ایمیل عضویت" type="email" placeholder="آدرس ایمیل" value={subscribe} onChange={e=>setSubscribe(e.target.value)} required/><button aria-label="ثبت ایمیل" type="submit"><ArrowLeft size={19}/></button></form>{formNote&&<small role="status">{formNote}</small>}</div></div><div className="footer-bottom container"><span>© خانه چوب — طراحی اختصاصی فروشگاه دکوراسیون</span><span>ساخته شده برای یک خانه آرام‌تر</span></div></footer>
  </div>
  <div className={`backdrop ${menuOpen?"visible":""}`} onClick={()=>setMenuOpen(false)} aria-hidden="true"/>
  <aside className={`mobile-drawer ${menuOpen?"mobile-drawer--open":""}`} aria-label="منوی موبایل" aria-hidden={!menuOpen}><div className="drawer-head"><strong>خانه چوب</strong><button onClick={()=>setMenuOpen(false)} aria-label="بستن منو"><X/></button></div><div className="drawer-feature"><img src="/images/featured-room.webp" alt="مبلمان منتخب خانه چوب"/><div><small>کالکشن فصل</small><b>آرامش در هر گوشه خانه</b><button onClick={()=>navigate("products")}>مشاهده مجموعه <ArrowLeft size={16}/></button></div></div><nav className="drawer-links" aria-label="لینک‌های موبایل">{[{id:"top",label:"صفحه اصلی"},{id:"products",label:"محصولات"},{id:"categories",label:"دسته‌بندی محصولات"},{id:"spaces",label:"دکوراسیون منزل"},{id:"journal",label:"مجله و ایده‌ها"},{id:"about",label:"درباره ما"},{id:"footer",label:"تماس با ما"}].map(item=><button onClick={()=>navigate(item.id)} key={item.id}>{item.label}<ChevronLeft size={18}/></button>)}</nav><div className="drawer-foot">THE ART OF LIVING</div></aside>
  <div className={`backdrop ${cartOpen?"visible":""}`} onClick={()=>setCartOpen(false)} aria-hidden="true"/>
  <aside className={`cart-drawer ${cartOpen?"cart-drawer--open":""}`} role="dialog" aria-modal={cartOpen} aria-label="سبد خرید" aria-hidden={!cartOpen}><div className="drawer-head"><div><strong>سبد خرید</strong><small>{count.toLocaleString("fa-IR")} محصول</small></div><button aria-label="بستن سبد" onClick={()=>setCartOpen(false)}><X/></button></div><div className="cart-items">{count===0?<div className="cart-empty"><ShoppingBag size={54}/><p>هنوز محصولی به سبد اضافه نکردی.</p><button className="solid-btn" onClick={()=>{setCartOpen(false);navigate("products")}}>مشاهده محصولات</button></div>:products.filter(p=>cart[p.id]).map(p=><article className="cart-line" key={p.id}><img src={p.image} alt=""/><div><strong>{p.name}</strong><small>{rial(p.price)}</small><div className="quantity-controls"><button aria-label={`کاهش ${p.name}`} onClick={()=>setCart(c=>({...c,[p.id]:Math.max(0,(c[p.id]||0)-1)}))}><Minus size={15}/></button><span>{(cart[p.id]||0).toLocaleString("fa-IR")}</span><button aria-label={`افزایش ${p.name}`} onClick={()=>setCart(c=>({...c,[p.id]:(c[p.id]||0)+1}))}><Plus size={15}/></button></div></div><button className="trash" aria-label={`حذف ${p.name}`} onClick={()=>setCart(c=>({...c,[p.id]:0}))}><Trash2 size={17}/></button></article>)}</div><div className="cart-total"><div><span>جمع کل</span><b>{rial(total)}</b></div><button disabled={count===0} onClick={()=>{}} className="checkout-btn">تکمیل خرید (در نسخه نمایشی غیرفعال)</button><small>پرداخت واقعی در این نسخه فعال نیست.</small></div></aside>
  {searchOpen&&<div className="modal-screen" onMouseDown={()=>setSearchOpen(false)} role="presentation"><section className="search-modal" onMouseDown={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="جست‌وجوی محصولات"><div className="modal-top"><strong>دنبال چه محصولی هستی؟</strong><button aria-label="بستن جست‌وجو" onClick={()=>setSearchOpen(false)}><X/></button></div><div className="search-input"><Search size={22}/><input autoFocus placeholder="مثلاً مبل، کنسول، میز..." value={search} onChange={e=>setSearch(e.target.value)}/></div><p>نتایج جست‌وجو در بخش محصولات نمایش داده می‌شوند.</p><button className="solid-btn" onClick={()=>{setFilter("all");setSearchOpen(false);navigate("products")}}>نمایش نتایج <ArrowLeft size={18}/></button></section></div>}
  {details&&<div className="modal-screen" onMouseDown={()=>setDetails(null)} role="presentation"><section className="product-modal" role="dialog" aria-modal="true" aria-label={`جزئیات ${details.name}`} onMouseDown={e=>e.stopPropagation()}><button className="modal-close" aria-label="بستن" onClick={()=>setDetails(null)}><X/></button><img src={details.image} alt={details.name}/><div><span className="eyebrow">منتخب خانه چوب</span><h2>{details.name}</h2><p>{details.description}. طراحی هماهنگ با دکوراسیون مدرن و گرم.</p><strong>{rial(details.price)}</strong><button className="solid-btn" onClick={()=>add(details.id)}>افزودن به سبد خرید <ShoppingCart size={18}/></button></div></section></div>}
  {article&&<div className="modal-screen" onMouseDown={()=>setArticle(null)} role="presentation"><section className="article-modal" role="dialog" aria-modal="true" aria-label={article.title} onMouseDown={e=>e.stopPropagation()}><button aria-label="بستن مقاله" className="modal-close" onClick={()=>setArticle(null)}><X/></button><img src={article.image} alt=""/><span className="eyebrow">مجله خانه چوب</span><h2>{article.title}</h2><p>{article.desc} این بخش نمایشی از ساختار مجله سایت است؛ متن کامل مقاله در نسخه نهایی مدیریت محتوا اضافه می‌شود.</p></section></div>}
 </>
}
