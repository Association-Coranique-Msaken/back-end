import React, { useState } from "react";
import { Link } from "react-router-dom";
import IdentificationCard from "./IdentificationCard";
export default function TableOfMember() {
    const [showIdentificationCard, setShowIdentificationCard] = useState(false);
    const handleShowIdentificationCard = () => {
        setShowIdentificationCard(true);
    };
    return (
        <div>
            <div className='table-container'>
                <table className='table table-bordered table-striped table-hover'>
                    <thead className='text-center'>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>المعرف</th>
                            <th scope='col'>الاسم</th>
                            <th scope='col'>اللقب</th>
                            <th scope='col'>اسم الأب</th>
                            <th scope='col'>تاريخ الولادة</th>
                            <th scope='col'>الجنس</th>
                            <th scope='col'>رقم بطاقة التعريف</th>
                            <th scope='col'>الهاتف</th>
                            <th scope='col'>تعديل</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        <tr>
                            <th>1</th>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>--/--/----</td>
                            <td>---</td>
                            <td>---</td>
                            <td>---</td>
                            <td>
                                <div className='dropdown-center'>
                                    <button
                                        className='btn btn-sm dropdown-toggle'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    ></button>
                                    <ul className='dropdown-menu'>
                                        <li>
                                            <Link className='dropdown-item' to={"/test"}>
                                                <i className='bi bi-file-earmark px-3'></i>مزيد من التفاصيل
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className='dropdown-item' to={"/test"}>
                                                <i className='bi bi-pen px-3'></i>تغيير
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className='dropdown-item' to={"/test"}>
                                                <i className='bi bi-trash3 px-3'></i>حذف
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className='dropdown-item' to={"/test"}>
                                                <i className='bi bi-printer px-3'></i>طباعة وصل الخلاص
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className='dropdown-item'
                                                to={"/MemberList"}
                                                onClick={handleShowIdentificationCard}
                                            >
                                                <i className='bi bi-person-vcard px-3'></i>بطاقة الانخراط
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {showIdentificationCard && (
                                    <IdentificationCard showIdentificationCard={handleShowIdentificationCard} />
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
