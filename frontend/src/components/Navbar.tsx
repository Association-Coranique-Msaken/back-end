import { Children } from "react";
import PageLogo from "./PageLogo";
import NavbarList from "./NavbarList";





export default function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg'>
      <div className='container-fluid'>
        <PageLogo/>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <NavbarList/>
        </div>
      </div>
    </nav>
  );
}