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
import "../components/projectSet.scss"
const ProjectSet = (props) => {
    const { projectSetStore } = props;
    const { findProjectSetPage } = projectSetStore;
    const [projectsetList, setProjectSetList] = useState([]);
    useEffect(() => {
        findProjectSetPage().then((data) => {
            if (data.code === 0) {
                setProjectSetList(data.data.dataList)
            }
        })
    }, [])

    const goProjectSetdetail = (id) => {
        props.history.push({ pathname: `/ProjectSetDetail/${id}` })
    }

    return (
        <div className="home">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={false}
            >
                <div className="title-top">
                    项目集列表
                </div>
            </NavBar>
            <div className='projectset'>
                <div className='title'>
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
                            setVisible(true)
                        }}
                    >
                        添加项目集
                    </Button>
                </div>
                <div className="projectset-box">
                    {
                        projectsetList && projectsetList.length > 0 && projectsetList.map(item => {
                            return <div className="projectset-list" key={item.id}>
                                <div className='projectset-left'>
                                    <div className='projectset-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='projectset-title' 
                                            onClick={() => goProjectSetdetail(item.id)}>{item.name}</div>
                                        <div>
                                            {item.startTime} ~ {item.endTime}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    未开始333
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
export default inject("projectSetStore")(observer(ProjectSet));