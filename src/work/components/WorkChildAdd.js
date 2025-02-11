/*
 * @Descripttion: 添加子事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:46
 */
import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { Empty, message } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkChildAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
import { getUser } from "tiklab-core-ui";
import { changeWorkItemParent } from "./WorkGetList";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../common/component/ProjectEmpty";
const WorkChildAddmodal = (props) => {
    const { workType, treePath, workStore, workChild, showSelectChild, setChildWorkList, selectChild, projectId, demandId, stageId } = props;

    const { workId, findPriority, priorityList, getWorkStatus, workStatusList,
        demandTypeId, findWorkItemAndChidren, workList, setWorkList } = workStore;

    const { addWorkChild, findSelectWorkItemList, getWorkChildList, selectChildToTal,
        selectWorkChildList, findChildrenLevel } = workChild;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const project = JSON.parse(localStorage.getItem("project"));

    const childAdd = useRef();
    const [current, setCurrent] = useState(1);
    const [pageText, setPageText] = useState("加载更多")
    const [pageSize, setPageSize] = useState(20);

    /**
     * 获取事项列表
     */
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

    /**
     * 获取可选择的事项列表
     */
    const findWorkItem = (value) => {
        const params = {
            projectId: projectId,
            workTypeId: workType.id,
            id: workId,
            title: null,
            ...value
        }
        if (demandId) {
            params.workTypeId = demandId;
        }
        findSelectWorkItemList(params)
    }

    /**
     * 监听鼠标事项关闭弹窗
     */
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

    /**
     * 确定添加事项
     */
    const determineAdd = (item) => {
        const id = item.id;
        let currentLevel = 0;
        if (treePath) {
            const parentArray = treePath.split(";")
            // 获取当前事项的层级
            currentLevel = parentArray.length - 1;
        }
        // 判断被添加事项有几级，限制为三级
        findChildrenLevel({ id: id }).then(res => {
            if (res.code === 0) {
                if (res.data === 2) {
                    message.warning("事项限制为三级，所选事项有两级下级事项，不能被添加为子事项");
                    return;
                }
                if (res.data === 1) {
                    if (currentLevel === 0) {
                        creatWorkChild(item)
                    } else {
                        message.warning("事项限制为三级，所选事项有一级下级事项，不能被添加为子事项");
                        return;
                    }
                }

                if (res.data === 0) {
                    if (currentLevel < 2) {
                        creatWorkChild(item)
                    } else {
                        message.warning("事项限制为三级，所选事项不能被添加为子事项");
                        return;
                    }
                }
            }
        })
    }

    /**
     * 创建子事项
     */
    const creatWorkChild = (item) => {
        const id = item.id;
        let params = {
            id: id,
            parentWorkId: workId,
            projectId: projectId,
            builder: getUser().userId,
            sprintId: sprintId,
            assigner: project?.master.id,
        }
        if (stageId) {
            params.stage = stageId;
        }
        createChildWorkItem(params, item)
    }

    /**
     * 创建子事项
     */
    const createChildWorkItem = (value, item) => {
        addWorkChild(value).then((res) => {
            showSelectChild(false)
            // 更新树形列表
            findWorkItemAndChidren({ id: value.id }).then(res => {
                if (res.code === 0) {
                    const list = changeWorkItemParent(workList, workId, res.data)
                    setWorkList([...list])
                }
            })
            let params = {};
            if (workType.code === "epic") {
                params = {
                    parentId: workId,
                    workTypeId: demandTypeId
                }
            } else {
                params = {
                    parentId: workId
                }
            }
            // 获取子事项列表
            getWorkChildList(params).then(res => {
                if (res.code === 0) {
                    setChildWorkList(res.data)
                }
            })
        })
    }


    /**
     * 搜索未被选择的事项
     */
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

    /**
     * 根据id或者事项标题搜索未被选择的事项
     */
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

    /**
     * 加载下一页
     */
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
                <div className="child-add-model" >
                    <div className="child-add-search">
                        <InputSearch style={{ minWidth: "250px", flex: 1 }} onChange={(value) => searchUnselectWorkById(value)} placeholder={"搜索事项名称，id"} />
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
                                        isRemote = {true}
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
                    {
                        selectWorkChildList && selectWorkChildList.length > 0 ? <div className="child-add-table">
                            <div className="child-add-table-title">选择事项</div>
                            {
                                selectWorkChildList && selectWorkChildList.map(item => {
                                    return <div className="child-add-work-item" onClick={() => determineAdd(item)} key={item.id}>
                                        <div className="work-item-icon">
                                            <ImgComponent
                                                alt=""
                                                className="svg-icon"
                                                src={item.workTypeSys?.iconUrl}
                                            />
                                            <div>
                                                <div className="work-item-id">{item.code}</div>
                                                <div className="work-item-title">{item.title} </div>
                                            </div>

                                        </div>
                                        <div className="work-item-right">
                                            <ImgComponent
                                                src={item.workPriority?.iconUrl}
                                                alt=""
                                                className="svg-icon"

                                            />
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
                                            <div className="child-add-table-page loading-more" onClick={() => loadNextPage()}>{pageText}</div>
                                            :
                                            <div className="child-add-table-page">到底啦~</div>
                                    }
                                </>
                            }
                        </div>
                            :
                            <div className="child-add-table">
                                <ProjectEmpty description="暂时没有可添加事项~" />
                            </div>
                    }
                </div>
            </div>
        </>
    );
};

export default inject('workStore', 'workChild')(observer(WorkChildAddmodal));
