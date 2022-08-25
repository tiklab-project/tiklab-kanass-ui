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
import "./workTypeList.scss";
const WorkTypeList = (props) => {
    const { systemSetStore } = props;
    const { findAllWorkType } = systemSetStore;
    const [workTypeList, setWorkTypeList] = useState([]);
    useEffect(() => {
        findAllWorkType().then((data) => {
            if (data.code === 0) {
                setWorkTypeList(data.data)
            }
        })
    }, [])

    const type = {
        system: "系统",
        custom: "自定义"
    }

    return (
        <div className="workType">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    事项类型
                </div>
            </NavBar>
            <div className='workType-content'>
                <div className="workType-box">
                    {
                        workTypeList && workTypeList.length > 0 && workTypeList.map(item => {
                            return <div className="workType-list" key={item.id}>
                                <div className='workType-left'>
                                    <div className='workType-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='workType-title'>{item.name}</div>
                                        <div>
                                            <span style={{marginRight: "10px"}}>流程配置：{item.flow.name}</span>
                                            <span>表单配置：{item.flow.name}</span>
                                            
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
export default inject("systemSetStore")(observer(WorkTypeList));