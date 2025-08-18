import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import React, {useEffect, useState} from "react"
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import {useDebounce} from "../../../common/utils/debounce";
import setImageUrl from "../../../common/utils/setImageUrl";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import PlanningGantt from "./PlanningGantt";
import {finWorkList} from "../../../work/components/WorkGetList";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import {Col, Row} from "antd";
import WorkTableHead from "../../../work/components/WorkTableHead";
import WorkTableFilter from "../../../work/components/WorkTableFilter";
import PlanningWorkStore from "../store/PlanningWorkStore";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import PlanningTableHead from "./PlanningTableHead";

const Planning = (props) => {
    const { workList, editWork, setWorkShowType, archiveView, findWorkTypeDmList, getWorkConditionList,
        setWorkId, setWorkIndex, findSelectSprintList, findStageList, findSelectVersionList} = PlanningWorkStore;
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const path = props.match.path;

    const store = {
        workStore: PlanningWorkStore,
        workCalendarStore: WorkCalendarStore
    };

    const [workTypeDmList, setWorkTypeDmList] = useState([]);
    const [defaultSprint, setDefaultSprint] = useState(null);
    const [defaultVersion, setDefaultVersion] = useState(null);
    const [defaultStage, setDefaultStage] = useState(null);

    useEffect(() => {
        // setWorkShowType("gantt")

        let params = {
            projectId: projectId
        }
        findWorkTypeDmList(params).then(res => {
            setWorkTypeDmList(res.data)
        })
        // 获取最新的迭代、版本、计划
        if (project){
            if (project.projectType.type === "scrum" || project.projectType.type === "kanban" || project.projectType.type === "hybrid"){
                findSelectSprintList(projectId).then(res => {
                    if (res.code === 0) {
                        if (res.data.length > 0) {
                            setDefaultSprint(res.data[0]?.id)
                        }
                    }
                })
            }
            if (project.projectType.type === "nomal" || project.projectType.type === "hybrid" || project.projectType.type === "ipd"){
                findStageList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setDefaultStage(res.data[0]?.id)

                    }
                })
            }
            findSelectVersionList(projectId).then(res => {
                if (res.code === 0) {
                    if (res.data.length > 0) {
                        setDefaultVersion(res.data[0]?.id)
                    }
                }
            })
        }

        getWorkConditionList(params).then((res) => {
            setWorkId(0)
            setWorkIndex(0)

        })
        return;
    }, [projectId])


    return(
        <Provider {...store}>
            <div className="planning">
                <Row className={"planning-top"}>
                    <Col
                        sm={24} md={24} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: "24", offset: "0" }}
                        style={{ background: "#fff", padding: "20px", height: "100%" }}
                    >
                        <div className="planning-top-filter">
                            <PlanningTableHead />
                            <WorkTableFilter />
                        </div>
                    </Col>
                </Row>
                <div>
                    {
                        <>
                            {
                                workList && workList.length > 0 ?
                                    <PlanningGantt
                                        workList={workList}
                                        editWork={editWork}
                                        projectId = {projectId}
                                        workStore = {PlanningWorkStore}
                                        WorkDetailDrawer = {WorkDetailDrawer}
                                        useDebounce = {useDebounce}
                                        archiveView = {archiveView}
                                        setImageUrl = {setImageUrl}
                                        workTypeDmList={workTypeDmList}
                                        defaultSprint={defaultSprint}
                                        defaultVersion={defaultVersion}
                                        defaultStage={defaultStage}
                                        {...props}/>
                                    :
                                    <div style={{ marginTop: "50px" }}>
                                        <ProjectEmpty description="暂时没有事项~" />
                                    </div>

                            }
                        </>
                    }
                </div>
            </div>
        </Provider>
    )
};

export default withRouter(observer(Planning));