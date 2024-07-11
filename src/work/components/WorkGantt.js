
import React, { useEffect, useState } from "react";
import WorkTableHead from "./WorkTableHead";
import WorkTableFilter from "./WorkTableFilter";
import { observer, Provider } from "mobx-react";
import { Row, Col, Button } from 'antd';
import { Empty } from "antd";
import "./WorkGantt.scss";
import { finWorkList } from "./WorkGetList";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';
// import Gantt from "./GanttTest"
import { withRouter } from "react-router";
import setImageUrl from "../../common/utils/setImageUrl";
import WorkDetailDrawer from "./WorkDetailDrawer";
import { useDebounce } from "../../common/utils/debounce";
import { getVersionInfo } from "thoughtware-core-ui"

const WorkGantt = (props) => {
    const { Gantt } = props;
    const { workList, editWork, setWorkShowType, setQuickFilterValue, archiveView } = WorkStore;
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

    const goBuy = () => {
        if(version === "cloud"){
            window.open("https://work.thoughtware.cn/#/enterprise/application/kanass")
        }else {
            window.open("https://thoughtware.cn/account/subscribe/apply/kanass")
        }
    }

    return (<Provider {...store}>
        <div>
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
                                    setImageUrl = {setImageUrl} 
                                    projectId = {projectId}
                                    workStore = {WorkStore}
                                    WorkDetailDrawer = {WorkDetailDrawer}
                                    useDebounce = {useDebounce}
                                    archiveView = {archiveView}
                                    {...props}
                                />
                                :
                                <div style={{ marginTop: "50px" }}>
                                    <Empty image="/images/nodata.png" description="暂时没有事项~" />
                                </div>

                        }
                    </>
                        :
                        <div style={{ marginTop: "50px" }}>
                            <Empty image="/images/nodata.png" description="付费功能请去购买~">
                                <Button type="primary" size={"middle"} onClick={() => goBuy()}>
                                    立即购买
                                </Button>
                            </Empty>

                        </div>
                }

            </div>
        </div>

    </Provider>

    )
}

export default withRouter(observer(WorkGantt));