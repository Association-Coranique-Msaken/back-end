import React from "react";
import "./../../pages/css/PageHeader.css";
import { Link } from "react-router-dom";
export default function HeaderOfPage(props) {
    return (
        <div>
            <div className='PageHeader'>
                <div className='col1'>
                    <h2>{props.title}</h2>
                </div>
                {props.display && (
                    <div className='col2'>
                        <Link className='btn btn-outline-primary' id='PageHeaderBtn' to={props.link}>
                            {props.linkText}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
HeaderOfPage.defaultProps = {
    title: "قائمة",
    display: false,
    link: "",
    linkText: "",
};
