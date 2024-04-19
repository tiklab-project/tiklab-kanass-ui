import React, { useEffect, useState, useRef, Fragment } from "react";
import { Empty, Progress } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkLog.scss";
import WorkLogStore from "../store/WorkLogStore";
import Button from "../../common/button/Button";
import UserIcon from "../../common/UserIcon/UserIcon";
import DeleteModal from "../../common/deleteModal/deleteModal";
import LogAdd from "../../project/workLog/components/LogAdd";

const WorkLog = (props) => {
    const [visible, setVisible] = useState(false);
    const { workStore, closeModal, workInfo, searchWorkById } = props;
    const { findWorkLogPage, workLogList, deleteWorKLog, findWorkItemAndUsedTime } = WorkLogStore;
    const [progressPercent, setProgressPercent] = useState(0)
    const [overPercent, setOverPercent] = useState(0)
    const { workId } = workStore;
    const [editLogId, setEditLogId] = useState()
    const [modalType, setModalType] = useState()
    const [logInfo, setLogInfo] = useState();
    const logAction = useRef()
    const [showLogAdd, setShowLogAdd] = useState(false)
    const [workItem, setWorkItem] = useState(workInfo)

    useEffect(() => {
        findWorkLogList()
        return;
    }, [workId])

    // 计算剩余时间
    const getGemianTime = () => {
        findWorkItemAndUsedTime({id: workId}).then(res => {
            if(res.code === 0){
                const workInfo  = res.data;
                setWorkItem(res.data)
                const estimateTime = workInfo.estimateTime;
                const surplusTime = workInfo.surplusTime;
                const usedTime = workInfo.usedTime;
                const overTime = usedTime - estimateTime;
        
                if (overTime > 0) {
                    const overPress = overTime / (surplusTime + usedTime);
                    setOverPercent((overPress * 100).toFixed(2))
                    const uerPress = estimateTime / (surplusTime + usedTime);
                    setProgressPercent((uerPress * 100).toFixed(2))
                    console.log(overPress, uerPress)
                } else {
                    const uerPress = usedTime / estimateTime;
                    setProgressPercent((uerPress * 100).toFixed(2))
                }
            }
        })
        
    }

    const findWorkLogList = () => {
        findWorkLogPage({ workItemId: workId })
        getGemianTime()
    }

    const showModal = () => {
        setShowLogAdd(true);
        setEditLogId()
        setModalType("add")
    };

    const workLog = useRef();
    const showEdit = (item) => {
        setEditLogId(item.id)
        setShowLogAdd(true)
        setModalType("edit")
        setLogInfo(item)
    }

    const deleteLog = (id) => {
        deleteWorKLog(id).then(res => {
            findWorkLogList()
        })
    }
    return (
        <Fragment>

            <div className="work-log" ref={workLog}>
               
                <div className="worklog-top" style={{ width: "100%", textAlign: "right" }}>
                    <div className="worklog-top-title">工时({workLogList.length})</div>
                    <Button onClick={showModal} type={"primary"}>
                        添加工时
                    </Button>
                </div>
                <div className="work-log-static">
                    <div className="log-static-item">
                        <div className="log-static-item-title">预估工时</div>
                        <div className="log-static-item-num">{workItem.estimateTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">已记录</div>
                        <div className="log-static-item-num">{workItem.usedTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">剩余工时</div>
                        <div className="log-static-item-num">{workItem.surplusTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-progress">
                        <div className="log-static-item-title">进度</div>
                        <div className="log-static-item-num">
                            <div className="log-percent">
                                <div
                                    className="log-percent-blue"
                                    style={{
                                        width: `${progressPercent}%`,
                                        borderBottomRightRadius: overPercent <= 0 ? '6px' : '0px',
                                        borderTopRightRadius: overPercent <= 0 ? '6px' : '0px'
                                    }}
                                ></div>
                                <div
                                    className="log-percent-red"
                                    style={{
                                        width: `${overPercent}%`,
                                        borderBottomLeftRadius: progressPercent <= 0 ? '6px' : '0px',
                                        borderTopLeftRadius: progressPercent <= 0 ? '6px' : '0px'
                                    }}
                                >

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="work-log-list">

                    {
                        workLogList.length > 0 ? workLogList.map(item => {
                            return <>
                                <div className="work-log-item" key={item.id}>
                                    <div style={{ flex: 1 }}>
                                        <div className="work-log-item-first">
                                            <div className="work-log-item-user">
                                                <UserIcon size="big">{item.user.nickname}</UserIcon>
                                                <span className="log-item-text">{item.user.nickname} 记录了 {item.takeupTime} 小时</span>
                                            </div>
                                            <div className="log-item-date">{item.workDate}</div>

                                        </div>
                                        <div className="work-log-item-second">
                                            <div className="log-content">{item.workContent}</div>

                                            <div className="log-action" ref={logAction}>
                                                <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}
                                                    onClick={() => showEdit(item)}>
                                                    <use xlinkHref="#icon-edit"></use>
                                                </svg>
                                                <DeleteModal deleteFunction={deleteLog} id={item.id} getPopupContainer={workLog.current} />

                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </>

                        })
                            :
                            <Empty image="/images/nodata.png" description="暂时没有工时记录~" />
                    }
                </div>

                <LogAdd
                    page="workDetail"
                    workId={workId}
                    closeModal={closeModal}
                    getContainer={workLog?.current}
                    showLogAdd={showLogAdd}
                    setShowLogAdd={setShowLogAdd}
                    modalType={modalType}
                    findWorkLogList={findWorkLogList}
                    logInfo={logInfo}
                />
            </div>

        </Fragment>
    );
}

export default inject("workStore")(observer(WorkLog));
