import React from "react";
import Navbar from "../components/shared/Navbar";
import TableOfMember from "../components/TableOfMember";
import HeaderOfPage from "../components/shared/HeaderOfPage.jsx";

export default function MemberList() {
    return (
        <div className='rtl'>
            <Navbar />
            <div className='main'>
                <HeaderOfPage title='قائمة المشاركين' display='true' link='/AddMember' linkText='إضافة' />
                <TableOfMember />
            </div>
        </div>
    );
}
