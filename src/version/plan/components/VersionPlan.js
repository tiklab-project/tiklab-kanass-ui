import React, { useEffect, useState } from "react";
import "../components/versionPlan.scss";
import { observer, inject, Provider } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkStore from "../../../work/store/WorkStore";
import VersionPlanStore from "../stores/VersionPlanStore";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import { removeNodeInTree } from "../../../common/utils/treeDataAction";
import setImageUrl from "../../../common/utils/setImageUrl";
import { Button, Modal } from "antd";
const VersionPlan = (props) => {
    const store = {
        versionPlanStore: VersionPlanStore,
        workStore: WorkStore
    }
    const [dragEvent, setDragEvent] = useState()
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const versionId = props.match.params.version ? props.match.params.version : null;
    // 显示事项详情
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { getSelectUserList, getWorkTypeList, getWorkStatus, workTypeList,
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType, deleteWorkItemAndChildren,
        workId, deleteWorkItem } = WorkStore;
    const { getNoPlanWorkList, noPlanWorkList, setNoPlanWorkList, getWorkList, planWorkList, setPlanWorkList,
        updateWorkItem, delVersion, noPlanSearchCondition, searchCondition,
        planTotal, noPlanTotal, haveChildren, findWorkItemAndChildrenIds } = VersionPlanStore;
    const [moveWorkId, setMoveWorkId] = useState()
    const [startVersionId, setStartVersionId] = useState();
    const [endVersionId, setEndVersionId ] = useState();
    const [listType, setListType] = useState();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList(
            {
                projectId: projectId,
                workStatusCodes: ["TODO", "PROGRESS"],
                keyWord: null,
                neqVersionId: versionId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        getWorkList(
            {
                projectId: projectId,
                versionId: versionId,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        // getVersionList({ projectId: projectId })

        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()


        return
    }, [])



    const moveVersionPlanItem = () => {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";

    }

    const moveStart = (id, versionId) => {
        setMoveWorkId(id)
        setStartVersionId(versionId)
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";
    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    const changeVersionPlan = (Sid) => {
        event.preventDefault();
        setActionType("update")
        setEndVersionId(Sid)
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
        event.preventDefault();
        let params = {
            startId: moveWorkId,
            endId: versionId,
            updateField: "projectVersion",
        }
        setEndVersionId(Sid)
        // 移动拖动的元素到所选择的放置目标节点
        if (startVersionId !== Sid) {
            dragEvent.style.background = "";
            updateWorkItem(params).then((res) => {
                if (res.code === 0) {
                    const newNoPlanWorkList = noPlanWorkList.filter(item => { return item.id != moveWorkId })
                    setNoPlanWorkList(newNoPlanWorkList)

                    const addWorkList = noPlanWorkList.filter(item => { return item.id == moveWorkId })
                    planWorkList.unshift(...addWorkList)
                    setPlanWorkList(planWorkList)
                }
            })
        }
        setShowModal(false)
    }

    const moveWorkItemList = (Sid) => {
        let params = {
            startId: moveWorkId,
            endId: versionId,
            updateField: "projectVersions",
        }
        setEndVersionId(Sid)
        if (startVersionId !== Sid) {
            dragEvent.style.background = "";
            updateWorkItem(params).then((res) => {
                if (res.code === 0) {
                    findWorkItemAndChildrenIds({id: moveWorkId}).then(res => {
                        if(res.code === 0){
                            const ids = res.data;
                            const newNoPlanWorkList = noPlanWorkList.filter(item => { return ids.indexOf(item.id) < 0 })
                            setNoPlanWorkList(newNoPlanWorkList)
        
                            const addWorkList = noPlanWorkList.filter(item => { return ids.indexOf(item.id) > -1})
                            planWorkList.unshift(...addWorkList)
                            setPlanWorkList(planWorkList)
                        }
                    })
                   
                }
            })
        }
        setShowModal(false)
    }

    const delVersionPlan = (Sid) => {
        event.preventDefault();
        setActionType("delete")
        setEndVersionId(Sid)
        haveChildren({ id: moveWorkId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setShowModal(true)
                } else {
                    delVersionOnePlan(Sid)
                }
            }
        })

    }

    const delVersionOnePlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId,
            endId: "nullstring",
            updateField: "projectVersion",
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startVersionId && Sid !== startVersionId) {
            dragEvent.style.background = "";
            delVersion(params).then((res) => {
                if (res.code === 0) {
                    const newNoPlanWorkList = planWorkList.filter(item => { return item.id != moveWorkId })
                    setPlanWorkList(newNoPlanWorkList)

                    const addWorkList = planWorkList.filter(item => { return item.id == moveWorkId })
                    noPlanWorkList.unshift(...addWorkList)
                    setNoPlanWorkList(noPlanWorkList)
                }

            })
        }
        setShowModal(false)
    }

    const delListVersionPlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId,
            endId: "nullstring",
            updateField: "projectVersions",
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startVersionId && !Sid) {
            dragEvent.style.background = "";
            delVersion(params).then((res) => {
                if (res.code === 0) {
                    findWorkItemAndChildrenIds({id: moveWorkId}).then(res => {
                        if(res.code === 0){
                            const ids = res.data;
                            const newNoPlanWorkList = planWorkList.filter(item => { return ids.indexOf(item.id) < 0 })
                            setPlanWorkList(newNoPlanWorkList)
        
                            const addWorkList = planWorkList.filter(item => { return ids.indexOf(item.id) > -1})
                            noPlanWorkList.unshift(...addWorkList)
                            setNoPlanWorkList(noPlanWorkList)
                        }
                    })
                }
            })
        }
        setShowModal(false)
    }
    const handleChange = (field, value) => {
        getNoPlanWorkList({
            [field]: value,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        })
    }

    const findVersionWorkItem = (field, value) => {
        getWorkList({
            [field]: value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        })
    }

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
        setSessionStorage("detailCrumbArray", [{ id: work.id, title: work.title, iconUrl: work.workTypeSys.iconUrl }])
        setListType(type)
        const pathname = props.match.url;
        props.history.push(`${pathname}/${work.id}`)
    }

    const changeNoPlanVersionPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: noPlanSearchCondition.pageParam.currentPage + 1
            }
        }
        getNoPlanWorkList(data)
    }

    const changePlanVersionPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition.pageParam.currentPage + 1
            }
        }
        getWorkList(data)
    }

    const submitOne= () => {
        if(actionType === "delete"){
            delVersionOnePlan(endVersionId)
        }
        if(actionType === "update"){
            moveOneWorkItem(endVersionId)
        }
    }

    const submitList = () => {
        if(actionType === "delete"){
            delListVersionPlan(endVersionId)
        }
        if(actionType === "update"){
            moveWorkItemList(endVersionId)
        }
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
        <div className="version-plan">
            <div className="version-plan-content">
                <div className="version-plan-box"
                    onDrop={() => delVersionPlan(null)}
                    onDragOver={dragover}
                >
                    <div className="version-plan-box-top">
                        <div className="version-plan-title">待办规划事项</div>
                        <div className="version-plan-filter">
                            <InputSearch onChange={(value) => handleChange("keyWord", value)} placeholder={"搜索事项名称"} />
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
                                            imgUrl={setImageUrl(item.workType?.iconUrl)}
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
                                    workStatusList.filter(item => item.id !== "done").map(item => {
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
                    <div className="version-plan-box-content">
                        <div className="version-plan-list">
                            {
                                noPlanWorkList && noPlanWorkList.length > 0 && noPlanWorkList.map((item, index) => {
                                    return <div
                                        className="version-plan-item-box"
                                        onDrag={() => moveVersionPlanItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, null)}
                                        key={item.id}
                                    >
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index, "noPlan")}>
                                            <div className="work-item-icon">
                                                {
                                                    item.workTypeSys?.iconUrl ?
                                                        <img
                                                            alt=""
                                                            className="icon-32"
                                                            src={setImageUrl(item.workTypeSys.iconUrl)}

                                                        />
                                                        :
                                                        <img
                                                            src={'/images/workType2.png'}
                                                            alt=""
                                                            className="icon-32"
                                                        />
                                                }

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
                                <div className="change-page" onClick={() => changeNoPlanVersionPage()}>加载更多</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="version-plan-box"
                    onDrop={() => changeVersionPlan(versionId)}
                    onDragOver={dragover}
                >
                    <div className="version-plan-box-top">
                        <div className="version-plan-title">版本下事项</div>
                        <div className="version-plan-filter">
                            <InputSearch onChange={(value) => findVersionWorkItem("keyWord", value)} placeholder={"搜索事项名称"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => findVersionWorkItem("workTypeIds", value)}
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
                                            imgUrl={setImageUrl(item.workType?.iconUrl)}
                                        />
                                    })
                                }
                            </SelectSimple>
                            <SelectSimple
                                name="assignerIds"
                                onChange={(value) => findVersionWorkItem("assignerIds", value)}
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
                                onChange={(value) => findVersionWorkItem("workStatusIds", value)}
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

                    <div className="version-plan-box-content">
                        <div className="version-plan-list">
                            {
                                planWorkList && planWorkList.length > 0 && planWorkList.map((item, index) => {
                                    return <div
                                        className="version-plan-item-box"
                                        onDrag={() => moveVersionPlanItem(item.id)}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, versionId)}
                                        key={item.id}
                                    >
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index, "plan")}>
                                            <div className="work-item-icon">
                                                {
                                                    item.workTypeSys?.iconUrl ?
                                                        <img
                                                            alt=""
                                                            className="icon-32"
                                                            src={setImageUrl(item.workTypeSys.iconUrl)}

                                                        />
                                                        :
                                                        <img
                                                            src={'/images/workType2.png'}
                                                            alt=""
                                                            className="icon-32"
                                                        />
                                                }

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
                                planTotal > 1 && searchCondition.pageParam.currentPage < planTotal && <div className="change-page" onClick={() => changePlanVersionPage()}>加载更多</div>
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
                        <Button key="back" onClick={() => setShowModal(false)} >
                            取消
                        </Button>
                        <Button key="primary" type="primary" onClick={() => submitList(endVersionId)}>
                            是
                        </Button>
                        <Button type="primary" onClick={() => submitOne(endVersionId)}>
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
export default observer(VersionPlan);