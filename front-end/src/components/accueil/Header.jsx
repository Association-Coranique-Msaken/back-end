import React from "react";
import logo from "../../images/logo_s.png";
import { HashLink as Link } from "react-router-hash-link";
export default function Header() {
    return (
        <div>
            <section className='Header-section1'></section>
            <section className='Header-section2'>
                <nav className='navbar navbar-expand-lg'>
                    <div className='container-fluid'>
                        <a className='navbar-brand' href='#test'>
                            <img src={logo} alt='logo'></img>
                        </a>
                        <h4 className='mx-2 my-2 Header-logo-title'>
                            الجمهورية التونسية <br /> الجمعية القرآنية بمساكن
                        </h4>

                        <button
                            className='navbar-toggler'
                            type='button'
                            data-bs-toggle='collapse'
                            data-bs-target='#navbarSupportedContent'
                            aria-controls='navbarSupportedContent'
                            aria-expanded='false'
                            aria-label='Toggle navigation'
                        >
                            <span className='navbar-toggler-icon'></span>
                        </button>
                        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                                <li className='nav-item'>
                                    <a className='nav-link active' href='#Header'>
                                        الرئيسية
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='#Apropos'>
                                        عن الجمعية
                                    </a>
                                </li>
                                <li className='nav-item dropdown'>
                                    <a
                                        className='nav-link dropdown-toggle'
                                        href='#test'
                                        id='navbarDropdown'
                                        role='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        الدورات التكوينية &nbsp;
                                    </a>
                                    <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                تعلم التجويد للكبار
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                قراءات
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                تحفيظ القرآن للصغار
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                إملاءات
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                علوم شرعية
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                الخط العربي
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='#test'>
                                        الدورة الصيفية
                                    </a>
                                </li>

                                <li className='nav-item dropdown'>
                                    <a
                                        className='nav-link dropdown-toggle'
                                        href='#test'
                                        id='navbarDropdown'
                                        role='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        المسابقات &nbsp;
                                    </a>
                                    <ul className='dropdown-menu rtl' aria-labelledby='navbarDropdown'>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                المسابقة المحلية
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                المسابقة الجهوية
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                المسابقة الوطنية
                                            </a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item' href='#test'>
                                                مسابقة السيرة
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='#test'>
                                        الرحلات
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='#Gallery'>
                                        صور و فيديوهات
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='#Footer'>
                                        الاتصال بنا
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <Link to='#auth' className='nav-link' href='#Authentification'>
                                        تسجيل دخول
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </section>
        </div>
    );
}
