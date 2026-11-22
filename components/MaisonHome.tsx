"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowUpLeft, Check, ChevronLeft, Heart, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images, products, toMoney, type Product, type ProductCategory } from "../data/catalog";

type IntroState = "loading" | "revealing" | "ready";
type Overlay = "none" | "search" | "cart" | "menu";
type CollectionFilter = "همه" | ProductCategory;

const filters: CollectionFilter[] = ["همه", "مبلمان", "نورپردازی", "میز", "اکسسوری"];

const spaces = [
  { number: "01", name: "مبلمان", english: "THE SEATING", image: images.categorySeating, className: "spaces-card--arch" },
  { number: "02", name: "نورپردازی", english: "THE LIGHT", image: images.categoryLighting, className: "spaces-card--regular" },
  { number: "03", name: "اشیای خاص", english: "THE OBJECTS", image: images.categoryObjects, className: "spaces-card--crescent" },
];

function EditorialImage({ src, alt, className = "", sizes = "100vw", priority = false, position = "center" }: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <div className={"image-frame " + className}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        quality={90}
        sizes={sizes}
        style={{ objectPosition: position }}
        className="editorial-image"
      />
    </div>
  );
}

function IconButton({ label, onClick, children, count, active = false }: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  active?: boolean;
}) {
  return (
    <button className={"icon-button" + (active ? " icon-button--active" : "")} type="button" aria-label={label} onClick={onClick}>
      {children}
      {typeof count === "number" && count > 0 && <span className="icon-badge">{count}</span>}
    </button>
  );
}

export default function MaisonHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState<IntroState>("loading");
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [filter, setFilter] = useState<CollectionFilter>("همه");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dismissRef = useRef<HTMLButtonElement>(null);

  const prefersLessMotion = useCallback(() => (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ), []);

  useEffect(() => {
    if (prefersLessMotion()) {
      setIntro("ready");
      return;
    }
    const reveal = window.setTimeout(() => setIntro("revealing"), 1250);
    const ready = window.setTimeout(() => setIntro("ready"), 2140);
    return () => { window.clearTimeout(reveal); window.clearTimeout(ready); };
  }, [prefersLessMotion]);

  useEffect(() => {
    const locked = intro !== "ready" || overlay !== "none" || selected !== null;
    const old = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = old; };
  }, [intro, overlay, selected]);

  useEffect(() => {
    if (intro !== "ready" || !rootRef.current || prefersLessMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo("[data-hero-title]", { yPercent: 110 }, { yPercent: 0, duration: 1.26, ease: "power4.out", stagger: 0.11, clearProps: "transform" });
      gsap.fromTo("[data-hero-sub]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.45 });
      gsap.fromTo(".hero-photo .editorial-image", { scale: 1.14 }, { scale: 1, duration: 2.1, ease: "power3.out" });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 58, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.14, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 88%", toggleActions: "play none none none", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-photo-reveal]").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)" }, {
          clipPath: "inset(0 0 0% 0)", duration: 1.55, ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 82%", toggleActions: "play none none none", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const image = element.querySelector<HTMLElement>(".editorial-image");
        if (!image) return;
        gsap.fromTo(image, { yPercent: -5, scale: 1.1 }, {
          yPercent: 5, scale: 1.1, ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.9 },
        });
      });

      const horizontal = document.querySelector<HTMLElement>(".materials-photo--detail");
      if (horizontal) gsap.fromTo(horizontal, { xPercent: -8 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: 1 } });
    }, rootRef);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 750);
    return () => { window.clearTimeout(refresh); context.revert(); };
  }, [intro, prefersLessMotion]);

  useEffect(() => {
    const listener = () => setNavScrolled(window.scrollY > 56);
    window.addEventListener("scroll", listener, { passive: true });
    listener();
    return () => window.removeEventListener("scroll", listener);
  }, []);

  useEffect(() => {
    if (overlay === "search") {
      const id = window.setTimeout(() => searchRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [overlay]);

  useEffect(() => {
    if (overlay === "none" && selected === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setOverlay("none"); setSelected(null); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlay, selected]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("maison-noor-cart-v2");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const valid = Object.fromEntries(Object.entries(parsed).filter(([id, qty]) => products.some(p => p.id === id) && typeof qty === "number" && Number.isInteger(qty) && qty > 0 && qty <= 30));
          setCart(valid);
        }
      }
    } catch { /* Browsers may disallow local storage. */ }
  }, []);

  const cartCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);
  const filtered = useMemo(() => filter === "همه" ? products : products.filter(p => p.category === filter), [filter]);
  const matches = useMemo(() => products.filter(p => (p.name + " " + p.latin + " " + p.category + " " + p.material).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [query]);

  const persistCart = (next: Record<string, number>) => {
    setCart(next);
    try { window.localStorage.setItem("maison-noor-cart-v2", JSON.stringify(next)); } catch { /* optional persistence */ }
  };
  const changeQuantity = (productId: string, delta: number) => {
    const next = { ...cart };
    const number = Math.min(30, Math.max(0, (next[productId] || 0) + delta));
    if (number === 0) delete next[productId];
    else next[productId] = number;
    persistCart(next);
  };
  const addToCart = (product: Product) => {
    changeQuantity(product.id, 1);
    setSelected(null);
    setOverlay("cart");
  };
  const toggleFavorite = (id: string) => {
    setFavorites(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  };
  const visit = (id: string) => {
    setOverlay("none");
    setSelected(null);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: prefersLessMotion() ? "instant" : "smooth" }), 50);
  };
  const submitNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter.trim())) {
      setNewsletterMessage("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }
    setNewsletterMessage("این بخش فعلاً نمایشی است؛ ایمیل ذخیره یا ارسال نمی‌شود.");
  };

  return (
    <div ref={rootRef} className="site-root">
      <div aria-hidden={intro === "ready"} className={"intro intro--" + intro}>
        <div className="intro-shade intro-shade--left" />
        <div className="intro-shade intro-shade--right" />
        <div className="intro-center">
          <div className="intro-monogram"><span>M</span><i /><span>N</span></div>
          <div className="intro-wordmark">MAISON NOOR</div>
          <span className="intro-caption">AN INTERIOR ATELIER</span>
          <span className="intro-rule"><span /></span>
        </div>
      </div>

      <div className="page-wrap">
        <header className={"site-header" + (navScrolled ? " site-header--solid" : "")}>
          <div className="header-inner">
            <div className="header-actions">
              <IconButton label="جست‌وجو" onClick={() => setOverlay("search")}><Search size={18} strokeWidth={1.35} /></IconButton>
              <IconButton label={"سبد خرید؛ " + cartCount + " محصول"} count={cartCount} onClick={() => setOverlay("cart")}><ShoppingBag size={18} strokeWidth={1.35} /></IconButton>
            </div>
            <a href="#home" onClick={e => { e.preventDefault(); visit("home"); }} className="brand" aria-label="میزونور - صفحه اصلی">
              MAISON NOOR
              <span>INTERIOR ATELIER</span>
            </a>
            <nav aria-label="منوی اصلی" className="main-nav">
              <button type="button" onClick={() => visit("home")}>خانه</button>
              <button type="button" onClick={() => visit("collections")}>مجموعه‌ها</button>
              <button type="button" onClick={() => visit("objects")}>منتخب‌ها</button>
              <button type="button" onClick={() => visit("atelier")}>آتلیه</button>
            </nav>
            <div className="mobile-menu-button">
              <IconButton label="بازکردن فهرست" onClick={() => setOverlay("menu")}><Menu size={22} strokeWidth={1.3}/></IconButton>
            </div>
          </div>
        </header>

        <main id="home">
          <section className="hero" aria-labelledby="hero-heading">
            <EditorialImage className="hero-photo" src={images.hero} alt="نشیمن با دیوارهای چوبی گرم، نورهای کروی و مبلمان معاصر" priority sizes="100vw" position="center 57%" />
            <div className="hero-shade" />
            <div className="hero-grain" aria-hidden="true" />
            <div className="container hero-content">
              <div className="hero-meta"><span>MAISON NOOR</span><span>EDITION / 2026</span></div>
              <div className="hero-main">
                <span className="micro-label" data-hero-sub>COLLECTED WITH INTENTION</span>
                <h1 id="hero-heading" className="hero-title" dir="ltr">
                  <span className="text-mask"><span data-hero-title>THE ART</span></span>
                  <span className="text-mask"><span data-hero-title>OF LIVING.</span></span>
                </h1>
                <p className="hero-fa" data-hero-sub>فضایی فراتر از یک خانه</p>
                <p className="hero-description" data-hero-sub>اشیای منتخب، بافت‌های اصیل و نگاهی آرام به زیبایی زندگی.</p>
                <button className="underlined-cta hero-cta" onClick={() => visit("collections")} type="button" data-hero-sub>کشف مجموعه <ArrowLeft size={17} strokeWidth={1.2}/></button>
              </div>
              <div className="hero-footer" aria-hidden="true"><span>01 — 04</span><span>SCROLL TO EXPLORE <ArrowDownLeft size={16}/></span></div>
            </div>
          </section>

          <section className="collections section-pad" id="collections" aria-labelledby="collections-title">
            <div className="container">
              <div className="section-heading" data-reveal>
                <span className="micro-label gold-text" dir="ltr">THE COLLECTION — 01</span>
                <div><h2 id="collections-title">زیبایی، در انتخاب‌های دقیق است.</h2><p>مجموعه‌ای برای لحظه‌هایی که خانه به آرامش تبدیل می‌شود.</p></div>
              </div>
              <div className="collections-composition">
                <article className="collection-major" data-reveal>
                  <EditorialImage src={images.collectionOne} alt="نشیمن واقعی با مبلمان گرم و دکوراسیون بافت‌دار" className="collection-photo" sizes="(max-width: 900px) 100vw, 58vw" position="center 55%"/>
                  <div className="collection-caption"><span>01 / THE RESIDENCE</span><h3>زندگی در قابِ سکوت</h3><button type="button" onClick={() => visit("spaces")} aria-label="مشاهده فضاهای خانه">مشاهده فضاها <ArrowUpLeft size={18}/></button></div>
                </article>
                <article className="collection-minor" data-reveal>
                  <EditorialImage src={images.collectionTwo} alt="مبل چرمی قهوه‌ای کنار میز چوبی در یک فضای صنعتی واقعی" className="collection-photo arch-cut" sizes="(max-width: 900px) 100vw, 36vw"/>
                  <div className="collection-caption"><span>02 / OBJECTS OF DESIRE</span><h3>برای لمسِ ماندگاری</h3><button type="button" onClick={() => visit("objects")}>مشاهده منتخب‌ها <ArrowUpLeft size={18}/></button></div>
                </article>
              </div>
            </div>
          </section>

          <section className="statement" aria-label="فلسفه طراحی">
            <div className="container statement-inner" data-reveal>
              <span className="micro-label gold-text">A CONSIDERED WAY OF LIVING</span>
              <p>زیبایی، همیشه در آن چیزی نیست که اضافه می‌کنیم؛<br/><em>گاهی در چیزی‌ست که حذف می‌کنیم.</em></p>
              <span className="statement-mark">M / N</span>
            </div>
          </section>

          <section className="spaces section-pad" id="spaces" aria-labelledby="spaces-title">
            <div className="container">
              <div className="section-heading section-heading--compact" data-reveal>
                <span className="micro-label gold-text">DISCOVER BY SPACE</span>
                <div><h2 id="spaces-title">جزئیات، سازنده‌ی فضا هستند.</h2><p>هر گوشه با یک انتخاب درست، هویت تازه‌ای پیدا می‌کند.</p></div>
              </div>
              <div className="spaces-grid">
                {spaces.map((space) => (
                  <button type="button" key={space.number} className={"spaces-card " + space.className} onClick={() => visit("objects")} data-reveal>
                    <EditorialImage src={space.image} alt={"عکاسی واقعی از دکوراسیون " + space.name} sizes="(max-width: 780px) 100vw, 33vw" />
                    <div className="spaces-meta"><span>{space.number} / {space.english}</span><strong>{space.name}</strong><ArrowUpLeft size={20} strokeWidth={1.2}/></div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="objects section-pad" id="objects" aria-labelledby="objects-title">
            <div className="container">
              <div className="section-heading section-heading--compact" data-reveal>
                <span className="micro-label gold-text">THE SELECTED EDIT</span>
                <div><h2 id="objects-title">منتخب‌های آتلیه</h2><p>چهار انتخاب برای الهام گرفتن؛ قیمت‌ها و سفارش‌ها فعلاً نمایشی‌اند.</p></div>
              </div>
              <div className="filter-tabs" role="group" aria-label="فیلتر مجموعه‌ها">
                {filters.map(item => (
                  <button className={filter === item ? "filter-tab is-active" : "filter-tab"} key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>
                ))}
              </div>
              <div className="products-grid">
                {filtered.map((product, index) => (
                  <article key={product.id} className={"product-card product-card--" + index % 3} data-reveal>
                    <button type="button" className="product-visual" onClick={() => setSelected(product)} aria-label={"مشاهده " + product.name}>
                      <EditorialImage src={product.image} alt={"تصویر واقعی الهام‌بخش برای " + product.category} sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" position={product.imagePosition || "center"}/>
                      <span className="product-quick">مشاهده جزئیات <ArrowUpLeft size={16}/></span>
                    </button>
                    <div className="product-meta"><div><span>{product.latin}</span><h3>{product.name}</h3><p>{toMoney(product.price)}</p></div><button type="button" aria-label={"افزودن " + product.name + " به علاقه‌مندی‌ها"} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)} className={favorites.includes(product.id) ? "favorite is-active" : "favorite"}><Heart size={19} fill={favorites.includes(product.id) ? "currentColor" : "none"} strokeWidth={1.25}/></button></div>
                  </article>
                ))}
              </div>
              {filtered.length === 0 && <p className="empty-state">محصولی در این دسته یافت نشد.</p>}
            </div>
          </section>

          <section className="materials section-pad" id="atelier" aria-labelledby="materials-title">
            <div className="container material-layout">
              <div className="material-still" data-photo-reveal><EditorialImage src={images.materialOne} alt="نور گرم آباژور در اتاقی تاریک و واقعی" className="material-photo" sizes="(max-width: 900px) 100vw, 48vw" /></div>
              <div className="material-copy" data-reveal>
                <span className="micro-label gold-text">THE ATELIER / MATERIAL MATTERS</span>
                <h2 id="materials-title">متریال،<br/><em>داستانِ فضاست.</em></h2>
                <p>چوبی که رگه‌هایش را پنهان نمی‌کند، سنگی که گذر زمان را به یاد دارد، و نوری که به فضا جان می‌دهد. ما به جزئیاتی باور داریم که هر روز لمس می‌شوند.</p>
                <button type="button" className="underlined-cta" onClick={() => visit("journal")}>روایت آتلیه <ArrowLeft size={18}/></button>
                <div className="material-index">01 <span /> 03</div>
              </div>
              <div className="materials-photo--detail" data-reveal><EditorialImage src={images.materialTwo} alt="صندلی تنها کنار پنجره در فضای صنعتی و نور طبیعی" className="crescent-cut" sizes="(max-width: 900px) 100vw, 32vw" /></div>
            </div>
          </section>

          <section className="journal" id="journal" aria-labelledby="journal-title">
            <EditorialImage src={images.journal} alt="نشیمن روشن با مبل‌های معاصر و میز چوبی طبیعی" className="journal-photo" sizes="100vw"/>
            <div className="journal-shade" />
            <div className="container journal-inner" data-reveal>
              <span className="micro-label">MAISON NOOR JOURNAL</span>
              <h2 id="journal-title">خانه،<br/>یک اثر زنده است.</h2>
              <p>گاهی یک تغییر کوچک، تمام تصویر را دگرگون می‌کند.</p>
              <button type="button" onClick={() => visit("newsletter")} className="underlined-cta">همراه ما بمانید <ArrowLeft size={18}/></button>
            </div>
          </section>

          <section id="newsletter" className="newsletter section-pad">
            <div className="container newsletter-inner">
              <div data-reveal><span className="micro-label gold-text">A LETTER FROM MAISON NOOR</span><h2>چیزهای خوب،<br/><em>آرام از راه می‌رسند.</em></h2><p>خبرنامه و معرفی مجموعه‌های تازه.</p></div>
              <form onSubmit={submitNewsletter} noValidate className="newsletter-form" data-reveal>
                <label htmlFor="newsletter-email">ایمیل شما</label>
                <div><input id="newsletter-email" dir="ltr" type="email" placeholder="you@example.com" value={newsletter} onChange={e => setNewsletter(e.target.value)}/><button type="submit" aria-label="عضویت در خبرنامه"><ArrowUpLeft size={24}/></button></div>
                <p aria-live="polite">{newsletterMessage || "ارسال واقعی ایمیل در نسخه نمایشی فعال نیست."}</p>
              </form>
            </div>
          </section>
        </main>
        <footer className="footer">
          <div className="container footer-top"><span className="micro-label gold-text">THE HOME, REIMAGINED.</span><a className="footer-top-link" href="#home" onClick={e => { e.preventDefault(); visit("home"); }}>بازگشت به بالا <ArrowUpLeft size={18}/></a></div>
          <div className="container footer-brand" dir="ltr">MAISON NOOR</div>
          <div className="container footer-bottom"><span>© 2026 MAISON NOOR — DEMO CONCEPT</span><span>تصاویر محیط، عکس‌های واقعی از Unsplash هستند؛ اقلام و قیمت‌ها نمایشی‌اند.</span></div>
        </footer>
      </div>

      {overlay !== "none" && (
        <div className="overlay-layer">
          <button className="overlay-backdrop" type="button" aria-label="بستن پنجره" onClick={() => setOverlay("none")}/>
          <aside className={"side-panel side-panel--" + overlay} role="dialog" aria-modal="true" aria-label={overlay === "search" ? "جست‌وجو" : overlay === "cart" ? "سبد خرید" : "فهرست"}>
            <div className="panel-header"><span>{overlay === "search" ? "جست‌وجو در مجموعه" : overlay === "cart" ? "سبد انتخاب‌های شما" : "MAISON NOOR"}</span><button ref={dismissRef} type="button" aria-label="بستن" onClick={() => setOverlay("none")}><X size={22}/></button></div>
            {overlay === "menu" && <nav className="mobile-nav" aria-label="فهرست موبایل"><button type="button" onClick={() => visit("home")}>خانه <ArrowLeft/></button><button type="button" onClick={() => visit("collections")}>مجموعه‌ها <ArrowLeft/></button><button type="button" onClick={() => visit("objects")}>منتخب‌ها <ArrowLeft/></button><button type="button" onClick={() => visit("atelier")}>آتلیه <ArrowLeft/></button></nav>}
            {overlay === "search" && <div className="search-panel"><label htmlFor="search-products">نام محصول، متریال یا دسته را جست‌وجو کنید</label><div className="search-input"><Search size={21}/><input ref={searchRef} id="search-products" placeholder="مثلاً چوب، میز یا نورپردازی" value={query} onChange={event => setQuery(event.target.value)}/></div><div className="search-results">{matches.map(product => <button type="button" key={product.id} onClick={() => { setOverlay("none"); setSelected(product); }}><Image src={product.image} alt="" width={96} height={112} unoptimized/><span><strong>{product.name}</strong><small>{product.material}</small></span><ArrowUpLeft size={18}/></button>)}{matches.length===0 && <p className="empty-state">نتیجه‌ای پیدا نشد.</p>}</div></div>}
            {overlay === "cart" && <div className="cart-panel">
              <div className="cart-items">
                {products.filter(p => (cart[p.id] || 0) > 0).map(product => <div className="cart-item" key={product.id}><Image alt="" src={product.image} width={94} height={114} unoptimized/><div><strong>{product.name}</strong><span>{toMoney(product.price)}</span><div className="qty-controls"><button type="button" aria-label={"کم‌کردن " + product.name} onClick={() => changeQuantity(product.id,-1)}><Minus size={16}/></button><span>{new Intl.NumberFormat("fa-IR").format(cart[product.id])}</span><button type="button" aria-label={"اضافه‌کردن " + product.name} onClick={() => changeQuantity(product.id,1)}><Plus size={16}/></button></div></div></div>)}
                {cartCount===0 && <div className="cart-empty"><ShoppingBag size={36} strokeWidth={1}/><p>هنوز چیزی به سبد اضافه نکرده‌اید.</p><button type="button" onClick={() => visit("objects")}>دیدن منتخب‌ها <ArrowLeft size={17}/></button></div>}
              </div>
              <div className="cart-summary"><div><span>جمع نمایشی</span><strong>{toMoney(total)}</strong></div><button type="button" disabled>تکمیل خرید (در نسخه نمایشی غیرفعال)</button><p>پرداخت و سفارش واقعی در این نسخه وجود ندارد.</p></div>
            </div>}
          </aside>
        </div>
      )}

      {selected && (
        <div className="overlay-layer product-modal-layer">
          <button type="button" className="overlay-backdrop" aria-label="بستن جزئیات" onClick={() => setSelected(null)}/>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <button type="button" className="modal-close" aria-label="بستن" onClick={() => setSelected(null)}><X size={21}/></button>
            <div className="modal-photo"><Image src={selected.image} alt={"تصویر الهام‌بخش " + selected.name} fill unoptimized sizes="(max-width: 700px) 100vw, 45vw" style={{objectFit:"cover"}}/></div>
            <div className="modal-info"><span className="micro-label gold-text">{selected.latin}</span><h2 id="product-modal-title">{selected.name}</h2><p>{selected.description}</p><dl><div><dt>متریال</dt><dd>{selected.material}</dd></div><div><dt>دسته</dt><dd>{selected.category}</dd></div></dl><strong>{toMoney(selected.price)}</strong><button type="button" onClick={() => addToCart(selected)}>افزودن به سبد نمایشی <ShoppingBag size={18}/></button><small>تصویر و قیمت برای نمایش کانسپت هستند، نه کاتالوگ واقعی.</small></div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status"><Check size={18}/>{toast}</div>}
    </div>
  );
}
