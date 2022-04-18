/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:13:36
 */

import React,{Fragment, useState,useEffect} from 'react';
import "../../../../assets/font-icon/iconfont.css";
import {withRouter} from "react-router-dom";
import { Layout,Button } from "antd";
const {Sider} = Layout;
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';


const ProdeSetAside =(props) => {
    // 解析props
    const {projectName} = props
    //语言包
    const { t } = useTranslation();

    // 路由
    const prorouter = [
        {
            title: `${t('survey')}`,
            icon: 'icon1_picture',
            key: `/index/projectSetDetail/basicInfo`,
            encoded: "Survey",
        },
        {
            title: `${t('module')}`,
            icon: 'icon1_magnifier-money',
            key: `/index/projectSetDetail/module`,
            encoded: "Module"
        },
        {
            title: `${t('user')}`,
            icon: 'icon1_user',
            key: `/index/projectSetDetail/user`,
            encoded: "User",
        },
        {
            title: `${t('privilege')}`,
            icon: 'icon1_light-bulb',
            key: `/index/projectSetDetail/projectDomainRole`,
            encoded: "Privilege",
        }
    ];
    // 当前选中路由
    const [selectKey,setSelectKey] = useState(`/index/prodetail/survey`);

    // 菜单是否折叠
    const [isShowText,SetIsShowText] = useState(true)

    // 当前项目id
    const projectId = localStorage.getItem("projectId")

    
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
                            <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon1_cheese"></use>
                            </svg>
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
                                            <svg className="icon" aria-hidden="true">
                                                <use xlinkHref= {`#${Item.icon}`}></use>
                                            </svg>
                                            <span className={`${isShowText ? "": "project-notext"}`}>
                                                {Item.title}
                                            </span>
                                        </div>
                            })
                        }
                    </ul>
                </div>

                <div className="project-back" onClick={()=> backProject(props.history.push("/index/project"))}>
                    <span style={{marginRight: "20px"}}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconfanhui"></use>
                        </svg>
                        返回项目
                    </span>
                </div>
            </Sider>
        </Fragment>
    )
    
}
export default withRouter(ProdeSetAside);