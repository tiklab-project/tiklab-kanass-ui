import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, message, } from 'antd';
import UploadIcon1 from "../../../assets/images/uploadIcon.png"
import "./workType.scss"
import { getUser } from 'tiklab-core-ui';
import Button from "../../../common/button/Button";
import {inject, observer} from "mobx-react";
import { withRouter } from "react-router";
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

const WorkTypeAddModal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const {  bottonType,addWorkTypeList, creatIcon, findIconList, orgaStore } = props;
    const { getFormList, getFlowList, flowList, fromList, findWorkTypeListById,
        editWorkTypeList} = orgaStore;
    
    const [grouper, setGruoper] = useState()
    const iconList = [
        {
            iconUrl: "workType1.png",
            key: "workType1"
        },
        {
            iconUrl: "workType2.png",
            key: "workType2"
        },
        {
            iconUrl: "workType3.png",
            key: "workType3"
        },
        {
            iconUrl: "workType4.png",
            key: "workType4"
        },
        {
            iconUrl: "workType5.png",
            key: "workType5"
        }
    ]
    const [iconUrl, setIconUrl] = useState("")
    const getIconList = () => {
        findIconList({ iconType: "workType" }).then((res) => {
            // setIconList(res.data)
        })
    }
    const showModal = () => {
        setVisible(true);
        getIconList()
        getFormList().then((res) => {
            console.log(res)
            if (res) {
                form.setFieldsValue({
                    form: res[0].id
                })
            }
        })
        getFlowList().then(res => {
            if (res) {
                form.setFieldsValue({
                    flow: res[0].id
                })
            }
        })

        if (props.type === "edit") {
            findWorkTypeListById(props.id).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    id: res.id,
                    desc: res.desc,
                    grouper: res.grouper,
                    form: res.form.id,
                    flow: res.flow.id
                })
                setGruoper(res.grouper)
                setIconUrl(res.iconUrl)
            })
        }
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = { ...values, iconUrl: iconUrl}
            if (props.type === "add") {
                addWorkTypeList(data)
            } else {
                data.id = props.id
                data.grouper = grouper
                console.log(data)
                editWorkTypeList(data)
            }
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
    // 上传图标
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
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
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
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
                    props.type !== "edit" ? <Button type={bottonType} onClick={showModal}>
                        {props.name}
                    </Button> :
                        <svg className="svg-icon" aria-hidden="true" onClick={showModal}>
                            <use xlinkHref="#icon-edit"></use>
                        </svg>

                }
                <Modal
                    title="添加事项类型"
                    visible={visible}
                    // footer={null}
                    onOk={onFinish}
                    onCancel={onCancel}
                    className="work-type-addmodel"
                    closable={false}
                >
                    <Form
                        {...layout}
                        name="basic"
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Form.Item
                            label="类型名称"
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
                            label="表单配置"
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
                                    fromList && fromList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                            
                        </Form.Item>
                        {fromList && fromList.length <= 0 && <div className="form-add" onClick={() => props.history.push("/index/setting/form")}>没有自定义表单，点击添加</div>}
                        <Form.Item
                            label="流程配置"
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
                                    flowList && flowList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })

                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="类型描述"
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
                            label="图标"
                            // name="icon"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择流程配置',
                                },
                            ]}
                        >
                            <div className="work-type-icon-box">
                                {
                                    iconList && iconList.map((item) => {
                                        return <div className={`work-type-icon ${item.iconUrl === iconUrl ? "icon-select" : null}`} key={item.id} onClick={() => { setIconUrl(item.iconUrl) }}>
                                            <img src={('images/' + item.iconUrl)} alt="" className="img-icon"/>
                                        </div>
                                    })
                                }

                                <Upload {...upLoadIcon}>
                                    <div className="work-type-icon">
                                        <img src={UploadIcon1} alt="" className="img-icon"/>
                                    </div>
                                </Upload>
                            </div>
                        </Form.Item>

                        {/* <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button htmlType="button" onClick={onCancel}>
                            取消
                        </Button>
                    </Form.Item> */}
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default withRouter(inject("orgaStore")(observer(WorkTypeAddModal)));