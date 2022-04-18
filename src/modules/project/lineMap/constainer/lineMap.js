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
import Timeline from "../component/lineMap"
import "../component/lineMap.scss";
import { Select } from 'antd';
import { Layout, Row, Col, Empty, Breadcrumb, Divider } from "antd";

const Linemap = (props) => {
    // 解析props
    const { lineMapStore } = props;
    const { findSprintRoadMap, findVersionRoadMap, findEpicRoadMap } = lineMapStore;
    // 获取当前项目id
    const projectId = localStorage.getItem("projectId");
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("sprint");
    // 数据
    const [roadList, setRoadList] = useState()

    useEffect(() => {
        if (type === "sprint") {
            findSprintRoadMap(projectId).then((data) => {
                if (data.code === 0) {
                    setRoadList(data.data)
                }
            })
        }
        if (type === "version") {
            findVersionRoadMap(projectId).then((data) => {
                if (data.code === 0) {
                    setRoadList(data.data)
                }
            })
        }
        if (type === "epic") {
            findEpicRoadMap(projectId).then((data) => {
                if (data.code === 0) {
                    setRoadList(data.data)
                }
            })
        }
    }, [type])

    /**
     * 改变类型
     * @param {*}} e 
     */
    const onChange = value => {
        setType(value)
    };

    return (

        <div className="project-linemap">
            <Breadcrumb>
                <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">路线图</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="lineMap">
                <div className="top-botton">
                    <Select defaultValue="sprint" onChange={onChange}>
                        <Select.Option value="sprint">迭代</Select.Option>
                        <Select.Option value="version">版本</Select.Option>
                        <Select.Option value="epic">史诗</Select.Option>
                    </Select>
                </div>
                {
                    roadList && roadList.length > 0 ? <Timeline data={roadList} type={type} /> : <Empty style={{ height: "79vh" }} />
                }
            </div>
        </div>
    )
}
export default inject(
    "lineMapStore"
)(observer(Linemap));