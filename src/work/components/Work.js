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
import WorkTableContent from "./WorkTable";
import WorkBodar from "./WorkBodar";
import { observer, Provider } from "mobx-react";
import { useSelector, RemoteComponent } from "tiklab-plugin-core-ui";
import WorkGantt from "./WorkGantt.js";
import WorkBreadCrumb from "./WorkBreadCrumb";
import WorkTableFilter from "./WorkTableFilter";
import { Form, Row, Col } from "antd";
import "../components/Work.scss";
import WorkStore from "../store/WorkStore";
import WorkCalendarStore from '../store/WorkCalendarStore';

const Work = (props) => {
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    const { workShowType, setSearchConditionNull, setSearchCondition, getWorkConditionPageTree,
        getWorkConditionPage, viewType, setWorkIndex, setWorkId, setDetailCrumbArray, setWorkShowType, 
        setQuickFilterValue, setTabValue, setIsWorkList } = WorkStore;
    
    const pluginStore = useSelector(state => state.pluginStore);
    const projectId = props.match.params.id;
    const [form] = Form.useForm();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    console.log(props)
    useEffect(() => {
        setQuickFilterValue({label: '所有', value: 'all'})
        setTabValue({id: "all", type: "system"})
        if (props.match.path === "/index/:id/sprintdetail/:sprint/workItem") {
            goSprintWorkItem()
            setWorkShowType("table")
        }

        if (props.match.path === "/index/work") {
            setWorkShowType("table")
            goSystemWorkItem()
        }
        if (props.match.path === "/index/workone/:id") {
            const id = props.match.params.id;
            let initValues = {
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
            initValues = { id: id, ...initValues }
            setSearchCondition(initValues)
            setWorkId(id)
            getWorkList();
            return
        }

        if (props.match.path === "/index/projectDetail/:id/workone/:id") {
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

        if (props.match.path === "/index/projectDetail/:id/work") {
            setWorkShowType("table")
            goProjectWorkItem()
        }


        return () => {
            setIsWorkList(true)
            // setWorkId("")
            // setWorkIndex("")
        };
    }, [])

    // 进入系统下事项
    const goSystemWorkItem = () => {
        let initValues = {
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        setSearchConditionNull()
        initFrom(initValues)
        getWorkList();

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
        setSearchConditionNull().then(() => {
            // initValues = { userId: useId, ...initValues }
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList();
        })
    }

    // 由项目首页筛选进入事项页面
    const goProjectWorkItem = () => {
        let initValues = {
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchConditionNull().then(() => {
            initValues = { projectIds: [projectId], ...initValues }
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList()
        })
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
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id"
                ) {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    if (workShowType === "list") {
                        setWorkIndex(1)
                        setWorkId(res.dataList[0].id)
                        setDetailCrumbArray([{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
                    }
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
                    if (workShowType === "list") {
                        setWorkIndex(1)
                        setWorkId(res.dataList[0].id)
                        setDetailCrumbArray([{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
                    }
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    return (<Provider {...store}>
        <Fragment>
            {
                workShowType === "list" &&  <Worklist {...props} form={form}></Worklist>
            }
            {
                workShowType === "table" && <WorkTableContent {...props} form={form}></WorkTableContent>
            }
            {
                workShowType === "bodar" &&
                <Fragment>
                    <Row>
                        <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }} style={{ background: "#fff" }}>
                            <div className="work-list-col" style={{ background: "#fff" }}>
                                <WorkBreadCrumb />
                                <WorkTableFilter form={form} />
                            </div>
                        </Col>
                    </Row>
                    <WorkBodar {...props} form={form}></WorkBodar>


                </Fragment>

            }
            {
                workShowType === "time" &&
                <Fragment>
                    <Row style={{ height: "100%" }}>
                        <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                            <div className="work-list-col" style={{ background: "#fff" }}>
                                <WorkBreadCrumb />
                                <WorkTableFilter form={form} />
                            </div>
                            <WorkGantt form={form} />
                        </Col>
                    </Row>
                </Fragment>

            }
            {
                workShowType === "calendar" &&
                <Fragment>
                    <Row style={{ height: "100%" }}>
                        <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                            <WorkBreadCrumb />
                            <WorkTableFilter form={form} />
                            <RemoteComponent
                                point="work-calendar"
                                pluginStore={pluginStore}
                                extraProps={{ workCalendarStore: WorkCalendarStore }}
                            />
                        </Col>
                    </Row>
                </Fragment>
            }
        </Fragment>
    </Provider>
        

    )
}
export default observer(Work);