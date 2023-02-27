import React, { Fragment } from "react";
import { Modal, Button,Form,Input,Radio,Select } from 'antd';
const { Option } = Select;

const layout = {
    labelCol: {
    span: 6,
    },
    wrapperCol: {
    span: 16,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
};

const WorkStatusAddModal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const {addWorkList,findWorkListById,
            editWorkList,group,fromList,
            getFormList,getFlowList,flowList} = props;

    const showModal = () => {
        setVisible(true);
        if(getFormList){
            getFormList().then((res)=> {
                console.log(res)
                if(res){
                    fromList && form.setFieldsValue({
                        form: fromList[0].id
                    })
                }
            })
            getFlowList().then(res=> {
                if(res){
                    flowList && form.setFieldsValue({
                        flow: flowList[0].id
                    })
                }
            })
        }
        
        

        if(props.type === "edit"){
            findWorkListById(props.id).then((res)=> {
                form.setFieldsValue({
                    name: res.name,
                    id: res.id,
                    desc: res.desc,
                    group: res.group,
                    
                })
                if(props.typeName === "类型") {
                    form.setFieldsValue({
                        form: res.form.id,
                        flow: res.flow.id,
                        category: res.category,
                    })
                }
            })
        }
    };

    const onFinish = (values) => {
        if(props.type ==="add"){
            addWorkList(values)
            
        }else {
            values.id= props.id
            editWorkList(values)
        }
        setVisible(false);
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    return (
        <>
        <div className="addmodel">
            {   
                props.type !== "edit"?<Button type="primary" onClick={showModal}>
                    +{props.name}
                </Button>: 
                <Button
                        type="link"
                        onClick={showModal}
                    >
                        {props.name}
                    </Button>
            }
            <Modal
                title="Title"
                visible={visible}
                footer={null}
                onCancel={onCancel}
                closable = {false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        group: group
                    }}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >

                    <Form.Item
                        label={`${props.typeName}名称`}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入状态名称',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={`${props.typeName}描述`}
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入状态描述',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {
                        props.typeName === "类型" && 
                            <Form.Item name="category" label="类别">
                                <Radio.Group>
                                    <Radio value = {1}>事项</Radio>
                                    <Radio value = {2}>子事项</Radio>
                                </Radio.Group>
                            </Form.Item>
                    }

                    <Form.Item
                        label={`${props.typeName}分组`}
                        name="group"
                        rules={[
                            {
                                required: true,
                                message: '请输入分组',
                            },
                        ]}
                    >
                        <Select
                            placeholder="系统"
                            allowClear
                        >
                            <Select.Option value="system">系统</Select.Option>
                            <Select.Option value="custom">自定义</Select.Option>
                        </Select>
                    </Form.Item>
                    {
                        props.typeName === "类型" && 
                        <Fragment>
                            <Form.Item
                                label= "表单配置"
                                name="form"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择表单配置',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="默认"
                                    allowClear
                                >
                                    {
                                        fromList && fromList.map((item)=> {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                        
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label= "流程配置"
                                name="flow"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择流程配置',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="默认"
                                    allowClear

                                >
                                    {
                                        flowList && flowList.map((item)=> {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                        
                                    }
                                </Select>
                            </Form.Item>
                        </Fragment>
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button htmlType="button" onClick={onCancel}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        
        </>
    );
};

export default WorkStatusAddModal;