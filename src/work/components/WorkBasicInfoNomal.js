import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Input, Upload, message, Table, DatePicker, Select, InputNumber, Space, Tabs } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Button from "../../common/button/Button";
import { DocumentEditor, PreviewEditor } from "tiklab-slate-ui";
import UserIcon from "../../common/UserIcon/UserIcon";
import { SwitchPreliminaryType } from "tiklab-form-ui";

import "./WorkBasicInfo.scss";
const { Dragger } = Upload;
const WorkBasicInfo = (props) => {
    const [detailForm] = Form.useForm();

    const [extDataForm] = Form.useForm();
    const layoutExForm = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };
    const [messageApi, contextHolder] = message.useMessage();

    const { workStore, workLogStore, workInfo } = props;
    const { workId, workIndex, findWorkAttachList, createWorkAttach, attachList, findFormConfig,
        formList, moduleList, sprintList, priorityList, editWork, userList
    } = workStore;
    const { setPlanTime } = workLogStore
    const [planTakeupTimeValue, setPlanTakeupTimeValue] = useState()
    // 富文本内容
    const [priorityDes, setPriorityDes] = useState("")

    // 获取详情内容
    const [parentWorkItem, setParentWorkItem] = useState("")

    const initForm = (workInfo) => {
        if (workInfo) {
            detailForm.setFieldsValue({
                assigner: workInfo.assigner?.id,
                reporter: workInfo.reporter?.id,
                module: workInfo.module?.id,
                workPriority: workInfo.workPriority?.id,
                workType: workInfo.workType?.id,
                percent: workInfo.percent,
                planBeginTime: moment(workInfo.planBeginTime || getNowFormatDate(), dateFormat),
                planEndTime: moment(workInfo.planEndTime || getNowFormatDate(), dateFormat),
                planTakeupTime: workInfo.planTakeupTime || null,
                predependworkitem: workInfo.preDependWorkItem?.id,
                sprint: workInfo.sprint?.id,
                parentWorkItem: workInfo.parentWorkItem?.id,
            })
            setPlanTakeupTimeValue(workInfo.planTakeupTime)
            // 父事项
            if (workInfo.parentWorkItem) {
                setParentWorkItem(workInfo.parentWorkItem.id)
            } else {
                setParentWorkItem("")
            }
            setPlanTime(workInfo.planTakeupTime)

            extDataForm.resetFields();
            if (workInfo.extData) {
                extDataForm.setFieldsValue(JSON.parse(workInfo.extData))
            } else {
                extDataForm.setFieldsValue("{}")
            }

            let descReplace;

            if (workInfo.desc) {
                setSlateValue(JSON.parse(workInfo.desc))
            }

            setPriorityDes(descReplace)
        }
    }

    useEffect(() => {
        findFormConfig({ id: workInfo.workType.form?.id })

        detailForm.resetFields()
        if (workId !== "" && workIndex !== "" && workInfo) {
            initForm(workInfo)
        }
        setEditorType(false)
        return
    }, [workInfo])


    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    // 上传附件的信息
    const filesParams = {
        name: 'uploadFile',
        multiple: true,
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                const filename = info.file.response.data.fileName
                createWorkAttach(workId, filename).then(() => {
                    findWorkAttachList(workId)
                })
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    }

    // 文件列表的
    const attachColums = [
        {
            title: '文件',
            dataIndex: ['attachment', 'fileMeta', 'originFileName'],
            key: 'name',
            render: (text, record) =>
                <a href={`${upload_url}/file/${record.attachment.fileName}?tenant=${tenant}`}
                    target="_blank"
                >
                    {text}
                </a>
        },
        {
            title: '文件类型',
            dataIndex: ['attachment', 'fileMeta', 'fileType'],
            key: 'type',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: text => <span style={{ color: "red" }}>删除</span>,
        }
    ]

    // 选择计划日期
    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD';

    // 获取当前时间
    const getNowFormatDate = () => {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }


    const [validateStatus, setValidateStatus] = useState("validating")
    const [showValidateStatus, setShowValidateStatus] = useState(false)

    /**
     * 字段更新
     */
    const updateSingle = (changedValues) => {
        console.log(Object.values(changedValues)[0])
        if (!Object.values(changedValues)[0]) {
            changedValues[Object.keys(changedValues)[0]] = "nullstring"
            console.log(changedValues)
        }
        if (changedValues.planEndTime) {
            changedValues.planEndTime = changedValues.planEndTime.format('YYYY-MM-DD HH:mm:ss')
        }
        if (changedValues.planBeginTime) {
            changedValues.planBeginTime = changedValues.planBeginTime.format('YYYY-MM-DD HH:mm:ss')
        }
        let data = {
            ...changedValues,
            id: workId,
            updateField: Object.keys(changedValues)[0]
        }

        editWork(data)
        setFieldName("")
    }

    const updataPlanTime = (value) => {
        setPlanTakeupTimeValue(value)
        const data = {
            updateField: "planTakeupTime",
            id: workId,
            planTakeupTime: value
        }
        editWork(data)
        setFieldName("")
    }

    /**
     * 万能表单字段更新
     */
    const updateExtData = (changedValues) => {
        let extData = JSON.parse(workInfo.extData)
        console.log(extData)
        let data = {
            extData: {
                ...extData,
                ...changedValues,
            },
            id: workId
        }
        workInfo.extData = JSON.stringify({
            ...extData,
            ...changedValues,
        })
        editWork(data)
    }

    const [hoverFieldName, setHoverFieldName] = useState("")
    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }

    // 转换描述编辑模式setEditorType
    const [editorType, setEditorType] = useState(false);
    const [slateValue, setSlateValue] = useState([
        {
            type: "paragraph",
            children: [{ text: "点击输入" }],
        },
    ])

    const editorDesc = () => {

        let data = {
            id: workId,
            desc: JSON.stringify(slateValue),
            updateField: "desc"
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                setEditorType(false);
            }
        })
    }

    const cancel = () => {
        setEditorType(false);
        setSlateValue(JSON.parse(workInfo.desc))
    }

    const [showMoreTab, setShowMoreTab] = useState(false);
    const tabsDropDown = useRef();

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [setShowMoreTab])

    const closeModal = (e) => {
        if (!tabsDropDown.current) {
            return;
        }
        if (!tabsDropDown.current.contains(e.target) && tabsDropDown.current !== e.target) {
            setShowMoreTab(false)
        }
    }

    return (
        <div className="work-info">
            {contextHolder}
            <div className="other-title">
                基本信息:
            </div>
            <div className="work-detail-box">
                <div className="detail-top">
                    <div className="left">
                        <Form
                            {...layout}
                            initialValues={{ remember: true }}
                            form={detailForm}
                            onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                            labelAlign="left"
                            colon={false}
                        >

                            <Form.Item label="优先级" name="workPriority"
                                hasFeedback={showValidateStatus === "workPriority" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectWorkPriority"
                                    bordered={fieldName === "workPriority" ? true : false}
                                    suffixIcon={fieldName === "workPriority" || hoverFieldName == "workPriority" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("workPriority")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("workPriority")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    allowClear
                                >
                                    {
                                        priorityList && priorityList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>
                                                <Space>
                                                    {
                                                        item.iconUrl ?
                                                            <img
                                                                src={('images/' + item.iconUrl)}
                                                                alt=""
                                                                className="img-icon"
                                                            />
                                                            :
                                                            <img
                                                                src={('images/project1.png')}
                                                                alt=""
                                                                className="img-icon"
                                                            />

                                                    }
                                                    {item.name}
                                                </Space>
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>


                            <Form.Item
                                label="所属迭代" name="sprint"
                                hasFeedback={showValidateStatus === "sprint" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectSprint"
                                    bordered={fieldName === "sprint" ? true : false}
                                    suffixIcon={fieldName === "sprint" || hoverFieldName == "sprint" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("sprint")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("sprint")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    allowClear
                                >
                                    {
                                        sprintList && sprintList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="所属模块" name="module"
                                hasFeedback={showValidateStatus === "module" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectModule"
                                    bordered={fieldName === "module" ? true : false}
                                    suffixIcon={fieldName === "module" || hoverFieldName == "module" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("module")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("module")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    allowClear
                                >
                                    {
                                        moduleList && moduleList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            {
                                parentWorkItem !== "" &&
                                <Form.Item name="parentWorkItem" label="上级事项"
                                    hasFeedback={showValidateStatus === "parentWorkItem" ? true : false}
                                    validateStatus={validateStatus}

                                >
                                    <Input
                                        bordered={false}
                                    // disabled={true}
                                    />
                                </Form.Item>
                            }
                        </Form>
                    </div>
                    <div className="right">
                        <Form
                            {...layout}
                            initialValues={{ remember: true }}
                            form={detailForm}
                            onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                            labelAlign="left"
                            colon={false}
                        >
                            <Form.Item
                                name="planBeginTime" label="计划开始日期" wrapperCol={{ span: 10 }}
                                hasFeedback={showValidateStatus === "planBeginTime" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <DatePicker
                                    locale={locale}
                                    format={dateFormat}
                                    showTime
                                    allowClear={false}
                                    className="work-select"
                                    bordered={fieldName === "planBeginTime" ? true : false}
                                    suffixIcon={fieldName === "planBeginTime" || hoverFieldName == "planBeginTime" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("planBeginTime")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("planBeginTime")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                // suffixIcon={false}
                                />
                            </Form.Item>

                            <Form.Item
                                name="planEndTime" label="计划结束日期" wrapperCol={{ span: 10 }}
                                hasFeedback={showValidateStatus === "planEndTime" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <DatePicker
                                    locale={locale}
                                    format={dateFormat}
                                    showTime
                                    allowClear={false}
                                    className="work-select"
                                    bordered={fieldName === "planEndTime" ? true : false}
                                    suffixIcon={fieldName === "planEndTime" || hoverFieldName == "planEndTime" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("planEndTime")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("planEndTime")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                />
                            </Form.Item>

                            <Form.Item name="planTakeupTime" label="计划用时"
                                hasFeedback={showValidateStatus === "planTakeupTime" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <InputNumber
                                    suffix="小时"
                                    bordered={fieldName === "planTakeupTime" ? true : false}
                                    suffixIcon={fieldName === "planTakeupTime" || hoverFieldName == "planTakeupTime" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("planTakeupTime")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("planTakeupTime")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    onChange={(value) => updataPlanTime(value)}
                                    value={planTakeupTimeValue}
                                // bordered={false}
                                // disabled={true}
                                />
                                小时
                            </Form.Item>
                            {/* <Form.Item 
                                name="predependworkitem" label="前置事项"
                                hasFeedback = {showValidateStatus === "predependworkitem" ? true : false}
                                validateStatus = {validateStatus}
                            >
                                <Input
                                    bordered={false}
                                    disabled={true}
                                />
                            </Form.Item> */}
                            <Form.Item label="报告人" name="reporter"
                                hasFeedback={showValidateStatus === "reporter" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectWorkUser"
                                    bordered={fieldName === "reporter" ? true : false}
                                    suffixIcon={fieldName === "reporter" || hoverFieldName == "reporter" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("reporter")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("reporter")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    allowClear
                                >
                                    {
                                        userList && userList.map((item) => {
                                            return <Select.Option value={item.user.id} key={item.id}><Space><UserIcon name={item.user.name} />{item.user.name}</Space></Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <Form
                    {...layoutExForm}
                    initialValues={{ remember: true }}
                    form={extDataForm}
                    labelAlign="left"
                    onValuesChange={(changedValues, allValues) => updateExtData(changedValues, allValues)}
                    className="exdata"
                    colon={false}
                >
                    {
                        formList && formList.map((item, index) => {
                            return <Form.Item
                                label={item.name}
                                name={`System${item.code}`}
                                key={item.id}
                                className="exdata-item"
                            >
                                {/* <DatePicker/> */}
                                {/* <Forms formType={item.fieldType.code} selectItemList={item.selectItemList} type="view" /> */}
                                <SwitchPreliminaryType
                                    code={item.fieldType.code}
                                    bordered={fieldName === `System${item.code}` ? true : false}
                                    showArrow={fieldName === `System${item.code}` ? true : false}
                                    onMouseEnter={() => changeStyle(`System${item.code}`)}
                                    onMouseLeave={() => setFieldName("")}
                                    data={item.selectItemList}
                                />
                            </Form.Item>
                        })
                    }
                </Form>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="other-title">描述：</div>
            </div>

            <div className="work-detail-box desc-box">

                <Fragment>
                    {
                        editorType ? <Fragment>
                            <DocumentEditor
                                focusEditor={true}
                                value={slateValue}
                                onChange={setSlateValue}
                                minHeight={300}
                                {...props}
                            />

                            <div className="desc-botton">

                                <Button onClick={() => cancel()}>取消</Button>
                                <Button type="primary" onClick={() => editorDesc()}>确定</Button>
                            </div>
                        </Fragment>
                            :
                            <div onClick={() => { setEditorType(true) }} className="desc-preview">
                                <PreviewEditor
                                    value={slateValue}
                                    onChange={setSlateValue}
                                    {...props}
                                />
                            </div>
                    }
                </Fragment>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="other-title attach-title">
                    附件列表:
                </div>
            </div>
            <div className="work-detail-box work-attach-box">

                <Fragment>
                    <div className="work-detail-upload">
                        <Dragger className="work-detail-upload">
                            <p className="ant-upload-drag-icon">
                                <svg className="list-img" aria-hidden="true">
                                    <use xlinkHref="#icon-uploadImg"></use>
                                </svg>上传附件
                            </p>
                        </Dragger>
                    </div>
                    {
                        attachList && attachList.length > 0 && (
                            <Fragment>
                                <Table columns={attachColums}
                                    dataSource={attachList}
                                    pagination={false}
                                    bordered={true}
                                    rowKey={(record) => record.id}
                                />
                            </Fragment>
                        )
                    }
                </Fragment>
            </div>
        </div>
    )
};
export default inject("workStore", "workLogStore")(observer(WorkBasicInfo));
