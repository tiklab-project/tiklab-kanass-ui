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
import { Modal } from 'antd';
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import { getUser} from 'tiklab-core-ui'
import SetNomalMenu from "./SetNomalMenu";
import ProjectChangeModal from "./ProjectChangeModal";
import MoreMenuModal from "./MoreMenuModal";
const { Sider } = Layout;

const ProdeNomalAside = (props) => {
    const { searchpro, workStore, prolist,systemRoleStore, project } = props;
    const {getInitProjectPermissions} = systemRoleStore;
    const { setWorkType, setWorkId } = workStore;
    //语言包
    const { t, i18n } = useTranslation();
    const tenant = getUser().tenant;
    // 当前选中路由
    const projectId = props.match.params.id;
    // const project =JSON.parse(localStorage.getItem("project"));
    const [selectKey, setSelectKey] = useState(`/index/projectNomalDetail/${projectId}/survey`);
    const [isShowText, SetIsShowText] = useState(false)
    // 切换项目窗口弹窗，鼠标移入与移出效果
    const [selectProject, setSelectProject] = useState(false)
    // 是否显示切换弹窗
    const [visible, setVisible] = useState(false)
    const path = props.location.pathname.split("/")[4];
    
     // 路由
     const normalProrouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/index/projectNomalDetail/${projectId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        // {
        //     title: `${t('line_photo')}`,
        //     icon: 'line',
        //     url: `/index/projectNomalDetail/${projectId}/linemap`,
        //     key: "linemap",
        //     encoded: "Pannel",
        // },
        {
            title: "计划",
            icon: 'survey',
            url: `/index/projectNomalDetail/${projectId}/stage`,
            key: "stage",
            encoded: "stage",
        },
        {
            title: `${t('work')}`,
            icon: 'workitem',
            url: `/index/projectNomalDetail/${projectId}/work`,
            key: "work",
            encoded: "Work",
        },
        {
            title: `${t('version')}`,
            icon: 'version',
            url: `/index/projectNomalDetail/${projectId}/version`,
            key: "version",
            encoded: "Version",
        },
        {
            title: `${t('milestone')}`,
            icon: 'milestone',
            url: `/index/projectNomalDetail/${projectId}/milestone`,
            key: "milestone",
            encoded: "Milestone",
        },
        {
            title: "工时",
            icon: 'log',
            url: `/index/projectNomalDetail/${projectId}/log`,
            key: "log",
            encoded: "log",
        }
    ];
    const prorouter = normalProrouter;
    
    useEffect(() => {
        // 初次进入激活导航菜单
        if(props.location.pathname.indexOf(`/index/projectNomalDetail/${projectId}/work`) >= 0){
            setSelectKey(`/index/projectNomalDetail/${projectId}/work/all`)
        }else {
            setSelectKey(props.location.pathname)
        }

        setWorkType(null)
        return
    }, [projectId,props.location.pathname])


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
        searchpro(id).then(data => {
            if(data.code === 0){
                localStorage.setItem("project", JSON.stringify(data.data));
                if(data.data.projectType.type === "scrum"){
                    props.history.push(`/index/projectScrumDetail/${id}/survey`)
                }
                if(data.data.projectType.type === "nomal"){
                    props.history.push(`/index/projectNomalDetail/${id}/survey`)
                }

                localStorage.setItem("projectId", id);
                // 重置事项id
                setWorkType(null)
                // 关闭切换弹窗
                setVisible(false)
                // 强制刷新
                location.reload();
            }
        });
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
        props.history.push(`/index/projectNomalDetail/${projectId}/projectSetDetail/basicInfo`)
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='project-detail-side'>
                <div className={`project-aside ${isShowText ? "" : "project-icon"}`}>
                    <ProjectChangeModal  
                        isShowText = {isShowText} 
                        prolist = {prolist} 
                        searchpro = {searchpro}
                        setWorkType= {setWorkType}
                        project = {project}
                    />
                    <ul className="project-menu">
                        {
                            prorouter && prorouter.map((item,index) =>  {
                                return isShowText ? 
                                    <div className={`project-menu-submenu ${ path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
                                    >
                                        <svg className="menu-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div> 
                                    :
                                    <div className={`project-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "project-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
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
                        <MoreMenuModal isShowText = {isShowText}/>
                    </ul>
                    <SetNomalMenu isShowText = {isShowText}/>
                    <div className="project-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ? 
                            <svg className="menu-icon" aria-hidden="true">
                                <use xlinkHref="#icon-leftcircle"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightcircle"></use>
                            </svg>
                        }
                    </div>
                </div>
            </Sider>

            <Modal
                className="project-modal"
                title="选择项目"
                visible={visible}
                onCancel={hiddenModal}
                closable = {false}
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
export default withRouter(inject( "workStore",'systemRoleStore')(observer(ProdeNomalAside)));