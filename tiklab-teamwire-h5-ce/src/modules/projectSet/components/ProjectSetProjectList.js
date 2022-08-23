/*
 * @Descripttion: 项目集下事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 11:32:13
 */
import React, { useEffect, useState } from 'react';
import {  Avatar, SearchBar,Button } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "./projectSetProjectList.scss";
import { withRouter } from 'react-router';
const ProjectSetProjectList = (props) => {
    const { projectSetStore } = props;
    const { findProjectList } = projectSetStore;
    const projectSetId = props.match.params.id;

    const [projectList, setProjectList] = useState()

    useEffect(() => {
        // setSearchConditionNull()
        findProjectList({projectSetId: projectSetId}).then(res => {
            if(res.code === 0){
                setProjectList(res.data.dataList)
            }
        })
    }, [])

    const goProjectDetail = (id, projectTypeId) => {
        props.history.push(`/project/projectDetail`)
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", projectTypeId);
    }

    return (
        <div className="projectset-project-list">
            <div className='projectset-project-search'>
                <SearchBar
                    placeholder='请输入内容'
                    style={{
                        '--border-radius': '100px',
                    }}
                />
                <Button
                    size='mini'
                    color='primary'
                    onClick={() => {
                        props.history.push("/workItemAdd")
                    }}
                >
                    添加事项
                </Button>
            </div>
            <div className='projectset-project'>
                {
                    projectList && projectList.length > 0 && projectList.map(item => {
                        return <div className="projectset-project-list" key = {item.id}>
                            <div className='projectset-project-left'>
                                <div className='projectset-project-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='projectset-project-title'  onClick={() => goProjectDetail(item.id, item.projectType.type)}>{item.projectName}</div>
                                    <div>
                                        {item.master ?item.master.name : "admin"}
                                    </div>
                                </div>
                            </div>
                            <div className='projectset-project-type'>
                                {item.projectState}
                            </div>
                            <div>
                                未开始
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("projectSetStore")(observer(ProjectSetProjectList)));