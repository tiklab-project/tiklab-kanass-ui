import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "./processWorkItem.scss"
import { getUser } from 'tiklab-core-ui';
import { withRouter } from 'react-router';
const ProcessWorkItem = (props) => {
    const { homeStore } = props;
    const { statWorkItemProcess } = homeStore;

    const [workItemList, setWorkItemList] = useState([]);

    useEffect(() => {
        statWorkItemProcess().then((data) => {
            if (data.code === 0) {
                // setProjectList(data.data)
                setWorkItemList(data.data)
                console.log(data.data)
            }
        })
    }, [])

    const goProdetail = (id, projectId) => {
        localStorage.setItem("projectId", projectId);
        props.history.push({ pathname: `/workItemDetail/${id}` })
    }

    const searchProject = (value) => {
       
    }
    return (
        <div className="process-workItem">
            <div className='process-workItem-content'>
                <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProject(value)}
                    />
                </div>
                <div className="process-workItem-box">
                    {
                        workItemList && workItemList.length > 0 && workItemList.map(item => {
                            return <div className="process-workItem-list" key={item.id}>
                                <div className='process-workItem-left'>
                                    <div className='process-workItem-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='process-workItem-title' 
                                            onClick={() => goProdetail(item.id, item.project.id)}>{item.title}</div>
                                        <div>
                                            {item.builder ?item.builder.name : "admin"}
                                        </div>
                                    </div>
                                </div>
                                <div className='workItem-type'>
                                    {item.workType.name}
                                </div>
                                <div className='workItem-type'>
                                    {item.project.projectName}
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
export default withRouter(inject("homeStore")(observer(ProcessWorkItem)));