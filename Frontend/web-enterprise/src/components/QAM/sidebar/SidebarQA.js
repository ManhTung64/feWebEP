import React, { useState, useEffect } from "react";
import { LOCAL_STORAGE_TOKEN_NAME, ACCOUNT_ID, ROLE, PROFILE_INFORMATION } from '../../../constants/constants'
import style from './SidebarQA.module.css';
import { useNavigate } from "react-router-dom";


function SidebarQA() {
    const navigate = useNavigate();
    const logout = event => {
		event.preventDefault()
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
		localStorage.removeItem(ACCOUNT_ID)
		localStorage.removeItem(ROLE)
		localStorage.removeItem(PROFILE_INFORMATION)
		navigate('/')
    }   
    return(
        <>
            <div className={style.qacLeft}>
                <div className={style.Leftcontainer}>
                    <div className={style.nameqac}>
                        <img src="https://cdn-icons-png.flaticon.com/128/3234/3234972.png"  className={style.qacimg}/>
                        <label className={style.qacName}>Quality Assurance Manager </label>
                    </div>
                    <hr className={style.line}/>

                    <div className={style.lcategore}>
                        <i class="fa fa-tachometer" aria-hidden="true"></i>
                        <label className={style.dbName}>
                        <a href="/qualityAssuranceManager">                               
                                <span className={style.linkCategory}>Dashboard</span>
                            </a>
                        </label>
                    </div>

                    <div className={style.lcategore}>
                        <i class="fa fa-table" aria-hidden="true"></i>
                        <label className={style.dbName}>
                            <a href="/category">                               
                                <span className={style.linkCategory}>Category</span>
                            </a>
                        </label>
                    </div>


                    <h1 className={style.accountPages}>ACCOUNT PAGES</h1>
                    <div className={style.lcategore}>
                        <i className="fa fa-user" aria-hidden="true"></i>
                        <label className={style.dbName}>
                        <a href="/profileQAM">                               
                                <span className={style.linkCategory}>Profile</span>
                            </a>
                        </label>
                    </div>
                    <div className={style.lcategore}>
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                        <label className={style.dbName} onClick={logout}>Logout</label>
                    </div>
                </div>                
            </div>       
        </>
    )
}

export default SidebarQA;