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
import "./recentProject.scss"
import { getUser } from 'tiklab-core-ui';
import { withRouter } from 'react-router';
const RecentProject = (props) => {
    const { homeStore } = props;
    const { statProjectWorkItem } = homeStore;

    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        statProjectWorkItem(getUser().userId).then((data) => {
            if (data.code === 0) {
                setProjectList(data.data)
            }
        })
    }, [])

    const goProdetail = (id) => {
        localStorage.setItem("projectId", id);
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
       
    }
    return (
        <div className="recent-project">
            <div className='recent-project-content'>
                <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProject(value)}
                    />
                    {/* <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        添加项目
                    </Button> */}
                </div>
                <div className="recent-project-box">
                    {
                        projectList && projectList.length > 0 && projectList.map(item => {
                            return <div className="recent-project-list" key={item.id}>
                                <div className='recent-project-left'>
                                    <div className='recent-project-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='recent-project-title' 
                                            onClick={() => goProdetail(item.project.id)}>{item.project.projectName}</div>
                                        {/* <div>
                                            {item.master.name}
                                        </div> */}
                                        <div className='recent-project-type'>
                                           <span style={{marginRight: "10px"}}>进行中： {item.processWorkItemCount}</span> 
                                           <span>已完成： {item.endWorkItemCount} </span>
                                        </div>
                                    </div>
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
export default withRouter(inject("homeStore")(observer(RecentProject)));