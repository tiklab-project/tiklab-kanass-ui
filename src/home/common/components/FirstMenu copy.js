import React, { useEffect, useState } from "react";
import "./FirstMenu.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import Logo from "./Logo";
import FirstMenuButtom from "./FirstMenuButtom";
import Search from "../../search/components/Search";
const { Sider } = Layout;
const FirstMenu = (props) => {
    const [isShowText, setIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[1];
    const [menuKey, setMenuKey] = useState(path);

    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default");
    const [themeClass, setThemeClass] = useState("first-sider-gray")

    useEffect(() => {
        getThemeClass(theme)
        return null;
    }, [])

    useEffect(()=> {
        setMenuKey(path)
        return null;
    }, [path])

    /**
         * 点击菜单跳转
         * @param {菜单信息} item 
         */
    const changeCurrentLink = item => {
        if(item.key !== "search"){
            localStorage.removeItem("sprintId")
            props.history.push(item.to)
            sessionStorage.setItem("menuKey", item.key)
        }else {
            
        }
        
    }

    const setActiveIcon = (type) => {
        let activeIcon = type + theme + "-active"
        switch (theme) {
            case "default":
                activeIcon = type + theme + "-active";
                break;
            case "blue":
                activeIcon = type + theme;
                break;
            case "black":
                activeIcon = type + "blue";
                break;
            default:
                activeIcon = type + theme + "-active";
                break;
        }
        return activeIcon;
    }

    // 系统顶部菜单
    const routers = [
        {
            to: '/index/overview',
            title: '首页',
            key: 'index',
            icon: 'home-' + theme,
            actionIcon: setActiveIcon("home-")
        },
        {
            to: '/project',
            title: '项目',
            key: 'project',
            icon: 'project-' + theme,
            actionIcon: setActiveIcon("project-")
        },
        {
            to: '/projectSet',
            title: '项目集',
            key: 'projectSet',
            icon: 'projectset-' + theme,
            actionIcon: setActiveIcon("projectset-")
        },
        {
            to: '/workitem',
            title: '事项',
            key: 'workitem',
            icon: 'work-' + theme,
            actionIcon: setActiveIcon("work-")
        },
        {
            to: '/log/list',
            title: '工时',
            key: 'log',
            icon: 'log-' + theme,
            actionIcon: setActiveIcon("log-")
        },

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
                    <Search isShowText={isShowText} theme={theme} />
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
        let name = "default"
        switch (theme) {
            case "black":
                name = "first-sider-black";
                break;
            case "default":
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



    const changeTheme = (color) => {
        console.log(color)
        localStorage.setItem("theme", color)
        getThemeClass(color)
    }


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
                        <Logo theme={theme} isShowText={isShowText} />
                        {renderRouter()}
                    </div>

                    <FirstMenuButtom isShowText={isShowText} theme={theme} changeTheme={changeTheme} {...props}/>
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

        </>

    )
}
export default withRouter(FirstMenu);