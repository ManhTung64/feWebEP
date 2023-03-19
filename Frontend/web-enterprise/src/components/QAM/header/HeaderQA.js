import React, { useState, useEffect } from "react";
import style from './HeaderQA.module.css';
import { useNavigate } from "react-router-dom";


function HeaderQA() {
    const navigate = useNavigate();
    return(
        <>
        {/* phai */}
            <div className={style.qacRight}>
                <div className={style.qamNavBar}>
                    <div className={style.pages}>
                        <label className={style.name}>Pages  </label>
                    </div>
                    <div className={style.searchContainer}>
					    <input type="text" placeholder="Search" />
				    </div>
                    <div className={style.downloadZip}>
                        <button className={style.btnDownload}>Download Zip</button>
                    </div>
                    <div className={style.qamLogout}>
                        <button className={style.btnDownload}>Download CSV</button>
                        {/* <button className={style.btnDownload}><a href={`${apiUrl}/file/idea/downloadzip/${downloadZipId}`} >Download ZIP</a></button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderQA;