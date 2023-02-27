/*
 * @Descripttion: 路线图页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 16:52:29
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import SprintLineMap from "../component/SprintLineMap";
import VersionLineMap from "../component/VersionLineMap";
import EpicPage from "../component/EpicPage";
import "../component/LineMap.scss";
import { Row, Col, Tabs } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
const Linemap = (props) => {
    // 解析props
    const { lineMapStore } = props;
    const { findSprintRoadMap, findVersionRoadMap, findEpicRoadMap } = lineMapStore;
    // 获取当前项目id
    const projectId = props.match.params.id;
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("sprint");
    // 数据
    const [sprintList, setSprintList] = useState([])
    const [versionList, setVersionList] = useState([])

    useEffect(() => {
        // findSprintRoadMap(projectId).then((data) => {
        //     if (data.code === 0) {
        //         setSprintList(data.data)
        //     }
        // })
        // findVersionRoadMap(projectId).then((data) => {
        //     if (data.code === 0) {
        //         setVersionList(data.data)
        //     }
        // })
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
        // setRoadList([])
        setType(value)
        // if (value === "sprint") {
        //     findSprintRoadMap(projectId).then((data) => {
        //         if (data.code === 0) {
        //             setSprintList(data.data)
        //         }
        //     })
        // }
        // if (value === "version") {
        //     findVersionRoadMap(projectId).then((data) => {
        //         if (data.code === 0) {
        //             setVersionList(data.data)
        //         }
        //     })
        // }
        // if (value === "epic") {
        //     findEpicRoadMap(projectId).then((data) => {
        //         if (data.code === 0) {
        //             setRoadList(data.data)
        //         }
        //     })
        // }
    };

    return (
        <Row style={{ height: "100%" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-linemap">
                    {/* <Breadcumb
                        firstText="项目管理"
                    >
                        <div className="top-botton">
                            <Select defaultValue="sprint" onChange={onChange}>
                                <Select.Option value="sprint">迭代</Select.Option>
                                <Select.Option value="version">版本</Select.Option>
                                <Select.Option value="epic">史诗</Select.Option>
                            </Select>
                        </div>
                    </Breadcumb> */}
                    <Breadcumb
                        firstText="项目管理"
                    ></Breadcumb>
                    <Tabs defaultActiveKey="sprint" onChange = {onChange} activeKey = {type}>
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

    )
}
export default inject(
    "lineMapStore"
)(observer(Linemap));