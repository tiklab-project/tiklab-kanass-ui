import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Table, Space, Popconfirm, Form, Input, Select, Row, Col, Empty, Progress } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import { getUser } from 'thoughtware-core-ui';
import "./WorkLog.scss";
import dayjs from "dayjs";
import WorkLogStore from "../store/WorkLogStore";
import Button from "../../common/button/Button";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkLogEdit from "./WorkLogEdit";
import DeleteModal from "../../common/deleteModal/deleteModal";

const WorkLog = (props) => {
    const [visible, setVisible] = useState(false);
    const { workStore, workInfo } = props;
    const { getWorkLogList, workLogList, deleteWorKLog, } = WorkLogStore;
    const { workId } = workStore;
    const [editLogId, setEditLogId] = useState()
    const [modalType, setModalType] = useState()
    const [logInfo, setLogInfo] = useState();
    const logAction = useRef()

    useEffect(() => {
        getGemianTime()
        return;
    }, [workId])

    // 计算剩余时间
    const getGemianTime = (page) => {
        getWorkLogList({ workItemId: workId }, page)
        // .then((res) => {
        //     let useTime = 0;
        //     if (res.length > 0) {
        //         res.map((item) => {
        //             useTime += parseInt(item.takeupTime)
        //         })
        //         setRemainTime(parseInt(versionTime) - useTime)
        //     }
        // })
    }

    const showModal = () => {
        setVisible(true);
        setEditLogId()
        setModalType("add")
    };

    const workLog = useRef();
    const showEdit = (item) => {
        setEditLogId(item.id)
        setVisible(true)
        setModalType("edit")
        setLogInfo(item)
    }
    return (
        <Fragment>

            <div className="work-log" ref={workLog}>
                <div className="worklog-top" style={{ width: "100%", textAlign: "right" }}>
                    <div className="worklog-top-title">工时({workLogList.length})</div>
                    {
                        !visible && <Button onClick={showModal} type={"primary"}>
                            添加工时
                        </Button>
                    }

                </div>
                {
                    visible &&
                    <div style={{ marginBottom: "30px" }}>
                        <WorkLogEdit
                            setVisible={setVisible}
                            workInfo={workInfo}
                            visible={visible} 
                            layout={"vertical"} 
                            editLogId = {editLogId}
                            modalType = {modalType}
                            logInfo = {logInfo}
                        />
                    </div>
                }

                <div className="work-log-static">
                    <div className="log-static-item">
                        <div className="log-static-item-title">预估工时</div>
                        <div className="log-static-item-num">{workInfo.estimateTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">已记录</div>
                        <div className="log-static-item-num">{workInfo.usedTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">剩余工时</div>
                        <div className="log-static-item-num">{workInfo.surplusTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-progress">
                        <div className="log-static-item-title">进度</div>
                        <div className="log-static-item-num">
                           <Progress percent={30} size="small" />
                        </div>
                    </div>
                </div>
                {
                    !visible && <div className="work-log-list">

                        {
                            workLogList.length > 0 ? workLogList.map(item => {
                                return <>
                                    <div className="work-log-item">
                                        <div style={{ flex: 1 }}>
                                            <div className="work-log-item-first">
                                                <div className="work-log-item-user">
                                                    <UserIcon size="big">{item.user.nickname}</UserIcon>
                                                    <span className="log-item-text">{item.user.nickname} 记录了 {item.takeupTime} 小时</span>
                                                </div>
                                                <div className="log-item-date">{item.workDate}</div>

                                            </div>
                                            {/* {
                                                editLogId === item.id && visible ?
                                                    <>
                                                        <div style={{ marginLeft: "26px" }}>
                                                            <WorkLogEdit
                                                                setVisible={setVisible}
                                                                visible={visible}
                                                                type="edit"
                                                                layout={"horizontal"}
                                                                logId={item.id}
                                                                workInfo={workInfo}
                                                            />
                                                        </div>

                                                    </>
                                                    :
                                                   

                                            } */}
                                            <div className="work-log-item-second">
                                                <div className="log-content">{item.workContent}</div>

                                                <div className="log-action" ref={logAction}>
                                                    <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }} 
                                                        onClick={() => showEdit(item)}>
                                                        <use xlinkHref="#icon-edit"></use>
                                                    </svg>
                                                    <DeleteModal deleteFunction={deleteWorKLog} id={item.id} getPopupContainer={workLog.current} />

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
                }

            </div>
        </Fragment>
    );
}

export default inject("workStore")(observer(WorkLog));
