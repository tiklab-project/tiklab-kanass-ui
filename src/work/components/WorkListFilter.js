
import React, { useState, useRef, useEffect } from "react";
import { Input, Radio, Dropdown, Menu } from "antd";
import { withRouter } from "react-router";
import "./WorkListFilter.scss";
import { observer, inject } from "mobx-react";
import WorkFilterModal from "./WorkFilterModal";
import WorkSort from "./WorkSort";
import { searchWorkList } from "./WorkSearch";
const WorkListFilter = (props) => {
    const { workStore, form, showWorkListFilter } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const { getWorkConditionPageTree, getWorkConditionPage,
        viewType, searchCondition,  getWorkStatus,
        findProjectList, getSelectUserList} = workStore;

    const [showSearch, setShowSearch] = useState(false);
    
    const workListSearch = useRef();
    
    useEffect(() => {
        getWorkStatus();
        findProjectList();
        getSelectUserList(projectId)
        return;
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
        searchWorkList(workStore, values)
    };

    const sorter = (orderParams) => {
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

    
    

    return (
        <div>
            {
                !showSearch ? <div className={`worklist-filter ${showWorkListFilter ? "show-worklist-filter" : "hidden-worklist-filter"}`} >
                    <div className="worklist-search-large" ref= {workListSearch}>
                        <div className="search-input">
                            <svg className="search-icon" aria-hidden="true">
                                <use xlinkHref="#icon-search"></use>
                            </svg>
                            <Input bordered={false} allowClear
                                placeholder="事项标题、ID"
                                className="workList-search-input"
                                key={"search"}
                                value={searchCondition.keyWord}
                                onChange={(value) => handleChange("keyWord", value.target.value)}
                            />
                        </div>
                    </div>
                    <WorkFilterModal form={form} viewType={"list"} {...props} workListSearch = {workListSearch}/>
                    <WorkSort sorter={sorter} buttonType={"icon"} />
                </div>
                    :
                    <div className="worklist-search-large">
                        <div className="search-input">
                            <svg className="search-icon" aria-hidden="true">
                                <use xlinkHref="#icon-search"></use>
                            </svg>
                            <Input bordered={false} allowClear
                                placeholder="事项标题、ID"
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