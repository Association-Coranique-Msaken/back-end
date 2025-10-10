import NavbarListItem from "./NavbarListItem";
import NavbarListItemDropdown from "./NavbarListItemDropdown";

export interface NavbarItem {
  title: string;
  children: NavbarItem[];
}
// Fixme: move this to models + get data data from backend
const navbarItemDict: NavbarItem[] = [
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
  },
  {
    title: "تسجيل دخول",
    children: [],
  },
];

export default function NavbarList() {
  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      {navbarItemDict.map((item, index) =>
        item.children.length > 0 ? (
          <NavbarListItemDropdown key={index} item={item} />
        ) : (
          <NavbarListItem key={index} title={item.title} />
        )
      )}
    </ul>
  );
}