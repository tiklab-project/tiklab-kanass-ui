import React, { useEffect, useState } from "react";
import "../components/sprintPlan.scss";
import { observer, inject } from "mobx-react";
import { SelectSimple, SelectItem } from "../../../common/select";
import InputSearch from "../../../common/input/InputSearch";
import WorkBorderDetail from "../../../work/components/WorkBorderDetail";

const SprintPlan = (props) => {

    const [dragEvent, setDragEvent] = useState()
    const { sprintPlanStore, workStore } = props
    const projectId =JSON.parse(localStorage.getItem("project"))?.id;
    const sprintId = localStorage.getItem("sprintId")
    // 显示事项详情
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { getSelectUserList, getWorkTypeList, getWorkStatus, workTypeList,
        userList, workStatusList, setWorkId, setWorkIndex, setWorkShowType } = workStore;
    const { getNoPlanWorkList, noPlanWorkList, getWorkList, planWorkList,
        getSprintList, setSprint, delSprint, noPlanSearchCondition, searchCondition } = sprintPlanStore;
    const [startId, setStartId] = useState()
    const [startSprintId, setStartSprintId] = useState();
    const [boxLength, setBoxLength] = useState(90)
    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })
        getWorkList({ projectId: projectId, sprintId: sprintId })
        getSprintList({ projectId: projectId })

        getSelectUserList(projectId)
        getWorkTypeList({projectId: projectId});
        getWorkStatus()
       

        return
    }, [])

    useEffect(() => {
        if(noPlanWorkList && planWorkList) {
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
        setStartId(id)
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
            startId: startId,
            endId: sprintId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId !== Sid) {
            dragEvent.style.background = "";
            // dragEvent.parentNode.removeChild( dragEvent );
            // event.target.appendChild( dragEvent );
            setSprint(params).then((res) => {
                if (res.code === 0) {
                    getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })
                    getWorkList({ projectId: projectId, sprintIdIsNull: false })
                }
            })
        }
    }

    const delSprintPlan = (Sid) => {
        event.preventDefault();
        let params = {
            startId: startId
        }
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId && Sid !== startSprintId) {
            dragEvent.style.background = "";
            delSprint(params).then((res) => {
                if (res.code === 0) {
                    getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })
                    getWorkList({ projectId: projectId, sprintIdIsNull: false })
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

    return (
        <div className="sprint-plan">
            <div className="sprint-plan-content">
                <div className="sprint-plan-box"
                    onDrop={() => delSprintPlan(null)}
                    onDragOver={dragover}
                    style = {{height: boxLength}}
                >
                    <div className="sprint-plan-box-top">
                        <div className="sprint-plan-title">代办规划事项</div>
                        <div className="sprint-plan-filter">
                            <InputSearch onChange={(value) => handleChange("title", value)} placeholder={"搜索事项名称"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => handleChange("workTypeIds", value)}
                                title={"类型"}
                                ismult={true}
                                selectValue={noPlanSearchCondition?.workTypeIds}
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
                                selectValue={noPlanSearchCondition?.assignerIds}
                            >
                                {
                                    userList.map(item => {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.user.name}
                                            key={item.id}
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
                                selectValue={noPlanSearchCondition?.workStatusIds}
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
                                noPlanWorkList && noPlanWorkList.map((item,index) => {
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
                                                    item.workTypeSys.iconUrl ?
                                                        <img
                                                            src={'/images/' + item.workTypeSys.iconUrl}
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
                        </div>
                    </div>
                </div>
                <div className="sprint-plan-box"
                    onDrop={() => changeSprintPlan(sprintId)}
                    onDragOver={dragover}
                    style = {{height: boxLength}}
                >
                    <div className="sprint-plan-box-top">
                        <div className="sprint-plan-title">迭代下事项</div>
                        <div className="sprint-plan-filter">
                            <InputSearch onChange={(value) => findSprintWorkItem("title", value)} placeholder={"搜索事项名称"} />
                            <SelectSimple name="workTypeIds"
                                onChange={(value) => findSprintWorkItem("workTypeIds", value)}
                                title={"类型"}
                                ismult={true}
                                selectValue={searchCondition?.workTypeIds}
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
                                onChange={(value) => findSprintWorkItem("assignerIds", value)}
                                title={"负责人"} ismult={true}
                                selectValue={searchCondition?.assignerIds}
                            >
                                {
                                    userList.map(item => {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.user.name}
                                            key={item.id}
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
                                selectValue={searchCondition?.workStatusIds}
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
                                planWorkList && planWorkList.map((item, index) => {
                                    if (item.sprint && item.sprint.id === sprintId) {
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
                                                        item.workTypeSys.iconUrl ?
                                                            <img
                                                                src={'/images/' + item.workTypeSys.iconUrl}
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
                                    }

                                })
                            }
                        </div>
                    </div>

                </div>
            </div>

            <WorkBorderDetail
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                showPage = {false}
                {...props}
            />
        </div>

    )
}
export default inject('sprintPlanStore', "workStore")(observer(SprintPlan));