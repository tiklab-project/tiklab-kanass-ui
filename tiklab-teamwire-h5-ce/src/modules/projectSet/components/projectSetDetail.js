import React from "react";
import { NavBar, Tabs } from 'antd-mobile';
import ProjectSetSurvey from "./ProjectSetSurvey";
import ProjectSetProjectList from "./ProjectSetProjectList"
const ProjectSetDetail = (props) => {
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
            <Tabs style={{"--content-padding": 0}}>
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
export default ProjectSetDetail;