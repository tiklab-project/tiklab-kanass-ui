
import React, { useState, useRef, useEffect } from "react";
import { Input, Radio, Dropdown, Menu } from "antd";
import { withRouter } from "react-router";
import "./WorkListFilter.scss";
import { observer, inject } from "mobx-react";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import { SelectSimple, SelectItem } from "../../common/select";
import WorkFilterQuick from "./WorkFilterQuick"
const WorkListFilter = (props) => {
    const { workStore, form, showWorkListFilter } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const { getWorkConditionPageTree, getWorkConditionPage,
        workShowType, viewType, setWorkIndex, setWorkId,
        searchCondition, getWorkBoardList, getWorkStatus,
         findProjectList, getSelectUserList,
        userList, projectList, findDmFlowList } = workStore;

    const [showSearch, setShowSearch] = useState(false);
    const [flowIds, setFlowIds] = useState();

    useEffect(() => {
        getWorkStatus();
        findProjectList();
        getSelectUserList(projectId)
        findDmFlowList({domainId: projectId}).then(res => {
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
        search({ 
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
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
        const orderParams = [];
        orderParams.push({
            name: sortType,
            orderType: isAsc
        })
        searchCondition.orderParams = orderParams;
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
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id" ) {
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
                    <WorkFilterQuick getWorkList = {getWorkList} flowIds = {flowIds}/>
                    {
                        props.match.path == "/index/work/worklist" ?
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
                            <SelectSimple 
                                name="assignerIds" 
                                onChange={(value) => handleChange("assignerIds", value)} 
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
                            value={searchCondition.keyWord}
                            onChange={(value) => handleChange("keyWord", value.target.value)}
                        />
                    </div>
                    <div className="search-cancel" onClick={() => setShowSearch(false)}>取消</div>
                </div>
            }


        </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkListFilter)));