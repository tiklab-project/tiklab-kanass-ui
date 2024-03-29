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
import { getUser } from "thoughtware-core-ui";
import { Select, Row, Col, Empty, Pagination } from "antd";
import "./DynamicList.scss";
import DynamicItem from "../../../common/overviewComponent/DynamicItem";

const DynamicList = (props) => {
    const { homeStore } = props;
    const { findLogpage, opLogCondition, opLogList,opLogTotal, setOpLogList, findProjectSetProjectList } = homeStore;
    console.log(opLogTotal)
    const userId = getUser().userId;
    const [projectList, setProjectList] = useState()
    const [firstText, setFirstText] = useState();
    const versionId = props.match.params.version;
    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    const path = props.match?.path;
    useEffect(() => {
        getSerchList()
        const params = {
            status: 1,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            data: null
        }
        if (props.route.path === "/projectDetail/:id/dynamic") {
            setFirstText("项目概况")
            const projectId = props.match.params.id;
            findLogpage({ ...params, data: { projectId: projectId } })

        }

        if (props.route.path === "/projectSetdetail/:projectSetId/dynamic") {
            setFirstText("项目集概况")
            const projectSetId = props.match.params.projectSetId;
            setOpLogList([]);
            findProjectSetProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    const list = res.data;
                    if (list.length > 0) {
                        let opLogs = []
                        list.map(item => {
                            findLogpage({ data: { projectId: item.id } }, "projectSet").then(res => {
                                if (res.code === 0) {
                                    opLogs.push(...res.data.dataList)
                                    setOpLogList([...opLogs])
                                }
                            })
                        })
                    } else {
                        setOpLogList([])
                    }
                }
            })
        }

        if (props.route.path === "/:id/sprintdetail/:sprint/dynamic") {
            findLogpage({ ...params, data: { sprintId: sprintId, projectId: projectId } })
            setFirstText("迭代概况")
        }
        if (props.route.path === "/:id/versiondetail/:version/dynamic") {
            findLogpage({ ...params, data: { versionId: versionId, projectId: projectId } })
            setFirstText("版本概况")
        }
        return;
    }, [])
    /**
         * 获取搜索参数的列表
         */
    const getSerchList = () => {
        if (path === "/projectSetdetail/:projectSetId/dynamic") {
            const projectSetId = props.match.params.projectSetId;
            findProjectSetProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }

    }
    const selectProject = (option) => {
        findLogpage({ data: { projectId: option } })
        // getModuleList(option)
        // getsprintlist(option)
        // getSelectUserList(option);
    }
    const onPageChange = (page, pageSize) => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: page
            }

        }
        findLogpage(params)
    };

    return (<Row style={{ height: "100%", overflow: "auto", background: "var(--thoughtware-gray-600)" }}>
        <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }} className="dynamic-col">
            <div className="dynamic-list-page">
                <div className="dynamic-list-top">
                    <Breadcumb
                        {...props}
                        firstText={firstText}
                        secondText="最新动态"
                    />
                    {
                        (path === "/projectSetdetail/:projectSetId/dynamic") &&
                        <div className="dynamic-filter">

                            <Select
                                placeholder="项目"
                                allowClear
                                className="dynamic-select"
                                key="selectProject2"
                                onSelect={selectProject}
                                style={{ width: 300 }}
                            >
                                {
                                    projectList && projectList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                    }
                </div>

                <div className="dynamic-list">
                    {
                        opLogList && opLogList.length > 0 ? opLogList.map((item) => {
                            return <DynamicItem content={item.data} type={item.actionType.id} {...props} />
                        })
                            :
                            <Empty image="/images/nodata.png" description="暂时没有动态~" />
                    }
                </div>
                {
                    opLogList && opLogList.length > 0 && <div className="dynamic-pagination">
                        <Pagination
                            onChange={onPageChange}
                            defaultCurrent={1}
                            total={opLogTotal}
                            current={opLogCondition.pageParam.currentPage}
                            showSizeChanger={false}
                            defaultPageSize={20}
                            pageSize={20}
                        />
                    </div>
                }
            </div>
        </Col>
    </Row>

    )
}
export default inject('homeStore')(observer(DynamicList));