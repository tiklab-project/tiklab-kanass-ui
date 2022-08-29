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
import "../components/projectSet.scss";
import ProjectSetAdd from "../components/projectSetAdd";

const ProjectSet = (props) => {
    const { projectSetStore, homeStore } = props;
    const { findProjectSetPage } = projectSetStore;
    const [projectsetList, setProjectSetList] = useState([]);
    const [visible, setVisible] = useState(false);
    const { setActiveIndex, activeIndex, setSystemSetVisible, systemSetVisible } = homeStore;

    
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
    const searchProjectSet = (value) => {
        findProjectSetPage({name: value}).then((data) => {
            if (data.code === 0) {
                setProjectSetList(data.data.dataList)
            }
        })
    }

    return (
        <div className="projectset">
            <div className="projectset-top">
                <div className="projectset-top-left" onClick={() => setSystemSetVisible(true)}>
                    <svg className="projectset-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-templateList"></use>
                    </svg>
                </div>
                <div className="projectset-title">项目集</div>
                <div></div>
            </div>
            <div className='projectset-content'>
                <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProjectSet(value)}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => setVisible(true)}
                    >
                        添加项目集
                    </Button>
                    <Modal
                        visible={visible}
                        content={<ProjectSetAdd {...props} visible={visible} setVisible={setVisible} setProjectSetList={setProjectSetList} />}
                        closeOnAction
                        showCloseButton={true}
                        onClose={() => {
                            setVisible(false)
                        }}
                    />
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
                                    {item.master.name}
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
export default inject("projectSetStore", "homeStore")(observer(ProjectSet));