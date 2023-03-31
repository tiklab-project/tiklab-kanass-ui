import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { Modal, Table, Select, message, Input, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkChildAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
const WorkChildAddmodal = (props) => {
    const { workType, treePath,workStore, workChild, showSelectChild, setChildWorkList, selectChild, projectId } = props;

    const { workTypeList, workId, workShowType, viewType, getWorkConditionPageTree, getWorkConditionPage, findPriority, priorityList } = workStore;

    const { addWorkChild, findEpicSelectWorkItemList, findSelectWorkItemList,
        getWorkChildList, unRelationTotal, selectChildToTal, selectWorkChildList } = workChild;

    const childAdd = useRef();
    const [current, setCurrent] = useState(1);
    const [pageText, setPageText] = useState("加载更多")
    const [pageSize, setPageSize] = useState(20);


    useEffect(() => {
        findWorkItem({
            workPriorityIds: null,
            treePath: treePath,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            },
            projectId: projectId
        })
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
        if (workType.code === "epic") {
            findEpicSelectWorkItemList(params)
            // .then(res => {
            //     if (res.code === 0) {
            //         setWorkChildList(res.data.dataList)
            //     }
            // })
        } else {

            findSelectWorkItemList(params)
            // .then(res => {
            //     if (res.code === 0) {
            //         setWorkChildList(res.data.dataList)
            //     }
            // })
        }
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
            projectId: projectId
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
        // getWorkRelationList(
        //     {

        //         pageParam: {
        //             pageSize: 20,
        //             currentPage: 1
        //         }
        //     })
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
        // setPageText("加载中")
        // getWorkRelationList(params).then(res => {
        //     if (res.code === 0) {
        //         setPageText("加载更多")
        //     }
        // })
    }

    return (
        <>
            <div className="child-add" ref={childAdd}>
                <div className="child-add-input">
                    <div>搜索添加子事项</div>
                    <div className="child-add-submit">
                        <span onClick={() => showSelectChild(false)}>
                            取消
                        </span>
                    </div>
                </div>
                <div className="child-add-model" >
                    <div className="child-add-search">
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
                                        imgUrl={item.iconUrl}
                                    />
                                })
                            }
                        </SelectSimple>
                        <InputSearch onChange={(value) => searchUnselectWorkByStatus("title", value)} placeholder={"项目名称"} />
                    </div>
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
                                                        src={'/images/' + item.workTypeSys?.iconUrl}
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
                            <Empty image = "/images/nodata.png" description = "暂时没有待办~" />
                        </div>
                    }


                </div>

            </div>


        </>
    );
};

export default inject('projectStore', 'workStore', 'workRelation')(observer(WorkChildAddmodal));
