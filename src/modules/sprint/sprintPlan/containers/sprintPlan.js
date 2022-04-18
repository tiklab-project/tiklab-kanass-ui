import React,{useEffect, useState} from "react";
import { Breadcrumb, Row, Col, Divider } from "antd";
import { ContainerTwoTone } from '@ant-design/icons';
import "../components/sprintPlan.scss";
import {observer,inject} from "mobx-react";
const SprintPlan = (props) => {

    const [dragEvent,setDragEvent] = useState()
    const {sprintPlanStore} = props
    const projectId = localStorage.getItem("projectId")
    const sprintId =  localStorage.getItem("sprintId")

    const {getNoPlanWorkList,noPlanWorkList,getWorkList,planWorkList,
            getSprintList,sprintList,setSprint,delSprint} = sprintPlanStore;
    const [startId,setStartId] = useState()
    const [startSprintId,setStartSprintId] = useState()

    // 拖放效果
    useEffect(() => {
        getNoPlanWorkList({projectId: projectId,sprintIdIsNull: true})
        getWorkList({projectId: projectId,sprintIdIsNull: false})
        getSprintList({projectId: projectId})
        return 
    }, [])



    const  moveSprintPlanItem= ()=> {
        const dragEvent = event.target
        setDragEvent(dragEvent)
        dragEvent.style.background = "#d0e5f2";
        
    }

    const moveStart = (id,sprintId)=> {
        setStartId(id)
        setStartSprintId(sprintId)
        const dragEvent = event.target
        dragEvent.style.background = "#d0e5f2";
    }

    //必须有onDragOver才能触发onDrop
    const dragover = ()=>{
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
            setSprint(params).then((res)=> {
                if(res === 0){
                    getNoPlanWorkList({projectId: projectId,sprintIdIsNull: true})
                    getWorkList({projectId: projectId,sprintIdIsNull: false})
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
            delSprint(params).then((res)=> {
                if(res === 0){
                    getNoPlanWorkList({projectId: projectId,sprintIdIsNull: true})
                    getWorkList({projectId: projectId,sprintIdIsNull: false})
                }
            })
        }
    }

    return (
        // <Row>
        //     <Col style={{padding: "10px"}} xl={{span: 18,offset:3}} lg={{span: 20,offset:2}}>
                <div className="sprint-plan">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item>迭代管理</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="/">迭代规划</a>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Divider /> */}
                    <div className="sprint-plan-content">
                        <div className="sprint-plan-box"
                            onDrop= {()=>delSprintPlan(null)} 
                            onDragOver = {dragover}
                        >
                        <div className="sprint-plan-box-top">
                            代办事项列表
                        </div>
                        <div style={{overflow: "hidden",height: "700px"}}>
                            <div style={{overflow: "auto",height: "700px"}} className="box">
                                {
                                    noPlanWorkList && noPlanWorkList.map((item)=> {
                                        return <div
                                                    className="sprint-plan-item-box"
                                                    onDrag={()=>moveSprintPlanItem()} 
                                                    draggable="true"
                                                    onDragStart={()=> moveStart(item.id,null)}
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
                        <div className="sprint-plan-box"
                            onDrop= {()=>changeSprintPlan(sprintId)} 
                            onDragOver = {dragover}
                        >
                            <div className="sprint-plan-box-top">
                                当前迭代
                            </div>
                            <div style={{overflow: "hidden",height: "700px"}}>
                                <div style={{overflow: "auto",height: "700px"}} className="box">
                                {
                                    planWorkList && planWorkList.map((item)=> {
                                        if(item.sprint && item.sprint.id === sprintId){
                                            return <div
                                                        className="sprint-plan-item-box"
                                                        onDrag={()=>moveSprintPlanItem(item.id)} 
                                                        draggable="true"
                                                        onDragStart={()=> moveStart(item.id,sprintId)}
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
                                        }
                                        
                                    })
                                }
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
        //     </Col>
            
        // </Row>
        
    )
}
export default inject('sprintPlanStore')(observer(SprintPlan));