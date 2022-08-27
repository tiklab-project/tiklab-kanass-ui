/*
 * @Descripttion: 事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 10:47:30
 */
import React, { useEffect, useState } from 'react';
import { AppOutline, EyeOutline } from 'antd-mobile-icons';
import { Tabs } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import LogContent from '../components/logContent';
import LogStatistics from "../components/logStatistics";
import "../components/log.scss"
const Log = (props) => {
    return (
        <div className="log">
             <div className="log-top">
                <div className="log-top-left" onClick={() => props.history.push("/set")}>
                    <svg className="log-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-templateList"></use>
                    </svg>
                </div>
                <div className="log-title">日志</div>
                <div style={{width: "30px"}}></div>
            </div>
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