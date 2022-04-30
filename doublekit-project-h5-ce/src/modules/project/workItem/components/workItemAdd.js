/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-22 11:18:31
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-23 18:55:37
 */
import React, { useEffect, useState } from 'react';
import {
    NavBar, Input, Button, Dialog, Form, Picker, DatePicker,
    Selector, Slider, Stepper, Toast, ImageUploader
} from 'antd-mobile';
import { BankcardOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "./workItem.scss";
import { withRouter } from 'react-router';
import "./workItemAdd.scss"
// import ImageUploader from 'antd-mobile/es/components/image-uploader'

const WorkItemAdd = (props) => {
    const { workItemStore } = props;
    const { findAllWorkType, workTypeList, getProjectUserList, projectUserList,
        findAllWorkPriority, workPriorityList, findSprintList, sprintList,
        findModuleList, moduleList, upload, createWorkAttach } = workItemStore;
    const back = () => {
        props.history.goBack();
    }
    const onFinish = (values) => {
        Dialog.alert({
            content: <pre>{JSON.stringify(values, null, 2)}</pre>,
        })
    }
    const [form] = Form.useForm();

    const [workItemTypePickerVisible, setWorkItemTypePickerVisible] = useState(false);
    const [assignerPickerVisible, setAssignerPickerVisible] = useState(false);
    const [workPriorityVisible, setWorkPriorityVisible] = useState(false);
    const [reportPickerVisible, setReportPickerVisible] = useState(false);
    const [sprintVisible, setSprintVisible] = useState(false);
    const [moduleVisible, setModuleVisible] = useState(false);
    const [imageList, setImageList] = useState([{
        url: 'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60',
    }])

    useEffect(() => {
        findAllWorkType()
        getProjectUserList("1c253fc2046a4468784d7f5191c0d94b")
        findAllWorkPriority()
        findSprintList("1c253fc2046a4468784d7f5191c0d94b")
        findModuleList("1c253fc2046a4468784d7f5191c0d94b")
    }, [])
    const mockUpload = async (file) => {
        setImageList([{
            url: 'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60',
        }])
        upload(file).then(data => {
            console.log(data.data.fileName)
            const fileName = data.data.fileName;
            if (data.code === 0) {
                createWorkAttach("project1-13", fileName)
            }
        })
        return {
            url: URL.createObjectURL(file),
        }
    }

    const [fileList, setFileList] = useState([])
    const handleUpload = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        const formdata = new FormData();
        formdata.append('file', file);

        let list = []
        for (var value of formdata.values()) {
            console.log(value);
            fileList.push(value)
        }
        // fileList.push(list)
        setFileList([...fileList])
        console.log(fileList[0].name)
    };

    return (
        <div>
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={back}
            >
                <div className="title-top">
                    添加事项
                </div>
            </NavBar>
            <Form
                name='form'
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='large'>
                        提交
                    </Button>
                }
            >
                <Form.Header>添加事项</Form.Header>
                <Form.Item name='title' label='事项名称' rules={[{ required: true }]}>
                    <Input placeholder='请输入事项名称' />
                </Form.Item>
                <Form.Item
                    label="事项类型"
                    name="workItemType"
                    rules={[
                        {
                            required: true,
                            message: '请选择项目类型',
                        },
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('workItemType') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ workItemType: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setWorkItemTypePickerVisible(true)
                    }}
                >

                    {
                        console.log(workTypeList)
                    }
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[workTypeList]}
                        visible={workItemTypePickerVisible}
                        onClose={() => {
                            setWorkItemTypePickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择项目类型"
                        }
                    </Picker>
                </Form.Item>
                <Form.Item
                    label="负责人"
                    name="assigan"
                    rules={[
                        {
                            required: true,
                            message: '请选择负责人',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('assigan') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ assigan: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setAssignerPickerVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[projectUserList]}
                        visible={assignerPickerVisible}
                        onClose={() => {
                            setAssignerPickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择负责人"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    label="报告人"
                    name="reporter"
                    rules={[
                        {
                            required: true,
                            message: '请选择报告人',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('reporter') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ reporter: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setReportPickerVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[projectUserList]}
                        visible={reportPickerVisible}
                        onClose={() => {
                            setReportPickerVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择报告人"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    label="优先级"
                    name="workPriority"
                    rules={[
                        {
                            required: true,
                            message: '请选择优先级',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('workPriority') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ workPriority: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setWorkPriorityVisible(true)
                    }}
                >
                    {/* <Input placeholder="项目名称" /> */}
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[workPriorityList]}
                        visible={workPriorityVisible}
                        onClose={() => {
                            setWorkPriorityVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择优先级"
                        }
                    </Picker>
                </Form.Item>

                <Form.Item
                    label="迭代"
                    name="sprint"
                    rules={[
                        {
                            required: true,
                            message: '请选择迭代',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('sprint') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ sprint: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setSprintVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[sprintList]}
                        visible={sprintVisible}
                        onClose={() => {
                            setSprintVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择迭代"
                        }
                    </Picker>
                </Form.Item>
                <Form.Item
                    label="模块"
                    name="module"
                    rules={[
                        {
                            required: true,
                            message: '请选择所属模块',
                        }
                    ]}
                    trigger='onConfirm'
                    arrow={
                        form.getFieldValue('module') ? (
                            <CloseCircleFill
                                style={{
                                    color: 'var(--adm-color-light)',
                                    fontSize: 14,
                                }}
                                onClick={e => {
                                    e.stopPropagation()
                                    form.setFieldsValue({ module: null })
                                }}
                            />
                        ) : (
                            true
                        )
                    }
                    onClick={() => {
                        setModuleVisible(true)
                    }}
                >
                    <Picker
                        style={{
                            '--title-font-size': '13px',
                            '--header-button-font-size': '13px',
                            '--item-font-size': '13px',
                            '--item-height': '30px',
                        }}
                        columns={[moduleList]}
                        visible={moduleVisible}
                        onClose={() => {
                            setModuleVisible(false)
                        }}
                    >
                        {
                            value => value.length > 0 ? value[0].label : "请选择迭代"
                        }
                    </Picker>
                </Form.Item>
                <Form.Item
                    initialValue={0}
                    rules={[
                        {
                            max: 5,
                            min: 1,
                            type: 'number',
                        },
                    ]}
                    name='planTakeupTime'
                    label='计划时长'
                >
                    <Stepper />

                </Form.Item>
                <div className='form-upload'>
                    <div>上传文件</div>
                    <div className='upload'>
                        <input type="file" onChange={handleUpload} />
                        <span>
                            <svg aria-hidden="true">
                                <use xlinkHref="#icon-shangchuanwenjian"></use>
                            </svg>
                        </span>
                    </div>
                    {
                        console.log(fileList)
                    }
                    {
                        fileList && fileList.length > 0 && fileList.map(item => {
                            return <div className='show-file'>
                                <span>
                                    <svg aria-hidden="true">
                                        <use xlinkHref="#icon-a-wenjianjiawenjian"></use>
                                    </svg>
                                </span>
                                <span>
                                    {item.name}
                                </span>
                            </div>
                        })
                    }
                </div>
                <div style={{ paddingLeft: "16px" }}>
                    <div><label>
                        图片附件
                    </label></div>
                    <ImageUploader
                        style={{ '--cell-size': '90px' }}
                        value={imageList}
                        onChange={setImageList}
                        upload={mockUpload}
                    />
                </div>



            </Form>
        </div>
    )
}

export default withRouter(inject("workItemStore")(observer(WorkItemAdd)));