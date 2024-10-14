import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Table, Space, InputNumber, Form, Input, Select, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import { getUser } from 'tiklab-core-ui';
import "./WorkLogEdit.scss";
import WorkLogStore from "../store/WorkLogStore";
import Button from "../../common/button/Button";
import { withRouter } from "react-router";
const { TextArea } = Input;

const WorkLogEdit = (props) => {
    const { modalType, setVisible, visible, editLogId, layout, logInfo } = props;
    console.log(modalType)
    const { workStore, workInfo } = props;
    const { getWorkLogList, addWorkLog, editWorKLog, searchWorKLog,
        versionTime, findWorkItemAndUsedTime } = WorkLogStore;
    const { workId, editWork } = workStore;
    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
   
    // 用时
    const [takeupTime, setTakeupTime] = useState(0)
    // 剩余时间
    const [surplusTime, setSurplusTime] = useState(0)
    const [isCustomSurplusTime, setIsCustomSurplusTime] = useState(false)

    // const projectId = props.match.params.id ? props.match.params.id : null;
    // 表格样式
    const [addLog] = Form.useForm();
    const labelCol = {
        labelCol: { span: 3 },
        wrapperCol: { span: 24 },
    };


    useEffect(() => {
        if(visible){
            getGemianTime()
        }
        return;
    }, [visible])



    // 计算剩余时间
    const getGemianTime = () => {
        findWorkItemAndUsedTime({ id: workId }).then(res => {
            if (res.code === 0) {
                const info = res.data;
                const workSurplusTime = info.surplusTime
                const surplus = workSurplusTime - takeupTime;
                setSurplusTime(workSurplusTime)
                setIsCustomSurplusTime(false)
                addLog.setFieldsValue({
                    estimateTime: info.estimateTime,
                    usedTime: info.usedTime,
                    surplusTime: surplus < 0 ? 0 : surplus
                })

                console.log(logInfo)
                if(modalType === "edit"){
                    setTakeupTime(logInfo?.takeupTime)
                    addLog.setFieldsValue({
                        takeupTime: logInfo?.takeupTime,
                        workContent: logInfo?.workContent
                    })
                }
            }
        })
    }


    // 弹窗添加编辑工时
    const creatLog = () => {
        addLog.validateFields().then((fieldsValue) => {
            const params = {
                project: workInfo.project,
                workItem: {
                    id: workId
                },
                user: {
                    id: getUser().userId
                },
                takeupTime: fieldsValue.takeupTime,
                workContent: fieldsValue.workContent
            }
            addWorkLog(params).then(res => {
                setVisible(false)
            })

            const workParams = {
                id: workId,
                surplusTime : fieldsValue.surplusTime,
                updateField : "surplusTime"
            }
            editWork(workParams).then(res => {
                console.log(res)
            })
        })

    };

    const changeTakeupTime = (value) => {
        const time = value.target.value;
        // setTakeupTime(time)

        if (!isCustomSurplusTime) {
            
            if(modalType === "edit"){
                const surplus = surplusTime - (time - takeupTime);
                addLog.setFieldsValue({
                    surplusTime: surplus < 0 ? 0 : surplus
                })
            }else {
                const surplus = surplusTime - time;
                addLog.setFieldsValue({
                    surplusTime: surplus < 0 ? 0 : surplus
                })
            }
        }

    }

    return (
        <div className="worklog-creat">
            <Form
                name="basic"
                form={addLog}
                preserve={false}
                layout={layout}
                labelAlign={"left"}

            >
                <div className="log-add-time">
                    <Form.Item
                        label="预估用时"
                        name="estimateTime"
                        className="log-form-item"
                    >
                        <Input min={0} disabled={true} type="number" key="estimateTime" suffix="小时" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="已用时"
                        name="usedTime"
                        className="log-form-item"
                    >
                        <Input min={0} disabled={true} type="number" key="surplusTime" suffix="小时" style={{ width: '100%' }} />
                    </Form.Item>
                </div>
                <div className="log-add-time">
                    <Form.Item
                        label="登记用时"
                        name="takeupTime"
                        className="log-form-item"
                        rules={[
                            {
                                required: true,
                                message: '登记用时不能为空',
                            },
                        ]}

                    >
                        <Input
                            min={0}
                            type="number"
                            key="surplusTime"
                            suffix="小时"
                            style={{ width: '100%' }}
                            onBlur={(value) => changeTakeupTime(value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="剩余用时"
                        name="surplusTime"
                        className="log-form-item"
                        rules={[
                            {
                                required: true,
                                message: '剩余用时不能为空',
                            },
                        ]}
                    >
                        <Input
                            min={0}
                            type="number"
                            key="surplusTime"
                            suffix="小时"
                            style={{ width: '100%' }}
                            onChange={() => setIsCustomSurplusTime(true)}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="工作内容"
                    name="workContent"
                    {...labelCol}
                    rules={[
                        {
                            required: true,
                            message: '请输入工作内容',
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
            <div className="worklog-creat-button">
                <Button onClick={() => setVisible(false)}>取消</Button>
                <Button type={"primary"} onClick={() => creatLog()}>确定</Button>
            </div>
        </div>
    );
}

export default withRouter(inject("workStore")(observer(WorkLogEdit)));
