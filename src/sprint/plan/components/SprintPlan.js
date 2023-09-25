import React, { useEffect, useState } from "react";
import "../components/sprintPlan.scss";
import { observer, inject, Provider } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkBorderDetail from "../../../work/components/WorkBorderDetail";
import WorkStore from "../../../work/store/WorkStore";
import SprintPlanStore from "../stores/SprintPlanStore"
const SprintPlan = (props) => {
    const store = {
        sprintPlanStore: SprintPlanStore,
        workStore: WorkStore
    }
    const [dragEvent, setDragEvent] = useState()
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const sprintId = localStorage.getItem("sprintId")
    // 显示事项详情
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { getSelectUserList, getWorkTypeList, getWorkStatus, workTypeList,
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType } = WorkStore;
    const { getNoPlanWorkList, noPlanWorkList, setNoPlanWorkList, getWorkList, planWorkList, setPlanWorkList,
        getSprintList, setSprint, delSprint, noPlanSearchCondition, searchCondition,
        planTotal, noPlanTotal } = SprintPlanStore;
    const [moveWorkId, setMoveWorkId] = useState()
    const [startSprintId, setStartSprintId] = useState();
    const [boxLength, setBoxLength] = useState(90)
    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList(
            {
                projectId: projectId,
                sprintIdIsNull: true,
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
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
        getSprintList({ projectId: projectId })

        getSelectUserList(projectId)
        getWorkTypeList({ projectId: projectId });
        getWorkStatus()


        return
    }, [])

    useEffect(() => {
        if (noPlanWorkList && planWorkList) {
            const length = noPlanWorkList.length > planWorkList.length ? noPlanWorkList.length * 90 + 90 : planWorkList.length * 90 + 90
            setBoxLength(length)
        }

        return
    }, [noPlanWorkList, planWorkList])


    const moveSprintPlanItem = () => {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";

    }

    const moveStart = (id, sprintId) => {
        setMoveWorkId(id)
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
        let params = {
            startId: moveWorkId,
            endId: sprintId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId !== Sid) {
            dragEvent.style.background = "";
            // dragEvent.parentNode.removeChild( dragEvent );
            // event.target.appendChild( dragEvent );
            setSprint(params).then((res) => {
                if (res.code === 0) {
                    const newNoPlanWorkList = noPlanWorkList.filter(item => { return item.id != moveWorkId })
                    setNoPlanWorkList(newNoPlanWorkList)

                    const addWorkList = noPlanWorkList.filter(item => { return item.id == moveWorkId })
                    planWorkList.unshift(...addWorkList)
                    console.log(addWorkList, planWorkList)
                    setPlanWorkList(planWorkList)
                }
            })
        }
    }

    const delSprintPlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: moveWorkId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId && Sid !== startSprintId) {
            dragEvent.style.background = "";
            delSprint(params).then((res) => {
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
        getNoPlanWorkList({ [field]: value })
    }

    const findSprintWorkItem = (field, value) => {
        getWorkList({ [field]: value })
    }

    /**
     * 显示事项详情抽屉
     * @param {事项id} id 
     * @param {*} index 
     */
    const goWorkItem = (id, index) => {
        setWorkIndex(index)
        setWorkId(id)
        setIsModalVisible(true)
        setWorkShowType("border")
    }

    const changeNoPlanSprintPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: noPlanSearchCondition.pageParam.currentPage + 1
            }
        }
        getNoPlanWorkList(data)
    }

    const changePlanSprintPage = () => {
        const data = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition.pageParam.currentPage + 1
            }
        }
        getWorkList(data)
    }

    return (<Provider {...store}>
        <div className="sprint-plan">
            <div className="sprint-plan-content">
                <div className="sprint-plan-box"
                    onDrop={() => delSprintPlan(null)}
                    onDragOver={dragover}
                // style = {{height: boxLength}}
                >
                    <div className="sprint-plan-box-top">
                        <div className="sprint-plan-title">待办规划事项</div>
                        <div className="sprint-plan-filter">
                            <InputSearch onChange={(value) => handleChange("title", value)} placeholder={"搜索事项名称"} />
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
                                            imgUrl={`${upload_url}${item.workType.iconUrl}`}
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
                                noPlanWorkList && noPlanWorkList.length > 0 && noPlanWorkList.map((item, index) => {
                                    return <div
                                        className="sprint-plan-item-box"
                                        onDrag={() => moveSprintPlanItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, null)}
                                        key={item.id}
                                    >
                                        <div className="work-item-title" onClick={() => goWorkItem(item.id, index)}>
                                            <div className="work-item-title-left" >
                                                {
                                                    item.workTypeSys?.iconUrl ?
                                                        <img
                                                            src={version === "cloud" ? (upload_url + item.workTypeSys.iconUrl + "?tenant=" + tenant) : (upload_url + item.workTypeSys.iconUrl)}
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
                                                {item.title}
                                            </div>
                                            <div>
                                                <span >{item.id}</span>
                                            </div>
                                        </div>
                                        <div className="work-item-id">
                                            <div userInfo={item.user} />
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
                            <InputSearch onChange={(value) => findSprintWorkItem("title", value)} placeholder={"搜索事项名称"} />
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
                                            imgUrl={`${upload_url}${item.workType.iconUrl}`}
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
                                planWorkList && planWorkList.length > 0 && planWorkList.map((item, index) => {
                                    return <div
                                        className="sprint-plan-item-box"
                                        onDrag={() => moveSprintPlanItem(item.id)}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, sprintId)}
                                        key={item.id}
                                    >
                                        <div className="work-item-title" onClick={() => goWorkItem(item.id, index)}>
                                            <div className="work-item-title-left" >
                                                {
                                                    item.workTypeSys?.iconUrl ?
                                                        <img
                                                            src={version === "cloud" ? (upload_url + item.workTypeSys.iconUrl + "?tenant=" + tenant) : (upload_url + item.workTypeSys.iconUrl)}
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
                                                {item.title}
                                            </div>
                                            <div>
                                                <span >{item.id}</span>
                                            </div>
                                        </div>
                                        <div className="work-item-id">
                                            <div userInfo={item.user} />
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

            <WorkBorderDetail
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                showPage={false}
                {...props}
            />
        </div>
    </Provider>


    )
}
export default observer(SprintPlan);