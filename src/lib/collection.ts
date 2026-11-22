export type WatchTone = "champagne" | "steel" | "copper";
export type WatchItem = {
  id: string;
  english: string;
  persian: string;
  number: string;
  tone: WatchTone;
  description: string;
  detail: string;
  finish: string;
  price: number;
};

/** Concept prices for interface demonstration only; not real merchandise. */
export const collection: WatchItem[] = [
  {
    id: "eclipse", english: "ÉCLIPSE", persian: "اکلیپس", number: "01 / 03", tone: "champagne",
    description: "تعادلی میان سکوت و درخشش.",
    detail: "صفحهٔ سبز جنگلی، قاب شامپاینی و نمایش بازِ چرخ‌دنده‌ها. تجسمی از ظرافت مکانیکی.",
    finish: "سبز جنگلی / طلایی شامپاینی", price: 68900000,
  },
  {
    id: "solstice", english: "SOLSTICE", persian: "سولستیس", number: "02 / 03", tone: "steel",
    description: "دقت، در خالص‌ترین فرم.",
    detail: "پرداخت فلزی سرد و صفحهٔ ذغالی؛ برای سلیقه‌ای که به سکوت طراحی اعتقاد دارد.",
    finish: "گرافیت / استیل برس‌خورده", price: 62400000,
  },
  {
    id: "nocturne", english: "NOCTURNE", persian: "نوکتورن", number: "03 / 03", tone: "copper",
    description: "روایتی تاریک از یک درخشش آرام.",
    detail: "قاب رزگلد، بند چرمی تیره و بافتی گرم؛ الهام‌گرفته از ساعات پایانی شب.",
    finish: "قهوه‌ای تیره / رزگلد", price: 74800000,
  },
];

export function formatPrice(amount: number) { return new Intl.NumberFormat("fa-IR").format(amount) + " تومان"; }
