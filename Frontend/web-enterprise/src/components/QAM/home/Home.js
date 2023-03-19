import React, { useState, useEffect } from "react";
import style from './Home.module.css';
import HeaderQA from "../header/HeaderQA";
import SidebarQA from "../sidebar/SidebarQA";

function Home() {
    return(
        <div className={style.qac}>
            <SidebarQA/>
            <div className={style.cateContainer}>
                <HeaderQA/>  
                <div className={style.boxContent}>
                    <div className={style.box}> 
                        <div className={style.boxSmall}>
                            <div className={style.iconBoxSmall}><i className="fa fa-lightbulb-o" aria-hidden="true" ></i></div>
                        </div>
                        <div className={style.lbName}>Total Idea</div>
                        <div className={style.numberIdea}> 23.5K</div>
                        <hr/>
                        <div className={style.summary}> +55% </div>
                        <div className={style.summary1}> than last month </div>
                    </div>

                    <div className={style.box}> 
                        <div className={style.boxSmall2}>
                            <div className={style.iconBoxSmall}><i class="fa fa-user" aria-hidden="true"></i></div>
                        </div>
                        <div className={style.lbName}>Total Idea</div>
                        <div className={style.numberIdea}> 12.5K</div>
                        <hr/>
                        <div className={style.summary2}> -3% </div>
                        <div className={style.summary1}> than last month </div>
                    </div>

                    <div className={style.box}> 
                        <div className={style.boxSmall3}>
                            <div className={style.iconBoxSmall}><i class="fa fa-user" aria-hidden="true"></i></div>
                        </div>
                        <div className={style.lbName}>Total Idea</div>
                        <div className={style.numberIdea}> 19K</div>
                        <hr/>
                        <div className={style.summary}> +3% </div>
                        <div className={style.summary1}> than last month </div>
                    </div>

                    <div className={style.box}> 
                        <div className={style.boxSmall4}>
                            <div className={style.iconBoxSmall}><i className="fa fa-lightbulb-o" aria-hidden="true" ></i></div>
                        </div>
                        <div className={style.lbName}>Total Idea</div>
                        <div className={style.numberIdea}> 15K</div>
                        <hr/>
                        <div className={style.summary2}> -2% </div>
                        <div className={style.summary1}> than last month </div>
                    </div>
                </div>  

                <div className={style.dashboard}>
                    <div className={style.dbbox}>
                        <div className={style.dbsmall}>                        
                        </div> 
                        <div className={style.titledb}>AAA </div>    
                        <div className={style.desdb}>AAA </div>       
                    </div>
                    <div className={style.dbbox}>                        
                        <div className={style.dbsmall}>                           
                        </div>
                    </div>
                    
                </div>
                <div className={style.dashboard}>
                    <div className={style.dbbox}>
                        <div className={style.dbsmall}>                        
                        </div> 
                        <div className={style.titledb}>AAA </div>    
                        <div className={style.desdb}>AAA </div>       
                    </div>
                    <div className={style.dbbox}>                        
                        <div className={style.dbsmall}>                           
                        </div>
                    </div>
                    
                </div>



                <div className={style.tbContribute}>          
                    <label className={style.lbDau}>Idea</label>
                    <table className="table">
                    <thead>
                    <br/>  
                    <tr>
                        <th scope="col">ACCOUNT</th>
                        <th scope="col">NUMBER OF IDEA</th>
                        <th scope="col">CATEGORY</th>
                        <th scope="col">HAZZZ</th>
                    </tr>
                    </thead>
                    <tbody>               
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    </tbody>
                    </table>

                    <div className={style.timeL}>
                    <div>
                        
                    </div>
                </div> 
                </div>
            </div>   
        </div>
    )
}

export default Home;