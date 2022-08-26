/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 15:40:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 11:05:30
 */
import React,{useState} from "react";
import { NavBar, Tabs } from 'antd-mobile';
import "./projectDeailTab.scss";
import Survey from "../survey/containers/survey";
import WorkItem from "../workItem/containers/workItem";
import Sprint from "../sprint/containers/sprint";
import Version from "../version/containers/versionList";
import MilestoneList from "../milestone/containers/milestoneList";
import ModuleList from "../module/containers/moduleList";
import StatisticsList from "../statistics/components/statisticsList";
import { inject, observer } from 'mobx-react';

const ProjectDetailTab = (props) => {
    const {projectStore} = props;
    const {activeIndex,setActiveIndex} = projectStore;
    const back = () => {
        window.history.back(-1);
    }
    

    return (
        <div className="project-detail">
             <div className="project-top">
                <div className="project-top-left" onClick={() => props.history.goBack()}>
                    <svg className="project-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="project-title">项目详情</div>
                <div style={{width: "30px"}}></div>
            </div>
            <Tabs 
                style={{"--content-padding": 0}} 
                activeKey={activeIndex}
                onChange={key => setActiveIndex(key)}
            >
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
export default inject("projectStore")(observer(ProjectDetailTab));