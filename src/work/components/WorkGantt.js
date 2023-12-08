
import React, { useEffect, useState } from "react";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { observer, Provider } from "mobx-react";
import {  Row, Col } from 'antd';
import { RemoteComponent } from "thoughtware-plugin-core-ui";
import { Empty } from "antd";
import "./WorkGantt.scss";
import { finWorkList } from "./WorkGetList";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import { withRouter } from "react-router";
const WorkGantt = (props) => {
    const { workList, editWork, setWorkShowType, setQuickFilterValue } = WorkStore;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const path = props.match.path;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    useEffect(() => {
        setWorkShowType("gantt")
        setQuickFilterValue({
            value: "pending",
            label: "我的待办"
        })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId
        }
        finWorkList(path, WorkStore, params);
        console.log(workList)
        return;
    }, [projectId])
    return (<Provider {...store}>
        <Row style={{ height: "100%", overflow: "auto" }}>
            <Col className="work-col" sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                <>
                    <div className="work-list-col">
                        <WorkTableHead />
                        <WorkTableFilter />
                    </div>
                    <div>
                        {
                            workList && workList.length > 0 ?
                                <RemoteComponent
                                    point="work-gantt"
                                    isModalType={true}
                                    extraProps={{ workList: workList, editWork: editWork }}
                                />
                                // <Gantt workList = {workList} editWork = {editWork}/>
                                :
                                <div style={{ marginTop: "50px" }}>
                                    <Empty image="/images/nodata.png" description="暂sss时没有事项~" />
                                </div>

                        }
                    </div>
                </>
            </Col>
        </Row>
    </Provider>

    )
}

export default withRouter(observer(WorkGantt));