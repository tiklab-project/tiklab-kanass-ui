import React, { useEffect, useState, useRef, Fragment } from "react";
import { Modal, Button, Table, Space, InputNumber, Form, Input, Select, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import { getUser } from 'tiklab-core-ui';
import "./WorkLog.scss";
import dayjs from "dayjs";
const { TextArea } = Input;

const WorkLog = (props) => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading] = useState(false);
    const { workLogStore, workStore, planTakeupTime, surplusTime } = props;
    const { getWorkLogList, workLogList, addWorkLog, deleteWorKLog, editWorKLog, searchWorKLog,
        versionTime } = workLogStore;
    const { workId, workAllList, getWorkAllList } = workStore;
    const [date, setDate] = useState(dayjs().format(dateFormat))
    const [modalTitle, setModalTitle] = useState("添加工时")
    const [modalType, setModalType] = useState("add")
    const [remainTime, setRemainTime] = useState(0)
    const [userInfo, setUserInfo] = useState([])
    const projectId = props.match.params.id ? props.match.params.id : null;
    // 表格样式
    const [AddLog] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 24 },
    };

    const columns = [
        {
            title: '工时内容',
            dataIndex: ['workItem', 'title'],
            key: 'workitem'
        },
        {
            title: '记录人',
            dataIndex: ['user', 'name'],
            key: 'user',
        },
        {
            title: '记录日期',
            dataIndex: 'workDate',
            key: 'workDate',
        },
        {
            title: '用时',
            dataIndex: 'takeupTime',
            key: 'takeuptime',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "15%",
            render: (text, record) => (
                <Space size="middle">
                    <span onClick={() => changeLog(record.id)} className="span-botton" >编辑</span>
                    <span onClick={() => delectLog(record.id)} className="span-botton" >删除</span>
                </Space>
            ),
        }
    ];

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
        userInfo.name = user?.nickname ? user?.nickname :  user?.name;
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
        setModalType("add")
        setModalTitle("添加工时")
        setVisible(true);
        getWorkAllList()
        getUserInfo()
        AddLog.setFieldsValue(
            {
                workItem: workId,
                workDate: moment(date, dateFormat),
                versionTime: versionTime,
                surplusTime: remainTime
            }
        )
    };

    // 弹窗添加编辑工时
    const handleOk = () => {
        AddLog.validateFields().then(value => {
            value.workDate = date
            value.projectId = projectId
            value.workItem = workId
            if (modalType === "add") {
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

    return (
        <Fragment>
            <Modal
                title={modalTitle}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                destroyOnClose={true}
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    form={AddLog}
                    preserve={false}
                    layout="vertical"

                >
                    <Form.Item
                        label="事项"
                        name="workItem"
                        rules={[
                            {
                                required: true,
                                message: "请选择事项",
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            disabled={true}
                        >
                            {
                                workAllList && workAllList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                   
                    <Form.Item
                        label="剩余用时"
                        name="surplusTime"
                    >
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "40px" }}>{surplusTime ? surplusTime : 0}</div>
                            <div style={{ width: "20px" }}>/</div>
                            <div style={{ width: "40px" }}>{planTakeupTime ? planTakeupTime : 0}</div> 小时
                        </div>
                    </Form.Item>

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
                        <InputNumber style={{ width: '30%', marginRight: "10px" }} /> 
                    </Form.Item>小时
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
            </Modal>
            <div className="work-log">
                <div className="worklog-top" style={{ width: "100%", textAlign: "right" }}>
                    <div className="worklog-top-title">工时({workLogList.length})</div>
                    <Button onClick={showModal}>
                        添加工时
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={workLogList}
                    rowKey={(record) => record.id}
                    onChange={onChange}
                    pagination={false}
                    className="worklog-table"
                />
            </div>
        </Fragment>
    );
}

export default inject(
    "workLogStore",
    "workStore"
)(observer(WorkLog));
