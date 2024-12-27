/*
 * @Descripttion: 一次菜单的更多菜单弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:38:00
 */
import React, { useEffect, useRef, useState } from "react";
import "./FirstMoreMenuModal.scss";
import { withRouter } from "react-router";
import Search from "../../search/components/Search";

const FirstMoreMenuModal = (props) => {
    const { isShowText, moreMenu, morePath, theme } = props;

    // 获取当前被激活的菜单
    const path = props.location.pathname.split("/")[1];
    console.log(props.location.pathname.split("/"), morePath)

    // 菜单的形式，宽菜单，窄菜单
    const [showMenu, setShowMenu] = useState(false);
    // 菜单弹窗ref
    const modelRef = useRef()
    // 更多点击按钮的的ref
    const setButton = useRef()

    /**
     * 显示菜单弹窗
     */
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        // 设置弹窗的位置在按钮旁边
        modelRef.current.style.left = setButton.current.clientWidth + 3;
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
     * 切换菜单
     * @param {菜单} item 
     */
    const changeCurrentLink = item => {
        if(item.key !== "search"){
            localStorage.removeItem("sprintId")
            props.history.push(item.to)
            // 用于选中效果
            sessionStorage.setItem("menuKey", item.key)
        }
        setShowMenu(false)
    }
    
    return (
        <div className="more-menu">
            {
                isShowText ? <div className={`first-menu-text-item ${morePath.indexOf(path) !== -1 ? "first-menu-link-active" : ""}`}
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
                    <div ref={setButton} className={`first-menu-link-item ${morePath.indexOf(path) !== -1 ? "first-menu-link-active" : ""}`} onClick={() => showMoreMenu()}>
                        <svg aria-hidden="true" style={{ width: "28px", height: "28px" }}>
                            <use xlinkHref={`#icon-more-${theme}`}></use>
                        </svg>
                    </div>
            }
            <div
                className={`more-menu-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                {
                    moreMenu && moreMenu.map((item, index) => {
                        return <div key={item.key}
                            onClick={() => changeCurrentLink(item)}
                            className={`first-menu-text-item ${path === item.key ? 'first-menu-link-active' : null}`}
                        >
                             <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-${item.key.toLowerCase()}-default`}></use>
                                    </svg>

                            <span>
                                {item.title}
                            </span>

                        </div>
                    })
                }
                <Search isShowText={true} theme={"default"} showMenu = {showMenu} setShowMenu = {setShowMenu}/>
            </div>
            
        </div>
    )
}
export default withRouter(FirstMoreMenuModal);