import React from "react";
import "./FirstMenu.scss";

import { withRouter } from "react-router";


const FirstMenu = (props) => {
    const { AppLink } = props;
    
    const menuKey = sessionStorage.getItem("menuKey");
    console.log(sessionStorage.getItem("menuKey"))
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
            to: '/home/survey',
            title: '首页',
            key: 'home',
            icon: "home-grey",
            actionIcon: "home-blue"
        },
        {
            to: '/project',
            title: '项目',
            key: 'project',
            icon: "project-grey",
            actionIcon: "project-blue"
        },
        {
            to: '/projectSetList',
            title: '项目集',
            key: 'projectSet',
            icon: "projectset-grey",
            actionIcon: "projectset-blue"
        },
        {
            to: '/workTable',
            title: '事项',
            key: 'work',
            icon: "work-grey",
            actionIcon: "work-blue"
        },
        {
            to: '/log/list',
            title: '工时',
            key: 'log',
            icon: "log-grey",
            actionIcon: "log-blue"
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
                            return <div key={item.key}
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
        props.history.push("/setting/home")
        sessionStorage.setItem("menuKey", "set")
    };

    return (
        <div className="first-menu">
            {renderRouter()}
            <div className="first-menu-bottom">
                <div className="first-set" onClick={() => goSet()} data-title-right="设置">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-iconsetsys"></use>
                    </svg>
                </div>
            </div>

        </div>
    )
}
export default withRouter(FirstMenu);