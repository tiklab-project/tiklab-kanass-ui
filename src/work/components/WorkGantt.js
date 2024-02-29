
import React, { useEffect, useState } from "react";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { observer, Provider } from "mobx-react";
import { Row, Col } from 'antd';
import { RemoteComponent } from "thoughtware-plugin-core-ui";
import { Empty } from "antd";
import "./WorkGantt.scss";
import { finWorkList } from "./WorkGetList";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
import Gantt from "./GanttTest"
import { withRouter } from "react-router";
import setImageUrl from "../../common/utils/setImageUrl";
import WorkDetailDrawer from "./WorkDetailDrawer";
import { useDebounce } from "../../common/utils/debounce";

const WorkGantt = (props) => {
    const { match, history, location } = props;
    const { workList, editWork, setWorkShowType, setQuickFilterValue, archiveView } = WorkStore;
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
        return;
    }, [projectId])
    return (<Provider {...store}>
        <>
            <Row style={{ background: "#fff"}}>
                <Col
                    className="work-col"
                    sm={24} md={24} lg={{ span: 24 }}
                    xl={{ span: "22", offset: "1" }}
                    xxl={{ span: "18", offset: "3" }}
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
                    workList && workList.length > 0 ?
                        <RemoteComponent
                            point="work-gantt"
                            isModalType={true}
                            extraProps={{ 
                                workList: workList, 
                                editWork: editWork,
                                setImageUrl: setImageUrl,
                                projectId: projectId,
                                workStore: WorkStore,
                                WorkDetailDrawer: WorkDetailDrawer,
                                useDebounce: useDebounce,
                                archiveView: archiveView,
                                match: match,
                                location: location,
                                history: history
                            }}
                        />
                        // <Gantt 
                        //     workList={workList} 
                        //     editWork={editWork} 
                        //     setImageUrl = {setImageUrl} 
                        //     projectId = {projectId}
                        //     workStore = {WorkStore}
                        //     WorkDetailDrawer = {WorkDetailDrawer}
                        //     useDebounce = {useDebounce}
                        //     archiveView = {archiveView}
                        //     {...props}
                        // />
                        :
                        <div style={{ marginTop: "50px" }}>
                            <Empty image="/images/nodata.png" description="暂时没有事项~" />
                        </div>

                }
            </div>
        </>

    </Provider>

    )
}

export default withRouter(observer(WorkGantt));