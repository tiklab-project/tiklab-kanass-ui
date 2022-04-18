/*
 * @Descripttion: 规划页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-22 16:14:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 17:09:18
 */
import React, { useEffect, useState } from "react";
import { Breadcrumb, Divider, Layout, Row, Col } from "antd";
import { ContainerTwoTone } from '@ant-design/icons';
import "../components/sprintPlan.scss";
import { observer, inject } from "mobx-react";
const Plan = (props) => {
    const [dragEvent, setDragEvent] = useState();
    const { projectSprintPlanStore } = props;
    const projectId = localStorage.getItem("projectId");
    const { getNoPlanWorkList, noPlanWorkList, getWorkList, planWorkList,
        getSprintList, sprintList, setSprint, delSprint } = projectSprintPlanStore;

    // 被移动事项的id
    const [startId, setStartId] = useState()

    // 被移动事项的初始迭代id
    const [startSprintId, setStartSprintId] = useState()


    useEffect(() => {
        getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })

        // 获取已经规划迭代的事项列表
        getWorkList({ projectId: projectId, sprintIdIsNull: false })

        // 获取所有迭代列表
        getSprintList({ projectId: projectId })
        return
    }, [])

    /**
     * 获取移动的dom
     */
    const movePlanItem = () => {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";

    }

    /**
     * 开始移动Dom
     * @param {*} id 
     * @param {*} sprintId 
     */
    const moveStart = (id, sprintId) => {
        console.log(id)
        setStartId(id)
        setStartSprintId(sprintId)
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";
    }

    /**
     * 必须有onDragOver才能触发onDrop
     */
    const dragover = () => {
        event.preventDefault();
    }

    /**
     * 放置被拖动元素
     * @param {*} id 
     */
    const changePlan = (id) => {
        let params = {
            startId: startId,
            endId: id
        }
        event.preventDefault();
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId !== id) {
            dragEvent.style.background = "";
            setSprint(params).then((res) => {
                if (res === 0) {
                    getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })
                    getWorkList({ projectId: projectId, sprintIdIsNull: false })
                }
            })
        }
    }

    /**
     * 删除规划
     * @param {*} id 
     */
    const delPlan = (id) => {
        let params = {
            startId: startId
        }
        event.preventDefault();
        // 移动拖动的元素到所选择的放置目标节点
        if (startSprintId && startSprintId !== id) {
            dragEvent.style.background = "";
            delSprint(params).then((res) => {
                if (res === 0) {
                    getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })
                    getWorkList({ projectId: projectId, sprintIdIsNull: false })
                }
            })
        }
    }

    return (
        <div className="project-plan">
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/#/index/prodetail/sprint">迭代列表</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">迭代规划</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="plan-content">
                <div className="plan-left"
                    onDrop={() => changePlan(null)}
                    onDragOver={dragover}
                >
                    <div className="plan-left-top">
                        代办事项列表
                    </div>
                    <div style={{ overflow: "hidden", height: "740px" }}>
                        <div style={{ overflow: "auto", height: "740px" }} className="box" onDrop={() => delPlan()}>
                            {
                                noPlanWorkList && noPlanWorkList.map((item) => {
                                    return <div
                                        className="plan-item-box"
                                        onDrag={() => movePlanItem()}
                                        draggable="true"
                                        onDragStart={() => moveStart(item.id, null)}
                                        key={item.id}
                                    >
                                        <div className="content-left">
                                            <ContainerTwoTone />
                                        </div>
                                        <div className="content-right">
                                            <div>{item.id}</div>
                                            <div>{item.title}</div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={{ overflow: "hidden", height: "765px", flex: 1 }}>
                    <div className="plan-right">
                        {
                            sprintList && sprintList.map((item) => {
                                return <div className="plan-right-item"
                                    onDrop={() => changePlan(item.id)}
                                    onDragOver={dragover}
                                    key={item.id}
                                >
                                    <div className="plan-right-item-top">{item.sprintName}</div>
                                    {
                                        planWorkList && planWorkList.map((planItem) => {
                                            if (planItem.sprint && planItem.sprint.id === item.id) {
                                                return <div className="plan-item-box"
                                                    onDrag={() => movePlanItem()}
                                                    draggable="true"
                                                    onDragStart={() => moveStart(planItem.id, item.id)}
                                                    key={planItem.id}
                                                >
                                                    <div className="content-left">
                                                        <ContainerTwoTone />
                                                    </div>
                                                    <div className="content-right">
                                                        <div>{planItem.id}</div>
                                                        <div>{planItem.title}</div>
                                                    </div>
                                                </div>
                                            }

                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default inject('projectSprintPlanStore')(observer(Plan));