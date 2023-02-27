/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import "./ProjectSetDetailAside.scss";
import ProjectSetSetButton from "./ProjectSetSettingButton";
import ProjectSetChangeModal from "./ProjectSetChangeModal";
import { getUser } from "tiklab-core-ui";

const { Sider } = Layout;

const ProjectSetDetailAside = (props) => {
    const { systemRoleStore } = props;
    const [isShowText, SetIsShowText] = useState(false)
    const { t, i18n } = useTranslation();
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/index/prodetail/survey`);
    
    // 切换项目窗口弹窗，鼠标移入与移出效果
    
    // 是否显示切换弹窗
    const [visible, setVisible] = useState(false)
    const projectSet = JSON.parse(localStorage.getItem("projectSet"))
    const projectSetId = props.match.params.projectSetId;
     // 路由
     const normalProrouter = [
        {
            title: `概览`,
            icon: 'survey',
            key: `/index/projectSetdetail/${projectSetId}/survey`,
            encoded: "Survey",
        },
        {
            title: `项目`,
            icon: 'project',
            key: `/index/projectSetdetail/${projectSetId}/projectSetProjectList`,
            encoded: "Pannel",
        },
        {
            title: `统计`,
            icon: 'project',
            key: `/index/projectSetdetail/${projectSetId}/statistics/workItem`,
            encoded: "Statistics",
        }
        // ,
        // {
        //     title: "成员",
        //     icon: 'project',
        //     key: `/index/projectSetdetail/${projectSetId}/user`,
        //     encoded: "User",
        // },
        // {
        //     title: "权限",
        //     icon: 'project',
        //     key: `/index/projectSetdetail/${projectSetId}/dominRole`,
        //     encoded: "DominRole",
        // }
    ];

    const prorouter = normalProrouter;
    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)

        systemRoleStore.getInitProjectPermissions(getUser().userId, projectSetId)
        
        return
    }, [projectSet,props.location.pathname])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectMenu = (key) => {
        setSelectKey(key)
        props.history.push(key)

    }

    /**
     * 点击折叠或展开菜单
     */
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const showModal = () => {
        setVisible(true)
    };

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='projectSet-detail-side'>
                <div className={`projectSet-aside`}>
                    <ProjectSetChangeModal isShowText = {isShowText}/>
                    <ul className="projectSet-menu">
                        {
                            prorouter && prorouter.map((item,index) =>  {return isShowText ? 
                                <div className={`projectSet-menu-submenu ${item.key === selectKey ? "projectSet-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.key)}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div> :
                                    <div className={`projectSet-menu-submenu-icon ${item.key === selectKey ? "projectSet-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.key)}
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
                    </ul>
                    <ProjectSetSetButton isShowText = {isShowText}/>
                    <div className="projectSet-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? <i className="iconfont iconzuo-yuan right" title="收回"></i> :
                            <i className="iconfont iconyou-yuan right" title="展开"></i>
                        }
                    </div>
                </div>
            </Sider>

        </Fragment>
    )

}
export default withRouter(inject( "systemRoleStore")(observer(ProjectSetDetailAside)));