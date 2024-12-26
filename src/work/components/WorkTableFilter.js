/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 15:57:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 16:50:56
 * @Description: 事项列表页面，甘特图页面，看板页面顶部的筛选
 */
import React, { useEffect, useState, useRef } from "react";
import { Input } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkTableFilter.scss";
import { withRouter } from "react-router";
import { SelectSimple, SelectItem } from "../../common/select";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import { useDebounce } from "../../common/utils/debounce";
import { searchWorkList } from "./WorkSearch";
import WorkTypeTab from "./WorkTypeTab";
import WorkFilterQuick from "./WorkFilterQuick";

const WorkTableFilter = (props) => {
    // 查找表单
    const { workStore } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 解析store数据
    const { projectList, searchCondition,
        workStatusList, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, viewType, findProjectList, getSelectUserList,
        getWorkTypeList, getWorkStatus, userList, getWorkBoardList } = workStore;
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
        searchWorkList(workStore, values)
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

    const selectChange = (field, value) => {
        search({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }


    const sorter = (orderParams) => {
        searchCondition.orderParams = orderParams;
        searchCondition.pageParam = {
            pageSize: 20,
            currentPage: 1
        }

        if (workShowType === "gantt") {
            if (viewType === "tree") {
                getWorkConditionPageTree()
            }
            if (viewType === "tile") {
                getWorkConditionPage()
            }
        }

        if (workShowType === "bodar") {
            getWorkBoardList(searchCondition)
        }

    }

    return (
        <div className="work-table-second">
            <WorkTypeTab />
            <div className="work-table-filter">
                <div className="worklist-table-search">
                    <div className="search-input">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-search"></use>
                        </svg>
                        <Input bordered={false} allowClear
                            className="workList-search-input"
                            key={"search"}
                            onChange={(value) => inputChange("keyWord", value.target.value)}
                            placeholder="搜索标题、ID"
                            value={inputValue}
                        />
                    </div>
                </div>
                {
                    (props.match.path === "/workitem") &&
                    <SelectSimple
                        name="projectIds"
                        onChange={(value) => selectChange("projectIds", value)}
                        title={"项目"} 
                        ismult={true}
                        suffixIcon = {true}
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
                <WorkFilterQuick />

                {
                    workStatusList && workStatusList.length > 0 &&
                    <SelectSimple
                        name="workStatus"
                        onChange={(value) => stateChange("workStatusIds", value)}
                        title={"状态"}
                        ismult={"true"}
                        value={searchCondition?.workStatusIds}
                        suffixIcon = {true}
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
                                    return <div key={item.id}></div>
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
                                    return <div key={item.id}></div>
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
                                    return <div key={item.id}></div>
                                }

                            })
                        }
                    </SelectSimple>
                }
                <SelectSimple
                    name="assignerIds"
                    onChange={(value) => selectChange("assignerIds", value)}
                    title={"负责人"}
                    ismult={true}
                    value={searchCondition?.assignerIds}
                    suffixIcon = {true}
                    positionType = "right"
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
                <WorkFilterModal layout={"horizontal"} {...props} />


                {
                    (workShowType === "bodar" || workShowType === "gantt") && <WorkSort sorter={sorter} />
                }

            </div>
        </div>


    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTableFilter)));