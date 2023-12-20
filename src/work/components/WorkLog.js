import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Table, Space, Popconfirm, Form, Input, Select, Row, Col, Empty } from 'antd';
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
    const { workStore } = props;
    const { getWorkLogList, workLogList, deleteWorKLog, versionTime } = WorkLogStore;
    const { workId } = workStore;
    const [remainTime, setRemainTime] = useState(0)
    const [editLogId, setEditLogId] = useState()
    const logAction = useRef()

    useEffect(() => {
        getGemianTime()
        return;
    }, [workId])

    // 计算剩余时间
    const getGemianTime = (page) => {
        getWorkLogList({ workItemId: workId }, page).then((res) => {
            let useTime = 0;
            if (res.length > 0) {
                res.map((item) => {
                    useTime += parseInt(item.takeupTime)
                })
                setRemainTime(parseInt(versionTime) - useTime)
            }
        })
    }

    const showModal = () => {
        setVisible(true);
        setEditLogId()
    };

    const workLog = useRef();
    const showEdit = (id) => {
        setEditLogId(id)
        setVisible(true)
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
                {
                    visible && !editLogId &&
                    <div style={{ marginBottom: "30px" }}>
                        <WorkLogEdit setVisible={setVisible} visible={visible} type="creat" layout={"vertical"} />
                    </div>

                }


                {/* <div className="worklog-table-title">工时列表</div> */}
                <div className="work-log-list">

                    {
                        workLogList.length > 0 ? workLogList.map(item => {
                            return <>
                                <div className="work-log-item">
                                    <div style={{ flex: 1 }}>
                                        <div className="work-log-item-first">
                                            <div className="work-log-item-user">
                                                <UserIcon>{item.user.nickname}</UserIcon>
                                                <span className="log-item-text">{item.user.nickname}</span>
                                            </div>
                                            <div className="log-item-date">{item.workDate}</div>

                                        </div>
                                        {
                                            editLogId === item.id && visible ?
                                                <>
                                                    <div style={{ marginLeft: "26px" }}>
                                                        <WorkLogEdit setVisible={setVisible} visible={visible} type="edit" layout={"horizontal"} logId={item.id} />
                                                    </div>

                                                </>
                                                :
                                                <div className="work-log-item-second">
                                                    <div>
                                                        <div className="log-content">用时： {item.takeupTime} 小时</div>
                                                        <div className="log-content">{item.workContent}</div>
                                                    </div>

                                                    <div className="log-action" ref = {logAction}>
                                                        <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => showEdit(item.id)}>
                                                            <use xlinkHref="#icon-edit"></use>
                                                        </svg>
                                                        {/* <Popconfirm
                                                            title="确定删除当前工时?"
                                                            onConfirm={() => {deleteWorKLog(item.id)}}
                                                            getPopupContainer = {() => logAction.current}
                                                            okText="是"
                                                            cancelText="否"
                                                            placement="topRight"
                                                        >
                                                            <span>
                                                               <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer" }} >
                                                                <use xlinkHref="#icon-delete"></use>
                                                            </svg> 
                                                            </span>
                                                            
                                                        </Popconfirm> */}
                                                        <DeleteModal deleteFunction = {deleteWorKLog} id= {item.id} getPopupContainer = {workLog.current}/>

                                                    </div>
                                                </div>

                                        }
                                    </div>

                                </div>


                            </>

                        })
                        :
                        <Empty image="/images/nodata.png" description="暂时没有工时记录~" />
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default inject("workStore")(observer(WorkLog));
