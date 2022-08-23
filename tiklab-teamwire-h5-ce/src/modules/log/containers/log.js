/*
 * @Descripttion: 事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 10:47:30
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Tabs, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import LogContent from '../components/logContent';
import LogStatistics from "../components/logStatistics"
const Log = (props) => {

    return (
        <div className="log">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div>日志</div>
            </NavBar>
            <Tabs style={{"--content-padding": 0}}>
                <Tabs.Tab title='日志' key='survey'>
                    <LogContent />
                </Tabs.Tab>
                <Tabs.Tab title='日志统计' key='workItem'>
                    <LogStatistics />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default inject("projectStore")(observer(Log));