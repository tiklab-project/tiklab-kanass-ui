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

const Linemap = (props) => {
    const store = {
        lineMapStore: LineMapStore
    }
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("sprint");



    /**
     * 改变类型
     * @param {*}} e 
     */
    const onChange = value => {
        setType(value)
    };

    return (
        <Provider {...store}>
            {/* <Row style={{ height: "100%" }}>
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}> */}
                    <div className="project-linemap">
                        <div className="project-linemap-head">
                            <div className="project-linemap-title">路线图</div>
                            <div className="line-map-tab">
                                <div className={`tab-tabpane ${type === "sprint" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("sprint")}>
                                    迭代
                                </div>
                                <div className={`tab-tabpane ${type === "version" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("version")}>
                                    版本
                                </div>
                                <div className={`tab-tabpane ${type === "epic" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("epic")}>
                                    需求池
                                </div>
                            </div>

                        </div>

                        {
                            type === "sprint" &&
                            <SprintPage />
                        }
                        {
                            type === "version" &&
                            <VersionPage />
                        }
                        {
                            type === "epic" &&
                            <EpicPage />
                        }
                    </div>
                {/* </Col>
            </Row> */}
        </Provider>


    )
}
export default observer(Linemap);