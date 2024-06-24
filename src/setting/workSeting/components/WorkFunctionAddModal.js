import React, { Fragment,useState } from "react";
import { Modal, Form,Input,Radio,Select } from 'antd';
import Button  from "../../../common/button/Button";
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

const WorkFunctionAddModal = (props) => {
    const iconList = [
        {
            iconUrl: "proivilege1.png",
            key: "proivilege1"
        },
        {
            iconUrl: "proivilege2.png",
            key: "proivilege2"
        },
        {
            iconUrl: "proivilege3.png",
            key: "proivilege3"
        },
        {
            iconUrl: "proivilege4.png",
            key: "proivilege4"
        },
        {
            iconUrl: "proivilege5.png",
            key: "proivilege5"
        }
    ]
    const [iconUrl, setIconUrl] = useState("")
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
        
        

        // if(props.type === "edit"){
        //     findWorkPriorityListById(props.id).then((res)=> {
        //         form.setFieldsValue({
        //             name: res.name,
        //             id: res.id,
        //             desc: res.desc,
        //             group: res.group,
                    
        //         })
        //         setIconUrl(res.iconUrl)
        //     })
        // }
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            // const data = { ...values, iconUrl: iconUrl }
            // if(props.type ==="add"){
            //     addWorkList(data)
                
            // }else {
            //     data.id= props.id
            //     editWorkPriorityList(data)
            // }
            setVisible(false);
        })
        
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
        <Fragment>
            {   
                props.type !== "edit"?<Button type="primary" onClick={showModal}>
                    添加功能
                </Button>: <svg className="svg-icon" aria-hidden="true" onClick={() => showModal()}  style={{ cursor: "pointer" }}>
                    <use xlinkHref="#icon-edit"></use>
                </svg>
            }
            <Modal
                title="添加优先级"
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                closable = {false}
            >
                <Form
                    {...layout}
                    name="basic"
                   
                    form={form}
                    onFinishFailed={onFinishFailed}
                >

                    <Form.Item
                        label={`名称`}
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
                        label={`描述`}
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
                        label={`分组`}
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
                   
                  
                </Form>
            </Modal>
        </Fragment>
        
        </>
    );
};

export default WorkFunctionAddModal;