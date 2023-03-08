import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Row, Col } from 'antd';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkTableFilter.scss";
import { withRouter } from "react-router";
import { SelectSimple, SelectItem } from "../../common/select";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import WorkTypeTab from "./WorkTypeTab";

const WorkTableFilter = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore, formItemLayout, labelHidden, layout } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 解析store数据
    const { projectList, setSearchCondition, searchCondition,
        workStatusList, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, getWorkGanttListTree, setWorkId, 
        setWorkIndex, viewType, setSearchConditionNull,findStateNodeList, 
        statWorkItemOverdue,findProjectList, getSelectUserList, 
        getWorkTypeList, getWorkStatus, userList, findDmFlowList} = workStore;
    
    const [flowIds, setFlowIds] = useState();

    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    useEffect(() => {
        findProjectList();
        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()
        findDmFlowList({domainId: projectId}).then(res => {
            console.log("flowId", res)
            if(res.code === 0){
                const list = [];
                res.data.map(item => {
                    list.push(item.flow.id)
                })
                setFlowIds(list)
            }
        })
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

    const handleChange = (field, value) => {
        console.log(value)
        search({ [field]: value })
    }


    const selectMenu = (type) => {
        // setWorkBreadCrumbText(option.children)
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
                pageSize: 20,
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
                pageSize: 20,
                currentPage: 1,
            }
        }
        const states = ["DONE"]
        getStateNodeList({ inNodeStatus: ['TODO', 'PROGRESS'], inFlowIds: flowIds}).then(data => {
            console.log("pending", data)
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues)
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        const states = "DONE"
        getStateNodeList({ nodeStatus: 'DONE', inFlowIds: flowIds}).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues)
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
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
                pageSize: 20,
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
                        stateNodeList.push(item.node.id)
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

    const sorter = (sortType, isAsc) => {
        const sortParams = [];
        sortParams.push({
            name: sortType,
            orderType: isAsc
        })
        searchCondition.orderParams = sortParams;
        if (viewType === "tree") {
            getWorkConditionPageTree()
        }
        if (viewType === "tile") {
            getWorkConditionPage()
        }
        // setShowSortDropDown(false)
        // setSortType(sortType)

    }
    return (
        <div className="work-table-second">
            <WorkTypeTab />
            <div className="work-table-filter">
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

                <SelectSimple name="assignerIds" onChange={(value) => selectChange("assignerIds", value)} title={"负责人"} ismult={true}>
                    {
                        userList.map(item => {
                            return <SelectItem
                                value={item.user.id}
                                label={item.user.name}
                                key={item.user.id}
                                imgUrl={item.user?.iconUrl}

                            />
                        })
                    }
                </SelectSimple>
                <SelectSimple
                    name="workStatus"
                    onChange={(value) => handleChange("workStatusIds", value)}
                    title={"状态"}
                    ismult={true}
                    selectValue={searchCondition?.workStatusIds}
                >
                    {
                        workStatusList.map(item => {
                            return <SelectItem
                                value={item.id}
                                label={item.name}
                                key={item.id}
                                imgUrl={item.iconUrl}
                            />
                        })
                    }
                </SelectSimple>
                <div className="worklist-table-search">
                    <div className="search-input">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                        <Input bordered={false} allowClear
                            className="workList-search-input"
                            key={"search"}
                            onChange={(value) => handleChange("title", value.target.value)}
                            placeholder="事项标题"
                        />
                    </div>
                </div>
                <WorkFilterModal form={form} layout={"horizontal"} {...props} />
                <WorkSort sorter={sorter}/>
            </div>
        </div>


    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTableFilter)));