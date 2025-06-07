import React from "react";
import admin from "../../images/admin.png";
import enseignant from "../../images/enseignant.png";
import etudiant from "../../images/etudiant.png";
import parent from "../../images/parent.png";
import { Link } from "react-router-dom";
export default function Authentification() {
    return (
        <section className='Authentification-section' id='connexion'>
            <h1 className='text-center Authentification-section-title'>تسجيل الدخول</h1>
            <div className='row text-center mx-0'>
                <div className='col-lg-3 col-md-6 col-12'>
                    <img src={admin} alt='admin' />
                    <h4>فضاء الإدارة</h4>
                    <Link to={"/AuthAdmin"}>تسجيل الدخول</Link>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <img src={enseignant} alt='enseignant' />
                    <h4>فضاء المؤدب</h4>
                    <Link to={"/AuthEnseignant"}>تسجيل الدخول</Link>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <img src={etudiant} alt='etudiant' />
                    <h4>فضاء التلميذ</h4>
                    <Link to={"/AuthEtudiant"}>تسجيل الدخول</Link>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <img src={parent} alt='parent' />
                    <h4>فضاء الوليّ</h4>
                    <Link to={"/AuthParent"}>تسجيل الدخول</Link>
                </div>
            </div>
        </section>
    );
}
