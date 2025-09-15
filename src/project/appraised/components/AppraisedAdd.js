/*
 * @Descripttion: 评审添加，编辑弹窗
 * @appraised: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:56:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:01:36
 */
import React, {useEffect, useState} from "react";
import { Modal, Select, Space, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Button from "../../../common/button/Button";
import StageList from "../../stage/stageList/components/StageList";
import StageListStore from "../../stage/stageList/store/StageListStore";
const { RangePicker } = DatePicker;

const AppraisedAddModal = (props) => {
    const { appraisedStore, userList, getUserList, setActiveTabs, selectTabs, type } = props;
    const { editAppraised, addAppraised, searchAppraisedById, status, getAppraisedList, appraisedTypeList } = appraisedStore;
    const {findStageListTile} = StageListStore;
    const [form] = Form.useForm();
    const dateFormat = "YYYY-MM-DD HH:mm:ss";
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 项目id
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };
    const [stageList, setStageList] = useState(null);

    useEffect(() => {
        findStageListTile({projectId:projectId}).then(res => {
            if (res.code === 0){
                setStageList(res.data)
            }
        })
    }, [projectId]);

    /**
     * 表单提交，编辑或者添加评审
     */
    const submitAppraised = () => {
        form.validateFields().then((fieldsValue) => {
            const time = fieldsValue["startTime"]
            let values = {
                ...fieldsValue,
                master: {
                    id: fieldsValue.master
                },
                project: {
                    id: projectId
                },
                appraisedType: {
                    id: fieldsValue.appraisedType
                },
                stage: {
                    id: fieldsValue.stage,
                },
                description: fieldsValue.description,
                startTime: time[0].format(dateFormat),
                endTime: time[1].format(dateFormat),
            };
            if (type === "edit") {
                values = { appraisedState: fieldsValue.appraisedState, ...values } // 0未开始 1进行中 2已完成
                values.id = props.id
                editAppraised(values).then(() => {
                    form.resetFields();
                    setVisible(false);
                    getAppraisedList({ projectId: projectId, name: null, appraisedState: null });
                })
            } else {
                values = { appraisedState: "0", ...values }
                addAppraised(values).then((res) => {
                    if (res.code === 0) {
                        setActiveTabs("all")
                        selectTabs("all", 1)
                    }
                    setVisible(false);
                    form.resetFields();
                })
            }
        })

    }

    /**
     * 重置表单
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    }

    /**
     * 显示编辑弹窗，若是编辑模式，初始化表单
     */
    const showModal = () => {
        getUserList(projectId)
        setVisible(true);
        if (type === "edit") {
            searchAppraisedById(props.id).then((res) => {
                form.setFieldsValue({
                    name: res.data.name,
                    project: res.data.project.id,
                    master: res.data.builder.id,
                    appraisedType: res.data.appraisedType.id,
                    stage:res.data.stage?.id,
                    startTime: res.data.startTime ? [moment(res.data.startTime, dateFormat), moment(res.data.endTime, dateFormat)] : null,
                    appraisedState: res.data.appraisedState,
                    description: res.data.description
                })
            })
        }
    };



    return (
        <>
            <div className="addmodel">
                {type !== "edit" ?
                    <Button onClick={showModal} type="primary" >
                        添加评审
                    </Button>
                    :
                    <svg className="svg-icon" aria-hidden="true" onClick={showModal} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>

                }
                <Modal
                    title={props.name}
                    visible={visible}
                    width={520}
                    onOk={submitAppraised}
                    onCancel={onFinishFailed}
                    cancelText="取消"
                    okText="确定"
                    closable={false}
                >
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            project: projectId
                        }}
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label="评审名称"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入评审名称',
                                },
                            ]}
                        >
                            <Input placeholder="请输入评审名称" />
                        </Form.Item>

                        <Form.Item
                            label="评审类型"
                            name="appraisedType"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择评审类型',
                                },
                            ]}
                        >
                            <Select
                                placeholder="评审类型"
                                allowClear
                            >
                                {
                                    appraisedTypeList?.map((item) => (
                                        (item.id === "222222" || item.id === "333333")
                                            ? (project.projectType.type === "ipd" && <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                            : <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        {
                            project.projectType.type === "ipd" &&
                            <Form.Item
                                label="阶段"
                                name="stage"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择阶段',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="阶段"
                                    allowClear
                                >
                                    {
                                        stageList && stageList.map((item, index) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.stageName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }

                        {
                            type === "edit" &&
                            <Form.Item
                                label="评审状态"
                                name="appraisedState"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择评审状态',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="评审状态"
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
                                    message: '请输入负责人',
                                },
                            ]}
                        >
                            <Select
                                placeholder="负责人"
                                allowClear
                            >
                                {
                                    userList && userList.map((item, index) => {
                                        return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="startTime" label="计划日期"
                                   rules={[
                                       {
                                           required: true,
                                           message: '请选择计划日期',
                                       },
                                   ]}>
                            <RangePicker
                                locale={locale}
                            />
                        </Form.Item>
                        <Form.Item name="description" label="描述"
                                   >
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        </>
    );
};
export default inject("appraisedStore")(observer(AppraisedAddModal));