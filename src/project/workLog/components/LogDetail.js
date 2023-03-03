/*
 * @Descripttion: 日志详情抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { Button, Drawer } from 'antd';
import "./LogDetail.scss";
import { getUser } from "tiklab-core-ui";
const { TextArea } = Input;
const LogDetail = (props) => {
    const { logDetailVisable, setLogDetailVisable, logId, listIndex, logStore } = props;
    const { findWorkLog, updateWorkLog, logList } = logStore;
    // 日志信息
    const [logDetail, setLogDetail] = useState()
    // 用时
    const [takeupTime, setTakeupTime] = useState()
    // 修改日志的字段key
    const [fieldName, setFieldName] = useState("")
    // 日志内容
    const [workContent, setWorkContent] = useState()
    // 登录人id
    const userId = getUser().userId;

    /**
     * 查找日志信息
     */
    useEffect(() => {
        if (logDetailVisable) {
            findWorkLog({ id: logId }).then(res => {
                setLogDetail(res.data)
                setTakeupTime(res.data.takeupTime)
                setWorkContent(res.data.workContent)
            })
        }

    }, [logDetailVisable])

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
    const changeWorkLog = (value, field) => {
        if (field === "takeupTime") {
            setTakeupTime(value.target.value)
            const params = {
                id: logDetail.id,
                takeupTime: value.target.value
            }
            updateWorkLog(params).then(res => {
                if(res.code === 0){
                    logList[listIndex].takeupTime = value.target.value
                }
            })
        }
        if (field === "workContent") {
            setWorkContent(value.target.value)
            const params = {
                id: logDetail.id,
                workContent: value.target.value
            }
            updateWorkLog(params).then(res => {
                if(res.code === 0){
                    logList[listIndex].workContent = value.target.value
                }
            })
        }

    }


    return (
        <Drawer
            title="日志详情"
            placement="right"
            onClose={onClose}
            visible={logDetailVisable}
            width={300}
        >
            {
                logDetail && <div className="log-detail">
                    <div className="log-detail-item">
                        <div className="log-detail-label">所属事项</div>
                        <div className="log-detail-content">{logDetail?.workItem?.title}</div>
                    </div>
                    <div className="log-detail-item">
                        <div className="log-detail-label">所属项目</div>
                        <div className="log-detail-content">{logDetail?.project?.projectName}</div>
                    </div>
                    <div className="log-detail-item">
                        <div className="log-detail-label">填写人</div>
                        <div className="log-detail-content">{logDetail?.user?.name}</div>
                    </div>
                    <div className="log-detail-item">
                        <div className="log-detail-label">记录时间</div>
                        <div className="log-detail-content">{logDetail?.workDate}</div>
                    </div>

                    <div className="log-detail-item">
                        <div className="log-detail-label">工时</div>
                        {
                            userId === logDetail.user.id ? <Input
                                suffix="小时"
                                type="number"
                                style={{ width: "100px", marginLeft: "-10px" }}
                                value={takeupTime}
                                onChange={(value) => changeWorkLog(value, "takeupTime")}
                                onFocus={() => setFieldName("takeupTime")}
                                onBlur={() => setFieldName("")}
                                onMouseEnter={() => setFieldName("takeupTime")}
                                onMouseLeave={() => setFieldName("")}
                                bordered={fieldName === "takeupTime" ? true : false}
                            />
                                :
                                <div className="log-detail-content">{logDetail?.takeupTime}</div>
                        }


                    </div>
                    <div className="log-detail-item">
                        <div className="log-detail-label">工作内容</div>
                        {
                            userId === logDetail.user.id ?
                                
                                <TextArea
                                    rows={3}
                                    maxLength={6}
                                    value={workContent}
                                    style={{ marginLeft: "-10px" }}
                                    onChange={(value) => changeWorkLog(value, "workContent")}
                                    onFocus={() => setFieldName("workContent")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setFieldName("workContent")}
                                    onMouseLeave={() => setFieldName("")}
                                    bordered={fieldName === "workContent" ? true : false}
                                />
                                :
                                <div className="log-detail-content">{logDetail?.workContent}</div>
                        }
                    </div>

                </div>
            }

        </Drawer>
    );
};

export default LogDetail;