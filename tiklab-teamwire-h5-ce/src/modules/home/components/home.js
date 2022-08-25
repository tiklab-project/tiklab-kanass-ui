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
import RecentProject from "./recentProject"
const Home = (props) => {
    const { homeStore } = props;
    const { setActiveIndex, activeIndex} = homeStore;

    return (
        <div className="home">
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={false}
            >
                <div>首页</div>
            </NavBar>
            <Tabs 
                style={{"--content-padding": 0}} 
                activeKey={activeIndex}
                onChange={key => setActiveIndex(key)}
            >
                <Tabs.Tab title='最近访问项目' key='survey'>
                    <RecentProject />
                </Tabs.Tab>
                <Tabs.Tab title='待办事项' key='workItem'>
                    <div>1</div>
                </Tabs.Tab>
                <Tabs.Tab title='动态' key='sprint'>
                   <div>2</div>
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default inject("homeStore")(observer(Home));