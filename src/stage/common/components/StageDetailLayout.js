import {withRouter} from "react-router";
import React, {useEffect, useState} from "react";
import {inject, Provider} from "mobx-react";
import {Col, Layout, Row} from "antd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import {renderRoutes} from "react-router-config";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import StageDetailStore from "../store/StageDetailStore";
import { getUser } from "tiklab-core-ui";
import "./StageDetailLayout.scss"
import StageEditModal from "../../../project/stage/stageList/components/StageEditModal";

const StageDetailLayout = (props) =>{

    const { route, systemRoleStore } = props;
    const store = {
        stageStore: StageDetailStore
    }
    const {findStage, deleteStage} = StageDetailStore
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const stageId = props.match.params.stage;
    const userId = getUser().userId;
    const [showStageAddMoal, setShowStageAddModal] = useState(false);
    const [showStageEditModal, setShowStageEditModal] = useState(false);

    const doneRouter = [
        {
            title: "概况",
            defaultIcon: "survey-default",
            id: `/project/${projectId}/stageDetail/${stageId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            defaultIcon: "workitem-default",
            id: `/project/${projectId}/stageDetail/${stageId}/workitem`,
            key: "work",
            encoded: "work",
        }
    ]
    const [stage, setStage] = useState();

    const [selectTab, setSelectTab] = useState("work");
    const [stageTab, setSprintTab] = useState(doneRouter);

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    const goBack = () => {
        props.history.push(`/project/${projectId}/stage`)
    }

    useEffect(() => {
        console.log("stageId:    ", stageId)
        findStage({id: stageId}).then(res => {
            setStage(res.data)
        })
    }, []);

    const showEditStage = () => {
        setShowStageEditModal(true)
    }

    return (
        <Provider {...store}>
            <div className="stage-detail">
                <Row style={{
                    borderBottom: "1px solid var(--tiklab-gray)"
                }}>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                        <div className={"stage-detail-top"}>
                            {
                                stage &&
                                <div className="stage-detail-title"  onClick={goBack}>
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref="#icon-left"></use>
                                    </svg>
                                    <p className="stage-title">{stage?.stageName}</p>
                                </div>
                            }
                            {/*<SprintDetailAside />*/}

                            <div className="stage-detail-tabs">
                                {
                                    stageTab.map(item => {
                                        return <div
                                            className={`stage-tab ${item.key === selectTab ? "stage-tab-active" : ""}`}
                                            key={item.key}
                                            onClick={() => handleTabClick(item.key, item.id)}
                                        >
                                            <span>{item.title}</span>
                                        </div>
                                    })
                                }
                            </div>

                            <div className="stage-detail-operate">
                                <svg className="svg-icon" aria-hidden="true" onClick={() => showEditStage(stageId)}>
                                    <use xlinkHref="#icon-edit"></use>
                                </svg>
                                <DeleteModal deleteFunction={deleteStage} id={stageId} />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {
                        stage ?
                            <Layout className="stage-detail-content">
                                {renderRoutes(route.routes)}
                            </Layout>
                            :
                            <div className="stage-detail-empty">
                                <ProjectEmpty description="阶段不存在或者已被删除"></ProjectEmpty>
                            </div>

                    }
                </Row>

                <StageEditModal
                    showStageEditModal={showStageEditModal}
                    setShowStageEditModal={setShowStageEditModal}
                    stageId={stageId}
                />
            </div>

        </Provider>

    )
}

export default withRouter(inject("systemRoleStore")(StageDetailLayout));