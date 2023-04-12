/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:13:36
 */

import React,{Fragment, useState,useEffect} from 'react';
import {withRouter} from "react-router-dom";
import { Layout,Button } from "antd";
const {Sider} = Layout;
import { useTranslation } from 'react-i18next';


const ProjectScrumSetAside =(props) => {
    //语言包
    const { t } = useTranslation();
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const projectName = JSON.parse(localStorage.getItem("project")).projectName
    // 路由
    const prorouter = [
        {
            title: `${t('projectInfo')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/basicInfo`,
            encoded: "Survey",
        },
        {
            title: "事项类型",
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/projectWorkType`,
            encoded: "WorkType",
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/user`,
            encoded: "User",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/projectDomainRole`,
            encoded: "Privilege",
        },
        {
            title: "流程",
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/projectFlow`,
            encoded: "WorkFlow",
        },
        {
            title: "表单",
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/projectForm`,
            encoded: "WorkForm",
        },
        {
            title: `${t('module')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectSetDetail/module`,
            encoded: "Module"
        }
    ];
    // 当前选中路由
    const [selectKey,setSelectKey] = useState(`/index/projectScrumDetail/${projectId}/projectSetDetail/basicInfo`);

    // 菜单是否折叠
    const [isShowText,SetIsShowText] = useState(true)


    
    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        return 
    }, [projectId])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectKeyFun = (key)=>{
        setSelectKey(key)
        props.history.push(key)
        
    }

    const backProject = () => {
        props.history.push("/index/prodetail/survey")
    }


    return(
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth = "50" width="180">
                <div className={`project-aside ${isShowText ? "": "project-icon"}`}>
                    <div className="project-title title">
                        设置
                    </div>
                    <ul className="project-menu">
                        {
                            prorouter && prorouter.map(Item=> {
                                return  <div className={`project-menu-submenu ${Item.key=== selectKey ? "project-menu-select" : ""}`} 
                                            key={Item.key} 
                                            onClick={()=>selectKeyFun(Item.key)}
                                        >
                                            <span className={`${isShowText ? "": "project-notext"}`}>
                                                {Item.title}
                                            </span>
                                        </div>
                            })
                        }
                    </ul>
                </div>

                {/* <div className="project-back" onClick={()=> backProject(props.history.push("/index/project"))}>
                    <span style={{marginRight: "20px"}}>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#iconfanhui"></use>
                        </svg>
                        返回项目
                    </span>
                </div> */}
            </Sider>
        </Fragment>
    )
    
}
export default withRouter(ProjectScrumSetAside);