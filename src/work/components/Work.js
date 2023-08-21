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
import { setSessionStorage } from "../../common/utils/setSessionStorage";

const Work = (props) => {
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    const { workShowType, setSearchConditionNull, setSearchCondition, getWorkConditionPageTree,
        getWorkConditionPage, viewType, setWorkIndex, setWorkId, setWorkShowType,
        setQuickFilterValue, setTabValue, setIsWorkList, findWorkItemNumByWorkType, 
        findWorkItemNumByWorkList, initValues } = WorkStore;

    const pluginStore = useSelector(state => state.pluginStore);
    const projectId = props.match.params.id;
    const [form] = Form.useForm();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    useEffect(() => {
        setQuickFilterValue({ label: '所有', value: 'all' })
        setTabValue({ id: "all", type: "system" })
        setWorkShowType("table")
        switch (props.match.path) {
            case "/index/:id/sprintdetail/:sprint/workItem":
                goWorkItem("sprint")
                break;
            case "/index/work":
                goWorkItem("system")
                break;
            case "/index/projectDetail/:id/work":
                goWorkItem("project")
                break;
            case "/index/workone/:id":
                goWorkItem("systemOne")
                break;
            case "/index/projectDetail/:id/workone/:id":
                goWorkItem("projectOne")
                break;
            default:
                break;
        }
        return () => {
            setIsWorkList(true)
        };
    }, [])

    // useEffect(()=> {
    //     debugger
    //     if(viewType === "tile" || workShowType === "bodar"){
    //         findWorkItemNumByWorkList()
    //     }
    //     if (viewType === "tree" && workShowType !== "bodar") {
    //         findWorkItemNumByWorkType()
    //     }
    // }, [])

    const goWorkItem = (type) => {
        const searchData = JSON.parse(sessionStorage.getItem("searchCondition"));
        const id = props.match.params.id;
        let initValues = {
            ...searchData,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        switch (type) {
            case "sprint":
                initValues = { ...initValues, projectIds: [projectId], sprintIds: [sprintId] };
                break;
            case "project":
                initValues = { ...initValues, projectIds: [projectId] };
                break;
            case "projectOne":
                
                initValues = { ...initValues, projectIds: [projectId], id: id };
                break;
            case "systemOne":
                initValues = { ...initValues, id: id };
                break;
            default: 
                break;
        }

        setSearchConditionNull().then(res => {
            setSearchCondition(initValues)
            sessionStorage.removeItem("searchCondition")
            initFrom(initValues)
            getWorkList();
            findWorkItemNumByWorkType();
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
                        setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
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
                        setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
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
                workShowType === "list" && <Worklist {...props} form={form}></Worklist>
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