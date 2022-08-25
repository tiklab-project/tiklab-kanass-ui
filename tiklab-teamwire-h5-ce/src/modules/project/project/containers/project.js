/*
 * @Descripttion: 事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 10:47:30
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/project.scss";
import ProjectAddEidtModal from "../components/projectAddEditModal";
const Project = (props) => {
    const { projectStore } = props;
    const { findProjectPage } = projectStore;
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        findProjectPage().then((data) => {
            if (data.code === 0) {
                setProjectList(data.data.dataList)
            }
        })
    }, [])

    const goProdetail = (id, projectTypeId) => {
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", projectTypeId);
        // workStore.setWorkId("")
        props.history.push({ pathname: "/project/projectDetail" })
    }

    const [visible, setVisible] = useState(false);

    const status =  {
        1: "未开始",
        2: "已启动",
        3: "已结束",
    }

    const searchProject = (value) => {
        const params = {
            projectName: value
        }
        findProjectPage(params).then((data) => {
            if (data.code === 0) {
                setProjectList(data.data.dataList)
            }
        })
    }
    return (
        <div className="project">
            <div className="project-top">
                <div className="project-top-left" onClick={() => props.history.push("/index/set")}>
                    <svg className="project-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-templateList"></use>
                    </svg>
                </div>
                <div className="project-title">项目</div>
                <div></div>
            </div>
            <div className='project-content'>
                <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProject(value)}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        添加项目
                    </Button>
                    <Modal
                        visible={visible}
                        content={<ProjectAddEidtModal {...props} visible={visible} setVisible={setVisible} setProjectList={setProjectList} />}
                        closeOnAction
                        showCloseButton={true}
                        onClose={() => {
                            setVisible(false)
                        }}
                    />
                </div>
                <div className="project-box">
                    {
                        projectList && projectList.length > 0 && projectList.map(item => {
                            return <div className="project-list" key={item.id}>
                                <div className='project-left'>
                                    <div className='project-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='project-title' 
                                            onClick={() => goProdetail(item.id, item.projectType.id)}>{item.projectName}</div>
                                        <div>
                                            {item.master.name}
                                        </div>
                                    </div>
                                </div>
                                <div className='project-type'>
                                    {item.projectType.name}
                                </div>
                                <div>
                                    {status[item.projectState]}
                                </div>
                                <div>
                                    <EyeOutline />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default inject("projectStore")(observer(Project));