/*
 * @Descripttion: 敏捷开发项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:14:10
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import SetMenu from "./SetMenu";
import MoreMenuModel from "./MoreMenuModal";
import "./ProjectAside.scss"
const { Sider } = Layout;

const ProjectAside = (props) => {
    const { isShowText, SetIsShowText, ChangeModal, initRouters, path, setUrl, backUrl, backName, iconName } = props;

    const [projectRouter, setProjectRouter] = useState([]);

    const [moreMenu, setMoreMenu] = useState()

    const [morePath, setMorePath] = useState()
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default");
    const [themeClass, setThemeClass] = useState("project-sider-gray")
    
    const resizeUpdate = (e) => {
        // 通过事件对象获取浏览器窗口的高度
        const documentHeight = e.target ? e.target.innerHeight : e.clientHeight;

        const menuHeight = documentHeight - 250;
        const menuNum = Math.floor(menuHeight / 60);
        let num = 0;
        num = menuNum > 7 ? 7 : menuNum;
        setProjectRouter(initRouters.slice(0, num))
        const hiddenMenu = initRouters.slice(num, initRouters.length)

        setMoreMenu(hiddenMenu)
        let data = [];
        hiddenMenu.map(item => {
            data.push(item.key)
        })
        setMorePath([...data])
    };
    useEffect(() => {
        getThemeClass(theme)
        return null;
    }, [])
    useEffect(() => {
        resizeUpdate(document.getElementById("root"))
        window.addEventListener("resize", resizeUpdate);
        return () => {
            // 组件销毁时移除监听事件
            window.removeEventListener('resize', resizeUpdate);
        }

    }, [initRouters])

    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectMenu = (key) => {
        // setSelectKey(key)
        props.history.push(key)

    }

    /**
     * 点击折叠或展开菜单
     */
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(backUrl)
    }


    const getThemeClass = (theme) => {
        let name = "default"
        switch (theme) {
            case "black":
                name = "project-sider-black";
                break;
            case "default":
                name = "project-sider-gray";
                break;
            case "blue":
                name = "project-sider-blue";
                break;
            default:
                name = "first-sider-gray";
                break;

        }
        setThemeClass(name)
        setTheme(theme)
        return name;
    }
    const setIcon = (item) => {
        let iconName = `#icon-${item.icon}`;

        switch (theme) {
            case "black":
                iconName = `#icon-${item.whiteIcon}`;
                break;
            case "default":
                iconName = `#icon-${item.icon}`;
                break;
            case "blue":
                iconName = `#icon-${item.whiteIcon}`;
                break;
            default:
                iconName = `#icon-${item.icon}`;
                break;

        }
        return iconName;
    }
    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="75" width="200"
                className={`project-detail-side ${themeClass}`}
            >
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    <ChangeModal isShowText={isShowText} theme={theme} />
                    <div className="project-menu" >
                        <div className="project-back-project">
                            {
                                isShowText ?
                                    <div className={`project-menu-submenu`}
                                        onClick={() => backProject()}
                                    >
                                        <svg className="icon-18" aria-hidden="true">
                                            <use xlinkHref={`#icon-${iconName}-${theme}`}></use>
                                        </svg>
                                        <span>
                                            {backName}
                                        </span>
                                    </div>
                                    :
                                    <div className={`project-menu-submenu-icon`}
                                        onClick={() => backProject()}
                                        data-title-right={backName}
                                    >
                                        <svg className={iconName === "backhome" ? "icon-24" : "icon-29"} aria-hidden="true">
                                            <use xlinkHref={`#icon-${iconName}-${theme}`}></use>
                                        </svg>
                                    </div>
                            }
                        </div>
                        {
                            projectRouter && projectRouter.map((item, index) => {
                                return isShowText ?
                                    <div className={`project-menu-submenu ${(path && path.indexOf(item.key) !== -1) ? "project-menu-select" : ""}`}
                                        key={item.encoded}
                                        onClick={() => selectMenu(item.id)}
                                    >
                                        <svg className="icon-18" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                    :
                                    <div className={`project-menu-submenu-icon ${(path && path.indexOf(item.key) !== -1) ? "project-menu-select" : ""}`}
                                        key={item.encoded}
                                        onClick={() => selectMenu(item.id)}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>

                            })
                        }
                        {moreMenu && moreMenu.length > 0 && <MoreMenuModel
                            isShowText={isShowText} moreMenu={moreMenu} morePath={morePath} theme={theme}
                        />}
                    </div>

                    <SetMenu isShowText={isShowText} setUrl={setUrl} theme={theme} />
                    {/* <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? <svg className="project-expend-icon" aria-hidden="true">
                                <use xlinkHref="#icon-leftcircle"></use>
                            </svg>
                                :
                                <svg className="project-expend-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-rightcircle"></use>
                                </svg>
                        }
                    </div> */}
                    <div className={"menu-box-right-border"}>
                        <div className={"menu-box-isexpanded"} onClick={toggleCollapsed}>
                            {
                                isShowText ? <svg className="first-menu-expend-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-leftcircle"></use>
                                </svg>
                                    :
                                    <svg className="first-menu-expend-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-rightcircle"></use>
                                    </svg>
                            }
                        </div>
                    </div>
                </div>
            </Sider>

        </Fragment>
    )

}
export default withRouter(ProjectAside);