import type { NavbarItem } from "./NavbarList";

export default function NavbarListItemDropdown({ item }: { item: NavbarItem }) {
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {item.title}
      </a>

      <ul className="dropdown-menu">
        {item.children.map((child, index) =>
          child.children.length > 0 ? (
            <NavbarListItemDropdown key={index} item={child} />
          ) : (
            <li key={index}>
              <a className="dropdown-item" href="#">
                {child.title}
              </a>
            </li>
          )
        )}
      </ul>
    </li>
  );
}
