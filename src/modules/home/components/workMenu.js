/*
 * @Descripttion: 头部事项菜单下拉菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-15 15:23:46
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:21:07
 */
import React, { Fragment, useState,useEffect, useRef } from "react";
import WorkFilterModal from "./workFilterModal";
import {observer, inject} from "mobx-react";
import "./workMenu.scss"
import { withRouter } from "react-router";

const WorkMenu = (props) => {
    const {setCurrentLink,currentLink} = props;
    const [showModal,setShowModal] = useState(false)
    const workRef = useRef()

    // 全局事件
    document.addEventListener("click", (e) => {
        setShowModal(false)
    });

    const showWorkFilterModal = (e) => {
        // 阻止冒泡
        e.nativeEvent.stopImmediatePropagation(e);
        setShowModal(true)
        setCurrentLink("/index/work")
    }

    const closeFilterModal = () => {
        setShowModal(false)
    }
    

    const stopBubble= (event) =>{
        var e=event||window.event;
        if(e.cancelBubble){
            e.cancelBubble=true;//ie 阻止事件冒泡
        }else{
            e.stopPropagation();// 其余浏览器 阻止事件冒泡
        }
    }
    return <div className = "work-menu" ref={workRef} onClick = {(e)=> stopBubble(e)}>
        <span 
            onClick={(e)=> showWorkFilterModal(e)} 
            className={currentLink === "/index/work" ? 'frame-header-link-active' : null}
        >
            事项
        </span>
        <WorkFilterModal  
            showModal ={showModal}
            setShowModal = {closeFilterModal}
            {...props}
        />
    </div>
}

export default withRouter(inject('homeStore')(observer(WorkMenu)));