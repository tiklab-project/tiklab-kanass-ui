import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { Empty } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkChildAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
import { getUser } from "tiklab-core-ui";
const WorkChildAddmodal = (props) => {
    const { workType, treePath, workStore, workChild, showSelectChild, setChildWorkList, selectChild, projectId } = props;

    const { workId, workShowType, viewType, getWorkConditionPageTree, 
        getWorkConditionPage, findPriority, priorityList, getWorkStatus,workStatusList } = workStore;

    const { addWorkChild, findSelectWorkItemList,
        getWorkChildList, selectChildToTal, selectWorkChildList } = workChild;
    const tenant = getUser().tenant;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const project = JSON.parse(localStorage.getItem("project"));

    const childAdd = useRef();
    const [current, setCurrent] = useState(1);
    const [pageText, setPageText] = useState("加载更多")
    const [pageSize, setPageSize] = useState(20);


    useEffect(() => {
        findWorkItem({
            workPriorityIds: null,
            workStatusIds: null,
            treePath: treePath,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            },
            projectId: projectId
        })
        getWorkStatus()
        findPriority()
        return;
    }, [])

    const findWorkItem = (value) => {
        const params = {
            projectId: projectId,
            workTypeId: workType.id,
            id: workId,
            title: null,
            ...value
        }
        findSelectWorkItemList(params)
    }

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [selectChild])

    const closeModal = (e) => {
        if (!childAdd.current) {
            return;
        }
        if (!childAdd.current.contains(e.target) && childAdd.current !== e.target) {
            showSelectChild(false)
        }
    }

    const creatWorkChild = (id) => {
        let params = {
            id: id,
            parentWorkId: workId,
            projectId: projectId,
            builder: getUser().userId,
            sprintId: sprintId,
            assigner: project?.master.id,
        }
        createChildWorkItem(params)
    }

    const createChildWorkItem = (value) => {
        addWorkChild(value).then((res) => {
            showSelectChild(false)
            if (workShowType === "bodar") {
                getWorkBoardList()
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                getWorkConditionPageTree()
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                getWorkConditionPage()
            }
            let params = {};
            if (workType.code !== "epic") {
                params = {
                    parentId: workId,
                    workTypeId: workType.id
                }
            } else {
                params = {
                    parentId: workId
                }
            }
            getWorkChildList(params).then(res => {
                if (res.code === 0) {
                    setChildWorkList(res.data.dataList)
                }
            })
        })
    }

    // 搜索事项
    const searchUnselectWorkByStatus = (key, value) => {
        setCurrent(1)
        setPageSize(20)
        findWorkItem({
            [key]: value,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            }
        })
    }

    const searchUnselectWorkById = (value) => {
        setCurrent(1)
        setPageSize(20)
        findWorkItem({
            likeId: value,
            title: value,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            }
        })
    }

    const loadNextPage = () => {
        setCurrent(current + 1)
        const params = {
            pageParam: {
                pageSize: pageSize,
                currentPage: current + 1
            }
        }
        findWorkItem(params)
    }

    return (
        <>
            <div className="child-add" ref={childAdd}>

                <div className="child-add-search">
                    <InputSearch style={{ minWidth: "250px",flex: 1 }} onChange={(value) => searchUnselectWorkById(value)} placeholder={"根据事项名称，或者id搜索"} />
                    <SelectSimple name="workPriorityIds"
                        onChange={(value) => searchUnselectWorkByStatus("workPriorityIds", value)}
                        title={"事项优先级"} ismult={true}
                    >
                        {
                            priorityList.map(item => {
                                return <SelectItem
                                    value={item.id}
                                    label={item.name}
                                    key={item.id}
                                    imgUrl={`${base_url}/images/${item.iconUrl}`}
                                />
                            })
                        }
                    </SelectSimple>
                    {
                        workStatusList && workStatusList.length > 0 && <SelectSimple
                            name="workStatus"
                            onChange={(value) => searchUnselectWorkByStatus("workStatusIds", value)}
                            title={"状态"}
                            ismult={true}
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
                    <div className="child-add-submit">
                        <span onClick={() => showSelectChild(false)}>
                            取消
                        </span>
                    </div>
                </div>
                <div className="child-add-model" >

                    {
                        selectWorkChildList && selectWorkChildList.length > 0 ? <div className="child-add-table">
                            <div className="child-add-table-title">选择事项</div>
                            {
                                selectWorkChildList && selectWorkChildList.map(item => {
                                    return <div className="child-add-work-item" onClick={() => creatWorkChild(item.id)} key={item.id}>
                                        <div className="work-item-icon">
                                            {
                                                item.workTypeSys?.iconUrl ?
                                                    <img
                                                        src={version === "cloud" ? (upload_url + item.workTypeSys?.iconUrl + "?tenant=" + tenant) : (upload_url + item.workTypeSys?.iconUrl)}
                                                        alt=""
                                                        className="svg-icon"

                                                    />
                                                    :
                                                    <img
                                                        src={'/images/workType2.png'}
                                                        alt=""
                                                        className="svg-icon"
                                                    />
                                            }
                                            <div>
                                                <div className="work-item-id">{item.id}</div>
                                                <div className="work-item-title">{item.title} </div>
                                            </div>

                                        </div>
                                        <div className="work-item-right">
                                            {
                                                item.workPriority?.iconUrl ?
                                                    <img
                                                        src={'/images/' + item.workPriority?.iconUrl}
                                                        alt=""
                                                        className="svg-icon"

                                                    />
                                                    :
                                                    <img
                                                        src={'/images/proivilege1.png'}
                                                        alt=""
                                                        className="svg-icon"
                                                    />
                                            }
                                            <div className="work-item-icon">
                                                {item.workStatus?.name}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                selectChildToTal !== 1 &&
                                <>
                                    {
                                        selectChildToTal > current ?
                                            <div className="child-add-table-page" onClick={() => loadNextPage()}>{pageText}</div>
                                            :
                                            <div className="child-add-table-page">到底啦~</div>
                                    }
                                </>
                            }

                        </div>
                            :
                            <div className="child-add-table">
                                <Empty image="/images/nodata.png" description="暂时没有待办~" />
                            </div>
                    }


                </div>

            </div>


        </>
    );
};

export default inject('workStore', 'workChild')(observer(WorkChildAddmodal));
