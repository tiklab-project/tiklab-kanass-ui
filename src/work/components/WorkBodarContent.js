import {Empty, Spin, Tooltip} from "antd";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import UserIcon from "../../common/UserIcon/UserIcon";
import { withRouter } from "react-router";
import React, {useRef} from "react";
import WorkDetailDrawer from "./WorkDetailDrawer";
import WorkDetailModalView from "./workDetailModalView/WorkDetailModalView";
import {observer} from "mobx-react";

const WorkBodarContent = (props) => {
    const {loading, dragover, isSameFlowBox, changeStatus, cancelDrag, moveWorkId, delectCurrentWorkItem,
        moveStart, moveWorkItem, showModal,changePage, workStore, isModalVisible, setIsModalVisible } = props;
    const {workBoardCurrentPage, boardGroup, workBoardList, workUserGroupBoardList} = workStore;

    const modelRef = useRef()

    const setStatusStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-item-status-todo";
                break;
            case "progress":
                name = "work-item-status-process";
                break;
            case "done":
                name = "work-item-status-done";
                break;
            default:
                name = "work-item-status-process";
                break;
        }
        return name;
    }

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份补零
        const day = date.getDate().toString().padStart(2, '0'); // 日期补零
        return `${month}月${day}日`;
    }

    const getChildrenCount = (children) => {
        if (!children) return 0;
        if (Array.isArray(children)) return children.length;
        if (typeof children === 'object') return Object.keys(children).length;
        return 0;
    }

    const getDueStatus = (planEndTime) => {
        if (!planEndTime) return null;
        const end = new Date(planEndTime).getTime();
        if (Number.isNaN(end)) return null;
        const now = Date.now();
        const msInDay = 24 * 60 * 60 * 1000;
        const diffDays = (end - now) / msInDay;
        if (diffDays < 0) {
            const overdueDays = Math.floor(Math.abs(diffDays));
            return { type: 'overdue', days: overdueDays };
        }
        if (diffDays <= 3) {
            const leftDays = Math.ceil(diffDays);
            return { type: 'soon', days: leftDays };
        }
        return null;
    }

    return (
        <div className={`work-bodar-content ${loading ? "work-bodar-content-spin" : ""}`}>
            <Spin spinning={loading} tip="加载中">
                {/*<div className="work-bodar-flex">*/}
                    <div className={`work-bodar-list`}>

                        {
                            boardGroup === "nogroup" && workBoardList && workBoardList.map((item, index) => {
                                if (item.state) {
                                    return <div className={`work-bodar-box`}

                                                onDragOver={dragover}
                                                id={`targetBox${index}`}
                                                key={item.state.id}
                                    >
                                        <div className="work-bodar-title">
                                            <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.totalRecord}</span></div>
                                        </div>
                                        {
                                            isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1 ?
                                                <div
                                                    className={`${(isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1) ? "work-bodar-box-border" : ""}`}
                                                    onDrop={() => changeStatus(item.state.id, index)}
                                                >
                                                </div>
                                                :
                                                <>
                                                    <div className="work-border-box-list" onDrop={() => cancelDrag()}>
                                                        {
                                                            item.workItemList.dataList.length > 0 ? item.workItemList.dataList.map((workItem, workIndex) => {
                                                                    return <div
                                                                        className={`work-bodar-item ${moveWorkId === workItem.id ? "work-bodar-item-move" : ""}`}
                                                                        key={workItem.id}
                                                                        onDrag={() => moveWorkItem()}
                                                                        onClick={() => showModal(workItem, workIndex, index)}
                                                                        draggable={"true"}
                                                                        onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                                    >

                                                                        <div className="work-item-icon">
                                                                            <ImgComponent
                                                                                src={workItem.workTypeSys?.iconUrl}
                                                                                alt=""
                                                                                className="icon-15"
                                                                            />
                                                                            <Tooltip title={workItem.title}>
                                                                                <div className="work-item-title">
                                                                                    {workItem.title}
                                                                                </div>
                                                                            </Tooltip>
                                                                        </div>

                                                                        {(() => {
                                                                            if (workItem.parentId) {
                                                                                return (
                                                                                    <Tooltip title={`父事项： ${workItem.parentWorkItem.title}`}>
                                                                                        <div className="work-item-middle">
                                                                                            <svg className="img-icon-right" aria-hidden="true">
                                                                                                <use xlinkHref="#icon-parent"></use>
                                                                                            </svg>
                                                                                            <span className="work-item-parent">{workItem.parentWorkItem.title}</span>
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                )
                                                                            }
                                                                            return null;
                                                                        })()}
                                                                        <div className="work-item-bottom">
                                                                                <div className="work-item-bottom-left">
                                                                                    {/*<div className="work-item-date">*/}
                                                                                    {/*    {parseDate(workItem.buildTime)}*/}
                                                                                    {/*</div>*/}
                                                                                    {/*子事项*/}
                                                                                    {(() => {
                                                                                        const childCount = getChildrenCount(workItem.children);
                                                                                        if (childCount > 0) {
                                                                                            return (
                                                                                                <Tooltip title={`子事项 ${childCount} 个`}>
                                                                                                    <span className="attr-badge">
                                                                                                        <svg className="img-icon-right" aria-hidden="true">
                                                                                                            <use xlinkHref="#icon-child"></use>
                                                                                                        </svg>
                                                                                                        {childCount}
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            )
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                    {/*逾期*/}
                                                                                    {(() => {
                                                                                        const due = getDueStatus(workItem.planEndTime);
                                                                                        if (!due || item.state.id === "done") return null;
                                                                                        if (due.type === 'soon') {
                                                                                            return (
                                                                                                <Tooltip title={`还有 ${due.days} 天到期`}>
                                                                                                    <span className="attr-badge attr-badge--orange">
                                                                                                        <svg className="icon-14" aria-hidden="true">
                                                                                                            <use xlinkHref="#icon-clock-orange"></use>
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            )
                                                                                        }
                                                                                        if (due.type === 'overdue') {
                                                                                            return (
                                                                                                <Tooltip title={`已逾期 ${due.days} 天`}>
                                                                                                    <span className="attr-badge attr-badge--red">
                                                                                                        <svg className="icon-14" aria-hidden="true">
                                                                                                            <use xlinkHref="#icon-clock-red"></use>
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            )
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                    {/*优先级*/}
                                                                                    {(() => {
                                                                                        const val = workItem?.workPriority?.value;
                                                                                        const name = workItem?.workPriority?.name;
                                                                                        const map = { low: 'priority--low', medium: 'priority--medium', high: 'priority--high' };
                                                                                        const cls = map[(val || '').toLowerCase()] || '';
                                                                                        return (
                                                                                            <Tooltip title={`优先级：${name}`}>
                                                                                                <span className={`priority-badge ${cls}`}>{name}</span>
                                                                                            </Tooltip>
                                                                                        )
                                                                                    })()}
                                                                                </div>
                                                                                <div className="work-item-bottom-right">
                                                                                    <UserIcon name={workItem.assigner?.nickname} />
                                                                                    <span>{workItem.assigner?.nickname}</span>
                                                                                </div>
                                                                            </div>

                                                                    </div>
                                                                })
                                                                :
                                                                <>
                                                                    {
                                                                        !loading && <Empty description="暂无事项" />
                                                                    }
                                                                </>

                                                        }
                                                        {
                                                            workBoardCurrentPage.length > 0 && item.workItemList.totalPage > 1 &&
                                                            workBoardCurrentPage[index] < item.workItemList.totalPage &&
                                                            <div className="change-page" onClick={() => changePage(item, index)}>加载更多</div>
                                                        }
                                                    </div>

                                                </>

                                        }
                                    </div>
                                }

                            })
                        }

                    </div>

                    {
                        boardGroup !== "nogroup" && workUserGroupBoardList && workUserGroupBoardList.map((item, index) => {
                                return <div style={{ overflow: "auto", height: "85vh" }}>
                                    <div className="work-bodar-name">{item.user.name}</div>
                                    <div className="work-bodar">
                                        {
                                            item.workBoardList && item.workBoardList.map(workList => {
                                                return <div className="work-bodar-box"
                                                            onDrop={() => changeStatus(workList.state.id, index)}
                                                            onDragOver={dragover}
                                                            id={`targetBox${index}`}
                                                            key={workList.state.id}
                                                    // style={{ height: `${item.length * 83 + 60}px` }}
                                                >
                                                    <div className="work-bodar-title">
                                                        <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.totalRecord} 个事项</span></div>
                                                    </div>
                                                    {
                                                        workList.workItemList.length > 0 && workList.workItemList.map((workItem, workIndex) => {
                                                            return <div
                                                                className="work-bodar-item"
                                                                key={workItem.id}
                                                                onDrag={() => moveWorkItem()}
                                                                draggable="true"
                                                                onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                            >
                                                                <div className="work-item-title" onClick={() => showModal(workItem, workIndex, index)}>
                                                                    <div className="work-item-title-left" >
                                                                        <ImgComponent
                                                                            src={workItem.workTypeSys?.iconUrl}
                                                                            alt=""
                                                                            className="svg-icon"

                                                                        />
                                                                        {workItem.title}
                                                                    </div>
                                                                    <div>
                                                                        <span >{workItem.code}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="work-item-id"
                                                                     onClick={() => showModal(workItem, workIndex, index)}
                                                                >
                                                                    <UserIcon userInfo={workItem.user} name={workItem.user?.name} />
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        )
                    }
                {/*<WorkDetailModalView*/}
                {/*    isModalVisible={isModalVisible}*/}
                {/*    setIsModalVisible={setIsModalVisible}*/}
                {/*    modelRef={modelRef}*/}
                {/*    showPage={true}*/}
                {/*    delectCurrentWorkItem={delectCurrentWorkItem}*/}
                {/*    {...props}*/}
                {/*/>*/}

                <WorkDetailDrawer
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    modelRef={modelRef}
                    showPage={true}
                    delectCurrentWorkItem={delectCurrentWorkItem}
                    {...props}
                />
                {/*</div>*/}
            </Spin>

        </div>
    )
}

export default withRouter(observer(WorkBodarContent));