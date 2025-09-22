/*
 * @Descripttion: 项目的更多菜单弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:13:42
 */

import React, { useEffect, useRef, useState } from "react";
import "./MoreMenuModal.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import {disableFunction} from "tiklab-core-ui";

const MoreMenuModel = (props) => {
    const { isShowText, moreMenu, morePath, theme, setSelectKey } = props;

    // 获取当前被激活的菜单
    const path = props.location.pathname.split("/")[3];

    // 菜单的形式，宽菜单，窄菜单
    const [showMenu, setShowMenu] = useState(false);
    // 菜单弹窗ref
    const modelRef = useRef()
    // 更多点击按钮的的ref
    const setButton = useRef()
    const disable = disableFunction();

    /**
     * 显示菜单弹窗
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        // 设置弹窗的位置在按钮旁边
        modelRef.current.style.left = setButton.current.clientWidth
    }


    /**
     * 监听菜单的弹窗的显示与不显示
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    /**
     * 关闭弹窗
     * @param {点击的位置} e 
     * @returns 
     */
    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    /**
     * 点击菜单
     */
    const selectMenu = (url, key) => {
        if (setSelectKey){
            setSelectKey(key)
        }
        props.history.push(url)
        setShowMenu(false)
        // if (!(key === "appraised" && disable)){
        //     props.history.push(url)
        //     setShowMenu(false)
        // }
    }

    return (
        <div className="more-menu">
            {
                isShowText ? <div className={`project-menu-submenu ${morePath.indexOf(path) !== -1 ? "project-menu-select" : ""}`}
                    onClick={() => showMoreMenu()}
                    ref={setButton}
                >
                    <svg className="icon-18" aria-hidden="true">
                        <use xlinkHref={`#icon-more-${theme}`}></use>
                    </svg>
                    <span>
                        更多
                    </span>
                </div>
                    :
                    <div ref={setButton} className={`project-menu-submenu-icon ${morePath.indexOf(path) !== -1 ? "project-menu-select" : ""}`} onClick={() => showMoreMenu()}>
                        <svg aria-hidden="true" style={{width: "28px", height: "28px"}}>
                            <use xlinkHref={`#icon-more-${theme}`}></use>
                        </svg>
                    </div>
            }
            <div
                className={`more-menu-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{left: "75px"}}
            >
                {
                    moreMenu && moreMenu.map((item,index) => {
                        return <div className={`project-menu-submenu ${path === item.key ? "project-menu-select" : ""}`}
                            key={index}
                            onClick={() => selectMenu(item.id, item.key)}
                        >
                            <svg className="icon-18" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.defaultIcon}`}></use>
                            </svg>
                            <span>
                                {item.title}
                            </span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(MoreMenuModel);