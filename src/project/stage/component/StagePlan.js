
/*
 * @Descripttion: 计划的事项列表 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { Fragment, useEffect, useState } from "react";
import StagePlanAddmodal from "./StagePlanAddModal";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import InputSearch from "../../../common/input/InputSearch"
import "./StagePlan.scss";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const StagePlan = (props) => {
    const { stageStore, stageId } = props;
    const { findWorkItemListByStage, deleteStageWorkItem } = stageStore;
    // 计划的子级计划
    const [stageChild, setStageChild] = useState()
    // 计划关联的事项ids
    let [stageWorkIds, setStageWorkIds] = useState()
    // 已展开子级的计划id集合
    const [expandedTree, setExpandedTree] = useState([])

    /**
     * 判断树是否展开
     * @param {上级的id} key 
     * @returns 
     */
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    /**
     * 树的展开与闭合
     * @param {上级的id} key 
     */
    const setOpenOrClose = (key) => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    /**
     * 计划状态显示
     * @param {*} value 
     * @returns 
     */
    const setStatusName = (value) => {
        let name = ""
        switch (value) {
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
     * 获取计划关联的事项id集合
     */
    useEffect(() => {
        findWorkItemListByStage({ stageId: stageId }).then(res => {
            if (res.code === 0) {
                setStageChild(res.data)
                let ids = []
                res.data.workItem.map(item => {
                    ids.push(item.id)
                })
                setStageWorkIds(ids)
            }
        })
        return
    }, [stageId])


    /**
     * 删除计划关联的事项
     * @param {事项id} id 
     */
    const deleteWorkItem = (id) => {
        const value = {
            stageId: stageId,
            workItem: { id: id }
        }
        deleteStageWorkItem(value).then(res => {
            if (res.code === 0) {
                findWorkItemListByStage({ stageId: stageId }).then(res => {
                    if (res.code === 0) {
                        setStageChild(res.data)
                        let ids = []
                        res.data.workItem.map(item => {
                            ids.push(item.id)
                        })
                        setStageWorkIds(ids)
                    }
                })
            }
        })
    }

    /**
     * 按标题搜索需求
     * @param {标题} value 
     */
    const onSearch = (value) => {
        findWorkItemListByStage({ stageId: stageId, workItemName: value }).then(res => {
            if (res.code === 0) {
                setStageChild(res.data)
            }
        })
    }

    /**
     * 计划列表
     * @param {计划列表} data 
     * @param {上级id} fid 
     * @param {层级} level 
     * @returns 
     */
    const stageTable = (data, fid, level) => {
        return (
            <div className={`stage-table-child ${isExpandedTree(fid) ? "stage-table-hidden" : ''}`}>
                {
                    data && data.map(item => {
                        return <Fragment>
                            <div className="stage-child-item" key={item.id}>
                                <div className="stage-item stage-item-title">
                                    <div className="stage-item-name" style={{ paddingLeft: level * 18 + 5 }}>
                                        {
                                            ((item.children && item.children.length > 0) || (item.childrenWorkItem && item.childrenWorkItem.length > 0)) ?
                                                <>
                                                    {
                                                        isExpandedTree(item.id) ?
                                                            <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-down"></use>
                                                            </svg>
                                                            :
                                                            <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-right"></use>
                                                            </svg>
                                                    }
                                                </>
                                                :
                                                <div style={{ width: "18px", height: "18px" }}></div>
                                        }

                                        <div className="stageName">{item.stageName}</div>
                                    </div>

                                </div>
                                <div className="stage-item stage-item-master">{item.master?.name}</div>
                                <div className="stage-item stage-item-status">{setStatusName(item.status)}</div>
                                <div className="stage-item stage-item-data">{item.startTime} ~ {item.endTime}</div>
                                <div className="stage-item stage-item-type">需求集</div>
                                <div className="stage-item stage-item-action"></div>
                            </div>
                            {
                                item.children && item.children.length > 0 && stageTable(item.children, item.id, level + 1)
                            }
                            {
                                item.childrenWorkItem && item.childrenWorkItem.length > 0 && workTable(item.childrenWorkItem, item.id, level + 1)
                            }
                        </Fragment>
                    })
                }
            </div>
        )
    }

    /**
     * 事项列表
     * @param {事项列表} data 
     * @param {上级事项} fid 
     * @param {层级} level 
     * @returns 
     */
    const workTable = (data, fid, level) => {
        return (
            <div className={`stage-table-workitem ${isExpandedTree(fid) ? "stage-table-hidden" : ''}`}>
                {
                    data && data?.map(item => {
                        return <Fragment>
                            <div className="stage-workitem-item" key={item.id}>
                                <div className="workitem-row workitem-row-title">
                                    <div
                                        className="workitem-row-name"
                                        style={{ paddingLeft: level * 18 + 5 }}
                                    >
                                        {
                                            (item.children && item.children.length > 0) ?
                                                <>
                                                    {
                                                        isExpandedTree(item.id) ?
                                                            <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-down"></use>
                                                            </svg>
                                                            :
                                                            <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-right"></use>
                                                            </svg>
                                                    }
                                                </>
                                                :
                                                <div style={{ width: "18px", height: "18px" }}></div>
                                        }
                                        <ImgComponent
                                            src={item.workTypeSys?.iconUrl}
                                            alt=""
                                            className="img-icon-right"
                                        />
                                        <div className="workitemName">{item.title}</div>
                                    </div>

                                </div>
                                <div className="workitem-row workitem-row-assigner">{item.assigner?.name}</div>
                                <div className="workitem-row workitem-row-status">{item.workStatusNode.name}</div>
                                <div className="workitem-row workitem-row-data">{item.planBeginTime} ~ {item.planEndTime}</div>
                                <div className="workitem-row workitem-row-type">事项</div>
                                <div className="workitem-row workitem-row-action" onClick={() => deleteWorkItem(item.id)}>{fid === 0 && "删除"}</div>
                            </div>
                            {
                                item.children && item.children.length > 0 && workTable(item.children, item.id, level + 1)
                            }

                        </Fragment>

                    })
                }
            </div>
        )
    }


    return (
        <div className="stage-workitem">
            <div className="stage-workitem-title">
                关联需求
                <StagePlanAddmodal
                    name="添加需求"
                    type="add"
                    stageId={stageId}
                    stageWorkIds={stageWorkIds}
                    setStageWorkIds={setStageWorkIds}
                    setStageChild={setStageChild}
                    {...props}
                />
            </div>
            <div className="search-add">
                <InputSearch
                    placeholder="搜索需求"
                    allowClear
                    style={{ width: 300 }}
                    onChange={onSearch}
                />

            </div>
            <div className="stage-table">
                <div className="stage-table-header">
                    <div className="stage-header-td header-name">标题</div>
                    <div className="stage-header-td header-master">负责</div>
                    <div className="stage-header-td header-status">状态</div>
                    <div className="stage-header-td header-data">日期</div>
                    <div className="stage-header-td header-type">类型</div>
                    <div className="stage-header-td header-action">操作</div>
                </div>
                {
                    stageTable(stageChild?.stage, 0, 0)
                }
                {
                    workTable(stageChild?.workItem, 0, 0)
                }
            </div>
        </div>
    )
}
export default withRouter(inject("stageStore")(observer(StagePlan)));