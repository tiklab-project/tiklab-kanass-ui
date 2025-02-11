/*
 * @Descripttion: 子事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:42
 */
import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col, message, Empty } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkChild.scss"
import WorkChildAddmodal from "./WorkChildAdd";
import Button from "../../common/button/Button";
import WorkChildStore from "../store/WorkChildStore";
import { getUser } from "tiklab-core-ui";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import dayjs from "dayjs";
import { changeWorkItemParent } from "./WorkGetList";
import SprintPlanStore from "../../sprint/plan/stores/SprintPlanStore";
import VersionPlanStore from "../../version/plan/stores/VersionPlanStore";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
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

    /**
     * 根据父级id,查找下级事项
     */
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

    /**
     * 获取子事项列表
     */
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
    
    /**
     * 删除子事项
     */
    const delectChild = (id) => {
        const params = {
            id: id
        }
        deleWorkChild(params).then((res) => {
            if (res.code === 0) {
                // 获取子事项列表
                findWorkChildList()
                // 获取事项及其子事项
                findWorkItemAndChidren({ id: id }).then(res => {
                    if (res.code === 0) {
                        // 更改列表
                        const list = changeWorkItemParent(workList, null, res.data)
                        setWorkList([...list])
                    }
                })
            }
        })
    }

    /**
     * 跳转事项详情
     */
    const goWorkItem = (record) => {
        setTabValue(1)
        setWorkId(record.id)
        
        // 设置事项详情的面包屑
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray")
        newDetailCrumbArray.push({ id: record.id, code: record.code, title: record.title, iconUrl: record.workTypeSys.iconUrl })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)

        // 创建最近事项
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: record.workTypeSys.iconUrl
        }
        createRecent(params)

        // 跳转事项详情
        if (props.match.path === "/project/:id/workDetail/:workId") {
            props.history.push(`/project/${project.id}/workDetail/${record.id}`)
        }

    }

    /**
     * 创建子事项
     */
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

        // 创建子事项
        addWork(params).then(res => {
            if (res.code === 0) {
                showAddChild(false)
                // 获取子事项列表
                findWorkChildList()

                // 获取当前的工作流
                getTransitionList(workStatusNodeId, workType?.flow?.id)
                // 更新树形列表
                findWorkItemAndChidren({ id: res.data }).then(res => {

                    if (res.code === 0) {
                        if (path === "/:id/sprint/:sprint/plan") {
                            planSprintWorkList.unshift(res.data)
                            // 更新迭代规划列表
                            setPlanSprintWorkList(planSprintWorkList)
                        } else if (path === "/:id/version/:version/plan") {
                            planVersionWorkList.unshift(res.data)
                            // 更新版本规划列表
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

    /**
     * 创建子事项
     */
    const createChildrenWorkItem = (event) => {

        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            createChildWorkItem()
        }

    }

    /**
     * 设置事项状态样式
     */
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

    /**
     * 列配置
     */
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
            title: "事项类型",
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
                <WorkPrivilegeComponent workId={workId} code="WorkChildrenDelete">
                    <span onClick={() => delectChild(record.id)} className="span-botton">解除父子关系</span>
                </WorkPrivilegeComponent>
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
                        <WorkPrivilegeComponent workId={workId} code="WorkChildrenAdd">
                            <Button onClick={() => { showAddChild(true); showSelectChild(false) }}>
                                添加{type}
                            </Button>

                        </WorkPrivilegeComponent>
                        <WorkPrivilegeComponent workId={workId} code="WorkChildrenAdd">
                            <Button onClick={() => { showAddChild(false); showSelectChild(true) }}>
                                关联{type}
                            </Button>
                        </WorkPrivilegeComponent>

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
                            onKeyDown={(event) => createChildrenWorkItem(event)}
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