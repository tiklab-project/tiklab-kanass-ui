import React, { useState } from "react";
import { Modal, Button,Form,Input,Select,Upload, message,} from 'antd';
import UploadIcon1 from "../../../../assets/images/uploadIcon.png"
import "./workType.scss"
import { getUser,getDomainTenant } from 'doublekit-core-ui';

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

const WorkTypeAddmodal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const {addWorkList,findWorkListById,
            editWorkList,group,fromList,
            getFormList,getFlowList,flowList,creatIcon,findIconList} = props;
    const [iconList,setIconList] = useState([])
    const [iconUrl,setIconUrl] = useState("")    
    const getIconList = ()=>{
        findIconList({iconType: "workType"}).then((res)=> {
            setIconList(res.data)
        })
    }
    const showModal = () => {
        setVisible(true);
        getIconList()
        getFormList().then((res)=> {
            console.log(res)
            if(res){
                form.setFieldsValue({
                    form: res[0].id
                })
            }
        })
        getFlowList().then(res=> {
            if(res){
                form.setFieldsValue({
                    flow: res[0].id
                })
            }
            })
        
        

        if(props.type === "edit"){
            findWorkListById(props.id).then((res)=> {
                form.setFieldsValue({
                    name: res.name,
                    id: res.id,
                    desc: res.desc,
                    group: res.group,
                    form: res.form.id,
                    flow: res.flow.id
                })
                setIconUrl(res.iconUrl)
            })
        }
    };

    const onFinish = (values) => {
        const data = {...values, iconUrl: iconUrl}
        if(props.type ==="add"){
            addWorkList(data)
        }else {
            data.id= props.id
            editWorkList(data)
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
    // 上传图标
    const ticket = getUser().ticket;
    const tenant = getDomainTenant();
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${img_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                const params = {
                    iconName: info.file.name,
                    iconUrl: info.file.response.data.fileName,
                    iconType: "workType"
                }
                creatIcon(params).then((res)=> {
                    if(res.code === 0){
                        getIconList()
                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
        <div >
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
                className="work-type-addmodel"
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
                        label= "类型名称"
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

                    

                    {/* <Form.Item
                        label="类型分组"
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
                    </Form.Item> */}
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
                    <Form.Item
                        label= "类型描述"
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
                    <Form.Item
                        label= "图标"
                        // name="icon"
                        rules={[
                            {
                                required: true,
                                message: '请选择流程配置',
                            },
                        ]}
                    >   
                        <div className = "work-type-icon-box">
                            {
                                iconList && iconList.map((item)=> {
                                    return <div  className = {`work-type-icon ${item.iconUrl === iconUrl ? "icon-select": null}`} key={item.id} onClick = {()=> {setIconUrl(item.iconUrl)}}>
                                        <img src={`${img_url}/file/${item.iconUrl}?tenant=${tenant}`} alt="" />
                                    </div>
                                })
                            }
                            
                            <Upload {...upLoadIcon}>
                                    <div  className = "work-type-icon">
                                        <img src={UploadIcon1} alt="" />
                                    </div>
                            </Upload>
                        </div>
                    </Form.Item>
                    
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

export default WorkTypeAddmodal;