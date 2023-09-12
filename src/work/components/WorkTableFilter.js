import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Row, Col } from 'antd';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkTableFilter.scss";
import { withRouter } from "react-router";
import { SelectSimple, SelectItem } from "../../common/select";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import WorkQuickTab from "./WorkQuickTab";
import WorkFilterType from "./WorkFilterType";
import { getUser } from "tiklab-core-ui";
import { useDebounce } from "../../common/utils/debounce";

const WorkTableFilter = (props) => {
    // 查找表单
    const { workStore } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 解析store数据
    const { projectList, searchCondition,
        workStatusList, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, getWorkGanttListTree, setWorkId,
        setWorkIndex, viewType, findProjectList, getSelectUserList,
        getWorkTypeList, getWorkStatus, userList, quickFilterValue } = workStore;
    const tenant = getUser().tenant;
    const [inputValue, setInputValue] = useState(searchCondition?.keyWord);
    
    useEffect(() => {
        findProjectList();
        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()
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
    }

    const stateChange = (field, value) => {
        search({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }

    const inputChange = (field, value) => {
        setInputValue(value)
        bebounceChange(field, value)
    }

    const bebounceChange = useDebounce((field, value) => {
        search({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }, [500])
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


    const selectChange = (field, value) => {
        search({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }


    const sorter = (sortType, isAsc) => {
        const sortParams = [];
        sortParams.push({
            name: sortType,
            orderType: isAsc
        })
        searchCondition.orderParams = sortParams;
        searchCondition.pageParam = {
            pageSize: 20,
            currentPage: 1
        }
        if (viewType === "tree") {
            getWorkConditionPageTree()
        }
        if (viewType === "tile") {
            getWorkConditionPage()
        }
    }

    return (
        <div className="work-table-second">
            <WorkQuickTab />
            <div className="work-table-filter">
                {
                    props.match.path == "/index/workTable" &&
                    <SelectSimple name="projectIds"
                        onChange={(value) => selectChange("projectIds", value)}
                        title={"项目"} ismult={true}
                    >
                        {
                            projectList.map(item => {
                                return <SelectItem
                                    value={item.id}
                                    label={item.projectName}
                                    key={item.id}
                                    // imgUrl={item.iconUrl}
                                    imgUrl={version === "cloud" ?
                                        (upload_url + item.iconUrl + "?tenant=" + tenant)
                                        :
                                        (upload_url + item.iconUrl)
                                    }
                                />
                            })
                        }
                    </SelectSimple>
                }
                <WorkFilterType />
                <SelectSimple
                    name="assignerIds"
                    onChange={(value) => selectChange("assignerIds", value)}
                    title={"负责人"}
                    ismult={true}
                    value={searchCondition?.assignerIds}
                >
                    {
                        userList.map(item => {
                            return <SelectItem
                                value={item.user?.id}
                                label={item.user?.nickname ? item.user?.nickname : item.user?.name}
                                key={item.user?.id}
                                imgUrl={item.user?.iconUrl}
                            />
                        })
                    }
                </SelectSimple>
                {
                    workStatusList && workStatusList.length > 0 && <SelectSimple
                        name="workStatus"
                        onChange={(value) => stateChange("workStatusIds", value)}
                        title={"状态"}
                        ismult={"true"}
                        value={searchCondition?.workStatusIds}
                    >
                        <div className="select-group-title">未开始</div>
                        {
                            workStatusList.map(item => {
                                if (item.id === "todo") {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.name}
                                        key={item.id}
                                        imgUrl={item.iconUrl}
                                    />
                                } else {
                                    return <div></div>
                                }

                            })
                        }
                        <div className="select-group-title">进行中</div>
                        {
                            workStatusList.map(item => {
                                if (item.id !== "todo" && item.id !== "done" && item.id !== "start") {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.name}
                                        key={item.id}
                                        imgUrl={item.iconUrl}
                                    />
                                } else {
                                    return <div></div>
                                }

                            })
                        }


                        <div className="select-group-title">已完成</div>
                        {
                            workStatusList.map(item => {
                                if (item.id === "done") {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.name}
                                        key={item.id}
                                        imgUrl={item.iconUrl}
                                    />
                                } else {
                                    return <div></div>
                                }

                            })
                        }
                    </SelectSimple>
                }

                <div className="worklist-table-search">
                    <div className="search-input">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                        <Input bordered={false} allowClear
                            className="workList-search-input"
                            key={"search"}
                            onChange={(value) => inputChange("keyWord", value.target.value)}
                            placeholder="事项标题、ID"
                            value={inputValue}
                        />
                    </div>
                </div>
                <WorkFilterModal layout={"horizontal"} {...props} />
                {/* <WorkSort sorter={sorter} /> */}
            </div>
        </div>


    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTableFilter)));