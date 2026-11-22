export const sourceImage = (id: string, width = 1500) =>
  "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + width + "&q=86";

export type ProductCategory = "مبلمان" | "نورپردازی" | "اکسسوری" | "میز";

export type Product = {
  id: string;
  name: string;
  latin: string;
  category: ProductCategory;
  material: string;
  image: string;
  imagePosition?: string;
  price: number;
  description: string;
};

export const images = {
  hero: sourceImage("photo-1771219491795-3b4dafc1cdf3", 2200),
  collectionOne: sourceImage("photo-1639422947517-8910fd782193", 1550),
  collectionTwo: sourceImage("photo-1680702699412-7df12ead8846", 1350),
  categorySeating: sourceImage("photo-1551231581-684f5c285fc0", 1100),
  categoryLighting: sourceImage("photo-1708950328533-5534d38d9cba", 1100),
  categoryObjects: sourceImage("photo-1678705424487-a59e52b08275", 1100),
  materialOne: sourceImage("photo-1704686448043-466a7178c8e9", 1500),
  materialTwo: sourceImage("photo-1694345643332-ee264634d95d", 1200),
  journal: sourceImage("photo-1758957701419-2c6e266f7988", 2100),
  closing: sourceImage("photo-1572048572872-2394404cf1f3", 1250),
} as const;

export const products: Product[] = [
  {
    id: "chiaro",
    name: "صندلی چوبی کیارو",
    latin: "CHIARO / WOOD CHAIR",
    category: "مبلمان",
    material: "چوب طبیعی / فرم دست‌ساز",
    image: sourceImage("photo-1528441397448-a44d50563cf8", 1150),
    price: 18700000,
    description: "فرمی آرام با جزئیات چوبی و تناسبی که در هر فضا ماندگار است.",
  },
  {
    id: "terre",
    name: "گلدان ترا",
    latin: "TERRE / CERAMIC OBJECT",
    category: "اکسسوری",
    material: "سرامیک / بافت طبیعی",
    image: sourceImage("photo-1768224461885-ea4785853779", 1150),
    price: 4350000,
    description: "شیئی کوچک و تأثیرگذار؛ برای سکوت میان عناصر خانه.",
  },
  {
    id: "casa",
    name: "میز سنگی کازا",
    latin: "CASA / STONE TABLE",
    category: "میز",
    material: "سنگ طبیعی / سطح صیقلی",
    image: sourceImage("photo-1759038085870-c254e539e655", 1150),
    price: 29600000,
    description: "ترکیبی از وزن سنگ و آرامش یک فرم ساده.",
  },
  {
    id: "lume",
    name: "چراغ لومه",
    latin: "LUME / AMBIENT LIGHT",
    category: "نورپردازی",
    material: "نور گرم / متریال فلزی",
    image: sourceImage("photo-1770917619525-8aa8592abf16", 1150),
    price: 8900000,
    description: "نوری کم‌جان اما دقیق برای گوشه‌هایی که باید دیده شوند.",
  },
];

export const toMoney = (value: number) => new Intl.NumberFormat("fa-IR").format(value) + " تومان";
