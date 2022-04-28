/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 15:40:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:44:18
 */
import React from "react";
import { NavBar, Tabs, SearchBar, Button, Modal } from 'antd-mobile';
import "./projectDeailTab.scss";
import Survey from "../survey/containers/survey";
import WorkItem from "../workItem/containers/workItem";
import Sprint from "../sprint/containers/sprint";
const ProjectDetailTab = (props) => {
    const back = () => {
        window.history.back(-1);
    }
    return (
        <div>
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={back}
            >
                <div className="project-detail-top" style={{fontSize: "15px"}}>
                    项目详情
                </div>
            </NavBar>
            <Tabs>
                <Tabs.Tab title='概况' key='survey'>
                    <Survey />
                </Tabs.Tab>
                <Tabs.Tab title='事项' key='workItem'>
                    <WorkItem />
                </Tabs.Tab>
                <Tabs.Tab title='迭代' key='sprint'>
                    <Sprint />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default ProjectDetailTab