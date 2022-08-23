/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 15:40:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 11:05:30
 */
import React from "react";
import { NavBar, Tabs } from 'antd-mobile';
import "./projectDeailTab.scss";
import Survey from "../survey/containers/survey";
import WorkItem from "../workItem/containers/workItem";
import Sprint from "../sprint/containers/sprint";
import Version from "../version/containers/versionList";
import MilestoneList from "../milestone/containers/milestoneList";
import ModuleList from "../module/containers/moduleList";
import StatisticsList from "../statistics/components/statisticsList"
const ProjectDetailTab = (props) => {
    const back = () => {
        window.history.back(-1);
    }
    return (
        <div>
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={back}
            >
                <div className="project-detail-top" style={{fontSize: "15px"}}>
                    项目详情
                </div>
            </NavBar>
            <Tabs style={{"--content-padding": 0}}>
                <Tabs.Tab title='概况' key='survey'>
                    <Survey />
                </Tabs.Tab>
                <Tabs.Tab title='事项' key='workItem'>
                    <WorkItem />
                </Tabs.Tab>
                <Tabs.Tab title='迭代' key='sprint'>
                    <Sprint />
                </Tabs.Tab>
                <Tabs.Tab title='版本' key='version'>
                    <Version />
                </Tabs.Tab>
                <Tabs.Tab title='里程碑' key='milestone'>
                    <MilestoneList />
                </Tabs.Tab>
                <Tabs.Tab title='模块' key='module'>
                    <ModuleList />
                </Tabs.Tab>
                <Tabs.Tab title='统计' key='statistics'>
                    <StatisticsList />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default ProjectDetailTab