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
import "../components/workItem.scss";
// import ProjectAddEidtModal from "./components/projectAddEditModal";
const WorkItem = (props) => {
    const { workItemStore } = props;
    const { getWorkConditionPage } = workItemStore;
    const [workItemList, setWorkItemList] = useState();

    useEffect(() => {
        getWorkConditionPage().then((data) => {
            if (data.code === 0) {
                setWorkItemList(data.data.dataList)
            }
        })
    }, [])
    

    return (
        <div className="home">
            <div className='workItem'>
                {
                    workItemList && workItemList.length > 0 && workItemList.map(item => {
                        return <div className="workItem-list">
                            <div className='workItem-left'>
                                <div className='workItem-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='workItem-title'>{item.title}</div>
                                    <div onClick={() => props.history.push({ pathname: "/project/projectDetail"})}>
                                        {item.builder.name}
                                    </div>
                                </div>
                            </div>
                            <div className='workItem-type'>
                                {item.workType.name}
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
export default inject("workItemStore")(observer(WorkItem));