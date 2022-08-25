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
import "./projectType.scss";
const ProjectType = (props) => {
    const { systemSetStore } = props;
    const { findAllProjectType } = systemSetStore;
    const [projectTypeList, setProjectTypeList] = useState([]);
    useEffect(() => {
        findAllProjectType().then((data) => {
            if (data.code === 0) {
                setProjectTypeList(data.data)
            }
        })
    }, [])

    const type = {
        scrum: "敏捷式项目",
        nomal: "瀑布式开发"
    }

    return (
        <div className="projectType">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    项目类型
                </div>
            </NavBar>
            <div className='projectType-content'>
                <div className="projectType-box">
                    {
                        projectTypeList && projectTypeList.length > 0 && projectTypeList.map(item => {
                            return <div className="projectType-list" key={item.id}>
                                <div className='projectType-left'>
                                    <div className='projectType-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='projectType-title'>{item.name}</div>
                                        <div>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {type[item.type]}
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
export default inject("systemSetStore")(observer(ProjectType));