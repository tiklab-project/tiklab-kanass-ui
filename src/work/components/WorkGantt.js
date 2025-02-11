/*
 * @Descripttion: 事项详情页面的甘特图组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:32:41
 */

import React, { useEffect, useState } from "react";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { observer, Provider } from "mobx-react";
import { Row, Col, Button } from 'antd';
import "./WorkGantt.scss";
import { finWorkList } from "./WorkGetList";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import { withRouter } from "react-router";
import WorkDetailDrawer from "./WorkDetailDrawer";
import { useDebounce } from "../../common/utils/debounce";
import { getVersionInfo } from "tiklab-core-ui"
import ProjectEmpty from "../../common/component/ProjectEmpty";
import setImageUrl from "../../common/utils/setImageUrl";
import {applySubscription} from "tiklab-core-ui";

const WorkGantt = (props) => {
    const { Gantt } = props;
    const { workList, editWork, setWorkShowType, archiveView } = WorkStore;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const path = props.match.path;
    const versionInfo = getVersionInfo();

    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    useEffect(() => {
        setWorkShowType("gantt")
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId
        }
        finWorkList(path, WorkStore, params);
        return;
    }, [projectId])

    /**
     * 购买订阅
     */
    const goBuy = () => {
        applySubscription("kanass")
    }

    return (<Provider {...store}>
        <div style={{height: "100%"}}>
            <Row style={{ background: "#fff" }}>
                <Col
                    className="work-col"
                    sm={24} md={24} lg={{ span: 24 }} xl={{ span: 24 }} xxl={{ span: "18", offset: "3" }}
                    style={{ background: "#fff", padding: "20px" }}
                >
                    <div className="work-list-col">
                        <WorkTableHead />
                        <WorkTableFilter />
                    </div>
                </Col>
            </Row>
            <div>
                {
                    Gantt && versionInfo.expired === false ? <>
                        {
                            workList && workList.length > 0 ?
                                <Gantt 
                                    workList={workList} 
                                    editWork={editWork} 
                                    projectId = {projectId}
                                    workStore = {WorkStore}
                                    WorkDetailDrawer = {WorkDetailDrawer}
                                    useDebounce = {useDebounce}
                                    archiveView = {archiveView}
                                    setImageUrl = {setImageUrl}
                                    {...props}
                                />
                                :
                                <div style={{ marginTop: "50px" }}>
                                    <ProjectEmpty description="暂时没有事项~" />
                                </div>

                        }
                    </>
                        :
                        <div style={{ marginTop: "50px" }}>
                            <ProjectEmpty description="付费功能请去购买~">
                                <Button type="primary" size={"middle"} onClick={() => goBuy()}>
                                    立即购买
                                </Button>
                            </ProjectEmpty>

                        </div>
                }

            </div>
        </div>

    </Provider>

    )
}

export default withRouter(observer(WorkGantt));