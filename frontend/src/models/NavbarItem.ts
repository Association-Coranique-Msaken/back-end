export interface NavbarItem {
  title: string;
  children: NavbarItem[];
}
// Fixme: move this to models + get data data from backend
export const navbarItemDict: NavbarItem[] = [
  {
    title: "الرئيسية",
    children: [],
  },
  {
    title: "عن الجمعية",
    children: [],
  },
  {
    title: "الدورات التكوينية",
    children: [
      { title: "تعلم التجويد للكبار", children: [] },
      { title: "قراءات", children: [] },
      { title: "تحفيظ القرآن للصغار", children: [] },
      { title: "إملاءات", children: [] },
      { title: "علوم شرعية", children: [] },
      { title: "الخط العربي", children: [] },
    ],
  },
  {
    title: "الدورة الصيفية",
    children: [],
  },
  {
    title: "المسابقات",
    children: [
      { title: "المسابقة المحلية", children: [] },
      { title: "المسابقة الجهوية", children: [] },
      { title: "المسابقة الوطنية", children: [] },
      { title: "مسابقة السيرة", children: [] },
    ],
  },
  {
    title: "صور و فيديوهات",
    children: [],
  },
  {
    title: "الاتصال بنا",
    children: [],
  }
];