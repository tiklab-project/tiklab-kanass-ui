/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { Fragment, useState, useEffect } from 'react';
import "../../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { Modal } from 'antd';
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import {getDomainTenant} from 'doublekit-core-ui'

const { Sider } = Layout;

const ProdeScrumAside = (props) => {
    const { searchpro, workStore, projectName, prolist, projectType, projectIcon } = props;
    //语言包
    const { t, i18n } = useTranslation();
    const tenant = getDomainTenant();
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/index/prodetail/survey`);
    const [isShowText, SetIsShowText] = useState(false)
    // 切换项目窗口弹窗，鼠标移入与移出效果
    const [selectProject, setSelectProject] = useState(false)
    // 是否显示切换弹窗
    const [visible, setVisible] = useState(false)
    const projectId = localStorage.getItem("projectId")

    // 路由
    const scrumProrouter = [
        {
            title: `${t('survey')}`,
            icon: 'icon1_picture',
            key: `/index/prodetail/survey`,
            encoded: "Survey",
        },
        {
            title: `${t('line_photo')}`,
            icon: 'icon1_monitor',
            key: `/index/prodetail/linemap`,
            encoded: "Pannel",
        },
        {
            title: `${t('demand')}`,
            icon: 'icon1_lightnings',
            key: `/index/prodetail/scrum/demand`,
            encoded: "Demand",
        },
        {
            title: `${t('task')}`,
            icon: 'icon1_lightnings',
            key: `/index/prodetail/scrum/task`,
            encoded: "Task",
        },
        {
            title: `${t('defect')}`,
            icon: 'icon1_lightnings',
            key: `/index/prodetail/scrum/defect`,
            encoded: "Defect",
        },
        {
            title: `${t('sprint')}`,
            icon: 'icon1_knife-fork',
            key: `/index/prodetail/sprint`,
            encoded: "Sprint",
        },
        {
            title: `${t('version')}`,
            icon: 'icon1_camera',
            key: `/index/prodetail/version`,
            encoded: "Version",
        },
        {
            title: `${t('milestone')}`,
            icon: 'icon1_user',
            key: `/index/prodetail/milestone`,
            encoded: "Milestone",
        },
        {
            title: `${t('statistic')}`,
            icon: 'icon1_sun-clouds',
            key: `/index/prodetail/statistics/work`,
            encoded: "Statistic",
        }
    ];

    const prorouter = scrumProrouter;
    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        return
    }, [projectId])


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

    /**
     * 隐藏切换项目弹窗
     */
    const hiddenModal = () => {
        setVisible(false)
    };

    /**
     * 切换项目
     * @param {id} id 
     */
    const selectProjectId = (id,typeId) => {
        // 切换选中项目，获取项目详情
        searchpro(id);
        // 讲当前项目id存入localStorage
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", typeId);
        // 重置事项id
        workStore.setWorkId("")
        // 关闭切换弹窗
        setVisible(false)
        // 切换路由
        props.history.push(selectKey)
        // 强制刷新
        location.reload();
    }

    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    const handleMouseOut = () => {
        setSelectProject("")
    }

    /**
     * 跳转到项目设置
     */
    const goProjectSet = () => {
        props.history.push("/index/projectSetDetail/basicInfo")
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='project-detail-side'>
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    {
                        isShowText ? <div className="project-title title">
                            <img src={`${img_url}/file/${projectIcon}?tenant=${tenant}`} width="30px" height="30px" alt="" onClick={showModal} />
                            <div className={`project-text `} >
                                <div>
                                    {projectName}
                                </div>
                                <div className='type'>
                                    {projectType}
                                </div>
                            </div>
                            <div className={`project-toggleCollapsed`} onClick={showModal}>
                                <svg className="project-aside-icon" aria-hidden="true">
                                    <use xlinkHref="#iconquanzhankai"></use>
                                </svg>
                            </div>
                        </div> :
                            <div className='project-title-icon'>
                                <img 
                                    src={`${img_url}/file/${projectIcon}?tenant=${tenant}`} 
                                    width="30px" 
                                    height="30px" alt="" 
                                    title={projectName}
                                    onClick={showModal} />
                            </div>
                    }
                    <ul className="project-menu">
                        {
                            prorouter && prorouter.map((item,index) =>  {return isShowText ? 
                                <div className={`project-menu-submenu ${item.key === selectKey ? "project-menu-select" : ""}`}
                                        key={item.encoded}
                                        onClick={() => selectMenu(item.key)}
                                    >
                                        <svg className="icon" aria-hidden="true">
                                            <use xlinkHref={`#${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div> :
                                        <div className={`project-menu-submenu-icon ${item.key === selectKey ? "project-menu-select" : ""}`}
                                            key={item.encoded}
                                            onClick={() => selectMenu(item.key)}
                                        >
                                            <svg className="project-aside-icon" aria-hidden="true">
                                                <use xlinkHref={`#${item.icon}`}></use>
                                            </svg>
                                            <span>
                                                {item.title}
                                            </span>
                                        </div>
                                    
                            })
                        }
                    </ul>
                    <div className="project-title setting" onClick={goProjectSet}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconshezhi-2"></use>
                        </svg>
                        <span className={`${isShowText ? "" : "project-notext"}`}>
                            项目设置
                        </span>
                    </div>
                    <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? <i className="iconfont iconzuo-yuan right" title="收回"></i> :
                            <i className="iconfont iconyou-yuan right" title="展开"></i>
                        }
                    </div>
                </div>
            </Sider>

            <Modal
                className="project-modal"
                title="选择项目"
                visible={visible}
                onCancel={hiddenModal}
                footer={[
                    <Button key="back" onClick={hiddenModal}>取消</Button>]}
            >
                {
                    prolist && prolist.map((item) => {
                        return <div className={`project-name ${item.id === selectProject ? "project-selectName" : ""}`}
                            onClick={() => selectProjectId(item.id,item.projectType.id)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}
                        >{item.projectName}</div>
                    })
                }
            </Modal>
        </Fragment>
    )

}
export default withRouter(inject( "workStore")(observer(ProdeScrumAside)));;