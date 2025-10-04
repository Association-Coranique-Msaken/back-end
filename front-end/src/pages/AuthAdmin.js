import React from "react";
import "./css/Authentification.css";
import logo from "../images/logo_s.png";
import admin from "../images/admin.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { uri_auth } from "../api";

export default function AuthAdmin() {
    const adminLogin = async (event) => {
        event.preventDefault(); // Empêche le rafraîchissement de la page par défaut

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await axios.post(uri_auth("admin"), { username, password });
            // Gérer la réponse réussie
            console.log(response.data);
            console.log("nour");
        } catch (error) {
            // Gérer les erreurs
            console.log("erreur");
            console.error(error);
        }
    };

    return (
        <div className='rtl'>
            <div className='Auth-main'>
                <section className='Auth-section'>
                    <form onSubmit={adminLogin}>
                        <div className='Auth-img-logo text-left'>
                            <img src={logo} alt='logo' />
                            <Link to={"/"}>
                                <i className='bi bi-arrow-left'></i>
                            </Link>
                        </div>
                        <div className='Auth-img text-center'>
                            <img src={admin} alt='admin_icon' />
                        </div>
                        <div className='text-center'>
                            <h1 id='Auth-title'>فضاء الإدارة</h1>
                        </div>
                        <div className='Auth-sub-section'>
                            <div className='Auth-partie1'>
                                <label className='Auth-etiquette mb-1'>اسم المستخدم</label>
                                <input type='text' name='username' className='Auth-input form-control mb-2' />
                            </div>
                            <div className='Auth-partie2'>
                                <label className='Auth-etiquette mb-1'>كلمة العبور</label>
                                <input type='password' name='password' className='Auth-input form-control mb-2' />
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
