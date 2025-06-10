/*
 * @Descripttion: 路线图页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 16:52:29
 */
import React, { useEffect, useState } from "react";
import { observer, Provider } from "mobx-react";
import SprintPage from "./SprintPage";
import EpicPage from "./EpicPage";
import VersionPage from "./VersionPage";
import "../component/LineMap.scss";
import LineMapStore from "../store/LineMapStore";
import WorkItemStatusPage from "./WorkItemStatusPage";
import WorkItemTimePage from "./WorkItemTimePage";
import {Col, Row} from "antd";

const Linemap = (props) => {
    const store = {
        lineMapStore: LineMapStore
    }
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("workItemTime");

    const { lineMapView } = LineMapStore;
    /**
     * 根据页面显示类型加载页面
     * @returns 页面
     */
    const view = () => {
        let dom = <WorkItemStatusPage />;
        switch (lineMapView) {
            case "workItemStatus":
                dom = <WorkItemStatusPage />;
                break;
            case "workItemTime":
                dom = <WorkItemTimePage />;
                break;
            default:
                dom = <WorkItemTimePage />;
                break;
        }
        // console.log(JSON.stringify(props.route));
        return dom;
    }


    /**
     * 改变类型
     * @param {*}} e 
     */
    const onChange = value => {
        setType(value)
    };

    return (
        <Provider {...store}>
            {view()}
            {/*<Row>*/}
            {/*    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>*/}
            {/*        <div className="project-linemap">*/}
            {/*            <div className="project-linemap-head">*/}
            {/*                <div className="project-linemap-title">路线图</div>*/}
            {/*                <div className="line-map-tab">*/}
            {/*                    <div className={`tab-tabpane ${type === "workItemStatus" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("workItemStatus")}>*/}
            {/*                        按状态*/}
            {/*                    </div>*/}
            {/*                    <div className={`tab-tabpane ${type === "workItemTime" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("workItemTime")}>*/}
            {/*                        按时间*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*{*/}
            {/*    type === "workItemTime" &&*/}
            {/*    <WorkItemTimePage />*/}
            {/*}*/}
            {/*{*/}
            {/*    type === "workItemStatus" &&*/}
            {/*    <WorkItemStatusPage />*/}
            {/*}*/}


        </Provider>


    )
}
export default observer(Linemap);