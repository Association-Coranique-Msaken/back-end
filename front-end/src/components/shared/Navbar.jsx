import React from "react";
import logo from "../../images/logo_s.png";
import "../../pages/css/Navbar.css";
import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <div className='rtl'>
            <nav className='shared-navbar navbar'>
                <div className='shared-navbar-logo'>
                    <img src={logo} alt='logo' />
                    <h4>
                        الجمهورية التونسية<span id='tild'>~</span>
                        <span>الجمعية القرآنية بمساكن</span>
                    </h4>
                </div>
                <div className='shared-navbar-dropdown'>
                    <ul className='navbar-nav' id='dropdown'>
                        <li className='nav-item dropdown'>
                            <a
                                className='nav-link dropdown-toggle'
                                href='#test'
                                role='button'
                                data-bs-toggle='dropdown'
                                aria-expanded='false'
                            >
                                <i className='bi bi-person-circle'></i> مرحبا بك سيدي
                            </a>
                            <ul className='dropdown-menu' id='liste'>
                                <li>
                                    <a className='dropdown-item' href='#test'>
                                        حساب المستخدم
                                    </a>
                                </li>
                                <li>
                                    <a className='dropdown-item' href='/'>
                                        خروج
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='shared-navbar-btn'>
                    <button
                        className=''
                        type='button'
                        data-bs-toggle='offcanvas'
                        data-bs-target='#offcanvasRight'
                        aria-controls='offcanvasRight'
                    >
                        <i className='bi bi-list'></i>
                    </button>
                </div>
            </nav>
            {/* navbar */}
            {/* side bar */}
            <div className='sidebar'>
                <div className='offcanvas offcanvas-end' id='offcanvasRight'>
                    <div className='offcanvas-header'>
                        <h4 className='offcanvas-title' id='offcanvasRightLabel'>
                            الجمعية القرآنية بمساكن
                        </h4>
                        <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='offcanvas'
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className='offcanvas-body'>
                        <ul>
                            <li>
                                <Link to={"/Dashboard"}>
                                    <i className='bi bi-speedometer2'></i>الرئسية
                                </Link>
                            </li>
                            <li>
                                <Link to={"/MemberList"}>
                                    <i className='bi bi-people'></i>المشاركين
                                </Link>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-people'></i>المؤدبين
                                </a>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-people'></i>المستخدمين
                                </a>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-people'></i>المجموعات
                                </a>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-sun'></i>الدورة الصيفية{" "}
                                </a>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-archive'></i>سجل المعاملات
                                </a>
                            </li>
                            <li>
                                <a href='#test'>
                                    <i className='bi bi-person'></i>الملف الشخصي{" "}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
