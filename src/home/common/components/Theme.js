import React, { useEffect, useRef, useState } from "react";
import "./Theme.scss"
import useLocalStorageListener from "../../../common/utils/useLocalStorageListener";
const Theme = (props) => {
    const {isShowText, theme} = props;
    const themeDrop = useRef();
    const [show, setShow ] = useState(false)
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);

        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [show])

    const closeModal = (e) => {
        if (!themeDrop.current) {
            return;
        }
        if (!themeDrop.current.contains(e.target) && themeDrop.current !== e.target) {
            setShow(false)
        }
    }

    const changeColor = (color) => {
        localStorage.setItem("theme", color)
    }

   
    
    return (
        <div className="theme-change" ref = {themeDrop}>

            <div className="theme-change-top" onClick={() => setShow(true)}>
                {
                    isShowText ?
                        <div className="theme-change-text">
                            <svg className="icon-20" aria-hidden="true">
                                <use xlinkHref={`${theme === "gray" ? "#icon-theme" : "#icon-theme-white"}`}></use>
                            </svg>
                            <div>修改主题</div>
                        </div>

                        :
                        <svg className="icon-20" aria-hidden="true">
                                <use xlinkHref={`${theme === "gray" ? "#icon-theme" : "#icon-theme-white"}`}></use>
                            </svg>
                }
            </div>
            <div className={`theme-change-box ${show === true ? null : "hidden-box"}`}>
                <div className="theme-change-item" onClick={() => changeColor("gray")}>灰色</div>
                <div className="theme-change-item" onClick={() => changeColor("blue")}>蓝色</div>
                <div className="theme-change-item" onClick={() => changeColor("darkblue")}>深蓝色</div>
            </div>
        </div>

    )
}

export default Theme;