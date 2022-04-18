import React, { useEffect,useState } from "react";
import { Modal, Button,Form,Input,Select,DatePicker  } from 'antd';
import {observer,inject} from "mobx-react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
    span: 6,
    },
    wrapperCol: {
    span: 16,
    },
};

const SprintAddmodal = (props) => {
    const [form] = Form.useForm();
    const {uselist,getUseList,sprintStore,sprintStateList,setVisible,visible,sprintId} = props;
    const {searchsprintList,addsprintlist,editsprintList} = sprintStore;
    const dateFormat = 'YYYY/MM/DD';
    const projectId = localStorage.getItem("projectId");

    const showModal = () => {
        getUseList(projectId)
        if(props.type === "edit"){
            searchsprintList(sprintId).then((res)=> {
                form.setFieldsValue({
                    sprintName: res.data.sprintName,
                    desc: res.data.desc || null,
                    startTime:res.data.startTime? [moment(res.data.startTime, dateFormat), moment(res.data.endTime, dateFormat)] : null,
                    master: res.data.master ? res.data.master.id : null,
                    sprintState: res.data.sprintState ? res.data.sprintState.id : null
                })
            })
        }
    };

    useEffect(()=> {
        if(visible) {
            showModal()
        }
    },[visible])
    
    const onFinish = (values) => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            let data = {...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                project: {
                    id: props.projectId
                }
            }
            if(props.type ==="add"){
                addsprintlist(data)
            }else {
                data = {
                    ...data,
                    id:  sprintId,
                    sprintState: {
                        id: values.sprintState
                    }
                }
                editsprintList(data)
            }
            setVisible(false);
        })
    };
    
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
        
    };


    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Please select time!',
            }
        ]
    };
    return (
        <>
        <div className="addmodel">
            <Modal
                title={"编辑"}
                visible={visible}
                onOk={onFinish} 
                onCancel={onCancel}
                cancelText="取消"
                okText="确定"
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                >
                    <Form.Item
                        label="迭代名称"
                        name="sprintName"
                        rules={[
                        {
                            required: true,
                            message: '请输入迭代名称',
                        },
                        ]}
                    >
                        <Input placeholder="迭代名称"/>
                    </Form.Item>
                    <Form.Item
                        label="负责人"
                        name="master"
                        rules={[
                            {
                                required: false,
                                message: '请输入项目编码',
                            },
                        ]}
                    >
                        <Select
                            placeholder="负责人"
                            allowClear
                        >   
                            {
                                uselist && uselist.map((item,index)=> {
                                    return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    {
                        props.type !== "add" && <Form.Item
                            label="迭代状态"
                            name="sprintState"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入迭代状态',
                                },
                            ]}
                        >
                            <Select
                                placeholder="迭代状态"
                                allowClear
                            >   
                            {
                                sprintStateList && sprintStateList.map((item,index)=> {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                            </Select>
                        </Form.Item>
                    }

                    <Form.Item name="startTime" label="计划日期" {...rangeConfig}>
                        <RangePicker locale={locale}/>
                    </Form.Item>
                    <Form.Item
                        label="迭代描述"
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入迭代描述',
                        },
                        ]}
                    >
                        <Input placeholder="迭代描述"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        
        </>
    );
};
export default inject("sprintStore")(observer(SprintAddmodal));