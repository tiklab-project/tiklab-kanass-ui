/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 19:14:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:11:10
 */
/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:07:05
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/sprint.scss";
import { withRouter } from 'react-router';

const Sprint = (props) => {
    const { sprintStore } = props;
    const { getSprintConditionPage } = sprintStore;
    const [sprintList, setsprintList] = useState();
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
        getSprintConditionPage({projectId: projectId}).then((data) => {
            if (data.code === 0) {
                setsprintList(data.data.dataList)
            }
        })
    }, [])
    
    const goSprintDetail = (sprint) => {
        props.history.push({ pathname: `/sprintWorkItem/${sprint.id}`})
        
        localStorage.setItem("sprint", JSON.stringify(sprint))
    }

    const searchSprint = (value) => {
        getSprintConditionPage({sprintName: value}).then((data) => {
            if (data.code === 0) {
                setsprintList(data.data.dataList)
            }
        })
    }
    return (
        <div className="home">
            <div className='sprint'>
                <div className='sprint-search'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchSprint(value)}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            props.history.push("/sprintAdd")
                        }}
                    >
                        添加迭代
                    </Button>
                </div>
                {
                    sprintList && sprintList.length > 0 && sprintList.map(item => {
                        return <div className="sprint-list" key = {item.id}>
                            <div className='sprint-left'>
                                <div className='sprint-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='sprint-title' onClick={() => goSprintDetail(item) }>{item.sprintName}</div>
                                    <div >
                                        {item.master ? item.master.name : "admin" }
                                    </div>
                                </div>
                            </div>
                            <div>
                                {item.sprintState.name}
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
export default withRouter(inject("sprintStore")(observer(Sprint)));