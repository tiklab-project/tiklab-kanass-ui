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
import RecentProject from "./recentProject";
import ProcessWorkItem from "./processWorkItem";
import SystemDynamic from "./systemDynamic"
import "./home.scss"
const Home = (props) => {
    const { homeStore } = props;
    const { setActiveIndex, activeIndex} = homeStore;

    return (
        <div className="home">
            <div className="home-top">
                <div className="home-top-left" onClick={() => props.history.push("/set")}>
                    <svg className="home-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-templateList"></use>
                    </svg>
                </div>
                <div className="home-title">首页</div>
                <div style={{width: "30px"}}></div>
            </div>
            <Tabs 
                style={{"--content-padding": 0}}
                activeKey={activeIndex}
                onChange={key => setActiveIndex(key)}
            >
                <Tabs.Tab title='最近访问项目' key='home'>
                    <RecentProject />
                </Tabs.Tab>
                <Tabs.Tab title='待办事项' key='workItem'>
                    <ProcessWorkItem />
                </Tabs.Tab>
                <Tabs.Tab title='动态' key='dynamic'>
                   <SystemDynamic />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default inject("homeStore")(observer(Home));