import React from "react";
import { Modal, Button,Select,Space,DatePicker,Input,Form } from 'antd';
import { observer,inject } from "mobx-react";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PrivilegeProjectButton } from "doublekit-privilege-ui";

const { Search } = Input;

const  VersionAddmodal = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const {editVersion,addVersion,searchVersionById,findVersionlist} = props;
    // const {projectName} = proStore;
    const projectId = localStorage.getItem("projectId");
    const layout = {
        labelCol: {
        span: 6,
        },
        wrapperCol: {
        span: 16,
        },
    };
    
    
    //提交用户列表
    const submitVersion = ()=> {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                project: projectId,
                'publishDate': fieldsValue['publishDate'].format('YYYY-MM-DD HH:mm:ss'),
                'startTime': fieldsValue['startTime'].format('YYYY-MM-DD HH:mm:ss')
            };
            if(props.type === "edit"){
                values.id = props.id
                editVersion(values).then(()=> {
                    setVisible(false);
                })
            }else {
                addVersion(values).then(()=> {
                    findVersionlist(projectId)
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

    // // 选择时间
    // const setDate = (date,dateString) => {
    //     console.log(date,dateString)
    // }
    const showModal = () => {
        setVisible(true);
        if(props.type === "edit"){
            searchVersionById({id: props.id}).then((res)=> {
                form.setFieldsValue({
                    name: res.name,
                    project: res.project.id,
                    publishDate: res.publishDate ? moment(res.publishDate) : null,
                    startTime: res.startTime ? moment(res.startTime) : null,
                    versionState: res.versionState
                })
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
            name: "已发布",
            id: "2"
        }
    ]

    return (
        <>
        <div className="addmodel">
            {props.type !== "edit"?
                <PrivilegeProjectButton code={'VersionAdd'} disabled ={"hidden"} domainId={projectId}>
                    <Button type="primary" onClick={showModal}>
                        +{props.name}
                    </Button>
                </PrivilegeProjectButton>
                : 
                <PrivilegeProjectButton code={'VersionEdit'} disabled ={"hidden"} domainId={projectId}>
                    <Button onClick={showModal} style={{color: "$blue-main"}} type="link">
                        {props.name}
                    </Button>
                </PrivilegeProjectButton>

            }
            <Modal
                title= {props.name}
                visible={visible}
                width={520}
                onOk={submitVersion}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        project: projectId
                    }}
                    form={form}
                >
                    <Form.Item
                        label="版本名称"
                        name="name"
                        rules={[
                        {
                            required: true,
                            message: '请输入版本名称',
                        },
                        ]}
                    >
                        <Input placeholder= "请输入版本名称"/>
                    </Form.Item>
                    {/* <Form.Item
                        label="所属项目"
                        name="project"
                        rules={[
                        {
                            required: true,
                            message: '请选择所属项目',
                        },
                        ]}
                    >
                        <Select
                            placeholder= {projectName}
                            allowClear
                        >   
                            <Select.Option value={projectId}>{projectName}</Select.Option>
                        </Select>
                    </Form.Item> */}
                    
                    <Form.Item
                        label="版本状态"
                        name="versionState"
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
                        <DatePicker 
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            locale={locale}
                        />
                    </Form.Item>

                    <Form.Item
                        label="发布日期"
                        name="publishDate"
                        rules={[
                            {
                                required: true,
                                message: '请选择发布日期',
                            }
                        ]}
                    >
                        <DatePicker 
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            locale={locale}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        
        </>
    );
};
export default inject("proStore")(observer(VersionAddmodal));