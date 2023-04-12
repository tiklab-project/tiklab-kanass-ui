
import React, { useState, useRef, useEffect } from "react";
import { Input, Radio, Dropdown, Menu } from "antd";
import { withRouter } from "react-router";
import "./WorkListFilter.scss";
import { observer, inject } from "mobx-react";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import { SelectSimple, SelectItem } from "../../common/select";

const WorkListFilter = (props) => {
    const { workStore, form, showWorkListFilter } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { getWorkConditionPageTree, getWorkConditionPage,
        workShowType, viewType, setWorkIndex, setWorkId, findStateNodeList,
        searchCondition, getWorkBoardList, setSearchConditionNull, getWorkStatus,
        setSearchCondition, statWorkItemOverdue, findProjectList, getSelectUserList,
        userList, projectList, findDmFlowList } = workStore;

    const [showSearch, setShowSearch] = useState(false);
    const [flowIds, setFlowIds] = useState();

    useEffect(() => {
        getWorkStatus();
        findProjectList();
        getSelectUserList(projectId)
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
    }, [])

    const handleChange = (field, value) => {
        search({ [field]: value })
    }

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
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        // initFrom(initValues)
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
        // initFrom(initValues)
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
        statWorkItemOverdue({ projectId: projectId, sprintId: sprintId }).then(res => {
            if (res.dataList.length > 0) {
                setWorkId(res.dataList[0].id)
                setWorkIndex(1)
            }

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

    return (
        <div>
            {
                !showSearch ? <div className={`worklist-filter ${showWorkListFilter ? "show-worklist-filter" : "hidden-worklist-filter"}`} >
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
                        props.match.path == "/index/work/worklist/:statetype" ?
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => handleChange("projectIds", value)}
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
                            :
                            <SelectSimple name="assignerIds" onChange={(value) => handleChange("assignerIds", value)} title={"负责人"} ismult={true}>
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
                    }

                    <div className="worklist-search-botton" onClick={() => setShowSearch(true)}>
                        <svg className="search-icon" aria-hidden="true">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                        标题搜索
                    </div>

                    <WorkFilterModal form={form} layout={"horizontal"} {...props} />
                    <WorkSort sorter={sorter} buttonType={"icon"} />
                </div>
                :
                <div className="worklist-search-large">
                    <div className="search-input">
                        <svg className="search-icon" aria-hidden="true">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                        <Input bordered={false} allowClear
                            placeholder="事项标题"
                            className="workList-search-input"
                            key={"search"}
                            onChange={(value) => handleChange("title", value.target.value)}
                        />
                    </div>
                    <div className="search-cancel" onClick={() => setShowSearch(false)}>取消</div>
                </div>
            }


        </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkListFilter)));