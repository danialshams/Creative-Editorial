'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpLeft, Check, ChevronDown, Heart, Instagram, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Trash2, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categoryNames, filterProducts, formatPrice, products, type Category, type Product } from '@/lib/catalog';

type Cart = Record<string, number>;
const CART_KEY = 'maison-noor-cart-v1';
const FAVORITES_KEY = 'maison-noor-favorites-v1';
const LOADER_KEY = 'maison-noor-seen-loader-v1';
const catList: Category[] = ['all', 'furniture', 'lighting', 'accessories'];

function Brand({ light = false }: { light?: boolean }) {
  return <a href="#top" className={`brand ${light ? 'brand-light' : ''}`} aria-label="میزونور، بازگشت به صفحه اصلی" dir="ltr"><span>MAISON <i>NOOR</i></span><small>INTERIOR LIVING</small></a>;
}

function Loader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const complete = useCallback(() => { if (finished.current) return; finished.current = true; onComplete(); }, [onComplete]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || sessionStorage.getItem(LOADER_KEY) === 'yes') { complete(); return; }
    document.body.classList.add('is-loading');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: () => { sessionStorage.setItem(LOADER_KEY, 'yes'); complete(); }});
      tl.fromTo('.loader-monogram', { opacity: 0, y: 18, filter: 'blur(9px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 })
        .fromTo('.loader-brand', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.28em', duration: 0.9 }, '-=0.35')
        .fromTo('.loader-rule-fill', { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: 'power1.inOut' }, '-=0.65')
        .to('.loader-monogram,.loader-brand,.loader-subtitle', { y: -10, opacity: 0, duration: 0.46, stagger: 0.05 }, '+=0.1')
        .to(el, { yPercent: -105, duration: 0.95, ease: 'power4.inOut' }, '-=0.07');
    }, root);
    return () => { ctx.revert(); document.body.classList.remove('is-loading'); };
  }, [complete]);
  return <div className="loader" ref={root} aria-label="در حال آماده‌سازی تجربه میزونور" role="status"><div className="loader-content"><div className="loader-monogram" dir="ltr"><span>M</span><span className="loader-monogram-rule"/><span>N</span></div><div className="loader-brand" dir="ltr">MAISON NOOR</div><p className="loader-subtitle">خانه‌ای که قرار است دوستش داشته باشید.</p><div className="loader-rule"><div className="loader-rule-fill"/></div><span className="loader-footer" dir="ltr">A QUIETER WAY OF LIVING · EST. 2026</span></div></div>;
}

function ProductImage({ product, priority = false }: {product: Product; priority?: boolean}) {
  return <Image className={`cutout product-image product-${product.id}`} src={product.image} alt={product.name} width={800} height={700} priority={priority} sizes="(max-width: 640px) 65vw, (max-width: 1024px) 33vw, 24vw"/>;
}

function ProductCard({ product, onAdd, onView, isFavorite, onFavorite }: {product: Product; onAdd: (p:Product)=>void;onView:(p:Product)=>void;isFavorite:boolean;onFavorite:(id:string)=>void;}) {
  return <article className="product-card" data-reveal>
    <div className="product-visual">
      <button className="product-image-button" aria-label={`مشاهده جزئیات ${product.name}`} onClick={() => onView(product)}><ProductImage product={product}/></button>
      <button className={`favorite-button ${isFavorite?'active':''}`} type="button" onClick={() => onFavorite(product.id)} aria-label={`${isFavorite?'حذف از':'افزودن به'} علاقه‌مندی‌ها: ${product.name}`} aria-pressed={isFavorite}><Heart size={18} strokeWidth={1.5} fill={isFavorite?'currentColor':'none'}/></button>
      <button className="quick-add" type="button" onClick={() => onAdd(product)} aria-label={`افزودن ${product.name} به سبد`}><Plus size={18}/><span>افزودن به سبد</span></button>
    </div>
    <div className="product-info"><div><h3><button onClick={() => onView(product)}>{product.name}</button></h3><span className="product-english" dir="ltr">{product.english}</span></div><span className="product-price">{formatPrice(product.price)}</span></div>
  </article>;
}

export default function Storefront() {
  const siteRef = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState<Category>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState('');
  const [newsletter, setNewsletter] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const productsInView = filterProducts(category);
  const searchResults = filterProducts('all', searchText);
  const count = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  const total = products.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);
  const cartItems = products.filter(p => (cart[p.id] ?? 0) > 0);

  const notify = useCallback((message: string) => { setToast(message); }, []);
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 3200); return () => clearTimeout(id); }, [toast]);
  useEffect(() => {
    try { const stored = localStorage.getItem(CART_KEY); if (stored) { const parsed:unknown = JSON.parse(stored); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) { const safe:Cart={};for(const p of products){const value=(parsed as Record<string,unknown>)[p.id];if (typeof value==='number' && Number.isInteger(value) && value > 0) safe[p.id]=Math.min(99,value);}setCart(safe);}} } catch {/* Ignore invalid local demo data */}
    try { const stored=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]') as unknown; if(Array.isArray(stored))setFavorites(stored.filter((id): id is string=>typeof id==='string' && products.some(p=>p.id===id))); } catch {/* Ignore invalid local demo data */}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites, hydrated]);

  useEffect(() => {
    const open = cartOpen || searchOpen || menuOpen || selectedProduct !== null;
    document.body.classList.toggle('panel-open',open);
    if (open) window.setTimeout(() => closeButton.current?.focus(), 80);
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') {setSearchOpen(false);setCartOpen(false);setMenuOpen(false);setSelectedProduct(null);} };
    document.addEventListener('keydown',onKey);
    return () => { document.body.classList.remove('panel-open');document.removeEventListener('keydown',onKey); };
  }, [cartOpen, searchOpen, menuOpen, selectedProduct]);
  useEffect(() => { if (searchOpen) window.setTimeout(() => searchInput.current?.focus(),120); }, [searchOpen]);
  useEffect(() => {
    if(!loaded || !siteRef.current) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl=gsap.timeline({defaults:{ease:'power3.out'}});
      tl.fromTo('.hero-eyebrow,.hero-title .line,.hero-description,.hero-cta', {opacity:0,y:34},{opacity:1,y:0,duration:1.03,stagger:0.12})
        .fromTo('.hero-chair', {opacity:0,y:60,scale:0.94},{opacity:1,y:0,scale:1,duration:1.45,ease:'power2.out'},'-=1.08')
        .fromTo('.hero-accent', {opacity:0,y:34},{opacity:1,y:0,duration:1.2,stagger:0.13},'-=0.75');
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el,{opacity:0,y:44},{opacity:1,y:0,duration:0.95,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}});
      });
      gsap.to('.story-image', {yPercent:-7,ease:'none',scrollTrigger:{trigger:'.story-section',start:'top bottom',end:'bottom top',scrub:1.4}});
    },siteRef);
    const refresh=()=>ScrollTrigger.refresh();
    window.addEventListener('load',refresh,{once:true});
    return()=>{ctx.revert();window.removeEventListener('load',refresh);};
  }, [loaded,category]);

  const addToCart=(product:Product)=>{setCart(c=>({...c,[product.id]:Math.min(99,(c[product.id]??0)+1)})); notify(`${product.name} به سبد اضافه شد`);};
  const editQuantity=(id:string,diff:number)=>setCart(c=>{const n={...c};const count=(n[id]??0)+diff;if(count<=0)delete n[id];else n[id]=Math.min(99,count);return n;});
  const toggleFavorite=(id:string)=>setFavorites(f=>f.includes(id)?f.filter(v=>v!==id):[...f,id]);
  const openCollection=(cat:Category='all')=>{setCategory(cat);setMenuOpen(false);setSearchOpen(false);window.setTimeout(()=>document.getElementById('collection')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}),20);};
  const closeAll=()=>{setCartOpen(false);setMenuOpen(false);setSearchOpen(false);setSelectedProduct(null);};
  const submitNewsletter=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setSubscribed(false);notify('عضویت در خبرنامه در نسخه نمایشی فعال نیست.');};

  return <>
    {!loaded && <Loader onComplete={() => setLoaded(true)}/>}
    <div ref={siteRef} className="site-shell" id="top">
      <div className="announcement" dir="ltr"><span>MAISON NOOR</span><span>THE QUIET COLLECTION — 2026</span><span>INTERIOR OBJECTS & LIVING</span></div>
      <header className="site-header">
        <div className="header-actions" dir="ltr"><button onClick={()=>setSearchOpen(true)} className="icon-button" aria-label="جست‌وجو"><Search size={20} strokeWidth={1.5}/></button><button onClick={()=>setCartOpen(true)} className="icon-button bag-action" aria-label={`سبد خرید، ${count} محصول`}><ShoppingBag size={20} strokeWidth={1.5}/>{count>0&&<span className="bag-count">{count}</span>}</button></div>
        <Brand/>
        <nav className="desktop-nav" aria-label="ناوبری اصلی"><a href="#top" className="active">خانه</a><button onClick={()=>openCollection()}>محصولات</button><a href="#story">داستان ما</a><a href="#contact">ارتباط با ما</a></nav>
        <button className="mobile-menu-trigger icon-button" onClick={()=>setMenuOpen(true)} aria-label="بازکردن منو"><Menu size={24} strokeWidth={1.4}/></button>
      </header>
      <main>
        <section className="hero" aria-label="مجموعه خانه آرام">
          <div className="hero-copy"><div className="hero-eyebrow"><span className="rule"/> مجموعه جدید ۱۴۰۵ <span className="eyebrow-dot"/></div>
            <h1 className="hero-title"><span className="line">خانه، جایی</span><span className="line">برای آرام گرفتن.</span></h1>
            <p className="hero-description">زیبایی قرار نیست فریاد بزند. مجموعه‌ای از مبلمان و اشیای منتخب برای خانه‌هایی که با سادگی، آرامش و جزئیات ماندگار تعریف می‌شوند.</p>
            <button className="underlined-link hero-cta" onClick={()=>openCollection()}>کشف مجموعه <ArrowLeft size={18} strokeWidth={1.4}/></button>
          </div>
          <div className="hero-gallery" aria-label="تصویر منتخب صندلی آوا">
            <div className="hero-halo" aria-hidden="true"/>
            <Image className="hero-chair cutout" src="/images/chair.webp" width={1285} height={963} priority alt="صندلی بوکله آوا، طراحی مجسمه‌وار و رنگ کرم" sizes="(max-width: 640px) 100vw, 64vw"/>
            <Image className="hero-table cutout hero-accent" src="/images/table.webp" width={453} height={378} alt="میز سنگی ترا در کنار صندلی" sizes="(max-width: 640px) 30vw, 18vw"/>
            <Image className="hero-vase cutout hero-accent" src="/images/vase.webp" width={465} height={447} alt="گلدان سرامیکی ریوا با شاخه زیتون" sizes="(max-width: 640px) 24vw, 14vw"/>
          </div>
          <div className="hero-bottom"><div className="hero-index" dir="ltr">01 <span/> 04</div><div className="hero-scroll" dir="ltr"><span>SCROLL TO EXPLORE</span><ChevronDown size={18} strokeWidth={1}/></div><div className="hero-caption" dir="ltr">DESIGNED TO FEEL LIKE HOME</div></div>
        </section>

        <section className="collection-section section-shell" id="collection">
          <div className="section-heading" data-reveal><div className="eyebrow english" dir="ltr">THE ESSENTIAL EDIT <span className="fine-rule"/></div><h2>منتخب‌های این فصل</h2><p>کمتر، اما انتخاب‌شده‌تر. هر قطعه برای ماندن آمده است.</p></div>
          <div className="collection-toolbar"><div className="category-tabs" role="group" aria-label="دسته‌بندی محصولات">{catList.map(cat=><button key={cat} className={category===cat?'active':''} aria-pressed={category===cat} onClick={()=>setCategory(cat)}>{categoryNames[cat]}</button>)}</div><span className="results-count"><SlidersHorizontal size={16}/> {new Intl.NumberFormat('fa-IR').format(productsInView.length)} محصول</span></div>
          <div className={`products-grid ${productsInView.length<3?'products-grid-short':''}`}>{productsInView.map(product=><ProductCard key={product.id} product={product} onView={setSelectedProduct} onAdd={addToCart} onFavorite={toggleFavorite} isFavorite={favorites.includes(product.id)}/>)}</div>
          <div className="collection-foot"><span className="fine-rule"/><span>BEAUTY IN WHAT REMAINS</span><span className="fine-rule"/></div>
        </section>

        <section className="story-section" id="story">
          <div className="story-layout"><div className="story-visual" data-reveal><span className="story-oversize" dir="ltr">SLOW<br/>LIVING.</span><Image className="story-image cutout" src="/images/sofa.webp" alt="مبل ماژولار میرا با بالش‌ها و پارچه گرم" width={766} height={280} sizes="(max-width: 640px) 100vw, 56vw"/></div><div className="story-copy" data-reveal><div className="eyebrow english" dir="ltr">THE ART OF LESS</div><span className="story-mark">“</span><h2>جزئیات کوچک،<br/>تأثیر بزرگ.</h2><p>خانه با تعداد اشیا معنا نمی‌گیرد؛ با احساسی که به شما می‌دهند شکل می‌گیرد. ما به فرم‌های ساده، بافت‌های زنده و کیفیتی باور داریم که هر روز بیشتر دوستش خواهید داشت.</p><button className="underlined-link" onClick={()=>openCollection('furniture')}>مشاهده مبلمان <ArrowLeft size={18}/></button></div></div>
        </section>

        <section className="category-section section-shell" id="categories"><div className="section-heading" data-reveal><span className="eyebrow english">EXPLORE THE COLLECTION</span><h2>زیبایی در هر گوشه</h2><p>از نور تا بافت، برای ساختن حال‌وهوای خانه.</p></div><div className="category-showcase"><button className="category-tile" onClick={()=>openCollection('lighting')} data-reveal><div className="category-image"><Image src="/images/lamp.webp" width={378} height={396} alt="چراغ رومیزی سورا" sizes="(max-width: 640px) 40vw, 26vw"/></div><span className="category-caption">روشنایی <ArrowUpLeft size={18}/></span><small dir="ltr">01 / LIGHTING</small></button><button className="category-tile" onClick={()=>openCollection('furniture')} data-reveal><div className="category-image category-image-chair"><Image src="/images/chair.webp" width={1285} height={963} alt="صندلی بوکله آوا" sizes="(max-width: 640px) 40vw, 26vw"/></div><span className="category-caption">مبلمان <ArrowUpLeft size={18}/></span><small dir="ltr">02 / FURNITURE</small></button><button className="category-tile" onClick={()=>openCollection('accessories')} data-reveal><div className="category-image"><Image src="/images/vase.webp" width={465} height={447} alt="گلدان سرامیکی ریوا" sizes="(max-width: 640px) 40vw, 26vw"/></div><span className="category-caption">اکسسوری <ArrowUpLeft size={18}/></span><small dir="ltr">03 / OBJECTS</small></button></div></section>

        <section className="statement" data-reveal><span className="statement-eyebrow" dir="ltr">MAISON NOOR — A SLOWER KIND OF BEAUTY</span><h2>برای زندگی کردن،<br/><em>نه فقط دیده شدن.</em></h2><div className="statement-line"/><p>ساده. صمیمی. ماندگار.</p></section>

        <section className="newsletter section-shell" id="contact" data-reveal><div><span className="eyebrow english">A LETTER FROM MAISON NOOR</span><h2>چیزهای خوب، آهسته از راه می‌رسند.</h2><p>گاه‌به‌گاه از مجموعه‌های تازه و ایده‌های چیدمان برایتان می‌نویسیم.</p></div><form className="newsletter-form" onSubmit={submitNewsletter}><label htmlFor="newsletter-email">ایمیل شما</label><div className="newsletter-field"><input type="email" name="email" id="newsletter-email" placeholder="your@email.com" dir="ltr" required value={newsletter} onChange={e=>setNewsletter(e.target.value)}/><button type="submit" aria-label="عضویت در خبرنامه"><ArrowLeft size={20}/></button></div><small>این قابلیت در نسخه نمایشی به سرویس ایمیل متصل نیست.</small>{subscribed&&<span>ثبت شد.</span>}</form></section>
      </main>
      <footer className="site-footer"><div className="footer-top"><div><Brand/><p>اشیایی برای خانه‌هایی که آرامش را انتخاب می‌کنند.</p></div><div className="footer-links"><a href="#collection">مجموعه‌ها</a><a href="#story">فلسفه ما</a><a href="#contact">ارتباط</a></div><div className="social-links"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="اینستاگرام"><Instagram size={19}/></a><button aria-label="جست‌وجو" onClick={()=>setSearchOpen(true)}><Search size={19}/></button></div></div><div className="footer-bottom"><span>© MAISON NOOR 2026 — CONCEPT STORE</span><span>DESIGNED WITH INTENTION</span><span>این سایت یک نمونه نمایشی است.</span></div></footer>
    </div>

    {menuOpen&&<div className="overlay-root" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeAll();}}><nav className="mobile-menu" role="dialog" aria-modal="true" aria-label="منوی اصلی"><div className="drawer-header"><span className="eyebrow english">MAISON NOOR</span><button ref={closeButton} onClick={closeAll} className="icon-button" aria-label="بستن منو"><X/></button></div><a href="#top" onClick={closeAll}>خانه</a><button onClick={()=>openCollection('all')}>همه محصولات</button><button onClick={()=>openCollection('furniture')}>مبلمان</button><button onClick={()=>openCollection('lighting')}>روشنایی</button><button onClick={()=>openCollection('accessories')}>اکسسوری</button><a href="#story" onClick={closeAll}>درباره ما</a><div className="menu-bottom" dir="ltr">LIVE MORE WITH LESS.</div></nav></div>}

    {searchOpen&&<div className="overlay-root overlay-search" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeAll();}}><section className="search-panel" role="dialog" aria-modal="true" aria-label="جست‌وجوی محصولات"><div className="drawer-header"><span className="eyebrow english">SEARCH OUR COLLECTION</span><button className="icon-button" ref={closeButton} onClick={closeAll} aria-label="بستن جست‌وجو"><X/></button></div><div className="search-bar"><Search size={24} strokeWidth={1.3}/><input ref={searchInput} value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder="دنبال چه چیزی هستید؟" aria-label="جست‌وجو در محصولات"/></div><p className="search-result-label">{searchText?`${new Intl.NumberFormat('fa-IR').format(searchResults.length)} نتیجه برای «${searchText}»`:'پیشنهادهای منتخب'}</p><div className="search-results">{searchResults.length?searchResults.map(p=><button key={p.id} onClick={()=>{setSearchOpen(false);setSelectedProduct(p);}}><Image src={p.image} width={90} height={80} alt=""/><span>{p.name}<small>{formatPrice(p.price)}</small></span><ArrowUpLeft size={18}/></button>):<p className="empty-state">محصولی با این عبارت پیدا نشد.</p>}</div></section></div>}

    {cartOpen&&<div className="overlay-root" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeAll();}}><aside className="side-drawer" role="dialog" aria-modal="true" aria-label="سبد خرید"><div className="drawer-header"><div><span className="eyebrow english">YOUR SELECTION</span><h2>سبد خرید <small>({new Intl.NumberFormat('fa-IR').format(count)})</small></h2></div><button className="icon-button" ref={closeButton} onClick={closeAll} aria-label="بستن سبد"><X/></button></div><div className="drawer-body">{cartItems.length?cartItems.map(p=><div className="cart-item" key={p.id}><Image src={p.image} width={120} height={115} alt={p.name}/><div><h3>{p.name}</h3><p>{formatPrice(p.price)}</p><div className="cart-controls"><button onClick={()=>editQuantity(p.id,-1)} aria-label={`کاهش تعداد ${p.name}`}><Minus size={14}/></button><span>{new Intl.NumberFormat('fa-IR').format(cart[p.id])}</span><button onClick={()=>editQuantity(p.id,1)} aria-label={`افزایش تعداد ${p.name}`}><Plus size={14}/></button></div></div><button className="remove-item" onClick={()=>setCart(c=>{const n={...c};delete n[p.id];return n;})} aria-label={`حذف ${p.name}`}><Trash2 size={16}/></button></div>):<div className="cart-empty"><ShoppingBag size={45} strokeWidth={0.8}/><h3>هنوز چیزی انتخاب نکردید.</h3><p>شاید یکی از اشیای منتخب ما برای خانه شما باشد.</p><button className="button dark" onClick={()=>{setCartOpen(false);openCollection();}}>دیدن مجموعه</button></div>}</div><div className="drawer-footer"><div className="total-line"><span>جمع کل</span><strong>{formatPrice(total)}</strong></div><p>محصولات و قیمت‌ها نمایشی هستند.</p><button className="button dark checkout" disabled={!count} onClick={()=>notify('پرداخت آنلاین در نسخه نمایشی فعال نیست.')}>ادامه و ثبت سفارش <ArrowLeft size={18}/></button></div></aside></div>}

    {selectedProduct&&<div className="overlay-root product-modal-root" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeAll();}}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`جزئیات ${selectedProduct.name}`}><button className="modal-close icon-button" ref={closeButton} onClick={closeAll} aria-label="بستن جزئیات"><X/></button><div className="product-modal-image"><Image src={selectedProduct.image} width={900} height={780} alt={selectedProduct.name} sizes="(max-width: 640px) 95vw, 48vw"/></div><div className="product-modal-copy"><span className="eyebrow english">{selectedProduct.english}</span><h2>{selectedProduct.name}</h2><p className="modal-desc">{selectedProduct.description}</p><div className="modal-spec"><span>متریال</span><span>{selectedProduct.materials}</span></div><div className="modal-spec"><span>مجموعه</span><span>{categoryNames[selectedProduct.category]}</span></div><strong className="modal-price">{formatPrice(selectedProduct.price)}</strong><button className="button dark" onClick={()=>{addToCart(selectedProduct);setSelectedProduct(null);setCartOpen(true);}}>افزودن به سبد <ShoppingBag size={17}/></button><small>تمام موارد این صفحه نمونه نمایشی هستند.</small></div></section></div>}

    {toast&&<div className="toast" role="status"><Check size={16}/><span>{toast}</span><button className="toast-close" onClick={()=>setToast('')} aria-label="بستن اعلان"><X size={15}/></button></div>}
    <noscript><style>{'.loader{display:none!important}'}</style></noscript>
  </>;
}
