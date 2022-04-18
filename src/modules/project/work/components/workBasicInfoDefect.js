import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Input, Upload, message, Table, DatePicker, InputNumber, Select, Row, Col } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { getUser, getDomainTenant } from 'doublekit-core-ui'
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Forms from "../../../../common/forms/forms";
const { Dragger } = Upload;

const WorkBasicInfo = (props) => {
    const { workStore, workLogStore, workInfo } = props;
    // 获取项目id
    const { workId, workIndex, workTypeList, findWorkAttachList, createWorkAttach, attachList,
        updateWorkItem, formList, moduleList, sprintList, priorityList, editWork, userList } = workStore;
    const { setPlanTime } = workLogStore
    // 详情表单
    const [detailForm] = Form.useForm();
    const [extDataForm] = Form.useForm();
    // 日期选择器格式
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    //完成率改变
    const percent = useRef();
    const ticket = getUser().ticket;
    const tenant = getDomainTenant();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };

    // 富文本内容
    const [priorityDes, setPriorityDes] = useState("")

    // 获取详情内容
    const [parentWorkItem, setParentWorkItem] = useState("")

    const initForm = (workInfo) => {
        if (workInfo) {
            detailForm.setFieldsValue({
                assigner: workInfo.assigner ? workInfo.assigner.name : null,
                reporter: workInfo.reporter ? workInfo.reporter.name : null,
                module: workInfo.module ? workInfo.module.moduleName : null,
                workPriority: workInfo.workPriority ? workInfo.workPriority.name : null,
                workType: workInfo.workType.name,
                percent: workInfo.percent,
                planBeginTime: moment(workInfo.planBeginTime || getNowFormatDate(), dateFormat),
                planEndTime: moment(workInfo.planEndTime || getNowFormatDate(), dateFormat),
                planTakeupTime: workInfo.planTakeupTime || null,
                predependworkitem: workInfo.preDependWorkItem ? workInfo.preDependWorkItem.title : null,
                sprint: workInfo.sprint ? workInfo.sprint.sprintName : null,
                parentWorkItem: workInfo.parentWorkItem ? workInfo.parentWorkItem.title : null,
            })
            // 父事项
            if (workInfo.parentWorkItem) {
                setParentWorkItem(workInfo.parentWorkItem.id)
            } else {
                setParentWorkItem("")
            }
            setPlanTime(workInfo.planTakeupTime)
            if (workInfo.extData) {
                extDataForm.setFieldsValue(JSON.parse(workInfo.extData))
            }
            // 富文本图片路径加域名
            const reg = /\/file\/(.*?)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)/gm
            let descReplace;

            if (workInfo.desc) {
                const regChange = `${img_url}$&`;
                descReplace = workInfo.desc.replace(reg, regChange)
            }
            setPriorityDes(descReplace)
        }
    }

    useEffect(() => {
        detailForm.resetFields()
        if (workId !== "" && workIndex !== "" && workInfo) {
            findWorkAttachList(workId)
            initForm(workInfo)
        }
        return
    }, [workInfo])


    // 上传附件的信息
    const filesParams = {
        name: 'uploadFile',
        multiple: true,
        action: `${img_url}/dfs/upload`,
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
                <a href={`${img_url}/file/${record.attachment.fileName}?tenant=${tenant}`}
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


    const changePercent = (value) => {
        let params = {
            id: workId,
            percent: value
        }
        updateWorkItem(params)
    }

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



    /**
     * 字段更新
     */
    const updateSingle = (changedValues, allValues) => {
        console.log(changedValues.allValues)
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
    /**
     * 万能表单字段更新
     */
    const updateExtData = (changedValues) => {
        let extData = JSON.parse(workInfo.extData)
        let data = {
            extData: {
                ...extData,
                ...changedValues,
            },
            id: workId
        }
        editWork(data)
    }

    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }
    return (
        <Row >
            <Col lg={24} xl={20}>
                <div className="work-detail-tab-info">
                    <div className="detail-top">
                        <div className="left">
                            <Form
                                {...layout}
                                initialValues={{ remember: true }}
                                form={detailForm}
                                onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                                labelAlign="left"
                            >
                                <Form.Item label="事项类型defect" name="workType">
                                    <Select
                                        placeholder="请选择事项类型"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkType"
                                        bordered={fieldName === "workType" ? true : false}
                                        showArrow={fieldName === "workType" ? true : false}
                                        onFocus={() => changeStyle("workType")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            workTypeList && workTypeList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id} category={item.category}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="优先级" name="workPriority">
                                    <Select
                                        placeholder="请选择优先级"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkPriority"
                                        bordered={fieldName === "workPriority" ? true : false}
                                        showArrow={fieldName === "workPriority" ? true : false}
                                        onFocus={() => changeStyle("workPriority")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            priorityList && priorityList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item label="负责人" name="assigner">
                                    <Select
                                        placeholder="请选择负责人"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkUser"
                                        bordered={fieldName === "assigner" ? true : false}
                                        showArrow={fieldName === "assigner" ? true : false}
                                        onFocus={() => changeStyle("assigner")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            userList && userList.map((item) => {
                                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item label="报告人" name="reporter">
                                    <Select
                                        placeholder="请选择报告人"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkUser"
                                        bordered={fieldName === "reporter" ? true : false}
                                        showArrow={fieldName === "reporter" ? true : false}
                                        onFocus={() => changeStyle("reporter")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            userList && userList.map((item) => {
                                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item label="所属迭代" name="sprint">
                                    <Select
                                        placeholder="请选择迭代"
                                        allowClear
                                        className="work-select"
                                        key="selectSprint"
                                        bordered={fieldName === "sprint" ? true : false}
                                        showArrow={fieldName === "sprint" ? true : false}
                                        onFocus={() => changeStyle("sprint")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            sprintList && sprintList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="所属模块" name="module">
                                    <Select
                                        placeholder="请选择模块"
                                        allowClear
                                        className="work-select"
                                        key="selectModule"
                                        bordered={fieldName === "module" ? true : false}
                                        showArrow={fieldName === "module" ? true : false}
                                        onFocus={() => changeStyle("module")}
                                        onBlur={() => setFieldName("")}
                                    >
                                        {
                                            moduleList && moduleList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="right">
                            <Form
                                {...layout}
                                initialValues={{ remember: true }}
                                form={detailForm}
                                onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                                labelAlign="left"
                            >
                                <Form.Item name="planBeginTime" label="计划开始日期" wrapperCol={{ span: 10 }}>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        showTime
                                        allowClear = {false}
                                        className="work-select"
                                        bordered={fieldName === "planBeginTime" ? true : false}
                                        showArrow={fieldName === "planBeginTime" ? true : false}
                                        onFocus={() => changeStyle("planBeginTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon = {false}
                                    />
                                </Form.Item>

                                <Form.Item name="planEndTime" label="计划结束日期" wrapperCol={{ span: 10 }}>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        showTime
                                        allowClear = {false}
                                        className="work-select"
                                        bordered={fieldName === "planEndTime" ? true : false}
                                        showArrow={fieldName === "planEndTime" ? true : false}
                                        onFocus={() => changeStyle("planEndTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon = {false}
                                    />
                                </Form.Item>

                                <Form.Item label="进度" name="percent">
                                    <InputNumber
                                        className="work-select"
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                        bordered={fieldName === "percent" ? true : false}
                                        showArrow={fieldName === "percent" ? true : false}
                                        onFocus={() => changeStyle("percent")}
                                        onBlur={() => setFieldName("")}
                                        min={1}
                                        max={100}
                                    />
                                </Form.Item>

                                <Form.Item name="planTakeupTime" label="计划用时">
                                    <Input
                                        suffix="小时"
                                        bordered={false}
                                        disabled={true}
                                    />
                                </Form.Item>
                                {
                                    parentWorkItem !== "" &&
                                    <Form.Item name="parentWorkItem" label="上级事项">
                                        <Input
                                            bordered={false}
                                            disabled={true}
                                        />
                                    </Form.Item>
                                }

                                <Form.Item name="predependworkitem" label="前置事项">
                                    <Input
                                        bordered={false}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Form>

                        </div>

                    </div>
                    <Form
                        {...layout}
                        initialValues={{ remember: true }}
                        form={extDataForm}
                        labelAlign="left"
                        onValuesChange={(changedValues, allValues) => updateExtData(changedValues, allValues)}
                        className="exdata"
                    >
                        {
                            formList && formList.map((item, index) => {
                                return <Form.Item
                                    label={item.name}
                                    name={`System${item.code}`}
                                    key={item.id}
                                    className="exdata-item"
                                ><Forms formType={item.fieldType.code} selectItemList={item.selectItemList} type="view" /></Form.Item>
                            })
                        }
                    </Form>
                    {priorityDes ? (
                        <div>
                            <div className="title">描述</div>
                            <div
                                className="priorityDes"
                                dangerouslySetInnerHTML={{
                                    __html: priorityDes,
                                }}
                            ></div>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="title">
                        附件列表:
                    </div>
                    {attachList && attachList.length > 0 && (
                        <Fragment>
                            <Table columns={attachColums}
                                dataSource={attachList}
                                pagination={false}
                                bordered={true}
                                rowKey={(record) => record.id}
                            />
                        </Fragment>
                    )}
                    <Dragger {...filesParams} style={{ height: "100px" }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">拖拽到此处上传附件或者点击上传附件</p>
                    </Dragger>
                </div>

            </Col>
        </Row>
    )
};
export default inject("workStore", "workLogStore")(observer(WorkBasicInfo));
