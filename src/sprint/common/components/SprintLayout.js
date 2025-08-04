/*
 * @Descripttion: 迭代详情页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-08 14:24:49
 */
import React, { useEffect, useState, useRef } from "react";
import { Provider, inject, observer } from "mobx-react";
import {Breadcrumb, Col, Empty, Layout, Row} from "antd";
import "../components/SprintLayout.scss";
import { renderRoutes } from "react-router-config";
import SprintDetailAside from "./SprintDetailAside";
import SprintDetailStore from "../store/SprintDetailStore";
import WorkStore from "../../../work/store/WorkStore";
import { getUser } from "tiklab-core-ui";
// import { UserVerify } from "tiklab-user-extension-ui";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import {withRouter} from "react-router";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import SprintAddmodal from "../../../project/sprint/components/SpintAddEditModal";
import SprintStore from "../../../project/sprint/store/SprintStore";

const Sprintdetail = (props) => {
    const { route, systemRoleStore } = props;
    const store = {
        sprintDetailStore: SprintDetailStore
    }
    const { findSprint, sprint } = SprintDetailStore;
    const { setSearchConditionNull, setTabValue } = WorkStore;
    const {uselist, getUseList, findAllSprintState, delesprintList} = SprintStore;
    const userId = getUser().userId;
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const sprintId = props.match.params.sprint;
    // 弹窗显示
    const [visible, setVisible] = useState(false);
    const [sprintStateList, setSprintStateList] = useState([])
    useEffect(() => {
        setSearchConditionNull()
        findSprint({ id: sprintId }).then(res => {
            console.log(res)
        })
        setTabValue({ id: "all", type: "system" })
        const isPublish = project?.projectLimits === "0" ? true : false;
        systemRoleStore.getInitProjectPermissions(userId, projectId, isPublish)

        findAllSprintState().then(res => {
            if (res.code === 0) {
                setSprintStateList(res.data)
            }
        });

        return () => {
            setSearchConditionNull()
            setTabValue({ id: "all", type: "system" })
        }
    }, []);

    /**
     * 显示添加或者编辑弹窗
     * @param {操作类型， edit,add} type
     * @param {迭代id} id
     */
    const showModal = (type, id) => {
        setVisible(true)
    }

    /**
     * 删除迭代
     * @param {迭代id} id
     */
    const deleSprintList = (id) => {
        delesprintList(id).then(res => {
            goBack();
        })
    }

    const allRouter = [
        {
            title: "概况",
            defaultIcon: "survey-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            defaultIcon: "workitem-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            defaultIcon: "plan-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/plan`,
            key: "plan",
            encoded: "plan",
        },
        {
            title: "统计",
            defaultIcon: "statistics-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/statistics/overview`,
            key: "statistics",
            encoded: "statistics",
        }

    ];

    const doneRouter = [
        {
            title: "概况",
            defaultIcon: "survey-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/overview`,
            key: "overview",
            encoded: "Survey",
        },
        {
            title: "事项",
            defaultIcon: "workitem-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "统计",
            defaultIcon: "statistics-default",
            id: `/project/${projectId}/sprintDetail/${sprintId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ]

    const [selectTab, setSelectTab] = useState("work");
    const [sprintTab, setSprintTab] = useState(allRouter);
    useEffect(() => {
        if (sprint) {
            if (sprint.status === "222222") {
                setSprintTab(doneRouter)
            } else {
                setSprintTab(allRouter)
            }
        }
    }, [sprint])

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    const goBack = () => {
        props.history.push(`/project/${projectId}/sprint`)
    }

    return (<Provider {...store}>
        {/*<Layout className="sprint-detail">*/}
        {/*    <SprintDetailAside />*/}
        {/*    {*/}
        {/*        sprint ? <Layout className="sprint-detail-content">*/}
        {/*            {renderRoutes(route.routes)}*/}
        {/*        </Layout>*/}
        {/*            :*/}
        {/*            <div className="sprint-detail-empty">*/}
        {/*                <ProjectEmpty description="迭代不存在或者已被删除"></ProjectEmpty>*/}
        {/*            </div>*/}

        {/*    }*/}

        {/*</Layout>*/}


            <div className="sprint-detail">

                <Row style={{
                    // borderBottom: "1px solid var(--tiklab-gray)"
                }}>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                        <div style={{
                            padding: "0 20px",
                            display: "flex",
                            gap: "60px",
                            lineHeight: "55px"
                        }}>
                            {
                                sprint &&
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <svg className="icon-22" aria-hidden="true" onClick={goBack}>
                                        <use xlinkHref="#icon-left"></use>
                                    </svg>
                                    <p className="sprint-title">{project?.projectName}</p>
                                </div>
                            }
                            {/*<SprintDetailAside />*/}

                            <div className="sprint-detail-tabs">
                                {
                                    sprintTab.map(item => {
                                        return <div
                                            className={`sprint-tab ${item.key === selectTab ? "sprint-tab-active" : ""}`}
                                            key={item.key}
                                            onClick={() => handleTabClick(item.key, item.id)}
                                        >
                                            <span>{item.title}</span>
                                        </div>
                                    })
                                }
                            </div>

                            <div className="sprint-detail-operate">
                                <svg className="svg-icon" aria-hidden="true" onClick={() => showModal("edit", sprintId)}>
                                    <use xlinkHref="#icon-edit"></use>
                                </svg>
                                <PrivilegeProjectButton code={'SprintDelete'} domainId={projectId}  {...props}>
                                    <DeleteModal deleteFunction={deleSprintList} id={sprintId} />
                                </PrivilegeProjectButton>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {
                        sprint ?
                            <Layout className="sprint-detail-content">
                                {renderRoutes(route.routes)}
                            </Layout>
                            :
                            <div className="sprint-detail-empty">
                                <ProjectEmpty description="迭代不存在或者已被删除"></ProjectEmpty>
                            </div>

                    }
                </Row>

            </div>
            <SprintAddmodal
                type={"edit"}
                sprintId={sprintId}
                projectId={projectId}
                uselist={uselist}
                getUseList={getUseList}
                sprintStateList={sprintStateList}
                setVisible={setVisible}
                visible={visible}
                sprintStore={SprintStore}
                {...props}
            />

    </Provider>

    )
}
// export default inject("systemRoleStore")(UserVerify(observer(Sprintdetail), "/noAuth", "kanass"));
export default inject("systemRoleStore")(observer(Sprintdetail));