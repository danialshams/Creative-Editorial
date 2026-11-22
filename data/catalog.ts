const localPhoto = (name: string) => "/images/" + name + ".webp";

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
  hero: localPhoto("hero"),
  collectionOne: localPhoto("collection-one"),
  collectionTwo: localPhoto("collection-two"),
  categorySeating: localPhoto("category-seating"),
  categoryLighting: localPhoto("category-lighting"),
  categoryObjects: localPhoto("category-objects"),
  materialOne: localPhoto("material-one"),
  materialTwo: localPhoto("material-two"),
  journal: localPhoto("journal"),
  closing: localPhoto("journal"),
} as const;

export const products: Product[] = [
  {
    id: "chiaro",
    name: "صندلی چوبی کیارو",
    latin: "CHIARO / WOOD CHAIR",
    category: "مبلمان",
    material: "چوب طبیعی / فرم دست‌ساز",
    image: localPhoto("product-chiaro"),
    price: 18700000,
    description: "فرمی آرام با جزئیات چوبی و تناسبی که در هر فضا ماندگار است.",
  },
  {
    id: "terre",
    name: "گلدان ترا",
    latin: "TERRE / CERAMIC OBJECT",
    category: "اکسسوری",
    material: "سرامیک / بافت طبیعی",
    image: localPhoto("product-terre"),
    price: 4350000,
    description: "شیئی کوچک و تأثیرگذار؛ برای سکوت میان عناصر خانه.",
  },
  {
    id: "casa",
    name: "میز سنگی کازا",
    latin: "CASA / STONE TABLE",
    category: "میز",
    material: "سنگ طبیعی / سطح صیقلی",
    image: localPhoto("product-casa"),
    price: 29600000,
    description: "ترکیبی از وزن سنگ و آرامش یک فرم ساده.",
  },
  {
    id: "lume",
    name: "چراغ لومه",
    latin: "LUME / AMBIENT LIGHT",
    category: "نورپردازی",
    material: "نور گرم / متریال فلزی",
    image: localPhoto("product-lume"),
    price: 8900000,
    description: "نوری کم‌جان اما دقیق برای گوشه‌هایی که باید دیده شوند.",
  },
];

export const toMoney = (value: number) => new Intl.NumberFormat("fa-IR").format(value) + " تومان";
