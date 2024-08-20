import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col, message, Empty } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkChild.scss"
import WorkChildAddmodal from "./WorkChildAdd";
import Button from "../../common/button/Button";
import WorkChildStore from "../store/WorkChildStore";
import { getUser } from "thoughtware-core-ui";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import dayjs from "dayjs";
import { changeWorkItemParent } from "./WorkGetList";
import SprintPlanStore from "../../sprint/plan/stores/SprintPlanStore";
import VersionPlanStore from "../../version/plan/stores/VersionPlanStore";
import ImgComponent from "../../common/imgComponent/ImgComponent";
const WorkChild = (props) => {
    const store = {
        workChild: WorkChildStore
    }
    const { treePath, workStore, workType, projectId, type, workTypeCode,
        getTransitionList, workStatusNodeId, workInfo, setTabValue } = props;

    const { planSprintWorkList, setPlanSprintWorkList } = SprintPlanStore;
    const { planVersionWorkList, setPlanVersionWorkList } = VersionPlanStore;
    const [selectIds, setSelectIds] = useState();
    const [selectChild, showSelectChild] = useState(false);
    const [addChild, showAddChild] = useState(false);
    const [workItemTitle, setWorkItemTitle] = useState()

    const { workId, workList, setWorkId, addWork, createRecent, demandtestcaseId,
        selectVersionList, sprintList, priorityList, setWorkList, findWorkItemAndChidren } = workStore;

    const { getWorkChildList, deleWorkChild, findWorkTypeListByCode } = WorkChildStore;
    const [childWorkList, setChildWorkList] = useState([]);
    const [demandId, setDemand] = useState();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const project = workInfo?.project;
    const projectType = project?.projectType.type;
    const path = props.match?.path;
    console.log(path)
    useEffect(() => {
        if (workTypeCode === "epic") {
            findWorkTypeListByCode().then(res => {
                setDemand(res.data)
                findWorkChildList()
            })
        } else {
            findWorkChildList()
        }
        return;
    }, [workId])

    const findWorkChildList = () => {
        const params = {
            parentId: workId,
            workTypeId: workType?.id,
            workTypeSysId: null,
            title: null,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            }
        }
        if (workTypeCode === "epic") {
            params.workTypeId = null;
            params.workTypeSysId = demandId;
        }
        getWorkChildList(params).then(res => {
            if (res.code === 0) {
                setChildWorkList(res.data)
            }

        })
    }
    const delectChild = (id) => {
        const params = {
            id: id
        }
        deleWorkChild(params).then((res) => {
            if (res.code === 0) {
                findWorkChildList()
                // if (workShowType === "bodar") {
                //     getWorkBoardList()
                // } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                //     getWorkConditionPageTree()
                // } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                //     getWorkConditionPage()
                // }
                findWorkItemAndChidren({ id: id }).then(res => {
                    if (res.code === 0) {
                        const list = changeWorkItemParent(workList, null, res.data)
                        setWorkList([...list])
                    }
                })
            }
        })
    }


    const goWorkItem = (record) => {
        setTabValue(1)
        setWorkId(record.id)
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray")
        newDetailCrumbArray.push({ id: record.id, code: record.code, title: record.title, iconUrl: record.workTypeSys.iconUrl })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: record.workTypeSys.iconUrl
        }
        createRecent(params)
        if (props.match.path === "/project/:id/workDetail/:workId") {
            props.history.push(`/project/${project.id}/workDetail/${record.id}`)
        }

    }


    const createChildWorkItem = () => {
        const params = {
            title: workItemTitle,
            parentWorkItem: workId,
            project: projectId,
            builder: getUser().userId,
            sprint: sprintId ? sprintId : sprintList[0]?.id,
            projectVersion: versionId ? versionId : selectVersionList[0]?.id,
            workType: workType.id,
            workPriority: priorityList[0]?.id,
            assigner: project?.master.id,
            desc: "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]",
            planBeginTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            planEndTime: dayjs().format("YYYY-MM-DD 23:59:59")
        }

        if (projectType === "scrum") {
            params.sprint = sprintList[0]?.id
        } else {
            if (workInfo.stage) {
                params.stage = workInfo.stage.id
            } else {
                message.error("请给父事项规划计划");
                return
            }

        }

        if (workTypeCode === "epic") {
            params.workType = demandTypeId
        }
        addWork(params).then(res => {
            if (res.code === 0) {
                showAddChild(false)
                findWorkChildList()
                getTransitionList(workStatusNodeId, workType?.flow?.id)
                findWorkItemAndChidren({ id: res.data }).then(res => {

                    if (res.code === 0) {
                        if (path === "/:id/sprint/:sprint/plan") {
                            planSprintWorkList.unshift(res.data)
                            setPlanSprintWorkList(planSprintWorkList)
                        } else if (path === "/:id/version/:version/plan") {
                            planVersionWorkList.unshift(res.data)
                            setPlanVersionWorkList(planVersionWorkList)
                        } else {
                            const list = changeWorkItemParent(workList, workId, res.data)
                            setWorkList([...list])
                        }

                    }
                })
            }
        })
    }

    const updateNameByKey = (event) => {

        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            createChildWorkItem()
        }

    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }
    const columns = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            render: (text, record) => <div className="work-title" onClick={() => goWorkItem(record)}>
                <ImgComponent
                    alt=""
                    className="svg-icon"
                    src={record.workTypeSys?.iconUrl}

                />
                <div className="work-name">{text}</div>
            </div>
        },
        {
            title: "事件类型",
            dataIndex: ["workTypeSys", "name"],
            key: "workType",
            width: "10%"

        },
        {
            title: "事项状态",
            dataIndex: ["workStatusNode", "name"],
            key: "workStatus",
            width: "10%",
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode?.id)}`}>
                {text}
            </div>
        },
        // {
        //     title: "负责人",
        //     dataIndex: ["assigner", "name"],
        //     key: "assigner",
        //     width: "10%"
        // },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "13%",
            render: (text, record) => (
                <span onClick={() => delectChild(record.id)} className="span-botton">解除父子关系</span>
            ),
        }
    ];


    return (<Provider {...store}>
        <div className="work-child">
            <div className="child-top">
                <div className="child-top-title">共{childWorkList?.length}条</div>
                {
                    !selectChild && workInfo.workStatusCode !== "DONE" &&
                    <div className="child-top-botton">
                        <Button onClick={() => { showAddChild(true); showSelectChild(false) }}>
                            添加{type}
                        </Button>
                        <Button onClick={() => { showAddChild(false); showSelectChild(true) }}>
                            关联{type}
                        </Button>
                    </div>

                }
            </div>
            <div className="child-content">
                {
                    selectChild && <WorkChildAddmodal
                        {...props}
                        name="添加事项"
                        selectIds={selectIds}
                        selectChild={selectChild}
                        showSelectChild={showSelectChild}
                        getWorkChildList={getWorkChildList}
                        setChildWorkList={setChildWorkList}
                        treePath={treePath}
                        demandId={demandId}
                        stageId={workInfo.stage?.id}
                    />
                }
                {
                    addChild && <div className="child-create-input">
                        <Input
                            placeholder="输入事项名称"
                            onChange={(value) => setWorkItemTitle(value.target.value)}
                            onKeyDown={(event) => updateNameByKey(event)}
                        />
                        <div className="child-create-submit">
                            <div className="create-submit" onClick={() => createChildWorkItem()}>
                                确定
                            </div>
                            <div className="create-cancel" onClick={() => showAddChild(false)}>
                                取消
                            </div>
                        </div>
                    </div>
                }
                {
                    childWorkList?.length > 0 ? <Table
                        columns={columns}
                        dataSource={childWorkList}
                        rowKey={record => record.id}
                        pagination={false}
                        showHeader={false}
                        scroll={{ x: "100%" }}
                    />
                        :
                        <Empty description={`暂无${type}`} />
                }

            </div>
        </div>
    </Provider>

    )
}
export default inject("workStore")(observer(WorkChild));