
export default function NavbarListItem({ title }: { title: string }) {
  return (
    <li className="nav-item">
      <a className="nav-link active" href="#">
        {title}
      </a>
    </li>
  );
}
