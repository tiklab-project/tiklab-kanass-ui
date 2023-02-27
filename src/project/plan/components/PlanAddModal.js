import React, { useState } from "react";
import { Modal, Button,Select,DatePicker,Input,Form } from 'antd';
import { observer,inject } from "mobx-react";
import moment from 'moment';
const { RangePicker } = DatePicker;

const  PlanAddModal = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const {planStore,projectStore} = props;
    const projectId = props.match.params.id;
    // const {projectName} = projectStore;
    const {editPlan,addPlan,searchPlanById,getUseList,uselist} = planStore;
    const [planInfo,setPlanInfo]= useState()
    const dateFormat = 'YYYY-MM-DD'
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };
    
    
    //提交计划列表
    const submitPlan = ()=> {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                'startTime': fieldsValue['startTime'][0].format('YYYY-MM-DD'),
                'endTime': fieldsValue['startTime'][1].format('YYYY-MM-DD'),
                master: {
                    id: fieldsValue.master
                },
                project: {
                    id: projectId
                },
                parentPlan: {
                    id: fieldsValue.parent
                },
                planState: fieldsValue.planState
            };
            if(props.type === "edit"){
                values.id = props.id
                editPlan(values).then(()=> {
                    setVisible(false);
                })
            }else {
                addPlan(values).then(()=> {
                    setVisible(false);
                })
            }
        })
        
    }

    // 表单验证
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    }

    const showModal = () => {
        setVisible(true);
        getUseList(projectId);
        if(props.type === "edit"){
            searchPlanById({id: props.id}).then((res)=> {
                setPlanInfo(res)
                form.setFieldsValue({
                    planName: res.planName,
                    // project: projectId,
                    master: res.master.id,
                    planState: res.planState,
                    startTime: [moment(res.startTime, dateFormat), moment(res.endTime, dateFormat)],
                })
                if(res.parentPlan) {
                    form.setFieldsValue({
                        parent: res.parentPlan.id
                    })
                }
            })
        }
    };

     // 状态类型
    const status = [
        {
            name: "未开始",
            id: "0"
        },
        {
            name: "进行中",
            id: "1"
        },
        {
            name: "已结束",
            id: "2"
        }
    ]
    return (
        <>
        <div className="addmodel">
            {props.type === "add"?
                <Button type="primary" onClick={showModal}>
                    +{props.name}
                </Button>
                :
                <span onClick={showModal} style={{color: "var(--tiklab-gray-400)"}} type="link">
                    {props.name}
                </span>

            }
            <Modal
                title= {props.name}
                visible={visible}
                width={520}
                onOk={submitPlan}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
                closable = {false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        project: projectId,
                        parent: props.parentId ? props.parentId : null
                    }}
                    form={form}
                    layout = "vertical"
                >
                    <Form.Item
                        label="计划名称"
                        name="planName"
                        rules={[
                        {
                            required: true,
                            message: '请输入计划名称',
                        },
                        ]}
                    >
                        <Input placeholder= "请输入计划名称"/>
                    </Form.Item>
                    {/* <Form.Item
                        label="所属项目"
                        name="project"
                        rules={[
                            {
                                required: true,
                                message: '请选择所属项目'
                            }
                        ]}
                    >
                        <Select
                            placeholder= {projectName}
                            allowClear
                        >
                            <Select.Option value={projectId}>{projectName}</Select.Option>
                        </Select>
                    </Form.Item> */}
                    {
                        props.type === "addChildren" || planInfo && planInfo.parentPlan && <Form.Item
                            label="上级计划"
                            name="parent"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择所属项目'
                                }
                            ]}
                        >
                            <Select
                                placeholder= {props.parentName || planInfo.parentPlan.planName}
                                allowClear
                            >
                                <Select.Option value={props.parentId || planInfo.parentPlan.id}>{props.parentName || planInfo.parentPlan.planName}</Select.Option>
                            </Select>
                        </Form.Item>
                    }
                    
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
                                    return <Select.Option value={item.user.id} key={item.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                            label="项目状态"
                            name="planState"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择项目状态',
                                },
                            ]}
                        >
                        <Select
                            placeholder="项目状态"
                            allowClear
                        >   
                        {
                            status && status.map((item,index)=> {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="起始时间"
                        name="startTime"
                        rules={[
                            {
                                required: true,
                                message: '请选择起始日期',
                            }
                        ]}
                    >
                        <RangePicker
                            defaultValue={[moment('2021-06-06', dateFormat), moment('2021-06-06', dateFormat)]}
                        />
                    </Form.Item>
                    
                </Form>
            </Modal>
        </div>
        
        </>
    );
};

export default inject("projectStore","planStore")(observer(PlanAddModal));