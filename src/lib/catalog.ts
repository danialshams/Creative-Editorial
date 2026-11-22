export type Category = 'all' | 'furniture' | 'lighting' | 'accessories';
export type Product = {
  id: string;
  name: string;
  english: string;
  category: Exclude<Category, 'all'>;
  image: string;
  price: number;
  materials: string;
  description: string;
};

export const products: readonly Product[] = [
  { id: 'ava', name: 'صندلی آوا', english: 'AVA LOUNGE CHAIR', category: 'furniture', image: '/images/chair.webp', price: 48900000, materials: 'پارچه بوکله، فریم چوبی', description: 'فرمی نرم و مجسمه‌وار با پارچه‌ای لطیف؛ طراحی‌شده برای لحظه‌های آرام خانه.' },
  { id: 'terra', name: 'میز کناری ترا', english: 'TERRA SIDE TABLE', category: 'furniture', image: '/images/table.webp', price: 12700000, materials: 'سنگ تراورتن طبیعی', description: 'تراورتن با رگه‌های طبیعی و ترکیبی از هندسه ساده و بافت زنده سنگ.' },
  { id: 'sora', name: 'چراغ رومیزی سورا', english: 'SORA TABLE LAMP', category: 'lighting', image: '/images/lamp.webp', price: 8900000, materials: 'سرامیک مات، شید پارچه‌ای', description: 'نوری آرام با تناسباتی متعادل؛ یک نقطه روشن برای گوشه‌های دنج خانه.' },
  { id: 'riva', name: 'گلدان ریوا', english: 'RIVA CERAMIC VASE', category: 'accessories', image: '/images/vase.webp', price: 3600000, materials: 'سرامیک دست‌پرداخت', description: 'سطحی طبیعی و فرمی ارگانیک که حتی بدون گل هم حضور چشمگیری دارد.' },
  { id: 'mira', name: 'مبل میرا', english: 'MIRA MODULAR SOFA', category: 'furniture', image: '/images/sofa.webp', price: 86900000, materials: 'پارچه کتانی بافت‌دار', description: 'راحتی سخاوتمندانه، خطوط بی‌تکلف و تناسبی مناسب فضاهای مینیمال.' }
];

export const categoryNames: Record<Category, string> = {
  all: 'همه محصولات', furniture: 'مبلمان', lighting: 'روشنایی', accessories: 'اکسسوری'
};
export function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
}
export function filterProducts(category: Category, query = '') {
  const q = query.trim().toLocaleLowerCase('fa-IR');
  return products.filter(p => (category === 'all' || p.category === category) &&
    (!q || [p.name, p.english, p.description, p.materials].some(s => s.toLocaleLowerCase('fa-IR').includes(q))));
}
