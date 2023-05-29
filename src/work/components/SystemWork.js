/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-24 13:20:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 13:27:06
 */
import React, { Fragment, useEffect } from "react";
import Worklist from "./WorkList";
import WorkTable from "./workTable";
import WorkBodar from "./WorkBodar";
import { observer, inject } from "mobx-react";
import { useSelector } from "tiklab-plugin-core-ui/es";
import { RemoteComponent } from "tiklab-plugin-ui"
import WorkGantt from "./WorkGantt.js";
import WorkBreadCrumb from "./WorkBreadCrumb";
import WorkTableFilter from "./WorkTableFilter";
import { Form, Row, Col } from "antd";
import { getUser } from "tiklab-core-ui";

const SystemWork = (props) => {
    const { workStore, workCalendarStore } = props;
    const { workShowType, setSearchConditionNull, setSearchCondition, getWorkConditionPageTree,
        getWorkConditionPage, viewType, setWorkIndex, setWorkId,
        findStateNodeList, statWorkItemOverdue } = workStore;
    const pluginStore = useSelector(state => state.pluginStore)
    const filterType = props.match.params.statetype ? props.match.params.statetype : null;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const [form] = Form.useForm();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const useId = getUser().userId

    useEffect(() => {
        // setSearchConditionNull()
        if (props.match.path === "/index/projectDetail/:id/sprintdetail/:sprint/workItem/:statetype"
        ) {
            goSprintWorkItem()
        }

        if (props.match.path === "/index/work/worklist/:statetype") {
            goSystemWorkItem()
        }

        if (props.match.path === "/index/work/workone/:id") {
            const id = props.match.params.id;
            let initValues = {
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
            initValues = { id: id, ...initValues }
            setSearchCondition(initValues)
            getWorkList();
            return
        }

        if (props.match.path === "/index/projectScrumDetail/:id/workone/:id" || props.match.path === "/index/projectScrumDetail/:id/workone/:id") {
            const id = props.match.params.id;
            let initValues = {
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
            initValues = { id: id, ...initValues }
            setSearchCondition(initValues)
            getWorkList();
            return
        }

        if (props.match.path === "/index/projectDetail/:id/work/:statetype") {
            goProjectWorkItem()
        }


        return () => {};
    }, [filterType])

    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        return stateNodeList;
    }
    // 进入系统下事项
    const goSystemWorkItem = () => {
        let initValues = {
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        const stateType = props.match.params.statetype;
        let states = []
        if (stateType === "process") {
            states = ["DONE"]
            getStateNodeList({ excNodeStatus: states }).then(data => {
                initValues = { userId: useId, workStatusIds: data, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })


        } else if (stateType === "all") {
            setSearchConditionNull()
            initFrom(initValues)
            getWorkList();

        } else if (stateType === "done") {
            states = "DONE"
            getStateNodeList({ nodeStatus: states }).then(data => {
                initValues = { userId: useId, workStatusIds: data, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })

        } else if (stateType === "overdue") {
            statWorkItemOverdue({ projectId: null }).then(res => {
                setWorkId(res.dataList[0].id)
                setWorkIndex(1)
            })
        } else {
            return
        }
    }

    const goSprintWorkItem = () => {
        let initValues = {
            projectIds: [projectId],
            sprintIds: [sprintId],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        const stateType = props.match.params.statetype;
        if (stateType === "all") {
            setSearchConditionNull().then(() => {
                // initValues = { userId: useId, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })
        } else if (stateType === "demand" || stateType === "task" || stateType === "defect") {
            findWorkTypeIds({ code: filterType }).then(data => {
                initValues = { workTypeIds: data.data, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })
        } else {
            return
        }
    }

    // 由项目首页筛选进入事项页面
    const goProjectWorkItem = () => {
        let initValues = {
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        const stateType = props.match.params.statetype;
        let states = []
        if (stateType === "process") {
            states = ["DONE"]
            getStateNodeList({ excNodeStatus: states }).then(data => {
                initValues = { projectIds: [projectId], userId: useId, workStatusIds: data, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })
        } else if (stateType === "all") {
            setSearchConditionNull().then(() => {
                initValues = { projectIds: [projectId], ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })
        } else if (stateType === "done") {
            states = "DONE"
            getStateNodeList({ nodeStatus: states }).then(data => {
                initValues = { projectIds: [projectId], userId: useId, workStatusIds: data, ...initValues }
                setSearchCondition(initValues)
                initFrom(initValues)
                getWorkList();
            })
        } else if (stateType === "overdue") {
            statWorkItemOverdue({ projectId: projectId }).then(res => {
                setWorkId(res.dataList[0].id)
                setWorkIndex(1)
            })
            return
        } else {
            return
        }
    }

    const initFrom = (fromValue) => {
        form.setFieldsValue({
            projectIds: fromValue.projectIds ? fromValue.projectIds : [],
            workTypeIds: fromValue.workTypeIds ? fromValue.workTypeIds : [],
            workStatusIds: fromValue.workStatusIds ? fromValue.workStatusIds : [],
            title: fromValue.title ? fromValue.title : "",
            assignerIds: fromValue.assignerIds ? fromValue.assignerIds : []
        })
    }

    const getWorkList = () => {
        if (viewType === "tile") {
            getPageList();
        } else if (viewType === "tree") {
            getPageTree();
        }
    }

    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id") {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id") {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    return (
        <div className="project-work" style={{height: "calc(100vh - 48px)"}}>
            {
                workShowType === "list" &&
                <Fragment>
                    <Worklist {...props} form={form}></Worklist>
                </Fragment>
            }
            {
                workShowType === "table" &&
                <Row style={{ height: "100%" }}>
                    <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                        <WorkBreadCrumb />
                        <WorkTableFilter form = {form}/>
                        <WorkTable {...props} form={form}></WorkTable>
                    </Col>
                </Row>
            }
            {
                workShowType === "bodar" &&
                <Row style={{ height: "100%" }}>
                    <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                        <WorkBreadCrumb />
                        <WorkTableFilter form = {form}/>
                        <WorkBodar {...props} form={form}></WorkBodar>
                    </Col>
                </Row>
            }
            {
                workShowType === "time" &&
                <Row style={{ height: "100%" }}>
                    <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                        <WorkBreadCrumb />
                        <WorkTableFilter form={form} />
                        <WorkGantt form={form} />
                    </Col>
                </Row>
            }
            {
                workShowType === "calendar" &&
                <Row style={{ height: "100%" }}>
                    <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                        <WorkBreadCrumb />
                        <WorkTableFilter form={form} />
                        <RemoteComponent
                            point="work-calendar"
                            pluginStore={pluginStore}
                            extraProps={{ workCalendarStore: workCalendarStore }}
                        />
                    </Col>
                </Row>
            }
        </div >

    )
}
export default inject("workStore", "workCalendarStore")(observer(SystemWork));