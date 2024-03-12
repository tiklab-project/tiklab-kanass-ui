import React, { useEffect, useState } from "react";
import "../components/versionPlan.scss";
import { observer, inject, Provider } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkStore from "../../../work/store/WorkStore";
import VersionPlanStore from "../stores/VersionPlanStore";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import { getUser } from "thoughtware-core-ui";
import setImageUrl from "../../../common/utils/setImageUrl";
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
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType } = WorkStore;
    const { getNoPlanWorkList, noPlanWorkList, setNoPlanWorkList, getWorkList, planWorkList, setPlanWorkList,
        setVersion, delVersion, noPlanSearchCondition, searchCondition,
        planTotal, noPlanTotal, deleteWorkItem } = VersionPlanStore;
    const [moveWorkId, setMoveWorkId] = useState()
    const [startVersionId, setStartVersionId] = useState();
    const [listType, setListType] = useState();
    
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
        let params = {
            startId: moveWorkId,
            endId: versionId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startVersionId !== Sid) {
            dragEvent.style.background = "";
            setVersion(params).then((res) => {
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

    const delVersionPlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId
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
    const goWorkItem = (work, index) => {
        setWorkIndex(index)
        setWorkId(work.id)
        setIsModalVisible(true)
        setWorkShowType("border")
        setSessionStorage("detailCrumbArray", [{ id: work.id, title: work.title, iconUrl: work.workTypeSys.iconUrl }])
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

    const deleteWork = (id) => {
        deleteWorkItem(id).then(res => {
            if(res.code === 0){
                setIsModalVisible(false)
                if(listType === "noPlan"){
                    removeTableTree(noPlanWorkList, id);
                    if(noPlanWorkList.length <= 0){
                        getNoPlanWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                }else {
                    removeTableTree(planWorkList, id);
                    if(planWorkList.length <= 0){
                        getWorkList(
                            {
                                pageParam: {
                                    pageSize: 20,
                                    currentPage: 1
                                }
                            }
                        )
                    }
                }
            }
            
            
        })
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
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index)}>
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
                                        <div className="work-item-left" onClick={() => goWorkItem(item, index)}>
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
                deleteWork = {deleteWork}
                {...props}
            />
        </div>
    </Provider>


    )
}
export default observer(VersionPlan);