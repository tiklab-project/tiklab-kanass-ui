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
import "./workPriorityList.scss";
const WorkPriorityList = (props) => {
    const { systemSetStore } = props;
    const { findAllWorkPriority } = systemSetStore;
    const [workPriorityList, setWorkPriorityList] = useState([]);
    useEffect(() => {
        findAllWorkPriority().then((data) => {
            if (data.code === 0) {
                setWorkPriorityList(data.data)
            }
        })
    }, [])

    const type = {
        system: "系统",
        custom: "自定义"
    }

    return (
        <div className="workPriority">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    项目类型列表
                </div>
            </NavBar>
            <div className='workPriority-content'>
                <div className="workPriority-box">
                    {
                        workPriorityList && workPriorityList.length > 0 && workPriorityList.map(item => {
                            return <div className="workPriority-list" key={item.id}>
                                <div className='workPriority-left'>
                                    <div className='workPriority-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='workPriority-title'>{item.name}</div>
                                        <div>
                                            {item.desc ? item.desc : "无"}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {type[item.group]}
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
export default inject("systemSetStore")(observer(WorkPriorityList));