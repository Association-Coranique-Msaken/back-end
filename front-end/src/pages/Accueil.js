import React from "react";
import "./css/Accueil.css";
import Header from "../components/accueil/Header";
import Gallery from "../components/accueil/Gallery";
import Apropos from "../components/accueil/Apropos";
import Actualite from "../components/accueil/Actualite";
import Authentification from "../components/accueil/Authentification";
import Multimedia from "../components/accueil/Multimedia";
import Footer from "../components/accueil/Footer";

export default function Accueil() {
    return (
        <div className='rtl'>
            <Header />
            <Gallery />
            <Actualite />
            <Multimedia />
            <Apropos />
            <Authentification id='auth' />
            <Footer />
        </div>
    );
}
