/*
 * @Descripttion: 
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
import "../components/workItem.scss";
import { withRouter } from 'react-router';
const WorkItem = (props) => {
    const { workItemStore } = props;
    const { getWorkConditionPage,workList,setSearchConditionNull } = workItemStore;

    useEffect(() => {
        setSearchConditionNull()
        getWorkConditionPage({projectId: localStorage.getItem("projectId")})
    }, [])

    const searchWorkItem = (value) => {
        getWorkConditionPage({title: value})
    }

    return (
        <div className="workItem-list">
            <div className='workItem-search'>
                <SearchBar
                    placeholder='请输入内容'
                    style={{
                        '--border-radius': '100px',
                    }}
                    onChange = {(value) => searchWorkItem(value)}
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
            <div className='workItem'>
                {
                    workList && workList.length > 0 && workList.map(item => {
                        return <div className="workItem-list" key = {item.id}>
                            <div className='workItem-left'>
                                <div className='workItem-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='workItem-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.title}</div>
                                    <div onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                        {item.builder ?item.builder.name : "admin"}
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
export default withRouter(inject("workItemStore")(observer(WorkItem)));