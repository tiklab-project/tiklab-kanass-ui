import React, { useEffect, useState } from "react";
import "../components/sprintPlan.scss";
import { observer, inject, Provider } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkStore from "../../../work/store/WorkStore";
import SprintPlanStore from "../stores/SprintPlanStore";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import { useDebounce } from "../../../common/utils/debounce";
import { removeNodeInTree } from "../../../common/utils/treeDataAction";
import { Modal, message } from "antd";
import Button from "../../../common/button/Button";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
const SprintPlan = (props) => {
    const store = {
        sprintPlanStore: SprintPlanStore,
        workStore: WorkStore
    }
    const [dragEvent, setDragEvent] = useState()
    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    // 显示事项详情
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { getSelectUserList, getWorkTypeList, getWorkStatus, workTypeList,
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType,
        deleteWorkItem, workId, deleteWorkItemAndChildren } = WorkStore;
    const { getNoPlanWorkList, noPlanSprintWorkList, setNoPlanSprintWorkList, getWorkList, planSprintWorkList, setPlanSprintWorkList,
        findSprintList, updateWorkItem, delSprint, noPlanSearchCondition, searchCondition,
        planTotal, noPlanTotal, haveChildren, findWorkItemAndChildrenIds, listType, setListType } = SprintPlanStore;
    const [moveWorkId, setMoveWorkId] = useState()
    const [startSprintId, setStartSprintId] = useState();
    const [endSprintId, setEndSprintId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [isDraggable, setIsDraggable] = useState(true);
    const [isMove, setIsMove] = useState(false)
    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList(
            {
                projectId: projectId,
                workStatusCodes: ["TODO", "PROGRESS"],
                assignerIds: null,
                keyWord: null,
                neqSprintId: sprintId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        getWorkList(
            {
                projectId: projectId,
                sprintId: sprintId,
                assignerIds: null,
                keyWord: null,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        findSprintList({ projectId: projectId })

        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()


        return
    }, [])




    const moveSprintPlanItem = () => {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";

    }

    const moveStart = (id, sprintId) => {
        console.log(1)
        setMoveWorkId(id)
        setIsDraggable(false)
        setStartSprintId(sprintId)
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";
    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeSprintPlan = (Sid) => {
        event.preventDefault();
        console.log(3)
        setIsDraggable(true)
        setActionType("update")
        setEndSprintId(Sid)
        haveChildren({ id: moveWorkId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setShowModal(true)
                } else {
                    moveOneWorkItem(Sid)
                }
            }
        })
    }

    const moveOneWorkItem = (Sid) => {
        let params = {
            startId: moveWorkId,
            endId: sprintId,
            updateField: "sprint",
        }
        setEndSprintId(Sid)
        if (startSprintId !== Sid) {
            dragEvent.style.background = "";
            updateWorkItem(params).then((res) => {
                if (res.code === 0) {
                    setIsMove(true)
                    const newNoPlanWorkList = noPlanSprintWorkList.filter(item => { return item.id != moveWorkId })
                    const newNoPlanWorkList1 = newNoPlanWorkList.filter((item, index, self) => {
                        return self.indexOf(item) === index;
                    });
                    setNoPlanSprintWorkList(newNoPlanWorkList1)

                    const addWorkList = noPlanSprintWorkList.filter(item => { return item.id == moveWorkId })
                    planSprintWorkList.unshift(...addWorkList)
                    const planSprintWorkList1 = planSprintWorkList.filter((item, index, self) => {
                        return self.indexOf(item) === index;
                    });
                    setPlanSprintWorkList(planSprintWorkList1)
                }
            })
        }
        setShowModal(false)
    }

    const moveWorkItemList = (Sid) => {
        let params = {
            startId: moveWorkId,
            endId: sprintId,
            updateField: "sprints",
        }
        setEndSprintId(Sid)
        if (startSprintId !== Sid) {
            dragEvent.style.background = "";
            updateWorkItem(params).then((res) => {
                if (res.code === 0) {
                    findWorkItemAndChildrenIds({ id: moveWorkId }).then(res => {
                        if (res.code === 0) {
                            setIsMove(true)
                            const ids = res.data;
                            const newNoPlanWorkList = noPlanSprintWorkList.filter(item => { return ids.indexOf(item.id) < 0 })
                            const newNoPlanWorkList1 = newNoPlanWorkList.filter((item, index, self) => {
                                return self.indexOf(item) === index;
                            });
                            setNoPlanSprintWorkList(newNoPlanWorkList1)

                            const addWorkList = noPlanSprintWorkList.filter(item => { return ids.indexOf(item.id) > -1 })
                            planSprintWorkList.unshift(...addWorkList)
                            const planSprintWorkList1 = planSprintWorkList.filter((item, index, self) => {
                                return self.indexOf(item) === index;
                            });
                            setPlanSprintWorkList(planSprintWorkList1)
                        }
                    })

                }
            })
        }
        setShowModal(false)
    }

    const delSprintPlan = (Sid) => {
        console.log(3)
        event.preventDefault();
        setIsDraggable(true)
        setActionType("delete")
        setEndSprintId(Sid)
        haveChildren({ id: moveWorkId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setShowModal(true)
                } else {
                    delSprintOnePlan(Sid)
                }
            }
        })

    }
    const delSprintOnePlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId,
            endId: "nullstring",
            updateField: "sprint",
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId && !Sid) {
            dragEvent.style.background = "";
            delSprint(params).then((res) => {
                if (res.code === 0) {
                    setIsMove(true)
                    const newNoPlanWorkList = planSprintWorkList.filter(item => { return item.id != moveWorkId })
                    const newNoPlanWorkList1 = newNoPlanWorkList.filter((item, index, self) => {
                        return self.indexOf(item) === index;
                    });
                    setPlanSprintWorkList(newNoPlanWorkList1)

                    const addWorkList = planSprintWorkList.filter(item => { return item.id == moveWorkId })
                    noPlanSprintWorkList.unshift(...addWorkList)
                    const noPlanSprintWorkList1 = noPlanSprintWorkList.filter((item, index, self) => {
                        return self.indexOf(item) === index;
                    });
                    setNoPlanSprintWorkList(noPlanSprintWorkList1)
                }

            })
        }
        setShowModal(false)
    }

    const delListSprintPlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId,
            endId: "nullstring",
            updateField: "sprints",
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId && !Sid) {
            dragEvent.style.background = "";
            delSprint(params).then((res) => {
                if (res.code === 0) {
                    setIsMove(true)
                    findWorkItemAndChildrenIds({ id: moveWorkId }).then(res => {
                        if (res.code === 0) {
                            const ids = res.data;
                            const newNoPlanWorkList = planSprintWorkList.filter(item => { return ids.indexOf(item.id) < 0 })
                            const newNoPlanWorkList1 = newNoPlanWorkList.filter((item, index, self) => {
                                return self.indexOf(item) === index;
                            });
                            setPlanSprintWorkList(newNoPlanWorkList1)

                            const addWorkList = planSprintWorkList.filter(item => { return ids.indexOf(item.id) > -1 })
                            noPlanSprintWorkList.unshift(...addWorkList)
                            const noPlanSprintWorkList1 = noPlanSprintWorkList.filter((item, index, self) => {
                                return self.indexOf(item) === index;
                            });
                            setNoPlanSprintWorkList(noPlanSprintWorkList1)
                        }
                    })

                }

            })
        }
        setShowModal(false)
    }

    const submitOne = () => {
        if (actionType === "delete") {
            delSprintOnePlan(endSprintId)
        }
        if (actionType === "update") {
            moveOneWorkItem(endSprintId)
        }
    }

    const submitList = () => {
        setIsDraggable(true)
        if (actionType === "delete") {
            delListSprintPlan(endSprintId)
        }
        if (actionType === "update") {
            moveWorkItemList(endSprintId)
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

    const findSprintWorkItem = useDebounce((field, value) => {
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

    const changeNoPlanSprintPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: isMove ? 1 : noPlanSearchCondition.pageParam.currentPage + 1
            }
        }
        getNoPlanWorkList(data).then(res => {
            if(res.code === 0 && isMove){
                setIsMove(false)
            }
        })
    }

    const changePlanSprintPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: isMove ? 1 : searchCondition.pageParam.currentPage + 1
            }
        }
        getWorkList(data).then(res => {
            if(res.code === 0 && isMove){
                setIsMove(false)
            }
        })
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
                    removeNodeInTree(noPlanSprintWorkList, null, workId);
                    if (noPlanSprintWorkList.length <= 0) {
                        getNoPlanWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                    setNoPlanSprintWorkList([...noPlanSprintWorkList])
                } else {
                    removeNodeInTree(planSprintWorkList, null, workId);
                    if (planSprintWorkList.length <= 0) {
                        getWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                    setPlanSprintWorkList([...planSprintWorkList])
                }
            }


        })
    }

    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem)
        setIsModalVisible(false)
    }

    return (<Provider {...store}>
        <div className="sprint-plan">
            <div className="sprint-plan-content">
                <div className="sprint-plan-box"
                    onDrop={() => delSprintPlan(null)}
                    onDragOver={dragover}
                >
                    <div className="sprint-plan-box-top">
                        <div className="sprint-plan-title">待办规划事项</div>
                        <div className="sprint-plan-filter">
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
                                            imgUrl={item.workType?.iconUrl}
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
                    <div className="sprint-plan-box-content">
                        <div className="sprint-plan-list">
                            {
                                noPlanSprintWorkList && noPlanSprintWorkList.length > 0 && noPlanSprintWorkList.map((item, index) => {
                                    return <div
                                        className="sprint-plan-item-box"
                                        onDrag={() => moveSprintPlanItem()}
                                        draggable = {isDraggable}
                                        onDragStart={() => moveStart(item.id, null)}
                                        onDragEnd = {() => setIsDraggable(true)}
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
                                                <div className="work-item-id">{item.code}</div>
                                                <div className="work-item-title">{item.title}</div>
                                            </div>
                                        </div >
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
                                <div className="change-page" onClick={() => changeNoPlanSprintPage()}>加载更多</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="sprint-plan-box"
                    onDrop={() => changeSprintPlan(sprintId)}
                    onDragOver={dragover}
                >
                    <div className="sprint-plan-box-top">
                        <div className="sprint-plan-title">迭代下事项</div>
                        <div className="sprint-plan-filter">
                            <InputSearch onChange={(value) => findSprintWorkItem("keyWord", value)} placeholder={"搜索事项"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => findSprintWorkItem("workTypeIds", value)}
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
                                onChange={(value) => findSprintWorkItem("assignerIds", value)}
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
                                onChange={(value) => findSprintWorkItem("workStatusIds", value)}
                                title={"状态"}
                                ismult={true}
                                value={searchCondition?.workStatusIds}
                                positionType="right"
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

                    <div className="sprint-plan-box-content">
                        <div className="sprint-plan-list">
                            {
                                planSprintWorkList && planSprintWorkList.length > 0 && planSprintWorkList.map((item, index) => {
                                    return <div
                                        className="sprint-plan-item-box"
                                        onDrag={() => moveSprintPlanItem()}
                                        draggable = {isDraggable}
                                        onDragStart={() => moveStart(item.id, sprintId)}
                                        onDragEnd = {() => setIsDraggable(true)}
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
                                                <div className="work-item-id">{item.code}</div>
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
                                planTotal > 1 && searchCondition.pageParam.currentPage < planTotal && <div className="change-page" onClick={() => changePlanSprintPage()}>加载更多</div>
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

            <Modal
                visible={showModal}
                title="是否移动下级"
                onCancel={() => setShowModal(false)}
                footer={[
                    <div className="submit-botton">
                        <Button key="back" onClick={() => setShowModal(false)}>
                            取消
                        </Button>
                        <Button key="primary" type="primary" onClick={() => submitList(endSprintId)}>
                            是
                        </Button>
                        <Button type="primary" onClick={() => submitOne(endSprintId)}>
                            否
                        </Button>
                    </div>

                ]}
            >
                是否移动下级
            </Modal>
        </div>
    </Provider>


    )
}
export default observer(SprintPlan);