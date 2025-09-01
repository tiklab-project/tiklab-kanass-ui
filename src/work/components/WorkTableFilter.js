/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 15:57:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 16:50:56
 * @Description: 事项列表页面，甘特图页面，看板页面顶部的筛选
 */
import React, { useEffect, useState, useRef } from "react";
import {Dropdown, Input, Menu} from 'antd';
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
import WorkTypeSelect from "./WorkTypeSelect";
import WorkFilterSelect from "./WorkFilterSelect";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import WorkCreatDropdown from "./workCreatDropdown";
import Button from "../../common/button/Button";
import WorkChangeView from "./WorkChangeView";
import WorkAddModel from "./WorkAddModel";
import ProductStore from "../../product/product/store/ProductStore";
import ProjectSetStore from "../../projectSet/projectSet/store/ProjectSetStore";

const getStore = (productId) =>{
    if (productId){
        return ProductStore
    }else {
        return ProjectSetStore
    }
}
const WorkTableFilter = (props) => {
    // 查找表单
    const { workStore } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    // 解析store数据
    const { searchCondition,
        workStatusList, getWorkConditionPage, getWorkConditionPageTree, setViewType, setWorkShowType,
        workShowType, viewType, getSelectUserList, setArchiveView, archiveView,
        getWorkTypeList, getWorkStatus, userList, getWorkBoardList, workTypeList, quickFilterVisible, workTypeVisible } = workStore;
    const [inputValue, setInputValue] = useState(searchCondition?.keyWord);
    const [stateType, setState] = useState();
    const workAddModel = useRef()
    const project = JSON.parse(localStorage.getItem("project"));
    const path = props.match.path;

    const productId = props.match.params.productId ? props.match.params.productId : null;
    const projectSetId = props.match.params.projectSetId ? props.match.params.projectSetId : null;
    const {findProjectList} = getStore(productId)
    const [projectList, setProjectList] = useState([])

    const [groupStatus, setGroupStatus] = useState({
        todo: { statusType: 'todo', allChecked: false, partialChecked: false },
        progress: { statusType: 'progress',allChecked: false, partialChecked: false },
        done: { statusType: 'done',allChecked: false, partialChecked: false }
    });

    const progressRef = useRef(null);

    const menuPlugin = (
        <Menu>
            {/* <Menu.Item>
                {
                    pluginStore.filter(item => item.point === "import-modal").length > 0 ? <div onClick={() => importFile()}>导入</div> :
                        <Popconfirm
                            title="此服务需要购买，确认购买?"
                            okText="Yes"
                            cancelText="No"
                        >
                            <div onClick={() => buy()}>导入ss?</div>
                        </Popconfirm>
                }
            </Menu.Item> */}
            <Menu.Item>
                <div onClick={() => exportFile()}>导出</div>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        findProjectList();
        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()
        if (path.includes("/product")){
            findProjectList({productId: productId}).then(res => {
                setProjectList(res.data)
            })
        }
        if (path.includes("/projectSet")){
            findProjectList({projectSetId: projectSetId}).then(res => {
                setProjectList(res.data)
            })
        }
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

    /**
     * 父复选框选择逻辑
     * @param e
     * @param groupType
     */
    const handleGroupCheck = (e, groupType) => {
        e.stopPropagation();
        const currentSelected = searchCondition?.workStatusIds || [];
        let newSelected = [...currentSelected];

        const groupItems = workStatusList.filter(item => {
            if (groupType === "todo") return item.id === "todo";
            if (groupType === "done") return item.id === "done";
            return item.id !== "todo" && item.id !== "done" && item.id !== "start";
        });

        if (e.target.checked) {
            // 添加组内所有未选中的项
            groupItems.forEach(item => {
                if (!newSelected.includes(item.id)) {
                    newSelected.push(item.id);
                }
            });
        } else {
            // 移除组内所有已选中的项
            newSelected = newSelected.filter(id =>
                !groupItems.some(item => item.id === id)
            );
        }
        stateChange("workStatusIds", newSelected);
    };

    // 判断是否所有子项都被选中
    const isAllChecked = (groupId) => {
        const groupItems = workStatusList.filter(item => {
            if (groupId === "todo") return item.id === "todo";
            if (groupId === "done") return item.id === "done";
            return item.id !== "todo" && item.id !== "done" && item.id !== "start";
        });
        const currentSelected = searchCondition?.workStatusIds || [];
        return groupItems.every(item => currentSelected.includes(item.id));
    }

    // 判断是否仅部分子项被选中
    const isPartiallyChecked = (groupId) => {
        const groupItems = workStatusList.filter(item => {
            if (groupId === "todo") return item.id === "todo";
            if (groupId === "done") return item.id === "done";
            return item.id !== "todo" && item.id !== "done" && item.id !== "start";
        });
        const currentSelected = searchCondition?.workStatusIds || [];
        const checkedCount = groupItems.filter(item => currentSelected.includes(item.id)).length;
        return checkedCount > 0 && checkedCount < groupItems.length;
    }

    /**
     * 子复选框选择逻辑
     * @param e
     * @param groupId
     */
    const handleChildChange = (e, groupId) => {
        const newValue = e.target.value;
        const isChecked = e.target.checked;
        const newSelectData = searchCondition?.workStatusIds || [];
        if(isChecked) {
            if(!newSelectData.includes(newValue)) {
                newSelectData.push(newValue);
            }
        } else {
            const index = newSelectData.indexOf(newValue);
            if(index > -1) {
                newSelectData.splice(index, 1);
            }
        }
        // searchCondition.workStatusIds = newSelectData;
        stateChange(newSelectData);

        // // 更新组的状态
        setGroupStatus({
            ...groupStatus,
            [groupId]: {
                allChecked: isAllChecked(groupId),
                partialChecked: isPartiallyChecked(groupId)
            }
        });
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
            {/*<WorkTypeTab/>*/}


            <div className="work-table-filter">
                {quickFilterVisible && <WorkFilterSelect />}
                {workTypeVisible && !path.includes("/product")  && <WorkTypeSelect />}

                {/*<WorkFilterQuick />*/}

                {/*{*/}
                {/*    (workShowType === "bodar" || workShowType === "gantt") && <WorkSort sorter={sorter} />*/}
                {/*}*/}
            </div>

            <div style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                {
                    workShowType === "gantt" && <div className="work-gantt-view">
                        <div className={`work-gantt-view-item work-gantt-view-week ${archiveView === "week" ? "work-gantt-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                        <div className={`work-gantt-view-item work-gantt-view-month ${archiveView === "month" ? "work-gantt-view-select" : ""}`} onClick={() => setArchiveView("month")}>月</div>
                    </div>
                }
                <div style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                }}>
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
                        (path.includes("/projectSet") || path.includes("/product")) &&
                        <SelectSimple
                            name="projectIds"
                            onChange={(value) => selectChange("projectIds", value)}
                            title={"项目"}
                            ismult={true}
                            suffixIcon = {true}
                            simpleClassName={"workTable-filter-select"}
                        >
                            {
                                projectList.map(item => {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.projectName}
                                        key={item.id}
                                        color={item.color}
                                    />
                                })
                            }
                        </SelectSimple>
                    }
                    {
                        workStatusList && workStatusList.length > 0 &&
                        <SelectSimple
                            name="workStatus"
                            onChange={(value) => stateChange("workStatusIds", value)}
                            title={"状态"}
                            ismult={true}
                            value={searchCondition?.workStatusIds}
                            suffixIcon = {true}
                            simpleClassName={"workTable-filter-select"}
                        >
                            <div className="select-group-title">
                                <input type="checkbox"
                                       className="group-checkbox"
                                       ref={(el) => {
                                           if (el) {
                                               el.checked = isAllChecked("todo");
                                               el.indeterminate = isPartiallyChecked("todo");
                                           }
                                       }}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                       }} // 添加一个处理函数来管理组选择逻辑
                                       onChange = {(e) => handleGroupCheck(e, "todo")} // 添加一个处理函数来管理组选择逻辑
                                />未开始</div>
                            {
                                workStatusList.map(item => {
                                    if (item.id === "todo") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                            status={"todo"}
                                            handleChildChange={(e) => handleChildChange(e, "todo")}
                                        />
                                    } else {
                                        return <div key={item.id}></div>
                                    }

                                })
                            }

                            <div className="select-group-title">
                                <input type="checkbox"
                                       className="group-checkbox"
                                       ref={(el) => {
                                           if (el) {
                                               el.checked = isAllChecked("progress");
                                               el.indeterminate = isPartiallyChecked("progress");
                                           }
                                       }}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                       }} // 添加一个处理函数来管理组选择逻辑
                                       onChange = {(e) => handleGroupCheck(e, "progress")} // 添加一个处理函数来管理组选择逻辑
                                />进行中
                            </div>
                            {
                                workStatusList.map(item => {
                                    if (item.id !== "todo" && item.id !== "done" && item.id !== "start") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                            status={"progress"}
                                            handleChildChange={(e) => handleChildChange(e, "progress")}
                                        />
                                    } else {
                                        return <div key={item.id}></div>
                                    }

                                })
                            }




                            <div className="select-group-title">
                                <input type="checkbox"
                                       className="group-checkbox"
                                       ref={(el) => {
                                           if (el) {
                                               el.checked = isAllChecked("done");
                                               el.indeterminate = isPartiallyChecked("done");
                                           }
                                       }}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                       }} // 添加一个处理函数来管理组选择逻辑
                                       onChange = {(e) => handleGroupCheck(e, "done")} // 添加一个处理函数来管理组选择逻辑
                                />已完成</div>
                            {
                                workStatusList.map(item => {
                                    if (item.id === "done") {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.name}
                                            key={item.id}
                                            imgUrl={item.iconUrl}
                                            status={"done"}
                                            handleChildChange={(e) => handleChildChange(e, "done")}
                                        />
                                    } else {
                                        return <div key={item.id}></div>
                                    }

                                })
                            }
                        </SelectSimple>
                    }
                    <WorkFilterModal layout={"horizontal"} {...props} />
                    <WorkAddModel workAddModel={workAddModel} workType={stateType} {...props} />
                </div>
            </div>
        </div>


    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkTableFilter)));