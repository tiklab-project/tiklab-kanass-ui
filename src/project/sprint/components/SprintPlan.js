/*
 * @Descripttion: 规划迭代的事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-22 16:14:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 17:09:18
 */
import React, { useEffect, useState } from "react";
import { ContainerTwoTone } from '@ant-design/icons';
import "../components/SprintPlan.scss";
import { observer } from "mobx-react";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import { Row, Col } from 'antd';
import ProjectSprintPlanStore from "../store/SprintPlanStore"
const SprintPlan = (props) => {
    const [dragEvent, setDragEvent] = useState();
    const projectId = props.match.params.id;
    const { getNoPlanWorkList, noPlanWorkList, getWorkList, planWorkList,
        getSprintList, sprintList, setSprint, delSprint } = ProjectSprintPlanStore;
    // 被移动事项的id
    const [startId, setStartId] = useState()
    // 被移动事项的初始迭代id
    const [startSprintId, setStartSprintId] = useState()


    useEffect(() => {
        /**
         * 获取没被规划的事项
         */
        getNoPlanWorkList({ projectId: projectId, sprintIdIsNull: true })

        /**
         * 获取已经规划迭代的事项列表
         */
        getWorkList({ projectId: projectId, sprintIdIsNull: false })
        /**
         * 获取所有迭代列表
         */
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
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-plan">
                    <Breadcrumb
                        firstText="迭代列表"
                        firstUrl={"/index/prodetail/sprint"}
                        secondText="迭代规划"
                        {...props}
                    />
                    <div className="plan-content">
                        <div className="plan-left"
                            onDrop={() => changePlan(null)}
                            onDragOver={dragover}
                        >
                            <div className="plan-left-top">
                                待办事项 <div style={{fontSize: "12px", marginLeft: "10px"}}>{noPlanWorkList?.length}</div>
                            </div>
                            <div className="plan-left-content">
                                <div className="box" onDrop={() => delPlan()}>
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
                        <div style={{ overflow: "auto", flex: 1, height: "100%" }}>
                            <div className="plan-right">
                                {
                                    sprintList && sprintList.map((item) => {
                                        return <div className="plan-right-item"
                                            onDrop={() => changePlan(item.id)}
                                            onDragOver={dragover}
                                            key={item.id}
                                        >
                                            <div className="plan-right-item-top">{item.sprintName} <div style={{fontSize: "12px", marginLeft: "10px"}}>{noPlanWorkList?.length}</div></div>
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
            </Col>
        </Row>
    )
}
export default observer(SprintPlan);