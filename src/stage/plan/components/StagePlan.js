import React, { useEffect, useState } from "react";
import "../components/stagePlan.scss";
import { observer, inject, Provider } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkStore from "../../../work/store/WorkStore";
import StagePlanStore from "../stores/StagePlanStore";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import { useDebounce } from "../../../common/utils/debounce";
import { removeNodeInTree } from "../../../common/utils/treeDataAction";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
const StagePlan = (props) => {
    const store = {
        stagePlanStore: StagePlanStore,
        workStore: WorkStore
    }
    const [dragEvent, setDragEvent] = useState()
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const stageId = props.match.params.stage;
    // 显示事项详情
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { getSelectUserList, getWorkTypeList, getWorkStatus, workTypeList,
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType,
        deleteWorkItem, workId, deleteWorkItemAndChildren } = WorkStore;
    const { getNoPlanWorkList, noPlanWorkList, setNoPlanWorkList, getWorkList, planWorkList, setPlanWorkList,
        findStageList, createStageWorkItem, deleteStageWorkItemCondition, noPlanSearchCondition, searchCondition,
        planTotal, noPlanTotal } = StagePlanStore;
    const [moveWorkId, setMoveWorkId] = useState()
    const [startStageId, setStartStageId] = useState();
    const [listType, setListType] = useState();

    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList(
            {
                projectId: projectId,
                workStatusCodes: ["TODO", "PROGRESS"],
                assignerIds: null,
                keyWord: null,
                neqStageId: stageId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        getWorkList(
            {
                projectId: projectId,
                stageId: stageId,
                assignerIds: null,
                keyWord: null,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        findStageList({ projectId: projectId })

        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()


        return
    }, [])

    useEffect(() => {
        if (noPlanWorkList && planWorkList) {
            const length = noPlanWorkList.length > planWorkList.length ? noPlanWorkList.length * 90 + 90 : planWorkList.length * 90 + 90

        }

        return
    }, [noPlanWorkList, planWorkList])


    const moveStagePlanItem = () => {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";

    }

    const moveStart = (id, stageId) => {
        setMoveWorkId(id)
        setStartStageId(stageId)
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";
    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeStagePlan = (Sid) => {
        event.preventDefault();
        let params = {
            workItem: {
                id: moveWorkId
            },
            stageId: stageId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startStageId !== Sid) {
            dragEvent.style.background = "";
            // dragEvent.parentNode.removeChild( dragEvent );
            // event.target.appendChild( dragEvent );
            createStageWorkItem(params).then((res) => {
                if (res.code === 0) {
                    const newNoPlanWorkList = noPlanWorkList.filter(item => { return item.id != moveWorkId })
                    setNoPlanWorkList(newNoPlanWorkList)

                    const addWorkList = noPlanWorkList.filter(item => { return item.id == moveWorkId })
                    planWorkList.unshift(...addWorkList)
                    setPlanWorkList(planWorkList)
                }
            })
        }
    }

    const delStagePlan = (Sid) => {
        event.preventDefault();
        let params = {
            workItem: moveWorkId,
            stageId: stageId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startStageId && !Sid) {
            dragEvent.style.background = "";
            deleteStageWorkItemCondition(params).then((res) => {
                if (res.code === 0) {
                    const newNoPlanWorkList = planWorkList.filter(item => { return item.id != moveWorkId })
                    setPlanWorkList(newNoPlanWorkList)

                    const addWorkList = planWorkList.filter(item => { return item.id == moveWorkId })
                    noPlanWorkList.unshift(...addWorkList)
                    setNoPlanWorkList(noPlanWorkList)
                }

            })
        }
    }

    const handleChange = useDebounce((field, value) => {
        getNoPlanWorkList({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }, [500])

    const findStageWorkItem = useDebounce((field, value) => {
        getWorkList({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }, [500])

    /**
     * 显示事项详情抽屉
     * @param {事项id} id 
     * @param {*} index 
     */
    const goWorkItem = (work, index, type) => {
        setWorkIndex(index)
        setWorkId(work.id)
        setIsModalVisible(true)
        setWorkShowType("border")
        setSessionStorage("detailCrumbArray", [{ id: work.id, code: work.code, title: work.title, iconUrl: work.workTypeSys.iconUrl }])
        const pathname = props.match.url;
        setListType(type)
        props.history.push(`${pathname}/${work.id}`)
    }

    const changeNoPlanStagePage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: noPlanSearchCondition.pageParam.currentPage + 1
            }
        }
        getNoPlanWorkList(data)
    }

    const changePlanStagePage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition.pageParam.currentPage + 1
            }
        }
        getWorkList(data)
    }
    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    const deleteWork = (deleteWorkItem) => {
        deleteWorkItem(workId).then(res => {
            if (res.code === 0) {
                setIsModalVisible(false)
                if (listType === "noPlan") {
                    removeNodeInTree(noPlanWorkList, null, workId);
                    if (noPlanWorkList.length <= 0) {
                        getNoPlanWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                    setNoPlanWorkList([...noPlanWorkList])
                } else {
                    removeNodeInTree(planWorkList, null, workId);
                    if (planWorkList.length <= 0) {
                        getWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                    setPlanWorkList([...planWorkList])
                }
            }


        })
    }

    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem)
        setIsModalVisible(false)
    }

    return (<Provider {...store}>
        <div className="stage-plan">
            <div className="stage-plan-content">
                <div className="stage-plan-box"
                    onDrop={() => delStagePlan(null)}
                    onDragOver={dragover}
                // style = {{height: boxLength}}
                >
                    <div className="stage-plan-box-top">
                        <div className="stage-plan-title">待办规划事项</div>
                        <div className="stage-plan-filter">
                            <InputSearch onChange={(value) => handleChange("keyWord", value)} placeholder={"搜索事项"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => handleChange("workTypeIds", value)}
                                title={"类型"}
                                ismult={true}
                                value={noPlanSearchCondition?.workTypeIds}
                            >
                                {
                                    workTypeList.map(item => {
                                        return <SelectItem
                                            value={item.workType.id}
                                            label={item.workType.name}
                                            key={item.workType.id}
                                            imgUrl={item.workType.iconUrl}
                                        />
                                    })
                                }
                            </SelectSimple>
                            <SelectSimple
                                name="assignerIds"
                                onChange={(value) => handleChange("assignerIds", value)}
                                title={"负责人"} ismult={true}
                                value={noPlanSearchCondition?.assignerIds}
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
                            <SelectSimple
                                name="workStatus"
                                onChange={(value) => handleChange("workStatusIds", value)}
                                title={"状态"}
                                ismult={true}
                                value={noPlanSearchCondition?.workStatusIds}
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
                        </div>
                    </div>
                    <div className="stage-plan-box-content">
                        <div className="stage-plan-list">
                            {
                                noPlanWorkList && noPlanWorkList.length > 0 && noPlanWorkList.map((item, index) => {
                                    return <div
                                        className="stage-plan-item-box"
                                        onDrag={() => moveStagePlanItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, null)}
                                        key={item.id}
                                    >
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index, "noPlan")}>
                                            <div className="work-item-icon">
                                                <ImgComponent
                                                    alt=""
                                                    className="icon-32"
                                                    src={item.workTypeSys.iconUrl}

                                                />

                                            </div>
                                            <div className="work-item-info">
                                                <div className="work-item-id">{item.id}</div>
                                                <div className="work-item-title">{item.title}</div>
                                            </div>
                                        </div >
                                        {/* <div className="work-item-master">
                                            <div className="work-item-id">{item.assigner?.nickname}</div>
                                        </div> */}
                                        <div className={`work-item-status`}>
                                            <div className={`work-status ${setStatuStyle(item.workStatusNode.id)}`}>
                                                {item.workStatusNode.name}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                noPlanTotal > 1 && noPlanSearchCondition.pageParam.currentPage < noPlanTotal &&
                                <div className="change-page" onClick={() => changeNoPlanStagePage()}>加载更多</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="stage-plan-box"
                    onDrop={() => changeStagePlan(stageId)}
                    onDragOver={dragover}
                >
                    <div className="stage-plan-box-top">
                        <div className="stage-plan-title">迭代下事项</div>
                        <div className="stage-plan-filter">
                            <InputSearch onChange={(value) => findStageWorkItem("keyWord", value)} placeholder={"搜索事项"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => findStageWorkItem("workTypeIds", value)}
                                title={"类型"}
                                ismult={true}
                                value={searchCondition?.workTypeIds}
                            >
                                {
                                    workTypeList.map(item => {
                                        return <SelectItem
                                            value={item.workType.id}
                                            label={item.workType.name}
                                            key={item.workType.id}
                                            imgUrl={item.workType?.iconUrl}
                                        />
                                    })
                                }
                            </SelectSimple>
                            <SelectSimple
                                name="assignerIds"
                                onChange={(value) => findStageWorkItem("assignerIds", value)}
                                title={"负责人"} ismult={true}
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
                            <SelectSimple
                                name="workStatus"
                                onChange={(value) => findStageWorkItem("workStatusIds", value)}
                                title={"状态"}
                                ismult={true}
                                value={searchCondition?.workStatusIds}
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
                        </div>
                    </div>

                    <div className="stage-plan-box-content">
                        <div className="stage-plan-list">
                            {
                                planWorkList && planWorkList.length > 0 && planWorkList.map((item, index) => {
                                    return <div
                                        className="stage-plan-item-box"
                                        onDrag={() => moveStagePlanItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, stageId)}
                                        key={item.id}
                                    >
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index, "plan")}>
                                            <div className="work-item-icon">
                                                <ImgComponent
                                                    alt=""
                                                    className="icon-32"
                                                    src={item.workTypeSys.iconUrl}

                                                />
                                            </div>
                                            <div className="work-item-info">
                                                <div className="work-item-id">{item.id}</div>
                                                <div className="work-item-title">{item.title}</div>
                                            </div>
                                        </div >
                                        {/* <div className="work-item-master">
                                            <div className="work-item-id">{item.assigner?.nickname}</div>
                                        </div> */}
                                        <div className={`work-item-status`}>
                                            <div className={`work-status ${setStatuStyle(item.workStatusNode.id)}`}>
                                                {item.workStatusNode.name}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                planTotal > 1 && searchCondition.pageParam.currentPage < planTotal && <div className="change-page" onClick={() => changePlanStagePage()}>加载更多</div>
                            }
                        </div>
                    </div>

                </div>
            </div>

            <WorkDetailDrawer
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                showPage={false}
                delectCurrentWorkItem={delectCurrentWorkItem}
                {...props}
            />
        </div>
    </Provider>


    )
}
export default observer(StagePlan);