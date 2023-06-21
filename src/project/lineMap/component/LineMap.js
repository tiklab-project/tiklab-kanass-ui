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
import SprintLineMap from "./SprintLineMap";
import VersionLineMap from "./VersionLineMap";
import EpicPage from "./EpicPage";
import "../component/LineMap.scss";
import { Row, Col, Tabs } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import LineMapStore from "../store/LineMapStore";
const Linemap = (props) => {
    const store = {
        lineMapStore: LineMapStore
    }
    const { findSprintRoadMap, findVersionRoadMap } = LineMapStore;
    // 获取当前项目id
    const projectId = props.match.params.id;
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("sprint");
    // 数据
    const [sprintList, setSprintList] = useState([])
    const [versionList, setVersionList] = useState([])

    useEffect(() => {
        if (type === "sprint") {
            findSprintRoadMap(projectId).then((data) => {
                if (data.code === 0) {
                    setSprintList(data.data)
                }
            })
        }
        if (type === "version") {
            findVersionRoadMap(projectId).then((data) => {
                if (data.code === 0) {
                    setVersionList(data.data)
                }
            })
        }

        return;
    }, [type])

    /**
     * 改变类型
     * @param {*}} e 
     */
    const onChange = value => {
        setType(value)
    };

    return (
        <Provider {...store}>
            <Row style={{ height: "100%" }}>
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="project-linemap">
                        <Breadcumb
                            firstText="项目管理"
                        ></Breadcumb>
                        <Tabs defaultActiveKey="sprint" onChange={onChange} activeKey={type}>
                            <Tabs.TabPane tab="迭代" key="sprint">

                            </Tabs.TabPane>
                            <Tabs.TabPane tab="版本" key="version">
                                {/* <VersionLineMap data={versionList} type={type} /> */}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="需求集" key="epic">

                            </Tabs.TabPane>
                        </Tabs>

                        {
                            type === "sprint" &&
                            <SprintLineMap data={sprintList} type={type} />
                        }
                        {
                            type === "version" &&
                            <VersionLineMap data={versionList} type={type} />
                        }
                        {
                            type === "epic" &&
                            <EpicPage />
                        }
                    </div>
                </Col>
            </Row>
        </Provider>


    )
}
export default observer(Linemap);