import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function AddMemberForm() {
    const [showcinInputs, setShowcinInputs] = useState(false);
    const [showpasInputs, setShowpasInputs] = useState(false);
    const CINhandleCheckboxChange = (event) => {
        setShowcinInputs(event.target.checked);
    };
    const PAShandleCheckboxChange = (event) => {
        setShowpasInputs(event.target.checked);
    };
    return (
        <div>
            <form method='post' enctype='multipart/form-data'>
                <div className='row mb-2'>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            الاسم <span className='etloile'>*</span>
                        </label>
                        <input type='text' name='prenom' className='form-control input-style input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            اللقب <span className='etloile'>*</span>
                        </label>
                        <input type='text' name='nom' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            اسم الأب <span className='etloile'>*</span>
                        </label>
                        <input type='text' name='prenom_pere' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            اسم الجد <span className='etloile'>*</span>
                        </label>
                        <input type='text' name='prenom_grand_pere' className='form-control input-style' />
                    </div>
                </div>
                <div className='row mb-2'>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            اسم الأم <span className='etloile'>*</span>
                        </label>
                        <input type='text' name='prenom_mere' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            لقب الأم<span className='etloile'>*</span>
                        </label>
                        <input type='text' name='nom_mere' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            تاريخ الولادة<span className='etloile'>*</span>
                        </label>
                        <input type='date' name='date_naissance' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            مكان الولادة<span className='etloile'>*</span>
                        </label>
                        <input type='text' name='lieu_naissance' className='form-control input-style' />
                    </div>
                </div>

                <div className='row mb-2'>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette gender mb-2 mt-2'>
                            الجنس<span className='etloile'>*</span>
                        </label>
                        <input className='me-2 mx-1' type='radio' name='gender' id='male' value='ذكر' />
                        <label for='male' className='radio_etiquette mb-2 mt-2'>
                            ذكر
                        </label>
                        <input className='me-4 mx-1' type='radio' name='gender' id='femelle' value='أنثى' />
                        <label for='femelle' className='radio_etiquette mb-2 mt-2'>
                            أنثى
                        </label>
                    </div>
                    <div className='col-lg-3 col-md-3 '>
                        <label className='etiquette mb-2 mt-2'>الهاتف الشخصي</label>
                        <input type='phone' name='mobilePersonel' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>هاتف الأم</label>
                        <input type='phone' name='mobileMere' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>هاتف الأب</label>
                        <input type='phone' name='mobilePere' className='form-control input-style' />
                    </div>
                </div>
                <div className='row mb-2 mb-3 '>
                    <div className='col'>
                        <label className='etiquette typeDoc mb-2 mt-2'>نوع الهوية</label>
                        <input type='checkbox' className='me-2 mx-1' id='cin' onChange={CINhandleCheckboxChange} />
                        <label className='form-check-label' for='cin'>
                            بطاقة تعريف وطنية
                        </label>

                        <input type='checkbox' className='me-4 mx-1' id='pas' onChange={PAShandleCheckboxChange} />
                        <label className='form-check-label' for='pas'>
                            جواز سفر
                        </label>

                        <input type='checkbox' className='me-4 mx-1' id='mathmoun' />
                        <label className='form-check-label' for='mathmoun'>
                            مضمون ولادة
                        </label>

                        <input type='checkbox' className='me-4 mx-1' id='autre' />
                        <label className='form-check-label' for='autre'>
                            وثيقة أخرى
                        </label>
                    </div>
                </div>

                <div className='row mb-2'>
                    {showcinInputs && (
                        <div className='col-lg-3 col-md-3 '>
                            <label className='etiquette mb-2 mt-2'>
                                رقم بطاقة التعريف الوطنية<span className='etloile'>*</span>
                            </label>
                            <input type='text' name='nbcin' className='form-control input-style' />
                        </div>
                    )}
                    {showpasInputs && (
                        <div className='col-lg-3 col-md-3'>
                            <label className='etiquette mb-2 mt-2'>
                                رقم جواز السفر<span className='etloile'>*</span>
                            </label>
                            <input type='text' name='nbpasseport' className='form-control input-style' />
                        </div>
                    )}
                </div>

                <div className='row mb-2'>
                    <div className='col-lg-3 col-md-3'>
                        <label className='etiquette mb-2 mt-2'>
                            المعرف<span className='etloile'>*</span>
                        </label>
                        <input type='number' name='alhizib' className='form-control input-style' />
                    </div>
                    <div className='col-lg-3 col-md-3'>
                        <label className=' etiquette mb-2 mt-2'>
                            الدور<span className='etloile'>*</span>
                        </label>
                        <select className='form-control input-style' data-live-search='true' name='role' id='role'>
                            <option value=''>--اختيار--</option>
                        </select>
                    </div>
                </div>

                <div className='btn_form mt-3'>
                    <button className='btn btn-outline-primary mx-3 addMemberForm_btn' name='submit' type='submit'>
                        تسجيل
                    </button>
                    <Link className='btn btn-outline-danger mx-3 addMemberForm_btn ' to={"/MemberList"}>
                        رجوع
                    </Link>
                </div>
            </form>
        </div>
    );
}
