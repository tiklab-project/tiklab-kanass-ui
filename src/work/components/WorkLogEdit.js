import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Table, Space, InputNumber, Form, Input, Select, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import { getUser } from 'thoughtware-core-ui';
import "./WorkLogEdit.scss";
import dayjs from "dayjs";
import WorkLogStore from "../store/WorkLogStore";
import Button from "../../common/button/Button";
import { withRouter } from "react-router";
const { TextArea } = Input;

const WorkLogEdit = (props) => {
    const {type, setVisible, visible, logId, layout} = props;
    const { workStore } = props;
    const { getWorkLogList, addWorkLog, editWorKLog, searchWorKLog,
        versionTime } = WorkLogStore;
    const { workId } = workStore;
    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const [date, setDate] = useState(dayjs().format(dateFormat))
    const [modalTitle, setModalTitle] = useState("添加工时")
    const [modalType, setModalType] = useState("add")
    const [remainTime, setRemainTime] = useState(0)
    const [userInfo, setUserInfo] = useState([])
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 表格样式
    const [AddLog] = Form.useForm();
    const labelCol = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
    };

   
    useEffect(() => {
        getGemianTime()
        // setDate(getNowFormatDate())
        return;
    }, [workId])

    useEffect(() => {
        if(visible && type === "edit"){
            searchWorKLog(logId).then((res) => {
                // setDate(res.workDate)
                // setLogId(res.id)
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
        return;
    }, [visible])


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


    // 弹窗添加编辑工时
    const creatLog = () => {
        AddLog.validateFields().then(value => {
            value.projectId = projectId
            value.workItem = workId
            value.user = {
                id: getUser().userId
            }
            if (type === "creat") {
                addWorkLog(value)
                AddLog.resetFields()
            } else {
                value.id = logId;
                editWorKLog(value).then(() => {
                    getGemianTime()
                })
                AddLog.resetFields()
            }
            setVisible(false);
        });

    };




    return (
        <div className="worklog-creat">
            {/* <div className="worklog-creat-title">添加工时</div> */}
            <Form
                {...labelCol}
                name="basic"
                form={AddLog}
                preserve={false}
                layout={layout}
                labelAlign = {"left"}
                initialValues = {{
                    takeupTime: 1
                }}

            >
                <Form.Item
                    label="用时"
                    name="takeupTime"
                    rules={[
                        {
                            required: true,
                            message: '请输入用时',
                        },
                    ]}
                >
                    <InputNumber
                        defaultValue={1}
                        style={{ width: '30%', marginRight: "10px" }}
                        formatter={value => `${value}小时`}
                        parser={value => value.replace('小时', '')}
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="工作内容"
                    name="workContent"
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
