/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-18 14:12:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-25 17:03:42
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Tabs } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import SprintDetail from "../components/sprintDetail";
import SprintWorkItem from "../components/sprintWorkItem";
import "../components/sprint.scss"
const Sprint = (props) => {
    const { sprintStore } = props;
    const { setActiveIndex, activeIndex} = sprintStore;
    const sprint = JSON.parse(localStorage.getItem("sprint"));
    return (
        <div className="sprint">
            <div className="sprint-top">
                <div className="sprint-top-left" onClick={() => props.history.goBack()}>
                    <svg className="sprint-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="sprint-title">{sprint && sprint.sprintName}</div>
                <div style={{width: "30px"}}></div>
            </div>
            <Tabs 
                style={{"--content-padding": 0}}
                activeKey={activeIndex}
                onChange={key => setActiveIndex(key)}
            >
                <Tabs.Tab title='详情' key='survey'>
                    <SprintDetail />
                </Tabs.Tab>
                <Tabs.Tab title='事项' key='workItem'>
                    <SprintWorkItem />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default inject("sprintStore")(observer(Sprint));