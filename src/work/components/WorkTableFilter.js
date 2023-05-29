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
import WorkQuickFilter from "./WorkQuickFilter";

const WorkTableFilter = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 解析store数据
    const { projectList, searchCondition,
        workStatusList, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, getWorkBoardList, getWorkGanttListTree, setWorkId, 
        setWorkIndex, viewType,findProjectList, getSelectUserList, 
        getWorkTypeList, getWorkStatus, userList, findDmFlowList} = workStore;
    
    const [flowIds, setFlowIds] = useState();

    useEffect(() => {
        findProjectList();
        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()
        findDmFlowList({domainId: projectId}).then(res => {
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
        search({ [field]: value })
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
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id") 
                {
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

    const selectChange = (field, value) => {
        search({ [field]: value })
    }
    

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

    return (
        <div className="work-table-second">
            <WorkTypeTab />
            <div className="work-table-filter">
                <WorkQuickFilter getWorkList = {getWorkList} flowIds = {flowIds}/>
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