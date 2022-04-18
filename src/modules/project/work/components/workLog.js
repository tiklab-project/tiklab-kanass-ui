import React, { useEffect, useState, useRef } from "react";
import { Modal, Button,Table,Space,DatePicker,Form, Input,Select  } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import {getUser} from 'doublekit-core-ui'
const { TextArea } = Input;

const WorkLog = (props)=> {
    const [visible, setVisible] = useState(false);
    const [confirmLoading] = useState(false);
    const {workLogStore,workStore} = props;
    const {getWorkLogList,workLogList,addWorkLog,deleteWorKLog,editWorKLog,searchWorKLog,
            versionTime,workLogPage} = workLogStore;
    const {workId,workAllList,getWorkAllList}  = workStore;
    const [date,setDate] = useState('')
    const [modalTitle,setModalTitle] = useState("添加日志")
    const [modalType,setModalType] = useState("add")
    const [remainTime,setRemainTime] = useState(0)
    const [userInfo,setUserInfo] = useState([])

    // 表格样式
    const [AddLog] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    const columns = [
        {
            title: '日志内容',
            dataIndex: ['workItem','title'],
            key: 'workitem'
        },
        {
            title: '记录人',
            dataIndex: ['worker','name'],
            key: 'worker',
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
            render: (text, record) => (
                <Space size="middle">
                    <span onClick={()=>changeLog(record.id)} className = "span-botton" >编辑</span>
                    <span onClick={()=>delectLog(record.id)} className = "span-botton" >删除</span>
                </Space>
            ),
        }
    ];

    useEffect(()=> {
        getGemianTime()
        setDate(getNowFormatDate())
    },[workId])

    // 获取当前登录用户信息
    const getUserInfo = ()=>{
        let userInfo = {userId: "", name: ""}
        let user = getUser()
        userInfo.userId = user.userId;
        userInfo.name = user.name;
        setUserInfo(userInfo)
        AddLog.setFieldsValue({
            worker: userInfo.userId
        })
    }

    // 计算剩余时间
    const getGemianTime = (page)=> {
        getWorkLogList({workItemId: workId},page).then((res)=> {
            let useTime = 0;
            if(res.length>0){
                res.map((item)=> {
                    useTime += parseInt(item.takeupTime)
                })
                setRemainTime(parseInt(versionTime) - useTime)
            }
        })
    }

    const showModal = () => {
        setModalType("add")
        setModalTitle("添加日志")
        setVisible(true);
        getWorkAllList()
        getUserInfo()
        AddLog.setFieldsValue(
            { 
                workItem: workId,
                workDate: moment(getNowFormatDate(), dateFormat),
                versionTime: versionTime,
                surplusTime: remainTime
            }
        )
    };

    // 弹窗添加编辑日志
    const handleOk = () => {
        AddLog.validateFields().then(value=> {
            value.workDate = date
            if(modalType === "add") {
                addWorkLog(value)
                AddLog.resetFields()
            }else {
                value.id = logId;
                editWorKLog(value).then(()=> {
                    getGemianTime()
                })
                AddLog.resetFields()
            }
            setVisible(false);
        });
    
    };

    // 删除日志
    const delectLog = (id) => {
        deleteWorKLog(id)
    }

    // 点击取消
    const handleCancel = () => {
        setVisible(false);
    };

    // 编辑日志
    const [logId,setLogId] = useState()
    const changeLog = (id)=> {
        setModalTitle("编辑日志")
        setModalType("edit")
        setVisible(true);
        searchWorKLog(id).then((res)=> {
            setDate(res.workDate)
            setLogId(res.id)
            AddLog.setFieldsValue(
                {
                    workItem: res.workItem.id,
                    workDate: moment(res.workDate, dateFormat),
                    takeupTime: res.takeupTime,
                    workContent: res.workContent,
                    worker: res.worker.id,
                    surplusTime: remainTime,
                    versionTime: versionTime
                }
            )
        })
    }

    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD';
    const getNowFormatDate =()=>{
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }


    // 选择日期之后
    const changeDate = (dateString) => {
        setDate(dateString)
    }

    // 改变页码
    const onChange = (pagination)=> {
        console.log(pagination)
        getGemianTime(pagination)
    }

    return (
        <>
            <div style={{width: "100%", textAlign: "right"}}>
                <Button type="primary" onClick={showModal}>
                    添加日志
                </Button>
            </div>
            
            <Modal
                title={modalTitle}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                destroyOnClose= {true}
            >
                <Form
                    {...layout}
                    name="basic"
                    form={AddLog}
                    preserve={false}
                    
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
                        >
                            {
                                workAllList && workAllList.map((item)=> {
                                    return <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
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
                    </Form.Item>

                    <Form.Item
                        label="记录时间"
                        name="workDate"
                        rules={[
                        {
                            required: true,
                            message: '请选择记录时间',
                        },
                        ]}
                    >
                        <DatePicker style={{width: '100%'}} onChange={changeDate}/>
                    </Form.Item>
                    
                    <Form.Item
                        label="预计用时"
                        name="versionTime"
                    >
                        <Input suffix="/小时" bordered={false} disabled={true} style={{width: '30%'}}/> 
                    </Form.Item>

                    <Form.Item
                        label="剩余用时"
                        name="surplusTime"
                    >
                        <Input suffix="/小时" 
                            bordered={false} 
                            disabled={true}
                            style={{width: '30%'}}
                            value="sbsbsbbsbbsfsbsbs"
                        /> 
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
                        <Input suffix="/小时" style={{width: '30%'}}/> 
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
            <Table 
                columns={columns} 
                dataSource={workLogList} 
                rowKey={(record)=> record.id} 
                onChange = {onChange}
                pagination = {{...workLogPage}}
            />

        </>
    );
}

export default inject(
    "workLogStore",
    "workStore"
)(observer(WorkLog));
