import React, { useEffect, useState } from "react";
import "./FirstMenu.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import Logo from "./Logo";
import FirstMenuButtom from "./FirstMenuButtom";
import useLocalStorageListener from "../../../common/utils/useLocalStorageListener";
const { Sider } = Layout;
const FirstMenu = (props) => {
    const [isShowText, setIsShowText] = useState(false)
    const menuKey = sessionStorage.getItem("menuKey");
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "gray"); 
    console.log(theme)
    const [themeClass, setThemeClass] = useState("first-sider-gray")

    useEffect(()=> {
        getThemeClass(theme)
        return null;
    }, [])
    /**
         * 点击菜单跳转
         * @param {菜单信息} item 
         */
    const changeCurrentLink = item => {
        localStorage.removeItem("sprintId")
        props.history.push(item.to)
        sessionStorage.setItem("menuKey", item.key)
    }
    // 系统顶部菜单
    const routers = [
        {
            to: '/index/home/survey',
            title: '首页',
            key: 'home',
            icon: theme === "gray" ? "home-gray" : "home-white",
            actionIcon: theme === "gray" ? "home-blue" :  "home-white"
        },
        {
            to: '/index/project',
            title: '项目',
            key: 'project',
            icon: theme === "gray" ? "project-gray" : "project-white",
            actionIcon: theme === "gray" ? "project-blue" :  "project-white"
        },
        {
            to: '/index/projectSetList',
            title: '项目集',
            key: 'projectSet',
            icon: theme === "gray" ? "projectset-gray" : "projectset-white",
            actionIcon: theme === "gray" ? "projectset-blue" :  "projectset-white"
        },
        {
            to: '/index/workTable',
            title: '事项',
            key: 'work',
            icon: theme === "gray" ? "work-gray" : "work-white",
            actionIcon: theme === "gray" ? "work-blue" :  "work-white"
        },
        {
            to: '/index/log/list',
            title: '工时',
            key: 'log',
            icon: theme === "gray" ? "log-gray" : "log-white",
            actionIcon: theme === "gray" ? "log-blue" :  "log-white"
        },
        {
            to: '/setting/version',
            title: '设置',
            key: 'log',
            icon: theme === "gray" ? "iconsetsys" : "set-white",
        }
    ]


    /**
     * 渲染左侧菜单
     * @returns 
     */
    const renderRouter = () => {
        if (routers) {
            return (
                <div className={'first-menu-link'}>
                    {
                        routers.map(item => {
                            return <>
                                {
                                    isShowText ? <div key={item.key}
                                        onClick={() => changeCurrentLink(item)}
                                        className={`first-menu-text-item ${menuKey === item.key ? 'first-menu-link-active' : null}`}
                                    >
                                        {
                                            menuKey === item.key ? <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.actionIcon}`}></use>
                                            </svg>
                                                :
                                                <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref={`#icon-${item.icon}`}></use>
                                                </svg>
                                        }

                                        <span>
                                            {item.title}
                                        </span>

                                    </div>
                                        :
                                        <div key={item.key}
                                            onClick={() => changeCurrentLink(item)}
                                            className={`first-menu-link-item ${menuKey === item.key ? 'first-menu-link-active' : null}`}
                                        >
                                            {
                                                menuKey === item.key ? <svg className="svg-icon" aria-hidden="true">
                                                    <use xlinkHref={`#icon-${item.actionIcon}`}></use>
                                                </svg>
                                                    :
                                                    <svg className="svg-icon" aria-hidden="true">
                                                        <use xlinkHref={`#icon-${item.icon}`}></use>
                                                    </svg>
                                            }

                                            <span>
                                                {item.title}
                                            </span>

                                        </div>
                                }

                            </>


                        })
                    }
                </div>
            )
        }
    }

    /**
    * 跳转到系统设置
    */
    const goSet = () => {
        props.history.push("/setting/version")
        sessionStorage.setItem("menuKey", "set")
    };
    const toggleCollapsed = () => {
        setIsShowText(!isShowText)
    }

    const getThemeClass = (theme) => {
        let name = "gray"
        switch (theme) {
            case "darkblue":
                name = "first-sider-darkblue";
                break;
            case "gray":
                name = "first-sider-gray";
                break;
            case "blue":
                name = "first-sider-blue";
                break;
            default:
                name = "first-sider-gray";
                break;

        }
        setThemeClass(name)
        setTheme(theme)
        return name;
    }

    useLocalStorageListener("theme", (updatedTraceInfo) => {
        console.log("data最新值：",updatedTraceInfo)
        getThemeClass(updatedTraceInfo)
    })

    return (
        <>
            <Sider
                className={`first-sider ${themeClass}`}
                trigger={null}
                collapsible
                collapsed={!isShowText}
                collapsedWidth="75"
                width="200"
            >
                <div className="first-menu">
                    <div className="first-menu-top">
                        <Logo theme = {theme} isShowText={isShowText} />
                        {renderRouter()}
                    </div>

                    <FirstMenuButtom isShowText={isShowText} theme = {theme}/>
                    <div className="first-menu-expend" onClick={toggleCollapsed} >
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
            </Sider>

        </>

    )
}
export default withRouter(FirstMenu);