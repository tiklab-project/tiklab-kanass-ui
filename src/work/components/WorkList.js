/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 10:49:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-18 17:32:06
 */
import React, { useEffect, useState } from "react";
import WorkAside from "./WorkAside";
import { withRouter } from "react-router";
import { renderRoutes } from "react-router-config";
import { Provider, observer } from "mobx-react";
import "./WorkList.scss";
import { Row, Col } from "antd";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import WorkDetail from "./WorkDetail";
import { finWorkList } from "./WorkGetList";
import { setSessionStorage } from "../../common/utils/setSessionStorage";

const WorkList = (props) => {
    const projectId = props.match.params.id;
    const {workId, setWorkShowType, setQuickFilterValue, setWorkList} = WorkStore;
    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    
    useEffect(() => {
        setWorkShowType("list")
        setQuickFilterValue(null)
        finWorkList(path, WorkStore, projectId, sprintId, versionId);
    }, [projectId])

    useEffect(() => {
        if(workId && workId.length > 0){
            if(path === `/index/projectDetail/:id/workList`){
                console.log(`/index/projectDetail/${projectId}/workList/${workId}`)
                props.history.push(`/index/projectDetail/${projectId}/workList/${workId}`)
            }
            if(path === `/index/workList`){
                props.history.push(`/index/workList/${workId}`)
            }
        }
    }, [workId]);

    return (
        <Provider {...store}>
            <div className="work-list">
                <WorkAside
                    {...props}
                />
                <Row style={{ flex: 1 }}>
                    <Col xs={{ span: "24" }} sm={{ span: "24" }} md={{ span: "24" }} xl={{ span: "24" }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                        <div className="work-list-detail">
                            <WorkDetail {...props}></WorkDetail>
                            {/* {renderRoutes(route.routes)} */}
                        </div>
                    </Col>
                </Row>

            </div>
        </Provider>

    )
};

export default withRouter(observer(WorkList));
