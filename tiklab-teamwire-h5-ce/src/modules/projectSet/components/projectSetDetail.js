import React from "react";
import { NavBar, Tabs } from 'antd-mobile';
import ProjectSetSurvey from "./ProjectSetSurvey";
import ProjectSetProjectList from "./ProjectSetProjectList";
import { inject, observer } from 'mobx-react';
import "./projectSetDetail.scss"
const ProjectSetDetail = (props) => {
    const { projectSetStore } = props;
    const { activeIndex, setActiveIndex} = projectSetStore;
    return (
        <div className="projectset-detail">
            <div className="projectset-detail-top">
                <div className="projectset-detail-top-left" onClick={() => props.history.goBack()}>
                    <svg className="projectset-detail-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="projectset-detail-title">项目集详情</div>
                <div></div>
            </div>
            <Tabs style={{"--content-padding": 0}} activeKey = {activeIndex} onChange = {(key) => setActiveIndex(key)}>
                <Tabs.Tab title='概况' key='survey'>
                    <ProjectSetSurvey />
                </Tabs.Tab>
                <Tabs.Tab title='项目' key='workItem'>
                    <ProjectSetProjectList />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default inject("projectSetStore")(observer(ProjectSetDetail));