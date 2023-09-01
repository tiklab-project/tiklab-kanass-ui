import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Table, Space, Popconfirm, Form, Input, Select, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import { getUser } from 'tiklab-core-ui';
import "./WorkLog.scss";
import dayjs from "dayjs";
import WorkLogStore from "../store/WorkLogStore";
import Button from "../../common/button/Button";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkLogEdit from "./WorkLogEdit"
const { TextArea } = Input;

const WorkLog = (props) => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading] = useState(false);
    const { workStore, planTakeupTime, surplusTime } = props;
    const { getWorkLogList, workLogList, addWorkLog, deleteWorKLog, editWorKLog, searchWorKLog,
        versionTime } = WorkLogStore;
    const { workId, workAllList, getWorkAllList } = workStore;
    const [date, setDate] = useState(dayjs().format(dateFormat))
    const [modalTitle, setModalTitle] = useState("添加工时")
    const [modalType, setModalType] = useState("add")
    const [remainTime, setRemainTime] = useState(0)
    const [userInfo, setUserInfo] = useState([])
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 表格样式
    const [AddLog] = Form.useForm();
    const [editLogId, setEditLogId] = useState()
    const logAction = useRef()

    useEffect(() => {
        getGemianTime()
        // setDate(getNowFormatDate())
        return;
    }, [workId])

    // 获取当前登录用户信息
    const getUserInfo = () => {
        let userInfo = { userId: "", name: "" }
        let user = getUser()
        userInfo.userId = user.userId;
        userInfo.name = user?.nickname ? user?.nickname : user?.name;
        setUserInfo(userInfo)
        AddLog.setFieldsValue({
            user: userInfo.userId
        })
    }

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
        // setModalType("add")
        // setModalTitle("添加工时")
        setVisible(true);
        setEditLogId()
        // getWorkAllList()
        // getUserInfo()
        // AddLog.setFieldsValue(
        //     {
        //         workItem: workId,
        //         workDate: moment(date, dateFormat),
        //         versionTime: versionTime,
        //         surplusTime: remainTime
        //     }
        // )
    };

    // 弹窗添加编辑工时
    const creatLog = () => {
        AddLog.validateFields().then(value => {
            // value.workDate = date
            value.projectId = projectId
            value.workItem = workId
            if (modalType === "add") {
                addWorkLog(value)
                AddLog.resetFields()
            }
            // else {
            //     value.id = logId;
            //     editWorKLog(value).then(() => {
            //         getGemianTime()
            //     })
            //     AddLog.resetFields()
            // }
            setVisible(false);
        });

    };

    // 删除工时
    const delectLog = (id) => {
        deleteWorKLog(id)
    }

    // 点击取消
    const handleCancel = () => {
        setVisible(false);
    };

    // 编辑工时
    const [logId, setLogId] = useState()
    const changeLog = (id) => {
        setModalTitle("编辑工时")
        setModalType("edit")
        setVisible(true);
        searchWorKLog(id).then((res) => {
            setDate(res.workDate)
            setLogId(res.id)
            AddLog.setFieldsValue(
                {
                    workItem: res.workItem.id,
                    workDate: moment(res.workDate, dateFormat),
                    takeupTime: res.takeupTime,
                    workContent: res.workContent,
                    user: res.user.id,
                    surplusTime: remainTime,
                    versionTime: versionTime
                }
            )
        })
    }

    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';

    // 改变页码
    const onChange = (pagination) => {
        getGemianTime(pagination)
    }
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
                        workLogList.map(item => {
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
                                                        <svg className="img-icon" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => showEdit(item.id)}>
                                                            <use xlinkHref="#icon-edit"></use>
                                                        </svg>
                                                        <Popconfirm
                                                            title="确定删除当前工时?"
                                                            onConfirm={() => {deleteWorKLog(item.id)}}
                                                            getPopupContainer = {() => logAction.current}
                                                            okText="是"
                                                            cancelText="否"
                                                            placement="topRight"
                                                        >
                                                            <span>
                                                               <svg className="img-icon" aria-hidden="true" style={{ cursor: "pointer" }} >
                                                                <use xlinkHref="#icon-delete"></use>
                                                            </svg> 
                                                            </span>
                                                            
                                                        </Popconfirm>

                                                    </div>
                                                </div>

                                        }




                                    </div>

                                </div>


                            </>

                        })
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default inject("workStore")(observer(WorkLog));
