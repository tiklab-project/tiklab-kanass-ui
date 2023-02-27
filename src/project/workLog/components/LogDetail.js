import React, { useState, useEffect, useRef, useImperativeHandle, Fragment } from "react";
import { Input } from "antd";
import { Button, Drawer } from 'antd';
import "./LogDetail.scss";
import { getUser } from "tiklab-core-ui";
const { TextArea } = Input;
const LogDetail = (props) => {
    const { logDetailVisable, setLogDetailVisable, logId, listIndex, logStore } = props;
    const { findWorkLog, updateWorkLog, logList } = logStore;
    const [logDetail, setLogDetail] = useState()
    const [takeupTime, setTakeupTime] = useState()
    const [fieldName, setFieldName] = useState("")
    const [workContent, setWorkContent] = useState()
    const userId = getUser().userId;
    useEffect(() => {
        if (logDetailVisable) {
            findWorkLog({ id: logId }).then(res => {
                setLogDetail(res.data)
                setTakeupTime(res.data.takeupTime)
                setWorkContent(res.data.workContent)
            })
        }

    }, [logDetailVisable])
    const onClose = () => {
        setLogDetailVisable(false);
    };

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
                        <div className="log-detail-content">{logDetail?.worker?.name}</div>
                    </div>
                    <div className="log-detail-item">
                        <div className="log-detail-label">记录时间</div>
                        <div className="log-detail-content">{logDetail?.workDate}</div>
                    </div>

                    <div className="log-detail-item">
                        <div className="log-detail-label">工时</div>
                        {
                            userId === logDetail.worker.id ? <Input
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
                            userId === logDetail.worker.id ?
                                
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