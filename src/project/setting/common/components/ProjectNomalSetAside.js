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

import { useTranslation } from 'react-i18next';
//import "../../../assets/font-icon/iconfont";
const {Sider} = Layout;

const ProdeNomalSetAside =(props) => {
    
    const { t } = useTranslation();
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const projectName = JSON.parse(localStorage.getItem("project")).projectName
    // 路由
    const prorouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/basicInfo`,
            encoded: "Survey",
        },
        {
            title: "事项类型",
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/projectWorkType`,
            encoded: "WorkType",
        },
        
        {
            title: `${t('user')}`,
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/user`,
            encoded: "User",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/projectDomainRole`,
            encoded: "Privilege",
        },
        {
            title: "表单",
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/projectForm`,
            encoded: "WorkForm",
        },
        {
            title: "流程",
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/projectFlow`,
            encoded: "WorkFlow",
        },
        {
            title: `${t('module')}`,
            icon: 'survey',
            key: `/index/projectNomalDetail/${projectId}/projectSetDetail/module`,
            encoded: "Module"
        }
    ];
    // 当前选中路由
    const [selectKey,setSelectKey] = useState(`/index/projectNomalDetail/${projectId}/projectSetDetail/basicInfo`);

    // 菜单是否折叠
    const [isShowText,SetIsShowText] = useState(true)

    // 当前项目id
    // const projectId = props.match.params.id

    
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
                        <span className={`${isShowText ? "": "project-notext"}`} style={{marginRight: "20px"}}>
                            {projectName}
                        </span>
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
            </Sider>
        </Fragment>
    )
    
}
export default withRouter(ProdeNomalSetAside);