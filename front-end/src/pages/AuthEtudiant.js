import React from "react";
import "./css/Authentification.css";
import logo from "../images/logo_s.png";
import etudiant from "../images/etudiant.png";
import { Link } from "react-router-dom";

export default function Auth_etudiant() {
    return (
        <div className='rtl'>
            <div className='Auth-main'>
                <section className='Auth-section'>
                    <form action=''>
                        <div className='Auth-img-logo text-left'>
                            <img src={logo} alt='logo' />
                            <Link to={"/"}>
                                <i className='bi bi-arrow-left'></i>
                            </Link>
                        </div>
                        <div className='Auth-img text-center'>
                            <img src={etudiant} alt='etudiant_icon' />
                        </div>
                        <div className='text-center'>
                            <h1 id='Auth-title'>فضاء التلميذ</h1>
                        </div>
                        <div className='Auth-sub-section'>
                            <div className='Auth-partie1'>
                                <label className='Auth-etiquette mb-1'>اسم المستخدم</label>
                                <input type='text' name='username' className='Auth-input form-control mb-2' />
                            </div>
                            <div className='Auth-partie2'>
                                <label className='Auth-etiquette mb-1'>كلمة العبور</label>
                                <input type='date' name='password' className='Auth-input form-control mb-2' />
                            </div>
                        </div>
                        <div className='Auth-btn-form text-center'>
                            <button className='Auth-btn btn btn-outline-primary' name='submit' type='submit'>
                                تسجيل
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
