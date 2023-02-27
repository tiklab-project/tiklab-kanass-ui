import React, { useState } from "react";
import { Modal, InputNumber, Form, Input, Select } from 'antd';
import { inject, observer } from "mobx-react";
const { TextArea } = Input;

const LogAdd = (props) => {
    const { showLogAdd, setShowLogAdd, logStore } = props;
    const { findWorkItemList, addWorkLog } = logStore;
    const [addLog] = Form.useForm();
    const [workItemList, setWorkItemList] = useState([])
    const [planTakeupTime, setPlanTakeupTime]  = useState(0)
    const [surplusTime, setSurplusTime]  = useState(0)
    const [projectId, setProjectId] = useState()
    const handleOk = () => {
        addLog.validateFields().then((fieldsValue) => {
            console.log(fieldsValue)
            const params = {
                project: {
                    id: projectId
                },
                workItem: {
                    id: fieldsValue.workItem
                },
                takeupTime: fieldsValue.takeupTime,
                workContent: fieldsValue.workContent
            }
            addWorkLog(params).then(res => {
                setShowLogAdd(false)
            })
        })
    }

    const handleCancel = () => {
        setShowLogAdd(false)
    }

    const changeDate = () => { }

    const searchWorkItem = (value) => {
        // findWorkItemList()
        console.log(value)
        if (value) {
            findWorkItemList({ title: value }).then(res => {
                if (res.code === 0) {
                    setWorkItemList(res.data)
                }
            })
        }
    }
    const [value, setValue] = useState();

    const handleChange = (newValue, option) => {
        console.log(newValue, option)
        setPlanTakeupTime(option.planTakeupTime)
        setSurplusTime(option.setSurplusTime)
        setProjectId(option.projectId)
        setValue(newValue);
    };

    return (
        <Modal
            title={"添加日志"}
            visible={showLogAdd}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
            closable={false}
        >
            <Form
                // {...layout}
                name="basic"
                form={addLog}
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
                        showSearch
                        value={value}
                        onSearch={searchWorkItem}
                        onChange={handleChange}
                        optionFilterProp='children'
                    >
                        {
                            workItemList.length > 0 && workItemList.map((item) => {
                                return <Select.Option 
                                    value={item.id} 
                                    key={item.id} 
                                    projectId={item.project.id}
                                    surplusTime = {item.surplusTime}
                                    planTakeupTime = {item.planTakeupTime}
                                >{item.title}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                {/* <Form.Item
                    label="记录人"
                    name="worker"
                    rules={[
                        {
                            required: true,
                            message: '请填写记录人',
                        },
                    ]}
                >
                    <Select
                        allowClear
                    >
                        <Select.Option value={userInfo.userId} key={userInfo.userId}>{userInfo.name}</Select.Option>
                    </Select>
                </Form.Item> */}

                {/* <Form.Item
                    label="记录时间"
                    name="workDate"
                    rules={[
                        {
                            required: true,
                            message: '请选择记录时间',
                        },
                    ]}
                >
                    <DatePicker style={{ width: '100%' }} showTime onChange={changeDate} />
                </Form.Item> */}

                {/* <Form.Item
                    label="预计用时"
                    name="versionTime"
                >
                    <Input suffix="1/小时" bordered={false} disabled={true} style={{ width: '30%' }} />
                </Form.Item>

                <Form.Item
                    label="剩余用时"
                    name="surplusTime"
                >
                    <Input suffix="/小时"
                        bordered={false}
                        disabled={true}
                        style={{ width: '30%' }}
                        value="sbsbsbbsbbsfsbsbs"
                    />
                </Form.Item> */}
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
                    <InputNumber suffix="/小时" style={{ width: '30%' }} />
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
        </Modal>
    )
}

export default inject('logStore')(observer(LogAdd));