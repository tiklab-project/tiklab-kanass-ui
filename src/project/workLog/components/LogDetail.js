/*
 * @Descripttion: 日志详情抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { Drawer } from 'antd';
import "./LogDetail.scss";
import { getUser } from "thoughtware-core-ui";
import { inject, observer } from "mobx-react";
import { EditOutlined } from '@ant-design/icons';
import Button from "../../../common/button/Button";
const { TextArea } = Input;
const LogDetail = (props) => {
    const { logDetailVisable, setLogDetailVisable, logId, listIndex, logStore, getList } = props;
    const { findWorkLog, updateWorkLog, logList, findWorkItemAndUsedTime, updateWorkItem } = logStore;
    // 日志信息
    const [logDetail, setLogDetail] = useState()
    // 用时
    const [takeupTime, setTakeupTime] = useState()

    const [surplusTime, setSurplusTime] = useState()
    const [isCustomSurplusTime, setIsCustomSurplusTime] = useState(false)
    // 修改日志的字段key
    const [fieldName, setFieldName] = useState("")
    // 日志内容
    const [workContent, setWorkContent] = useState()

    const [workItem, setWorkItem] = useState()
    const [progressPercent, setProgressPercent] = useState(0)
    const [overPercent, setOverPercent] = useState(0)
    const [edit, setEdit] = useState(false)
    // 登录人id
    const userId = getUser().userId;
    // 渲染dom
    const logDetailRef = useRef();

    /**
     * 挂载监听点击事件
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [])

    /**
     * 点击抽屉之外的地方关闭抽屉
     * @param {抽屉dom} e 
     * @returns 
     */
    const closeModal = (e) => {
        if (!logDetailRef.current) {
            return;
        }
        if (!logDetailRef.current.contains(e.target) && logDetailRef.current !== e.target) {
            setLogDetailVisable(false)
        }
    }

    /**
     * 查找日志信息
     */
    useEffect(() => {
        if (logDetailVisable) {
            initPage()
            setEdit(false)
        }
        return;
    }, [logDetailVisable])

    const initPage = () => {
        findWorkLog({ id: logId }).then(res => {
            setLogDetail(res.data)
            setTakeupTime(res.data.takeupTime)
            setWorkContent(res.data.workContent)
            findWorkItemAndUsedTime({ id: res.data.workItem.id }).then(res => {
                if (res.code === 0) {
                    setWorkItem(res.data)
                    const workInfo = res.data;
                    const estimateTime = workInfo.estimateTime;
                    const surplusTime = workInfo.surplusTime;
                    setSurplusTime(surplusTime)
                    const usedTime = workInfo.usedTime;
                    const overTime = usedTime - estimateTime;

                    if (overTime >= 0) {
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
        })
    }
    /**
     * 关闭日志详情抽屉
     */
    const onClose = () => {
        setLogDetailVisable(false);
    };

    /**
     * 修改日志
     * @param {修改值} value 
     * @param {字段} field 
     */
    const changeTakeupTime = (value) => {
        const time = value.target.value;
        setTakeupTime(time)

        if(!isCustomSurplusTime){
            const surplus = surplusTime - (time - takeupTime);
            setSurplusTime(surplus)
        }
        
        
    }

    const changeSurplusTime = (value) => {
        const time = value.target.value;
        setSurplusTime(time)
        setIsCustomSurplusTime(true)
    }

    const submit = () => {
        const params = {
            ...logDetail,
            id: logId,
            takeupTime: takeupTime,
            workContent: workContent,
            
        }
        updateWorkLog(params).then(res => {
            if(res.code === 0){
                const workParams = {
                    id: workItem.id,
                    surplusTime: surplusTime,
                    updateField: "surplusTime"
                }
                updateWorkItem(workParams).then(data => {
                    if(data.code === 0){
                        getList()
                        setIsCustomSurplusTime(false)
                        setEdit(false)
                        initPage()
                    }
                })
               
            }
        })
    }

    return (
        <div ref={logDetailRef}>
            <Drawer
                title="工时详情"
                placement="right"
                onClose={onClose}
                visible={logDetailVisable}
                width={500}
                mask={false}
                className="log-detail-drawer"
                getContainer={false}
            >
                <div className="work-log-static">
                    <div className="log-static-item">
                        <div className="log-static-item-title">预估工时</div>
                        <div className="log-static-item-num">{workItem?.estimateTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">已记录</div>
                        <div className="log-static-item-num">{workItem?.usedTime} <span className="unit">小时</span></div>
                    </div>
                    <div className="log-static-item">
                        <div className="log-static-item-title">剩余工时</div>
                        <div className="log-static-item-num">{workItem?.surplusTime} <span className="unit">小时</span></div>
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
                {
                    logDetail && <div className="log-detail">
                        <div className="log-detail-item">
                            <div className="log-detail-label">
                                <div>所属事项</div>
                                {
                                    userId === logDetail.user.id && <div className="log-edit" onClick={() => setEdit(true)}>
                                        <EditOutlined style={{ fontSize: "16px", color: "var(--thoughtware-gray-500)" }} />
                                    </div>
                                }
                            </div>
                            <div className="log-detail-content">{logDetail?.workItem?.title}</div>
                        </div>
                        <div className="log-detail-item">
                            <div className="log-detail-label">所属项目</div>
                            <div className="log-detail-content">{logDetail?.project?.projectName}</div>
                        </div>
                        <div className="log-detail-item">
                            <div className="log-detail-label">登记人</div>
                            <div className="log-detail-content">{logDetail?.user?.nickname}</div>
                        </div>
                        <div className="log-detail-item">
                            <div className="log-detail-label">登记时间</div>
                            <div className="log-detail-content">{logDetail?.workDate}</div>
                        </div>

                        <div className="log-detail-item">
                            <div className="log-detail-label">登记工时</div>
                            {
                                edit ? <Input
                                    suffix="小时"
                                    type="number"
                                    style={{ width: "100px" }}
                                    value={takeupTime}
                                    onChange={(value) => changeTakeupTime(value)}
                                />
                                    :
                                    <div className="log-detail-content">{logDetail?.takeupTime}</div>
                            }
                        </div>
                        <div className="log-detail-item">
                            <div className="log-detail-label">剩余时间</div>
                            {
                                edit ? <Input
                                    suffix="小时"
                                    type="number"
                                    style={{ width: "100px" }}
                                    value={surplusTime}
                                    onChange={(value) => changeSurplusTime(value)}
                                />
                                    :
                                    <div className="log-detail-content">{workItem?.surplusTime}</div>
                            }
                        </div>
                        <div className="log-detail-item">
                            <div className="log-detail-label">工作内容</div>
                            {
                                edit ?

                                    <TextArea
                                        rows={3}
                                        value={workContent}
                                        onChange={(value) => setWorkContent(value.target.value)}
                                    />
                                    :
                                    <div className="log-detail-content">{logDetail?.workContent}</div>
                            }
                        </div>
                        {
                            edit && <div className="log-submit-botton">
                                <Button onClick = {() => setEdit(false)}> 取消 </Button>
                                <Button type="primary" onClick = {() => submit()}> 确定 </Button>
                            </div>
                        }

                    </div>
                }

            </Drawer>
        </div>

    );
};

export default inject("logStore")(observer(LogDetail));