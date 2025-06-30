
/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:45:13
 * @Description: 事项工时记录
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { observer, inject } from "mobx-react";
import "./WorkLog.scss";
import WorkLogStore from "../store/WorkLogStore";
import UserIcon from "../../common/UserIcon/UserIcon";
import DeleteModal from "../../common/deleteModal/deleteModal";
import LogAdd from "../../project/workLog/components/LogAdd";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
import {Button} from "antd";
import WorkLogMoreDrawer from "./WorkLogMoreDrawer";


const WorkLog = (props) => {
    const { workStore, closeModal, workInfo } = props;
    const { findWorkLogPage, workLogList, deleteWorKLog, findWorkItemAndUsedTime } = WorkLogStore;
    const [progressPercent, setProgressPercent] = useState(0)
    const [overPercent, setOverPercent] = useState(0)
    const { workId } = workStore;
    const [modalType, setModalType] = useState()
    const [logInfo, setLogInfo] = useState();
    const logAction = useRef()
    const [showLogAdd, setShowLogAdd] = useState(false)
    const [workItem, setWorkItem] = useState(workInfo)

    const [displayedLogs, setDisplayedLogs] = useState([]);
    const [logList, setLogList] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);

    useEffect(() => {
        findWorkLogList()
        return;
    }, [workId])


    /**
     * 获取事项工时，计算逾期时间比例，进度
     */
    const getGemianTime = () => {
        findWorkItemAndUsedTime({ id: workId }).then(res => {
            if (res.code === 0) {
                const workInfo = res.data;
                setWorkItem(res.data)
                const estimateTime = workInfo.estimateTime;
                const surplusTime = workInfo.surplusTime;
                const usedTime = workInfo.usedTime;
                const overTime = usedTime - estimateTime;

                if (overTime >= 0) {
                    const overPress = overTime / (surplusTime + usedTime);
                    setOverPercent((overPress * 100).toFixed(2))
                    const uerPress = estimateTime / (surplusTime + usedTime);
                    setProgressPercent((uerPress * 100).toFixed(2))
                } else {
                    const uerPress = usedTime / estimateTime;
                    setProgressPercent((uerPress * 100).toFixed(2))
                }
            }
        })

    }

    /**
     * 获取事项工时列表
     */
    const findWorkLogList = () => {
        findWorkLogPage({ workItemId: workId }).then(res => {
            setDisplayedLogs(res.data.dataList.slice(0, 3))
            if (res.data.dataList.length > 3){
                setHasMore(true)
            }
            setLogList(res.data.dataList)
        })
        getGemianTime()
    }

    const showMore = () => {
        setMoreDrawerVisible(true)
    };

    /**
     * 显示添加工时抽屉
     */
    const showModal = () => {
        setShowLogAdd(true);
        setModalType("add")
    };

    const workLog = useRef();

    /**
     * 显示编辑工时状态
     */
    const showEdit = (item) => {
        setShowLogAdd(true)
        setModalType("edit")
        setLogInfo(item)
    }

    /**
     * 删除工时
     */
    const deleteLog = (id) => {
        deleteWorKLog(id).then(res => {
            findWorkLogList()
        })
    }

    return (
        <Fragment>

            <div className="other-title other-title-button">
                工时信息:
                {/*<WorkPrivilegeComponent workId={workId} code="WorkLogsAdd">*/}
                    <Button className="other-title-add-button" type="text" onClick={showModal}>
                        <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}>
                            <use xlinkHref="#icon-add2"></use>
                        </svg>
                        添加工时
                    </Button>
                {/*</WorkPrivilegeComponent>*/}
            </div>

            <div className="work-log" ref={workLog}>

                {/*<div className="worklog-top" style={{ width: "100%", textAlign: "right" }}>*/}
                {/*    */}
                {/*</div>*/}
                {/*<div className="work-log-static">*/}
                {/*    <div className="log-static-item">*/}
                {/*        <div className="log-static-item-title">预估工时</div>*/}
                {/*        <div className="log-static-item-num">{workItem.estimateTime} <span className="unit">小时</span></div>*/}
                {/*    </div>*/}
                {/*    <div className="log-static-item">*/}
                {/*        <div className="log-static-item-title">已记录</div>*/}
                {/*        <div className="log-static-item-num">{workItem.usedTime} <span className="unit">小时</span></div>*/}
                {/*    </div>*/}
                {/*    <div className="log-static-item">*/}
                {/*        <div className="log-static-item-title">剩余工时</div>*/}
                {/*        <div className="log-static-item-num">{workItem.surplusTime} <span className="unit">小时</span></div>*/}
                {/*    </div>*/}
                {/*    <div className="log-static-progress">*/}
                {/*        <div className="log-static-item-title">进度</div>*/}
                {/*        <div className="log-static-item-num">*/}
                {/*            <div className="log-percent">*/}
                {/*                <div*/}
                {/*                    className="log-percent-blue"*/}
                {/*                    style={{*/}
                {/*                        width: `${progressPercent}%`,*/}
                {/*                        borderBottomRightRadius: overPercent <= 0 ? '6px' : '0px',*/}
                {/*                        borderTopRightRadius: overPercent <= 0 ? '6px' : '0px'*/}
                {/*                    }}*/}
                {/*                ></div>*/}
                {/*                <div*/}
                {/*                    className="log-percent-red"*/}
                {/*                    style={{*/}
                {/*                        width: `${overPercent}%`,*/}
                {/*                        borderBottomLeftRadius: progressPercent <= 0 ? '6px' : '0px',*/}
                {/*                        borderTopLeftRadius: progressPercent <= 0 ? '6px' : '0px'*/}
                {/*                    }}*/}
                {/*                >*/}

                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="work-log-list">

                    {
                        logList.length > 0 ? logList.map(item => {
                                if (displayedLogs.includes(item)){
                                    return <>
                                        <div className="work-log-item" key={item.id}>
                                            <div style={{ flex: 1 }}>
                                                <div className="work-log-item-first">
                                                    <div className="work-log-item-user">
                                                        <UserIcon size="big" name={item.user.nickname}/>
                                                        <span className="log-item-text">{item.user.nickname} 记录了 {item.takeupTime} 小时</span>
                                                    </div>
                                                    <div className="log-item-date">{item.workDate}</div>

                                                </div>
                                                <div className="work-log-item-second">
                                                    <div className="log-content">{item.workContent}</div>

                                                    <div className="log-action" ref={logAction}>
                                                        <WorkPrivilegeComponent workId={workId} code="WorkLogEdit">
                                                            <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}
                                                                 onClick={() => showEdit(item)}>
                                                                <use xlinkHref="#icon-edit"></use>
                                                            </svg>
                                                        </WorkPrivilegeComponent>
                                                        <WorkPrivilegeComponent workId={workId} code="WorkLogDelete">
                                                            <DeleteModal deleteFunction={deleteLog} id={item.id} getPopupContainer={workLog.current} />
                                                        </WorkPrivilegeComponent>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </>
                                }

                            })
                            :
                            <ProjectEmpty description="暂时没有工时记录~" />
                    }
                    {
                        hasMore && <div className="work-log-more" onClick={showMore}> --查看更多-- </div>
                    }
                </div>

                <LogAdd
                    page="workDetail"
                    workId={workId}
                    closeModal={closeModal}
                    showLogAdd={showLogAdd}
                    setShowLogAdd={setShowLogAdd}
                    modalType={modalType}
                    findWorkLogList={findWorkLogList}
                    logInfo={logInfo}
                />

                <WorkLogMoreDrawer
                    moreDrawerVisible={moreDrawerVisible}
                    setMoreDrawerVisible={setMoreDrawerVisible}
                    workId={workId}
                    showEdit={showEdit}
                    deleteLog={deleteLog}
                    workLog={workLog}
                />
            </div>

        </Fragment>
    );
}

export default inject("workStore")(observer(WorkLog));

