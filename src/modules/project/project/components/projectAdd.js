import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import UploadIcon1 from "../../../../assets/images/uploadIcon.png";
import { getUser, getDomainTenant } from 'doublekit-core-ui';
import { observer, inject } from "mobx-react";
import "./projectAdd.scss"
const { RangePicker } = DatePicker;
const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const ProjectAddmodal = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const { proStore, name, type, id } = props;
    const { searchpro, projectTypelist, getProjectTypeList, getUseList, uselist, creatIcon, findIconList, updateProject, addProlist } = proStore;
    const [projectId, setProjectId] = useState("");
    const dateFormat = 'YYYY/MM/DD';
    const [iconList, setIconList] = useState([])
    const [iconUrl, setIconUrl] = useState("")

    const getIconList = () => {
        findIconList({ iconType: "project" }).then((res) => {
            setIconList(res.data)
        })
    }
    const showModal = () => {
        setVisible(true);
        getProjectTypeList()
        getUseList()
        getIconList()
        if (type !== "add") {
            searchpro(id).then((response) => {
                form.setFieldsValue({
                    projectName: response.projectName,
                    projectType: response.projectType.id,
                    desc: response.desc,
                    projectState: response.projectState,
                    startTime: [moment(response.startTime, dateFormat), moment(response.endTime, dateFormat)]
                })
                setProjectId(response.id)
                setIconUrl(response.iconUrl)
                if (response.master) {
                    form.setFieldsValue({
                        master: response.master.id,
                    })
                }

            })
        }
    };


    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                id: projectId,
                projectName: values.projectName,
                projectKey: values.projectKey,
                projectType: {
                    id: values.projectType
                },
                master: {
                    id: values.master
                },
                desc: values.desc,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                projectState: values.projectState,
                iconUrl: values.iconUrl
            }
            if (type === "add") {
                addProlist(data)
            } else {
                updateProject(data)
            }
            setVisible(false);
        })
    }

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

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "1"
        },
        {
            name: "进行中",
            id: "2"
        },
        {
            name: "已结束",
            id: "3"
        }
    ]

    /**
    *上传图标 
    */
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
                    iconType: "project"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    } else {

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
                    type !== "edit" ? <Button type="primary" onClick={showModal}>
                        +{name}
                    </Button> : <span onClick={showModal} className="span-botton">
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#iconchuangzuo-copy"></use>
                        </svg>
                        {name}</span>
                }
                <Modal
                    title={name}
                    visible={visible}
                    onOk={onFinish}
                    onCancel={onCancel}
                    cancelText="取消"
                    okText="确定"
                    className="project-addmodel"
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
                            label="项目名称"
                            name="projectName"

                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目名称',
                                },
                            ]}
                        >
                            <Input placeholder="项目名称" />
                        </Form.Item>
                        <Form.Item
                            label="项目Key"
                            name="projectKey"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目键值',
                                },
                                {
                                    pattern: /^[A-Za-z]+$/,
                                    message: '只能包含字母!'
                                }
                            ]}
                        >
                            <Input placeholder="项目键值" />
                        </Form.Item>
                        <Form.Item
                            label="项目类型"
                            name="projectType"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目编码',
                                },
                            ]}
                        >
                            <Select
                                placeholder="项目类型"
                                allowClear
                            >
                                {
                                    projectTypelist && projectTypelist.map((item, index) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>

                        {
                            type !== "add" && <Form.Item
                                label="项目状态"
                                name="projectState"
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
                                        status && status.map((item, index) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }

                        <Form.Item
                            label="负责人"
                            name="master"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入项目编码',
                                }
                            ]}
                        >
                            <Select
                                placeholder="负责人"
                                allowClear
                            >
                                {
                                    uselist && uselist.map((item, index) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="startTime" label="计划日期" {...rangeConfig}>
                            <RangePicker locale={locale} />
                        </Form.Item>
                        <Form.Item
                            label="项目描述"
                            name="desc"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入项目描述',
                                },
                            ]}
                        >
                            <Input placeholder="项目描述" />
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
                            <div className="project-icon-box">
                                {
                                    iconList && iconList.map((item) => {
                                        return <div className={`project-icon ${item.iconUrl === iconUrl ? "icon-select" : null}`} key={item.id} onClick={() => { setIconUrl(item.iconUrl) }}>
                                            <img src={`${img_url}/file/${item.iconUrl}?tenant=${tenant}`} alt="" />
                                        </div>
                                    })
                                }
                                <Upload {...upLoadIcon}>
                                    <div className="project-icon">
                                        <img src={UploadIcon1} alt="" />
                                    </div>
                                </Upload>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default inject('proStore')(observer(ProjectAddmodal));