/*
 * @Descripttion: 动态列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 13:36:22
 */

import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import { Select, Row, Col } from "antd";
import "./DynamicList.scss";

const DynamicList = (props) => {
    const { homeStore } = props;
    const { findLogpage, findProjectList, opLogList } = homeStore;
    const userId = getUser().userId;
    const [projectList, setProjectList] = useState()
    const [firstText, setFirstText] = useState();
    const versionId = props.match.params.version;
    const sprintId =  props.match.params.sprint;
    useEffect(() => {
        if (props.route.path === "/projectDetail/:id/dynamic") {
            setFirstText("项目概况")
            const projectId = props.match.params.id;
            findLogpage({ userId: userId, projectId: projectId })
            findProjectList().then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        if (props.route.path === "/dynamic") {
            setFirstText("首页")
            findLogpage({ userId: userId, projectId: projectId })
        }
        if (props.route.path === "/projectSetdetail/:projectSetId/dynamic") {
            setFirstText("项目集概况")
            findLogpage({ userId: userId})
        }

        if (props.route.path === "/:id/sprintdetail/:sprint/dynamic") {
            findLogpage({ userId: userId, sprintId: sprintId })
            setFirstText("迭代概况")
        }
        if (props.route.path === "/:id/versiondetail/:version/dynamic") {
            findLogpage({ userId: userId, versionId: versionId })
            setFirstText("版本概况")
        }
        return;
    }, [])

    const selectProject = (option) => {
        // getModuleList(option)
        // getsprintlist(option)
        // getSelectUserList(option);
    }

    return (<Row style={{ height: "100%", overflow: "auto", background: "var(--tiklab-gray-600)" }}>
        <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }} className="dynamic-col">
            <div className="dynamic-list-page">
                <div className="dynamic-list-top">
                    <Breadcumb
                        {...props}
                        firstText={firstText}
                        secondText="最新动态"
                    // firstUrl="/home"
                    />
                    <div className="dynamic-filter">
                        <Select
                            placeholder="项目集"
                            allowClear
                            className="dynamic-select"
                            key="selectProject"
                            onSelect={selectProject}
                            width={100}
                        >
                            {
                                projectList && projectList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>

                        <Select
                            placeholder="项目"
                            allowClear
                            className="dynamic-select"
                            key="selectProject2"
                            onSelect={selectProject}
                            width={100}
                        >
                            {
                                projectList && projectList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>

                        <Select
                            placeholder="迭代"
                            allowClear
                            className="dynamic-select"
                            key="selectProject3"
                            onSelect={selectProject}
                            width={100}
                        >
                            {
                                projectList && projectList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>
                        <Select
                            placeholder="事项"
                            allowClear
                            className="dynamic-select"
                            key="selectProject4"
                            onSelect={selectProject}
                            width={100}
                        >
                            {
                                projectList && projectList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                </div>

                <div className="dynamic-list">
                    {
                        opLogList && opLogList.map((item) => {
                            return <div
                                dangerouslySetInnerHTML={{ __html: item.data }}
                                className="dynamic-item"
                            />
                        })
                    }
                </div>
            </div>
        </Col>
    </Row>

    )
}
export default inject('homeStore')(observer(DynamicList));