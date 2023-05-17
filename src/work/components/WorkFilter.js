import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Select } from 'antd';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import { SelectSimple, SelectItem } from "../../common/select";
const WorkFilterForm = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 解析store数据
    const { projectList, setSearchCondition, searchCondition,
        getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, getWorkGanttListTree, workTypeList,
        setWorkId, setWorkIndex, viewType, setSearchConditionNull,
        findStateNodeList, statWorkItemOverdue, 
        findProjectList, getSelectUserList, getWorkTypeList, getWorkStatus, userList } = workStore;

    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    useEffect(() => {
        findProjectList();
        getSelectUserList(projectId)
        getWorkTypeList({projectId: projectId});
        getWorkStatus()
        getAllWorkItem()
        return
    }, [])



    //查找事务
    const search = values => {
        if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(values)
        }
        if (workShowType === "time") {
            getWorkGanttListTree(values)
        }
    };

    const selectMenu = (type) => {
        switch (type) {
            case "all":
                getAllWorkItem();
                break;
            case "pending":
                getPendingWorkItem();
                break;
            case "ending":
                getEndingWorkItem();
                break;
            case "creat":
                getCreatWorkItem();
                break;
            case "overdue":
                getOverdueWorkItem();
                break;
            default:
                break;

        }
    }
    const getWorkList = () => {
        if (viewType === "tile") {
            getPageList();
        } else if (viewType === "tree") {
            getPageTree();
        }
    }

    const getAllWorkItem = () => {
        setSearchConditionNull()
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 10,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        initFrom(initValues)
        getWorkList();

    }

    const getPendingWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 10,
                currentPage: 1,
            }
        }
        const states = ["DONE"]
        getStateNodeList({ excNodeStatus: states }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 10,
                currentPage: 1,
            }
        }
        const states = "DONE"
        getStateNodeList({ nodeStatus: states }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 10,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        initFrom(initValues)
        getWorkList();
    }

    const getOverdueWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            sprintId: sprintId,
            pageParam: {
                pageSize: 10,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        initFrom(initValues)
        statWorkItemOverdue({ projectId: projectId, sprintId: sprintId }).then(res => {
            if (res.dataList.length > 0) {
                setWorkId(res.dataList[0].id)
                setWorkIndex(1)
            }

        })
    }


    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectScrumDetail/:id/workMessage/:id" ||
                    props.match.path === "/index/projectNomalDetail/:id/workMessage/:id"
                ) {
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
                if (props.match.path === "/index/projectScrumDetail/:id/workMessage/:id" ||
                    props.match.path === "/index/projectNomalDetail/:id/workMessage/:id") {
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

    const initFrom = (fromValue) => {
        form.setFieldsValue({
            projectIds: fromValue.projectIds ? fromValue.projectIds : [],
            workTypeId: fromValue.workTypeId ? fromValue.workTypeId : [],
            workStatusIds: fromValue.workStatusIds ? fromValue.workStatusIds : [],
            title: fromValue.title ? fromValue.title : "",
            assignerIds: fromValue.assignerIds ? fromValue.assignerIds : []
        })
    }

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
    const selectChange = (field, value) => {
        search({ [field]: value })
    }
    const quickFilterList = [
        {
            value: "all",
            name: "所有"
        },
        {
            value: "pending",
            name: "我的待办"
        },
        {
            value: "ending",
            name: "我的已办"
        },
        {
            value: "creat",
            name: "我创建的"
        },
        {
            value: "overdue",
            name: "已逾期"
        }
    ]

    return (
        <div className="workitem-filter">
            <SelectSimple name="quickFilter"
                onChange={(value) => selectMenu(value)}
                title={"所有"} ismult={false}>
                {
                    quickFilterList.map(item => {
                        return <SelectItem
                            value={item.value}
                            label={item.name}
                            key={item.value}

                        />
                    })
                }
            </SelectSimple>
            {
                props.match.path == "/index/work/worklist/:statetype" &&
                <SelectSimple name="workTypeIds"
                    onChange={(value) => selectChange("projectIds", value)}
                    title={"项目"} ismult={true}
                >
                    {
                        projectList.map(item => {
                            return <SelectItem
                                value={item.id}
                                label={item.projectName}
                                key={item.id}
                                imgUrl={item.iconUrl}
                            />
                        })
                    }
                </SelectSimple>
            }
            <SelectSimple name="workTypeIds"
                onChange={(value) => selectChange("workTypeIds", value)}
                title={"类型"}
                ismult={true}
                selectValue={searchCondition?.workTypeIds}
            >
                {
                    workTypeList.map(item => {
                        return <SelectItem
                            value={item.workType.id}
                            label={item.workType.name}
                            key={item.workType.id}
                            imgUrl={item.workType.iconUrl}
                        />
                    })
                }
            </SelectSimple>
            {
                props.match.path !== "/index/work/worklist/:statetype"
                && <SelectSimple name="assignerIds" onChange={(value) => selectChange("assignerIds", value)} title={"负责人"} ismult={true}>
                    {
                        userList.map(item => {
                            return <SelectItem
                                value={item.id}
                                label={item.user?.nickname ? item.user?.nickname : item.user?.name}
                                key={item.id}
                                imgUrl={item.user?.iconUrl}

                            />
                        })
                    }
                </SelectSimple>
            }

           

        </div>
    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterForm)));