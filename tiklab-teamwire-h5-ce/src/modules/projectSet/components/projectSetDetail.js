import React from "react";
import { NavBar, Tabs } from 'antd-mobile';
import ProjectSetSurvey from "./ProjectSetSurvey";
import ProjectSetProjectList from "./ProjectSetProjectList";
import { inject, observer } from 'mobx-react';

const ProjectSetDetail = (props) => {
    const { projectSetStore } = props;
    const { activeIndex, setActiveIndex} = projectSetStore;
    return (
        <div className="projectset-detail">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                onBack={()=> props.history.goBack()}
            >
                <div>项目集详情</div>
            </NavBar>
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