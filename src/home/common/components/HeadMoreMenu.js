import React, { useRef, useState, useEffect } from 'react';
import { observer, inject } from "mobx-react";
import "./HeadMoreMenu.scss";
import { withRouter } from 'react-router';
const HeadMoreMenu = (props) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const headMoreMenu = useRef();
    const menuKey = sessionStorage.getItem("menuKey");
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showDropDown])

    const closeModal = (e) => {
        if (!headMoreMenu.current) {
            return;
        }
        if (!headMoreMenu.current.contains(e.target) && headMoreMenu.current !== e.target) {
            setShowDropDown(false)
        }
    }
    
    const goTodoList = () => {
        props.history.push("/index/todoList")
        sessionStorage.setItem("menuKey", "todoList")
        setShowDropDown(false)
    }

    return (
        <div className="head-more-menu" ref = {headMoreMenu} 
            onMouseEnter={() => setShowDropDown(true)}
            onMouseLeave={() => setShowDropDown(false)}
        >
            <div className={`frame-header-link-item ${menuKey === "todoList" ? 'frame-header-link-active' : null}`} 
                onClick={() => setShowDropDown(true)}
                
            >
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-four"></use>
                </svg>
            </div>
            {
                showDropDown && <div className="head-more-menu-drop-down">
                    <div className="head-more-menu-item" onClick={() => goTodoList()}>待办</div>
                </div>
            }

        </div>
    );
}


export default withRouter(inject("homeStore")(observer(HeadMoreMenu)));