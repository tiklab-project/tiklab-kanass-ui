import React, { useEffect, useState, useRef, Fragment } from "react";
import { Form, Spin, Upload, message, Table, DatePicker, Select, InputNumber, Space, Empty } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Button from "../../common/button/Button";
import { DocumentEditor, PreviewEditor, EditorBig, EditorBigContent } from "tiklab-slate-ui";
import { SwitchPreliminaryType } from "tiklab-form-ui";
import "tiklab-slate-ui/es/tiklab-slate.css"
import "./WorkBasicInfo.scss";
import { getSessionStorage } from "../../common/utils/setSessionStorage";
import { useDebounce } from "../../common/utils/debounce";
import { SelectItem, SelectSimple } from "../../common/select"
import setImageUrl from "../../common/utils/setImageUrl";
const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const WorkBasicInfo = (props) => {
    const [detailForm] = Form.useForm();
    const [extDataForm] = Form.useForm();
    const formRef = useRef();
    const layoutExForm = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

    const layoutBottom = {
        labelCol: { span: 2 },
        wrapperCol: { span: 18 },
    };
    const [messageApi, contextHolder] = message.useMessage();

    const { workStore, workInfo, setWorkInfo } = props;
    const { workId, workList, setWorkList, findWorkAttachList, createWorkAttach,
        attachList, findFormConfig, formList, moduleList, sprintList, priorityList, editWork,
        findFieldList, findCanBeRelationParentWorkItemList, findCanBeRelationPerWorkItemList,
        userList, searchWorkById, workIndex, treeIndex,
    } = workStore;

    const [planTakeupTimeValue, setPlanTakeupTimeValue] = useState()

    const [selectItemList, setSelectItemList] = useState()

    const projectId = props.match.params.id;

    const [parentList, setParentList] = useState();
    const [preWorkList, setPreWorkList] = useState();

    const initForm = (workInfo) => {
        if (workInfo) {
            detailForm.setFieldsValue({
                assigner: workInfo.assigner?.id,
                builder: workInfo.builder?.id,
                module: workInfo.module?.id,
                workPriority: workInfo.workPriority?.id,
                workType: workInfo.workType?.id,
                percent: workInfo.percent,
                planTime: [moment(workInfo.planBeginTime || getNowFormatDate(), dateFormat), moment(workInfo.planEndTime || getNowFormatDate(), dateFormat)],
                planTakeupTime: workInfo.planTakeupTime || null,
                preDependWorkItem: workInfo.preDependWorkItem ? { value: workInfo.preDependWorkItem?.id, label: workInfo.preDependWorkItem?.title } : null,
                sprint: workInfo.sprint?.id,
                parentWorkItem: workInfo.parentWorkItem ? { value: workInfo.parentWorkItem?.id, label: workInfo.parentWorkItem?.title } : null,
                eachType: workInfo.eachType
            })
            setPlanTakeupTimeValue(workInfo.planTakeupTime)


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

    useEffect(() => {
        findFormConfig({ id: workInfo.workType.form.id })
        findFieldList({ code: "bugType" }).then(res => {
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

        const params = {
            id: workId,
            projectId: workInfo.project.id,
            workTypeId: workInfo.workType.id
        }
        findCanBeRelationParentWorkItemList(params).then(res => {
            if (res.code === 0) {
                setParentList(res.data.dataList);
            }
        })

        findCanBeRelationPerWorkItemList(params).then(res => {
            if (res.code === 0) {
                setPreWorkList(res.data.dataList);
            }
        })
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
                    record.type.indexOf("image") === -1 ?

                        <a href={setImageUrl("/file/" + record.attachmentUrl)}
                            target="_blank"
                        >
                            {text}
                        </a>
                        :
                        <a href={setImageUrl("/image/" +record.attachmentUrl)}
                            target="_blank"
                        >
                            {text}
                        </a>

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
    const updateSingle = (changedValues) => {
        let changeKey = Object.keys(changedValues)[0];
        console.log(Object.values(changedValues)[0])
        if (!Object.values(changedValues)[0]) {
            changedValues[Object.keys(changedValues)[0]] = "nullstring"
            console.log(changedValues)
        }
        if (changedValues.planTime) {
            changedValues.planBeginTime = changedValues.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            changedValues.planEndTime = changedValues.planTime[1].format('YYYY-MM-DD HH:mm:ss')
            changeKey = "planBeginTime"
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

        if (changeKey === "builder") {
            changedValues.builder = {
                id: changedValues.builder
            }
        }
        if (changeKey === "builder") {
            changedValues.builder = {
                id: changedValues.builder
            }
        }
        if (changeKey === "parentWorkItem") {
            changedValues.parentWorkItem = changedValues.parentWorkItem === "nullstring" ?
                {
                    id: "nullstring"
                }
                :
                {
                    id: changedValues.parentWorkItem.value,
                    title: changedValues.parentWorkItem.label
                }
        }

        if (changeKey === "preDependWorkItem") {
            changedValues.preDependWorkItem = changedValues.preDependWorkItem === "nullstring" ?
                {
                    id: "nullstring"
                }
                :
                {
                    id: changedValues.preDependWorkItem.value,
                    title: changedValues.preDependWorkItem.label,
                }
        }
        if (changeKey === "attachment") {
            changedValues.fileName = {
                id: changedValues.attachment
            }
        }
        let data = {
            ...changedValues,
            id: workId,
            updateField: changeKey
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                console.log(changedValues)
                setWorkInfo({ ...workInfo, ...changedValues })

                //  更新列表数据
                if ((props.match.path.indexOf("/index/projectDetail/:id/work") > -1 ||
                    props.match.path.indexOf("/index/work") > -1 ||
                    props.match.path.indexof("/index/:id/sprintdetail/:sprint/work") > -1 ||
                    props.match.path.indexof("/index/:id/versiondetail/:version/work") > -1) &&
                    (changeKey === "assigner" || changeKey === "workPriority")
                ) {

                    searchWorkById(workId).then((res) => {
                        if (res) {
                            workList[workIndex - 1] = res
                            setWorkList([...workList])
                        }
                    })
                }

                if (changeKey === "parentWorkItem") {
                    if (changedValues.parentWorkItem.id === "nullstring") {
                        searchWorkById(workId).then((res) => {
                            if (res) {
                                deleteAndQueryDeepData(workList, treeIndex)
                                workList.splice(workIndex - 1, 0, res)

                                console.log(workList)
                                setWorkList([...workList])
                            }
                        })
                    } else {

                    }

                }
            }
        })
        setFieldName("")
    }

    // 事项更换上级之后把当前事项从列表中移除
    const deleteAndQueryDeepData = (originalArray, indexes) => {
        if (indexes.length === 0) {
            return undefined; // 如果索引数组为空，返回 undefined
        }

        const currentIndex = indexes.shift(); // 获取当前层级的下标
        if (currentIndex < 0 || currentIndex >= originalArray.length) {
            return undefined; // 下标越界，返回 undefined 表示未找到数据
        }

        if (indexes.length === 0) {
            // 如果索引数组为空，表示找到了要删除的数据，将其删除并返回
            return originalArray.splice(currentIndex, 1)[0];
        }

        const currentLevelData = originalArray[currentIndex].children; // 获取当前层级的数据
        const result = deleteAndQueryDeepData(currentLevelData, indexes); // 递归查询下一层级的数据

        // 如果递归后返回了 undefined，表示在更深的层级未找到数据，则将当前层级的数据删除
        // if (result === undefined) {
        //   originalArray.splice(currentIndex, 1);
        // }

        return result;
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
    const [slateValue, setSlateValue] = useState()


    const editorDesc = () => {
        setEditorType(false);
        // let data = {
        //     id: workId,
        //     desc: slateValue,
        //     updateField: "desc"
        // }
        // editWork(data).then(res => {
        //     if (res.code === 0) {
        //         
        //     }
        // })
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

    const [parentLoading, setParentLoading] = useState(false);
    // 根据id 或者事项标题查找可被关联的上级事项
    const searchParentByWord = useDebounce((value) => {
        const params = {
            id: workId,
            projectId: projectId,
            workTypeId: workInfo.workType.id,
            title: value,
            likeId: value
        }
        setParentLoading(true)
        findCanBeRelationParentWorkItemList(params).then(res => {
            if (res.code === 0) {
                setParentLoading(false)
                setParentList(res.data.dataList);
            }
        })
    }, [500])

    const searchPerByWord = useDebounce((value) => {
        const params = {
            id: workId,
            projectId: projectId,
            workTypeId: workInfo.workType.id,
            title: value,
            likeId: value
        }
        findCanBeRelationPerWorkItemList(params).then(res => {
            console.log(res)
            if (res.code === 0) {
                setPreWorkList(res.data.dataList);
                console.log(res.data.dataList)
            }
        })
    }, [1000])

    /**
     * 更新描述
     */
    const updataDesc = useDebounce((value) => {
        setSlateValue(value);

        let data = {
            id: workId,
            desc: value,
            updateField: "desc"
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                workInfo.desc = value
            }
        })
    }, [500])

    return (
        <div className="work-info">
            {contextHolder}
            <div className="other-title">
                基本信息:
            </div>
            <div className="work-detail-box">
                <div className="detail-top">
                    <div className="left" ref={formRef}>
                        <Form
                            {...layout}
                            initialValues={{ remember: true }}
                            form={detailForm}
                            onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                            labelAlign="left"
                            colon={false}

                        >
                            <Form.Item label="缺陷类型" name="eachType"
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
                                    getPopupContainer={() => formRef.current}
                                >
                                    {
                                        selectItemList && selectItemList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>
                                                <Space>
                                                    <img
                                                        src={('images/project1.png')}
                                                        alt=""
                                                        className="img-icon-right"
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
                                    getPopupContainer={() => formRef.current}
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
                                                                className="img-icon-right"
                                                            />
                                                            :
                                                            <img
                                                                src={('images/project1.png')}
                                                                alt=""
                                                                className="img-icon-right"
                                                            />

                                                    }
                                                    {item.name}
                                                </Space>
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="报告人" name="reporter"
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
                                            return <Select.Option value={item.user?.id} key={item.id}><Space><UserIcon name = {item.user.name}/>{item.user.name}</Space></Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item> */}

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
                                    getPopupContainer={() => formRef.current}
                                >
                                    {
                                        sprintList && sprintList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>



                            <Form.Item label="负责人" name="assigner"
                            >
                                <Select
                                    placeholder="无"
                                    className="work-select"
                                    key="selectAssigner"
                                    bordered={fieldName === "assigner" ? true : false}
                                    suffixIcon={fieldName === "assigner" || hoverFieldName == "assigner" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("assigner")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("assigner")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                    getPopupContainer={() => formRef.current}
                                >
                                    {
                                        userList && userList.map((item) => {
                                            return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                        })
                                    }
                                </Select>
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
                                />
                                小时
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="right" ref={formRef}>
                        <Form
                            {...layout}
                            initialValues={{ remember: true }}
                            form={detailForm}
                            onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                            labelAlign="left"
                            colon={false}
                        >

                            <Form.Item label="事项类型" name="workType"
                                hasFeedback={showValidateStatus === "workType" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <div style={{ padding: "0 11px" }}>{workInfo.workTypeSys?.name}</div>
                            </Form.Item>
                            <Form.Item label="状态" name="workStatus"
                            >
                                <div style={{ padding: "0 11px" }}>{workInfo.workStatusNode?.name}</div>
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
                                    getPopupContainer={() => formRef.current}
                                >
                                    {
                                        moduleList && moduleList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="创建人" name="builder"
                                hasFeedback={showValidateStatus === "builder" ? true : false}
                                validateStatus={validateStatus}
                            >
                                <div style={{ padding: "0 11px" }}>{workInfo.builder?.nickname ? workInfo.builder.nickname : workInfo.builder.name}</div>
                            </Form.Item>
                            <Form.Item name="percent" label="进度"
                                hasFeedback={showValidateStatus === "percent" ? true : false}
                                validateStatus={validateStatus}
                            >

                                <InputNumber min={1} max={100}
                                    // value={workInfo?.percent ? workInfo?.percent : 0}

                                    value={workInfo.percent}

                                    key="percent"
                                    bordered={fieldName === "percent" ? true : false}
                                    suffixIcon={fieldName === "percent" || hoverFieldName == "percent" ? <CaretDownOutlined /> : false}
                                    onFocus={() => changeStyle("percent")}
                                    onBlur={() => setFieldName("")}
                                    onMouseEnter={() => setHoverFieldName("percent")}
                                    onMouseLeave={() => setHoverFieldName("")}
                                />
                                %
                            </Form.Item>
                        </Form>
                    </div>

                </div>
                <div className="detail-bottom">
                    <Form
                        {...layoutBottom}
                        initialValues={{ remember: true }}
                        form={detailForm}
                        onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                        labelAlign="left"
                        colon={false}
                    >
                        <Form.Item
                            name="planTime" label="计划日期" wrapperCol={{ span: 16 }}
                            hasFeedback={showValidateStatus === "planTime" ? true : false}
                            validateStatus={validateStatus}
                        >
                            <RangePicker
                                locale={locale}
                                format={dateFormat}
                                allowClear={false}
                                className="work-select"
                                bordered={fieldName === "planTime" ? true : false}
                                suffixIcon={fieldName === "planTime" || hoverFieldName == "planTime" ? <CaretDownOutlined /> : false}
                                onFocus={() => changeStyle("planTime")}
                                onBlur={() => setFieldName("")}
                                onMouseEnter={() => setHoverFieldName("planTime")}
                                onMouseLeave={() => setHoverFieldName("")}
                                getPopupContainer={() => formRef.current}
                                showTime
                            />
                        </Form.Item>
                        <Form.Item
                            name="parentWorkItem" label="上级事项"
                            hasFeedback={showValidateStatus === "parentWorkItem" ? true : false}
                            validateStatus={validateStatus}
                        >

                            <SelectSimple
                                name="parentWorkItem"
                                onSearchChange={(value) => searchParentByWord(value)}
                                title={"无"}
                                simpleClassName={fieldName === "parentWorkItem" ? "select-focused" : ""}
                                onFocus={() => changeStyle("parentWorkItem")}
                                onBlur={() => changeStyle("")}
                                suffixIcon={fieldName === "parentWorkItem" || hoverFieldName == "parentWorkItem" ? true : false}
                                onMouseEnter={() => setHoverFieldName("parentWorkItem")}
                                onMouseLeave={() => setHoverFieldName("")}
                            >
                                {
                                    parentList && parentList.length > 0 ? parentList.map(item => {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.title}
                                            key={item.id}
                                            imgUrl={setImageUrl(item.workTypeSys?.iconUrl)}
                                        />
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="没有查到~" />
                                }
                            </SelectSimple>
                        </Form.Item>

                        <Form.Item name="preDependWorkItem" label="前置事项"
                            hasFeedback={showValidateStatus === "preDependWorkItem" ? true : false}
                            validateStatus={validateStatus}
                        >
                            <SelectSimple
                                name="preDependWorkItem"
                                onSearchChange={(value) => searchPerByWord(value)}
                                title={"无"}
                                simpleClassName={fieldName === "preDependWorkItem" ? "select-focused" : ""}
                                onFocus={() => changeStyle("preDependWorkItem")}
                                onBlur={() => changeStyle("")}

                                suffixIcon={fieldName === "preDependWorkItem" || hoverFieldName == "preDependWorkItem" ? true : false}
                                onMouseEnter={() => setHoverFieldName("preDependWorkItem")}
                                onMouseLeave={() => setHoverFieldName("")}
                            >
                                {
                                    preWorkList && preWorkList.length > 0 ? preWorkList.map(item => {
                                        return <SelectItem
                                            value={item.id}
                                            label={item.title}
                                            key={item.id}
                                            imgUrl={setImageUrl(item.workTypeSys?.iconUrl)}
                                        >
                                            <div>事项</div>
                                        </SelectItem>
                                    })
                                        :
                                        <Empty image="/images/nodata.png" description="没有查到~" />
                                }
                            </SelectSimple>


                        </Form.Item>
                    </Form>
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
                            <div style={{ border: " #f0f0f0 solid 1px" }}>
                                <EditorBig
                                    ticket={ticket}
                                    tenant={tenant}
                                    base_url={base_url}
                                    value={slateValue}
                                    minHeight={300}
                                    // onChange={setSlateValue}
                                    onChange={(value) => updataDesc(value)}
                                    {...props}
                                >
                                    <div style={{ padding: "10px" }}>
                                        <EditorBigContent
                                            value={slateValue}
                                        />
                                    </div>


                                </EditorBig>
                            </div>

                            <div className="desc-botton">

                                <Button onClick={() => cancel()}>取消</Button>
                                <Button type="primary" onClick={() => editorDesc()}>确定</Button>
                            </div>
                        </Fragment>
                            :
                            <div onClick={() => { setEditorType(true) }} className="desc-preview">
                                {
                                    console.log(slateValue)
                                }
                                {
                                    slateValue && <PreviewEditor
                                        value={slateValue}
                                        base_url={base_url}
                                        ticket={ticket}
                                        tenant={tenant}
                                        {...props}
                                    />
                                }

                            </div>
                    }
                </Fragment>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="other-title attach-title">
                    附件:
                </div>
            </div>
            <div className="work-detail-box work-attach-box">

                <Fragment>
                    <div className="work-detail-upload">
                        <Dragger className="work-detail-upload" {...filesParams}>
                            <p className="ant-upload-drag-icon">
                                <svg className="big-icon" aria-hidden="true">
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
export default inject("workStore")(observer(WorkBasicInfo));
