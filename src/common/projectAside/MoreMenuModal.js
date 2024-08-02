/*
 * @Descripttion: 项目的更多菜单弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useEffect, useRef, useState } from "react";
import "./MoreMenuModal.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";

const MoreMenuModel = (props) => {
    const { isShowText, moreMenu, morePath, theme } = props;
    const projectId = props.match.params.id;

    // 获取当前被激活的菜单
    const path = props.location.pathname.split("/")[3];

    // 菜单的形式，宽菜单，窄菜单
    const [showMenu, setShowMenu] = useState(false);
    // 菜单弹窗ref
    const modelRef = useRef()
    // 更多点击按钮的的ref
    const setButton = useRef()
    const { t } = useTranslation();
    // 当前被点击菜单的key
    const paths = ["statistics"]

    /**
     * 显示菜单弹窗
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        // 设置弹窗的位置在按钮旁边
        modelRef.current.style.left = setButton.current.clientWidth
    }

    /**
     * 更多菜单数组
     */
    // const moreMenu = [
    //     {
    //         title: `${t('statistic')}`,
    //         icon: 'statisticslog',
    //         url: `/projectDetail/${projectId}/statistics/workItem`,
    //         key: "statistics",
    //         encoded: "Statistic",
    //     }
    // ]

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
     * @param {菜单key} key 
     */
    const selectMenu = (key) => {
        props.history.push(key)
        setShowMenu(false)
    }

    return (
        <div className="more-menu">
            {
                isShowText ? <div className={`project-menu-submenu ${morePath.indexOf(path) !== -1 ? "project-menu-select" : ""}`}
                    onClick={() => showMoreMenu()}
                    ref={setButton}
                >
                    <svg className="icon-18" aria-hidden="true">
                        <use xlinkHref={`${theme === "default" ? "#icon-more" : "#icon-more-white"}`}></use>
                    </svg>
                    <span>
                        更多
                    </span>
                </div>
                    :
                    <div ref={setButton} className={`project-menu-submenu-icon ${morePath.indexOf(path) !== -1 ? "project-menu-select" : ""}`} onClick={() => showMoreMenu()}>
                        <svg aria-hidden="true" style={{width: "28px", height: "28px"}}>
                            <use xlinkHref={`${theme === "default" ? "#icon-more" : "#icon-more-white"}`}></use>
                        </svg>
                    </div>
            }
            <div
                className={`more-menu-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                {
                    moreMenu && moreMenu.map((item,index) => {
                        return <div className={`project-menu-submenu ${path === item.key ? "project-menu-select" : ""}`}
                            key={index}
                            onClick={() => selectMenu(item.id)}
                        >
                            <svg className="icon-18" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
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