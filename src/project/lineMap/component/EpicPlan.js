import React, { Fragment, useEffect, useState } from "react";
import EpicPlanAddmodal from "./EpicPlanAddModal";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import InputSearch from "../../../common/input/InputSearch"
import "./EpicPlan.scss"

const EpicPlan = (props) => {
    const { epicStore, epicId } = props;
    const { findEpicChildWorkItemAndEpic, deleteEpicWorkItem } = epicStore;
    // 史诗的下级事项和下级史诗
    const [epicChild, setEpicChild] = useState()
    const [setSelectWorkItemList] = useState()
    // 史诗的子级事项id集合
    let [epicWorkIds, setEpicWorkIds] = useState()

    /**
     * 通过史诗id获取史诗的下级事项和下级史诗
     */
    useEffect(() => {
        findEpicChildWorkItemAndEpic({ epicId: epicId }).then(res => {
            if (res.code === 0) {
                setEpicChild(res.data)
                let ids = []
                res.data.workItem.map(item => {
                    ids.push(item.id)
                })
                setEpicWorkIds(ids)
            }
        })
        return
    }, [epicId])


    /**
     * 删除史诗与事项的关联
     * @param {事项id} id 
     */
    const deleteWorkItem = (id) => {
        const value = {
            epicId: epicId,
            workItem: { id: id }
        }
        deleteEpicWorkItem(value).then(res=> {
            if(res.code === 0){
                findEpicChildWorkItemAndEpic({ epicId: epicId }).then(res => {
                    if (res.code === 0) {
                        setEpicChild(res.data)
                        let ids = []
                        res.data.workItem.map(item => {
                            ids.push(item.id)
                        })
                        setEpicWorkIds(ids)
                    }
                })
            }
        })
    }


    // 搜索用户
    const onSearch = (value) => {
        findEpicChildWorkItemAndEpic({ epicId: epicId, workItemName: value }).then(res => {
            if (res.code === 0) {
                setEpicChild(res.data)
            }
        })
    }

    /**
     * 根据值获取状态的显示文字
     * @param {状态值} value 
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

    // 展开的子级的上级id
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
        console.log(expandedTree)
    }

    /**
     * 渲染下级史诗列表
     * @param {史诗列表} data 
     * @param {上级id} fid 
     * @param {层级} level 
     * @returns 
     */
    const epicTable = (data, fid, level) => {
        return (
            <div className={`epic-table-child ${isExpandedTree(fid) ? "epic-table-hidden" : ''}`}>
                {
                    data && data.map(item => {
                        return <Fragment>
                            <div className="epic-child-item" key = {item.id}>
                                <div className="epic-item epic-item-title">
                                    <div className="epic-item-name" style={{ paddingLeft: level * 18 + 5 }}>
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
                                            <div style={{width: "18px", height: "18px"}}></div>
                                        }
                                       
                                        <div className="epicName">{item.epicName}</div>
                                    </div>

                                </div>
                                <div className="epic-item epic-item-master">{item.master?.name}</div>
                                <div className="epic-item epic-item-status">{setStatusName(item.status)}</div>
                                <div className="epic-item epic-item-data">{item.startTime} ~ {item.endTime}</div>
                                <div className="epic-item epic-item-type">需求集</div>
                                <div className="epic-item epic-item-action"></div>
                            </div>
                            {
                                item.children && item.children.length > 0 && epicTable(item.children, item.id, level + 1)
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
     * 渲染下级事项列表
     * @param {史诗列表} data 
     * @param {上级id} fid 
     * @param {层级} level 
     * @returns 
     */
    const workTable = (data, fid, level) => {
        return (
            <div className={`epic-table-workitem ${isExpandedTree(fid) ? "epic-table-hidden" : ''}`}>
                {
                    data && data?.map(item => {
                        return <Fragment>
                            <div className="epic-workitem-item" key = {item.id}>
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
                                            <div style={{width: "18px", height: "18px"}}></div>
                                        }
                                         {
                                            item.workTypeSys?.iconUrl ?
                                                <img
                                                    src={('images/' + item.workTypeSys?.iconUrl)}
                                                    alt=""
                                                    className="img-icon"
                                                />
                                                :
                                                <img
                                                    src={('images/workType1.png')}
                                                    alt=""
                                                    className="img-icon"
                                                />
                                        }
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
        <div className="epic-workitem">
            <div className="epic-workitem-title">
                关联需求
                <EpicPlanAddmodal
                    name="添加需求"
                    type="add"
                    setselectWorkItemList={setSelectWorkItemList}
                    epicId={epicId}
                    epicWorkIds={epicWorkIds}
                    setEpicWorkIds = {setEpicWorkIds}
                    setEpicChild = {setEpicChild}
                    {...props}
                />
            </div>
            <div className="search-add">
                <InputSearch
                    placeholder="需求名称"
                    allowClear
                    style={{ width: 300 }}
                    onChange={onSearch}
                />

            </div>
            <div className="epic-table">
                <div className="epic-table-header">
                    <div className="epic-header-td header-name">标题</div>
                    <div className="epic-header-td header-master">负责</div>
                    <div className="epic-header-td header-status">状态</div>
                    <div className="epic-header-td header-data">日期</div>
                    <div className="epic-header-td header-type">类型</div>
                    <div className="epic-header-td header-action">操作</div>
                </div>
                {
                    epicTable(epicChild?.epic, 0, 0)
                }
                {
                    workTable(epicChild?.workItem, 0, 0)
                }
            </div>
        </div>
    )
}
export default withRouter(inject("epicStore")(observer(EpicPlan)));