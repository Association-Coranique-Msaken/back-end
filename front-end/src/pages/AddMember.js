import React from "react";
import "./css/AddMember.css";
import Navbar from "../components/shared/Navbar";
import HeaderOfPage from "../components/shared/HeaderOfPage";
import AddMemberForm from "../components/AddMemberForm";

export default function AddMember() {
    return (
        <div className='rtl'>
            <Navbar />
            <div className='main'>
                <HeaderOfPage title='أضف مشارك' />
                <AddMemberForm />
            </div>
        </div>
    );
}
