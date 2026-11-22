"use client";

import { useEffect, useRef, useState } from "react";
import { collection, formatPrice, type WatchItem } from "@/lib/collection";
import { WatchVisual } from "@/components/WatchVisual";

type CartEntry = { id: string; quantity: number };

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M5 12h14m-6-6 6 6-6 6"}/></svg>;
}
function BagIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
}
function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m5 5 14 14M19 5 5 19"/></svg>;
}
function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 8h18M8 16h13"/></svg>;
}

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeWatch, setActiveWatch] = useState<WatchItem | null>(null);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [message, setMessage] = useState("");
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (collection.find((w) => w.id === item.id)?.price ?? 0) * item.quantity, 0);
  const hasOverlay = menuOpen || cartOpen || activeWatch !== null;

  useEffect(() => {
    if (!hasOverlay) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); setCartOpen(false); setActiveWatch(null); }
    }
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [hasOverlay]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let context: { revert: () => void } | undefined;
    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const opening = gsap.timeline({ defaults: { ease: "power3.out" } });
        opening.from(".site-header", { y: -25, opacity: 0, duration: 1.05 })
          .from(".hero-eyebrow, .hero-heading .headline-line, .hero-copy, .hero-links", { y: 33, opacity: 0, duration: 1.16, stagger: 0.125 }, "-=.68")
          .fromTo(".hero-watch-shell", { scale: .76, rotate: -15, opacity: 0, y: 75 }, { scale: 1, rotate: -7, opacity: 1, y: 0, duration: 1.8, ease: "power2.out" }, "-=1.45")
          .from(".hero-watch-note, .hero-vertical", { opacity: 0, duration: .9, stagger: .12 }, "-=.7");
        gsap.to(".hero-watch-shell", {
          yPercent: 15, rotate: 4, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.3 },
        });
        gsap.to(".craft-visual-inner", {
          rotation: 36, scale: 1.12, ease: "none",
          scrollTrigger: { trigger: ".craft-section", start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.from(".craft-copy > *", {
          opacity: 0, y: 34, duration: .94, stagger: .14, ease: "power2.out",
          scrollTrigger: { trigger: ".craft-copy", start: "top 78%", toggleActions: "play none none reverse" },
        });
        gsap.from(".collection-heading > *", {
          opacity: 0, y: 35, duration: .85, stagger: .12,
          scrollTrigger: { trigger: ".collection-heading", start: "top 82%", toggleActions: "play none none reverse" },
        });
        gsap.from(".watch-card", {
          opacity: 0, y: 78, duration: 1.15, stagger: .16, ease: "power3.out",
          scrollTrigger: { trigger: ".collection-grid", start: "top 84%", toggleActions: "play none none reverse" },
        });
        gsap.from(".manifesto-title", {
          opacity: 0, scale: .94, y: 45, duration: 1.35, ease: "power3.out",
          scrollTrigger: { trigger: ".manifesto-section", start: "top 75%", toggleActions: "play none none reverse" },
        });
      }, rootRef.current);
      if (document.fonts) void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    }
    void animate();
    return () => { disposed = true; context?.revert(); };
  }, []);

  function openCart() { setActiveWatch(null); setMenuOpen(false); setCartOpen(true); }
  function openWatch(watch: WatchItem) { setCartOpen(false); setMenuOpen(false); setActiveWatch(watch); }
  function addToCart(id: string) {
    setCart((prev) => {
      const found = prev.find((entry) => entry.id === id);
      return found ? prev.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...prev, { id, quantity: 1 }];
    });
    setActiveWatch(null);
    setCartOpen(true);
    setMessage("ساعت به سبد نمایشی اضافه شد.");
  }
  function changeQuantity(id: string, delta: number) {
    setCart((prev) => prev.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + delta } : entry).filter((entry) => entry.quantity > 0));
  }
  const closeOverlays = () => { setMenuOpen(false); setCartOpen(false); setActiveWatch(null); };

  return (
    <div className="site-shell" ref={rootRef} id="top">
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="هورل، صفحه اصلی" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" dir="ltr">HORÉL<span className="brand-dot">.</span></span>
          <span className="brand-caption" dir="ltr">ATELIER DU TEMPS</span>
        </a>
        <nav className="desktop-nav" aria-label="منوی اصلی">
          <a href="#craft">هنر ساخت</a><a href="#collection">کلکسیون</a><a href="#philosophy">فلسفه هورل</a>
        </nav>
        <div className="header-actions">
          <button className="bag-button" type="button" onClick={openCart} aria-label={`سبد نمایشی، ${cartCount} ساعت`}>
            <BagIcon /><span className="bag-count">{cartCount.toLocaleString("fa-IR")}</span>
          </button>
          <span className="header-divider" aria-hidden="true"/>
          <a className="header-discover" href="#collection">کشف مجموعه <ArrowIcon diagonal/></a>
          <button className="mobile-menu-toggle" type="button" aria-label="باز کردن منو" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><MenuIcon/></button>
        </div>
      </header>
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-lines" aria-hidden="true"/>
          <div className="hero-glow" aria-hidden="true"/>
          <div className="hero-copy-wrap">
            <p className="hero-eyebrow"><span className="tiny-star">✦</span> آتلیه‌ای برای لحظه‌های ماندگار <span className="hairline"/></p>
            <h1 className="hero-heading" id="hero-title">
              <span className="headline-line">زمان،</span>
              <span className="headline-line hero-heading-secondary">ساختهٔ <span>دست.</span></span>
            </h1>
            <p className="hero-copy">فراتر از اندازه‌گیری ثانیه‌ها. روایتی از نور، فلز و حرکت؛ جایی که مهندسی به هنر تبدیل می‌شود.</p>
            <div className="hero-links">
              <a href="#collection" className="button-primary"><span>کشف کلکسیون</span><ArrowIcon/></a>
              <a href="#craft" className="button-link">سفر به قلب زمان <span className="underline-motion"/></a>
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <div className="stage-orbit orbit-one"/><div className="stage-orbit orbit-two"/>
            <div className="stage-halo"/>
            <div className="hero-watch-shell"><WatchVisual tone="champagne" label=""/></div>
            <div className="hero-stage-number" dir="ltr">ÉDITION / 001</div>
          </div>
          <div className="hero-vertical" dir="ltr"><span>HOROLOGY / REIMAGINED</span><span className="vertical-line"/><span>2026</span></div>
          <div className="hero-watch-note"><span className="hero-note-line"/> <span>ÉCLIPSE 01</span><small>یک تعریف تازه از زمان</small></div>
          <a href="#craft" className="hero-scroll-cue" aria-label="اسکرول برای دیدن ادامه"><span>SCROLL TO EXPLORE</span><span className="scroll-cue-line"/></a>
          <span className="hero-bottom-index" dir="ltr">01 — 04</span>
        </section>

        <div className="transition-band" aria-hidden="true"><span>HORÉL</span><span className="transition-ornament">✳</span><span>THE ART OF TIME</span><span className="transition-ornament">✳</span><span>HORÉL</span></div>

        <section className="intro-section" aria-label="فلسفه طراحی">
          <p className="small-overline">یک نگاه متفاوت</p>
          <p className="intro-statement">بعضی چیزها تنها برای <em>دیدن</em> ساخته نمی‌شوند. باید مکث کرد، نزدیک شد و جزئیاتشان را <span>زندگی کرد.</span></p>
          <div className="intro-bottom"><span className="intro-flourish">✳</span><span className="intro-index">THE ESSENCE OF HORÉL</span></div>
        </section>

        <section className="craft-section" id="craft" aria-labelledby="craft-title">
          <div className="craft-picture">
            <div className="craft-visual-inner">
              <div className="craft-image" role="img" aria-label="نمای نزدیک از چرخ‌دنده‌های طلایی ساعت مکانیکی"/>
              <div className="craft-image-shade"/>
            </div>
            <span className="craft-image-caption" dir="ltr">THE MOVEMENT / STUDY Nº 01</span>
            <div className="craft-crosshair" aria-hidden="true">✣</div>
          </div>
          <div className="craft-copy">
            <p className="section-eyebrow"><span className="section-number">01</span><span className="section-rule"/> هنر ساخت</p>
            <h2 id="craft-title">قلبی که با <span>زمان</span> می‌تپد.</h2>
            <p className="craft-lead">در پس هر حرکت آرام عقربه، جهانی از نظم و ظرافت نهفته است. هر چرخ‌دنده بخشی از داستانی بزرگ‌تر است؛ داستانِ تبدیل انرژی به احساس.</p>
            <div className="craft-facts">
              <div><span>01</span><strong>حرکت</strong><small>ریتمی پیوسته و هماهنگ</small></div>
              <div><span>02</span><strong>تعادل</strong><small>نقطه تلاقی فرم و عملکرد</small></div>
              <div><span>03</span><strong>جزئیات</strong><small>زیبایی در مقیاس میلی‌متر</small></div>
            </div>
            <a className="text-cta" href="#collection">تماشای حاصل این نگاه <ArrowIcon diagonal/></a>
          </div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="collection-heading">
            <div><p className="section-eyebrow section-eyebrow-dark"><span className="section-number">02</span><span className="section-rule"/> منتخب آتلیه</p><h2 id="collection-title">سه روایت.<br/><span>یک مفهوم.</span></h2></div>
            <p>هر مدل، شخصیت خودش را دارد. از درخشش گرم شامپاینی تا سکوت استیل و عمقِ شب.</p>
          </div>
          <div className="collection-grid">
            {collection.map((watch, index) => (
              <article className={`watch-card card-${watch.tone}`} key={watch.id}>
                <div className="watch-card-top"><span>{watch.number}</span><span className="card-asterisk">✳</span></div>
                <button className="watch-card-visual" type="button" onClick={() => openWatch(watch)} aria-label={`مشاهده جزئیات ساعت ${watch.persian}`}>
                  <div className="card-watch-scale"><WatchVisual tone={watch.tone} label={`ساعت ${watch.persian}`}/></div>
                </button>
                <div className="watch-card-bottom">
                  <div><span className="watch-card-label">{index===0?"SIGNATURE PIECE":"ATELIER SERIES"}</span><h3 dir="ltr">{watch.english}</h3><p>{watch.description}</p></div>
                  <button className="round-action" type="button" onClick={() => openWatch(watch)} aria-label={`نمایش جزئیات ${watch.persian}`}><ArrowIcon diagonal/></button>
                </div>
              </article>
            ))}
          </div>
          <p className="collection-footnote">* تمامی محصولات، تصاویر و قیمت‌ها در این پروژه صرفاً مفهومی و نمایشی هستند.</p>
        </section>

        <section className="quote-section" aria-labelledby="quote-title">
          <div className="quote-grid" aria-hidden="true"/>
          <span className="quote-symbol">“</span>
          <p className="section-eyebrow"><span className="section-number">03</span><span className="section-rule"/> فلسفه زمان</p>
          <h2 id="quote-title">زمان نمی‌ایستد؛<br/><span>اما می‌شود یک لحظه را</span><br/>ماندگار کرد.</h2>
          <div className="quote-attribution"><span className="quote-line"/><span dir="ltr">HORÉL — A PHILOSOPHY OF TIME</span></div>
        </section>

        <section className="manifesto-section" id="philosophy" aria-labelledby="manifesto-title">
          <div className="manifesto-dial" aria-hidden="true"><div className="manifesto-dial-inner"/><div className="manifesto-dial-hand"/></div>
          <div className="manifesto-content"><p className="section-eyebrow"><span className="section-number">04</span><span className="section-rule"/> چیزی فراتر از ساعت</p>
            <h2 className="manifesto-title" id="manifesto-title">لحظه‌ها می‌گذرند.<br/><span>اثرشان می‌ماند.</span></h2>
            <p>هورل، یک تجربه طراحی مفهومی است؛ ادای احترامی به جزئیاتی که در گذرِ شتاب‌زدهٔ روزمره کمتر دیده می‌شوند.</p>
            <a href="#top" className="button-primary manifesto-button">بازگشت به آغاز <ArrowIcon/></a>
          </div>
          <span className="manifesto-english" dir="ltr">TIME, CONSIDERED.</span>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-main"><a href="#top" className="footer-logo" dir="ltr">HORÉL<span>.</span></a><p>هنرِ ماندگارِ زمان.</p><a href="#top" className="back-to-top">بالای صفحه <ArrowIcon/></a></div>
        <div className="footer-bottom"><span dir="ltr">© 2026 HORÉL — CONCEPT DESIGN</span><span>یک نمونه‌کار نمایشی — بدون امکان خرید واقعی</span><span dir="ltr">PERSIAN / RTL EXPERIENCE</span></div>
      </footer>

      <div className="sr-only" role="status" aria-live="polite">{message}</div>
      {menuOpen && <div className="overlay-backdrop" onMouseDown={closeOverlays}>
        <nav className="mobile-panel" aria-label="منوی موبایل" aria-modal="true" role="dialog" onMouseDown={(event)=>event.stopPropagation()}>
          <div className="drawer-top"><span dir="ltr">HORÉL.</span><button ref={closeRef} type="button" aria-label="بستن منو" onClick={closeOverlays}><CloseIcon/></button></div>
          <a href="#top" onClick={closeOverlays}>خانه</a><a href="#craft" onClick={closeOverlays}>هنر ساخت</a><a href="#collection" onClick={closeOverlays}>کلکسیون</a><a href="#philosophy" onClick={closeOverlays}>فلسفه هورل</a>
          <div className="mobile-panel-footer" dir="ltr">ATELIER DU TEMPS / 2026</div>
        </nav>
      </div>}
      {activeWatch && <div className="overlay-backdrop" onMouseDown={closeOverlays}>
        <div className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event)=>event.stopPropagation()}>
          <button ref={closeRef} className="dialog-close" type="button" aria-label="بستن جزئیات ساعت" onClick={closeOverlays}><CloseIcon/></button>
          <div className={`detail-visual detail-${activeWatch.tone}`}><WatchVisual tone={activeWatch.tone} label={`تصویر مفهومی ${activeWatch.persian}`}/></div>
          <div className="detail-content"><p className="small-overline" dir="ltr">HORÉL / ÉDITION {activeWatch.number}</p><h2 id="detail-title" dir="ltr">{activeWatch.english}</h2><p className="detail-persian">{activeWatch.persian}</p><p>{activeWatch.detail}</p><div className="detail-spec"><span>ترکیب رنگ</span><strong>{activeWatch.finish}</strong></div><div className="detail-spec"><span>قیمت نمایشی</span><strong>{formatPrice(activeWatch.price)}</strong></div>
          <button className="button-primary detail-add" onClick={()=>addToCart(activeWatch.id)}>افزودن به سبد نمایشی <BagIcon/></button><small>این یک نمونه‌کار است و سفارش واقعی ثبت نمی‌شود.</small></div>
        </div>
      </div>}
      {cartOpen && <div className="overlay-backdrop" onMouseDown={closeOverlays}>
        <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(event)=>event.stopPropagation()}>
          <div className="drawer-top"><div><p className="small-overline">یک تجربه مفهومی</p><h2 id="cart-title">سبد نمایشی <span>({cartCount.toLocaleString("fa-IR")})</span></h2></div><button ref={closeRef} type="button" onClick={closeOverlays} aria-label="بستن سبد"><CloseIcon/></button></div>
          <div className="cart-items">{cart.length===0 ? <div className="cart-empty"><span>◌</span><p>هنوز ساعتی به این مجموعه اضافه نکرده‌اید.</p><button type="button" className="button-outline" onClick={closeOverlays}>بازگشت به مجموعه</button></div> : cart.map((entry)=>{
            const watch = collection.find((w)=>w.id===entry.id)!;
            return <div className="cart-item" key={entry.id}><div className={`cart-item-visual card-${watch.tone}`}><WatchVisual tone={watch.tone} label=""/></div><div className="cart-item-info"><strong dir="ltr">{watch.english}</strong><small>{formatPrice(watch.price)}</small><div className="quantity-controls"><button type="button" onClick={()=>changeQuantity(entry.id,-1)} aria-label={`کاهش تعداد ${watch.persian}`}>−</button><span>{entry.quantity.toLocaleString("fa-IR")}</span><button type="button" onClick={()=>changeQuantity(entry.id,1)} aria-label={`افزایش تعداد ${watch.persian}`}>+</button></div></div></div>;
          })}</div>
          <div className="cart-footer"><div className="cart-subtotal"><span>مجموع نمایشی</span><strong>{formatPrice(cartTotal)}</strong></div><p>پرداخت و ثبت سفارش فعال نیست؛ این سبد فقط برای آزمایش رابط کاربری است.</p><button className="button-primary cart-close" type="button" onClick={closeOverlays}>ادامه تماشا <ArrowIcon/></button></div>
        </aside>
      </div>}
    </div>
  );
}
