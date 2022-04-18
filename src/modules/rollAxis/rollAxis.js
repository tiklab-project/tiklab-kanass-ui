/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 11:23:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-30 15:38:35
 */
import React, {useEffect, useState} from 'react';
import "./rollAxis.scss"
const RollAxis=(props)=>{
    const onMouseDown =(e) => {
        console.log(e)
        window.onmousemove = (event) =>{
            console.log(event)
        }
    }
    return (
        <div style={{width: "500px",height: "20px"}} className="slideRail">
            <div style={{width: "20px",height: "18px"}} className="slide" id="slide" onMouseDown={onMouseDown}></div>
        </div>
    )
}
export default RollAxis;
