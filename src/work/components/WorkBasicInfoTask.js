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
import "tiklab-slate-ui/es/tiklab-slate.css"
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

    const { workStore, workInfo, setWorkInfo } = props;
    const { workId, workIndex, workList, setWorkList, findWorkAttachList, createWorkAttach, attachList, findFormConfig,
        formList, moduleList, sprintList, priorityList, editWork, userList, findFieldList
    } = workStore;
    const [planTakeupTimeValue, setPlanTakeupTimeValue] = useState()

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
                eachType: workInfo.eachType,
            })
            setPlanTakeupTimeValue(workInfo.planTakeupTime)
            // 父事项
            if (workInfo.parentWorkItem) {
                setParentWorkItem(workInfo.parentWorkItem.id)
            } else {
                setParentWorkItem("")
            }

            extDataForm.resetFields();
            if (workInfo.extData) {
                extDataForm.setFieldsValue(JSON.parse(workInfo.extData))
            } else {
                extDataForm.setFieldsValue("{}")
            }

            if (workInfo.desc) {
                setSlateValue(workInfo.desc)
            }

        }
    }
    const [selectItemList, setSelectItemList] = useState()
    useEffect(() => {
        findFormConfig({ id: workInfo.workType.form.id })
        findFieldList({ code: "taskType" }).then(res => {
            if (res.code === 0) {
                setSelectItemList(res.data[0].selectItemList)
            }
        })
        findWorkAttachList(workInfo.id)
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
        action: `${base_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                const res = info.file.response;
                console.log(info)
                const params = {
                    workItem: {
                        id: workId
                    },
                    attachmentName: info.file.name,
                    attachmentUrl: res.data,
                    type: info.file.type
                }
                createWorkAttach(params).then(() => {
                    findWorkAttachList(workId)
                })
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
            dataIndex: 'attachmentName',
            key: 'name',
            render: (text, record) => {
                return (
                    record.type.indexOf("image") === -1 ? <Fragment>
                        {
                            version === "cloud" ? <a href={`${upload_url}file/${record.attachmentUrl}?tenant=${tenant}`}
                                target="_blank"
                            >
                                {text}
                            </a>
                                :
                                <a href={`${upload_url}/file/${record.attachmentUrl}`}
                                    target="_blank"
                                >
                                    {text}
                                </a>
                        }

                    </Fragment>
                        :
                        <Fragment>
                            {
                                version === "cloud" ?
                                    <a href={`${upload_url}/image/${record.attachmentUrl}?tenant=${tenant}`}
                                        target="_blank"
                                    >
                                        {text}
                                    </a>
                                    :
                                    <a href={`${upload_url}/image/${record.attachmentUrl}`}
                                        target="_blank"
                                    >
                                        {text}
                                    </a>
                            }

                        </Fragment>

                )
            }
        },
        {
            title: '文件类型',
            dataIndex: "type",
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
    const updateSingle = (changedValues, allValues) => {
        const changeKey = Object.keys(changedValues)[0];
        if (!Object.values(changedValues)[0]) {
            changedValues[Object.keys(changedValues)[0]] = "nullstring"
        }
        if (changedValues.planEndTime) {
            changedValues.planEndTime = changedValues.planEndTime.format('YYYY-MM-DD HH:mm:ss')
        }
        if (changedValues.planBeginTime) {
            changedValues.planBeginTime = changedValues.planBeginTime.format('YYYY-MM-DD HH:mm:ss')
        }

        if (changeKey === "workPriority") {
            const priority = priorityList.filter(item => {
                return item.id === changedValues.workPriority
            })
            changedValues.workPriority = priority[0];
        }

        if (changeKey === "module") {
            changedValues.module = {
                id: changedValues.module
            }
        }

        if (changeKey === "sprint") {
            changedValues.sprint = {
                id: changedValues.sprint
            }
        }

        if (changeKey === "assigner") {
            changedValues.assigner = {
                id: changedValues.assigner
            }
        }

        if (changeKey === "reporter") {
            changedValues.reporter = {
                id: changedValues.reporter
            }
        }
        if (changeKey === "builder") {
            changedValues.builder = {
                id: changedValues.builder
            }
        }
        if (changeKey === "parentWorkItem") {
            changedValues.parentWorkItem = {
                id: changedValues.parentWorkItem
            }
        }
        if (changeKey === "attachment") {
            changedValues.fileName = {
                id: changedValues.attachment
            }
        }
        if (changeKey === "preDependWorkItem") {
            changedValues.preDependWorkItem = {
                id: changedValues.preDependWorkItem
            }
        }

        let data = {
            ...changedValues,
            id: workId,
            updateField: changeKey
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                setWorkInfo({ ...workInfo, ...changedValues })
                if (props.match.path === "/index/projectDetail/:id/work" ||
                    props.match.path === "/index/work" || props.match.path === "/index/:id/sprintdetail/:sprint/workItem") {
                    workList[workIndex - 1] = { ...workList[workIndex - 1], ...changedValues }
                    setWorkList([...workList])
                }
            }
        })
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

        let data = {
            extData: JSON.stringify({
                ...extData,
                ...changedValues,
            }),
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
    const [slateValue, setSlateValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]")

    const editorDesc = () => {
        let data = {
            id: workId,
            desc: slateValue,
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
        setSlateValue(workInfo.desc)
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
                            <Form.Item label="任务类型" name="eachType"
                                hasFeedback={showValidateStatus === "eachType" ? true : false}
                                validateStatus={validateStatus}
                            >

                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectEachType"
                                    bordered={fieldName === "eachType" ? true : false}
                                    suffixIcon={fieldName === "eachType" || hoverFieldName == "eachType" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("eachType")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("workPriority")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    allowClear
                                >
                                    {
                                        selectItemList && selectItemList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>
                                                <Space>
                                                    <img
                                                        src={('images/project1.png')}
                                                        alt=""
                                                        className="img-icon"
                                                    />
                                                    {item.name}
                                                </Space>
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

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
                                hasFeedback={showValidateStatus === "predependworkitem" ? true : false}
                                validateStatus={validateStatus}
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
                                            return <Select.Option value={item.user.id} key={item.id}><Space><UserIcon name={item.user?.nickname ? item.user?.nickname : item.user?.name} />{item.user?.nickname ? item.user?.nickname : item.user?.name}</Space></Select.Option>
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

            <div className="work-detail-box work-attach-box">

                <Fragment>
                    {
                        editorType ? <Fragment>
                            <DocumentEditor
                                focusEditor={true}
                                value={slateValue}
                                onChange={setSlateValue}
                                minHeight={300}
                                ticket = {ticket}
                                tenant = {tenant}
                                base_url = {base_url}
                                {...props}
                            />

                            <div className="desc-botton">

                                <Button onClick={() => cancel()}>取消</Button>
                                <Button type="primary" onClick={() => editorDesc()}>确定</Button>
                            </div>
                        </Fragment>
                            :
                            <div onClick={() => { setEditorType(true) }} className="desc-preview">
                                {
                                    slateValue && <PreviewEditor
                                        value={slateValue}
                                        onChange={setSlateValue}
                                        base_url = {base_url}
                                        ticket = {ticket}
                                        tenant = {tenant}
                                        {...props}
                                    />
                                }
                            </div>
                    }
                </Fragment>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="other-title attach-title">
                    附件列表:
                </div>
            </div>
            <div className="work-detail-box attach-box">

                <Fragment>
                    <div className="work-detail-upload">
                        <Dragger className="work-detail-upload" {...filesParams}>
                            <p className="ant-upload-drag-icon">
                                <svg className="list-img" aria-hidden="true">
                                    <use xlinkHref="#icon-uploadImg"></use>
                                </svg>上传附件dsd
                            </p>
                        </Dragger>
                    </div>
                    {
                        attachList && attachList.length > 0 && (
                            <Fragment>
                                <Table
                                    columns={attachColums}
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
export default inject("workStore")(observer(WorkBasicInfo));
