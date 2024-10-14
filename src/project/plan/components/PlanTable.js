/*
 * @Descripttion: 计划列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-08 16:06:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 15:27:15
 */
import React, { useState, useEffect,useRef } from "react";
import { Modal } from 'antd';
import { observer, inject } from "mobx-react";
import PlanWorkItemAddmodal from "./PlanWorkItemAdd";
import PlanAdd from "./PlanAddModal";
import WorkAddModel from "../../../work/components/WorkAddModel";
import "./Plan.scss"
import PlanAddmodal from "./PlanAddModal";
import { getUser } from 'tiklab-core-ui';
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const PlanTable = (props) => {
    const { planStore,planWorkItemStore } = props
    const { getPlanList, planList,delePlan } = planStore;
    const {addPlanWorkItem,delePlanWorkItem,searchAllPlanWorkItem} = planWorkItemStore;
    // 删除事项确认框的显示与不显示
    const [isWorkModalVisible, setIsWorkModalVisible] = useState(false);
    // 要删除计划的id
    const [dePlan,setDePlan] = useState();
    // 项目id
    const projectId = props.match.params.id;
    // 删除计划确认框的显示与不显示
    const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
    // 要删除事项的id
    const [deWorkItemId,setDeWorkItemId] = useState();
    const [deWorkItemPlanId,setDeWorkItemPlanId] = useState();

    const tenant = getUser().tenant;
    
    useEffect(() => {
        getPlanList({ projectId: projectId })
        return;
    }, [])
    const [expandedTree, setExpandedTree] = useState([])

    /**
     * 删除计划
     */
    
    const deletePlanModal=(id)=> {
        setDePlan(id)
        setIsWorkModalVisible(true)
    }

    const deletePlan=()=> {
        delePlan({id:dePlan}).then((data)=> {
            if(data.code === 0) {
                setIsWorkModalVisible(false)
            }
        })
    }

    /**
     * 删除事项
     */
    
    const deletePlanWorkItemModal=(id,planId)=>{
        setDeWorkItemId(id)
        setDeWorkItemPlanId(planId)
        setIsPlanModalVisible(true)
    }
    const deletePlanWorkItem=()=> {
        delePlanWorkItem({workItem: {id: deWorkItemId},planId: deWorkItemPlanId}).then(res=>{
            if(res.code === 0){
                setIsPlanModalVisible(false)
                getPlanList({ projectId: projectId })
            }
        })
    }
    // 树的展开与闭合
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = async key => {
        // debugger
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key));
        }
    }

    /**
     * 添加子事项
     */
    const workAddModel = useRef();
    const [workItemState,setWorkItemState] = useState();

    const setStatusName = (value) => {
        let name = ""
        switch(value){
            case "0":
                name = "未开始"
                break;
            case "1": 
                name = "进行中"
                break;
            case "2":
                name = "已结束"
                break;
            default: 
                name = "未开始"
                break;
        }
        return name;
    }

    /**
     * 第二层计划
     * @param {*} data 
     * @param {*} faid 
     * @param {*} deep 
     * @returns 
     */
    const TreeSecondDom = (data,faid,deep) => {
        return (
            <ul className="plan-table-ul child">
                {
                    data && data.map((childItem, index) => {
                        return (
                            <li key={childItem.id} className={isExpandedTree(faid) ? null : 'plan-table-hidden'} >
                                <div
                                    className={`plan-table-item plan-table-child`}
                                // onClick={(event)=>changeWorkChilden(childItem.id)}
                                >
                                    <div className="plan-table-item-content">
                                        <div className="name cell" style={{paddingLeft: `${deep * 20 + 10}`}}>
                                            {
                                                (childItem.children && childItem.children.length>0) || (childItem.workItemList && childItem.workItemList.length>0) ?
                                                    (isExpandedTree(childItem.id) ?
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-down"></use>
                                                    </svg> :
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-right"></use>
                                                    </svg>
                                                    ) : ""
                                            }
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-plan"></use>
                                            </svg>
                                            <PlanAdd 
                                                name={childItem.planName}
                                                type="edit"
                                            />
                                        </div>
                                        <div className="start-time cell">{childItem.startTime}</div>
                                        <div className="end-time cell">{childItem.endTime}</div>
                                        <div className="cell state">{setStatusName(childItem.planState)}</div>
                                        <div className="cell action">
                                            <span onClick={()=> deletePlanModal(childItem.id)}>删除</span>
                                            <PlanWorkItemAddmodal  
                                                name="添加规划"
                                                type="children"
                                                addPlanWorkItem={addPlanWorkItem}
                                                searchAllPlanWorkItem = {searchAllPlanWorkItem}
                                                planId={childItem.id}
                                            />
                                            <PlanAddmodal 
                                                name="编辑" 
                                                type="edit" 
                                                id = {childItem.id}
                                                // parentId = {faid}
                                                // parentName = {childItem.planName}
                                            />
                                            <PlanAdd 
                                                name="添加子计划"
                                                type="addChildren"
                                                parentId={childItem.id}
                                                parentName = {childItem.planName}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {
                                    childItem.workItemList && childItem.workItemList.length > 0 && TreeWorkItemDom(childItem.workItemList, childItem.id,deep+1)
                                }
                                {
                                    childItem.children && childItem.children.length > 0 && TreeSecondDom(childItem.children, childItem.id,deep+1)
                                }
                            </li>
                        )
                    })
                }
            </ul>

        )

    }

    /**
     * 第二层事项
     * @param {*} data 
     * @param {*} faid 
     * @param {*} deep 
     * @returns 
     */
    const TreeWorkItemDom = (data,faid,deep) => {
        return (
            <ul className="plan-table-ul child">
                {
                    data && data.map((childItem, index) => {
                        return (
                            <li key={childItem.id} className={isExpandedTree(faid) ? null : 'plan-table-hidden'} >
                                <div
                                    className={`plan-table-item plan-table-child`}
                                >
                                    <div className="plan-table-item-content">
                                        <div className="name cell" style={{paddingLeft: `${deep * 20 + 10}`}}>
                                            {
                                                childItem.children && childItem.children.length>0? (isExpandedTree(childItem.id) ?
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-down"></use>
                                                    </svg> :
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-right"></use>
                                                    </svg>
                                                    ) : ""
                                            }
                                            <ImgComponent 
                                                className="img-icon-right"
                                                alt="" 
                                                src={childItem.workType.iconUrl}
                                            />
                                            {childItem.title}
                                        </div>
                                        <div className="start-time cell">{childItem.startTime}</div>
                                        <div className="end-time cell">{childItem.endTime}</div>
                                        <div className="state cell">{childItem.workStatus ? childItem.workStatus.name : "未开始"}</div>
                                        <div className="action cell">
                                            <span onClick={()=> deletePlanWorkItemModal(childItem.id,faid) }>删除</span>
                                            <span>添加子事项</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    childItem.children && childItem.children.length > 0 && TreeWorkItemDom(childItem.children, childItem.id,deep+1)
                                }
                            </li>
                        )
                    })
                }
            </ul>

        )

    }

    /**
     * 第一层
     * @param {*} item 
     * @param {*} deep 
     * @returns 
     */
    const TreeDom = (item, deep) => {
        return (
            <li key={item.id}>
                <div
                    className={`plan-table-item plan-table-child`}
                // onClick={(event)=>changeWorkChilden(item.id,index)}
                >
                    <div className="plan-table-item-content">
                        {/* <div className="cell id">{item.id}</div> */}
                        <div className="cell name" style={{paddingLeft: `${deep * 20 + 10}`}}>
                            {
                                item.children && item.children.length>0 || item.workItemList && item.workItemList.length>0 ?
                                    (isExpandedTree(item.id) ?
                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                        <use xlinkHref="#icon-down"></use>
                                    </svg> :
                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                        <use xlinkHref="#icon-right"></use>
                                    </svg>
                                    ) : ""
                            }
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-plan"></use>
                            </svg>
                            <PlanAdd 
                                name={item.planName}
                                type="edit"
                            />
                            
                        </div>
                        <div className="cell start-time">{item.startTime}</div>
                        <div className="cell end-time">{item.endTime}</div>
                        <div className="cell state">{setStatusName(item.planState)}</div>
                        <div className="cell action">
                            <span onClick={()=>deletePlanModal(item.id)}>删除</span>
                            <PlanWorkItemAddmodal  
                                name="添加规划"
                                type="children"
                                addPlanWorkItem={addPlanWorkItem}
                                searchAllPlanWorkItem = {searchAllPlanWorkItem}
                                planId={item.id}
                            />
                            <PlanAddmodal 
                                name="编辑" 
                                type="edit" 
                                id = {item.id}
                            />
                            <PlanAdd
                                name="添加子计划"
                                type="addChildren"
                                parentId={item.id}
                                parentName = {item.planName}
                            />
                        </div>
                    </div>

                </div>
                {
                    item.workItemList && item.workItemList.length > 0 && TreeWorkItemDom(item.workItemList, item.id,deep+1)
                }
                {
                    item.children && item.children.length > 0 && TreeSecondDom(item.children,item.id,deep+1)
                }
            </li>
        )
    }

    return (
        <div className="plan-workitem">
            <div className="plan-table-contant" >
                <div
                    className="plan-table-head"
                >
                    <div className="plan-table-head-content">
                        <div className="cell name">计划名称</div>
                        <div className="cell start-time">开始时间</div>
                        <div className="cell end-time">结束时间</div>
                        <div className="cell state">计划z状态</div>
                        <div className="cell action">
                            操作
                        </div>
                    </div>

                </div>
                <ul className="plan-table-ul">
                    {
                        planList && planList.map((item, index) => {
                            return TreeDom(item, 0)
                        })
                    }
                </ul>
            </div>
            <Modal title="是否删除" visible={isWorkModalVisible} closable = {false} onOk={deletePlan} onCancel={()=>setIsWorkModalVisible(false)}>
                是否删除计划？
            </Modal>
            <Modal title="是否删除" visible={isPlanModalVisible} closable = {false} onOk={deletePlanWorkItem} onCancel={()=>setIsPlanModalVisible(false)}>
                是否删除事项？
            </Modal>
            <WorkAddModel workAddModel = {workAddModel} state ={workItemState} {...props}/>
        </div>
    )
}
export default inject("planStore", "planWorkItemStore")(observer(PlanTable));