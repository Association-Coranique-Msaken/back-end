import React from "react";
import logo from "../../images/logo_s.png";
import logo_l from "../../images/logo.png";
export default function Apropos() {
    return (
        <section className='Apropos-section row mx-0' id='a_propos'>
            <div className='Apropos-partie1 col-lg-3'>
                <span>الجمــعية القــرآنـيـة بمســاكن</span>
            </div>
            <div className='Apropos-partie2 col-lg-4 col-md-6 col-12'>
                <h5 className='Apropos-partie2-title'>مرحبا بكم في</h5>
                <a href='#test'>
                    <img src={logo} className='Apropos-partie2-logo' alt='logo' />
                    الجمعية القرآنية بمساكن
                </a>
                <p>
                    "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت
                    لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس
                    نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي
                    فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا باراياتيور. أيكسسيبتيور ساينت أوككايكات كيوبايداتات نون
                    بروايدينت ,سيونت ان كيولبا كيو أوفيسيا ديسيريونتموليت انيم أيدي ايست لابوريوم."
                </p>
            </div>
            <div className='Apropos-partie3 col-lg-4 col-md-6 col-12'>
                <h2 id='apropos'>عن الجمــعية</h2>
                <img src={logo_l} alt='logo' />
            </div>
            <div className='Apropos-partie4 col-lg-1'></div>
        </section>
    );
}
