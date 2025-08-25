/*
 * @Descripttion: 自定义事项详情页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 11:15:41
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import {
    Form,
    Spin,
    Upload,
    message,
    Table,
    DatePicker,
    Select,
    InputNumber,
    Space,
    Empty,
    Tooltip,
    Input,
    Modal, Drawer, Progress
} from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
import { getUser } from 'tiklab-core-ui';
import {observer, inject, Provider} from "mobx-react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Button from "../../common/button/Button";
import { DocumentEditor, PreviewEditor, EditorBig } from "tiklab-slate-ui";
import { SwitchPreliminaryType } from "tiklab-form-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import { useDebounce } from "../../common/utils/debounce";
import { SelectItem, SelectSimple } from "../../common/select"
import setImageUrl from "../../common/utils/setImageUrl";
import WorkDetailSelect from "./WorkDetailSprintSelect";
import WorkDetailVersionSelect from "./WorkDetailVersionSelect";
import { changeWorkItemList, changeWorkItemParent } from "./WorkGetList";
import StageStore from "../../project/stagePlan/store/StagePlanStore";
import { updateWorkTree } from "../../project/stagePlan/component/StageListTreeChange";
import DeleteModal from "../../common/deleteModal/deleteModal";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import CircleProgress from "../../common/progress/CircleProgress";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkBasicInfoBottom from "./WorkBasicInfoBottom";
import ProductModuleStore from "../../product/module/store/ProductModuleStore";
import ModuleStore from "../../project/setting/module/store/ModuleStore";
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const getStore = (project) =>{
    if (project?.productId){
        return ProductModuleStore
    }else {
        return ModuleStore
    }
}
const WorkBasicInfo = (props) => {
    const { detailForm, getTransitionList } = props;
    const [extDataForm] = Form.useForm();
    const formRef = useRef();
    const moreFormRef = useRef();
    const exFormRef = useRef();

    // 自定义字段的栅格设置
    const layoutExForm = {
        labelCol: { lg: { span: 3 }, xxl: { span: 2 } },
        wrapperCol: { lg: { span: 21 }, xxl: { span: 22 } },
    };

    // 字段的栅格设置
    const layout = {
        labelCol: { lg: { span: 6 }, xxl: { span: 4 } },
        wrapperCol: { lg: { span: 18 }, xxl: { span: 20 } },
    };

    // 更多字段的栅格设置
    const moreLayout = {
        labelCol: { lg: { span: 6 }, xxl: { span: 8 } },
        wrapperCol: { lg: { span: 18 }, xxl: { span: 20 } },
    };

    // 选项较长的栅格设置
    const layoutBottom = {
        labelCol: { lg: { span: 3 }, xxl: { span: 2 } },
        wrapperCol: { lg: { span: 21 }, xxl: { span: 22 } },
    };

    const { workStore, workInfo, setWorkInfo, workDetailMetaData, setWorkDetailMetaData, workRelationStore, workTypeText, deep, setTabValue, taskType } = props;
    const { workId, workList, setWorkList, findWorkAttachList, createWorkAttach,
        attachList, findFormConfig, formList, selectVersionList, sprintList, priorityList, editWork,
        findCanBeRelationParentWorkItemList, findCanBeRelationPerWorkItemList,
        userList, searchWorkById, findChildrenLevel, stageList, createSelectItemRelation,
        createCheckboxSelectItemRelation, deleteWorkAttach, findFlow, permissionFieldList
    } = workStore;
    const store = {
        workRelation: workRelationStore,
        workStore: workStore
    }

    // 预估工时
    const [estimateTimeValue, setEstimateTimeValue] = useState(0)
    // 剩余工时
    const [surplusTimeValue, setSurplusTimeValue] = useState(0)

    // 项目id
    const projectId = props.match.params.id;
    const project = JSON.parse(localStorage.getItem("project"));
    const {moduleList, findModuleList} = getStore(project)
    // 项目类型
    const projectType = workInfo?.project?.projectType.type;

    // 上级事项
    const [parentList, setParentList] = useState();
    // 前置事项
    const [preWorkList, setPreWorkList] = useState();

    const [moreVisible, setMoreVisible] = useState(false)

    const [moreDesc, setMoreDesc] = useState(false);
    const [descPreviewHeight, setDescPreviewHeight] = useState(0);
    const descPreviewRef = (node) => {
        if (node) {
            setDescPreviewHeight(node.getBoundingClientRect().height);
        }
    };

    /**
     * 初始化事项的信息
     * @param {事项信息} workInfo 
     */
    const initForm = (workInfo) => {
        if (workInfo) {
            detailForm.setFieldsValue({
                assigner: workInfo.assigner?.id,
                builder: workInfo.builder?.id,
                reporter: workInfo.reporter?.id,
                module: workInfo.module?.id,
                workPriority: workInfo.workPriority?.id,
                workType: workInfo.workType?.id,
                percent: workInfo.percent,
                projectVersion: workInfo.projectVersion?.id,
                estimateTime: workInfo.estimateTime || 0,
                surplusTime: workInfo.surplusTime || 0,
                preDependWorkItem: workInfo.preDependWorkItem ? { value: workInfo.preDependWorkItem?.id, label: workInfo.preDependWorkItem?.title } : null,
                sprint: workInfo.sprint?.id,
                stage: workInfo.stage?.id,
                parentWorkItem: workInfo.parentWorkItem ? { value: workInfo.parentWorkItem?.id, label: workInfo.parentWorkItem?.title } : null,
                eachType: (!workInfo.eachType || workInfo.eachType === "nullstring") ? null : workInfo.eachType
            })
            if (workInfo.planBeginTime && workInfo.planEndTime) {
                detailForm.setFieldsValue({
                    planTime: [moment(workInfo.planBeginTime, dateFormat), moment(workInfo.planEndTime, dateFormat)],
                })
            }
            setEstimateTimeValue(workInfo.estimateTime ? workInfo.estimateTime : 0)
            setSurplusTimeValue(workInfo.surplusTime ? workInfo.surplusTime : 0)

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
        // 查找flow关联的form
        const flowId = workInfo.workType.flow.id
        // // 查找流程
        // findFlow({ id: flowId }).then(res => {
        //     if (res.code === 0) {
        //         console.log(res.data)
        //     }
        // })
        //
        // //根据事项类型，获取自定义表单字段
        // findFormConfig({ id: workInfo.workType.form.id })

        //根据事项类型，获取自定义表单字段
        findFormConfig({ id: workInfo.workType.form.id })

        // 查找附件列表
        // findWorkAttachList(workInfo.id)

        // 清空表单
        detailForm.resetFields()
        if (workId !== "" && workInfo) {
            // 初始化信息
            initForm(workInfo)
        }

        // 描述设置为查看模式
        setEditorType(false)

        const params = {
            id: workId,
            projectId: workInfo.project.id,
            workTypeId: workInfo.workType.id
        }

        // // 查找能被设置为上级的事项列表
        // findCanBeRelationParentWorkItemList(params).then(res => {
        //     if (res.code === 0) {
        //         setParentList(res.data.dataList);
        //     }
        // })

        setParentList(workDetailMetaData.canBeRelationParentWorkItemList);

        // // 根据id 或者事项标题查找可被关联成的前置事项列表
        // findCanBeRelationPerWorkItemList(params).then(res => {
        //     if (res.code === 0) {
        //         setPreWorkList(res.data.dataList);
        //     }
        // })

        setPreWorkList(workDetailMetaData.canBeRelationPerWorkItemList);

        if (project?.productId){
            findModuleList({ productId: project?.productId });
        }else{
            findModuleList({ projectId: projectId });
        }

        return null;
    }, [workInfo])


    const ticket = getUser().ticket;
    const tenant = getUser().tenant;

    // 选择计划日期
    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD';

    // 暂时作为常量
    const [validateStatus, setValidateStatus] = useState("validating")
    const [showValidateStatus, setShowValidateStatus] = useState(false)

    /**
     * 字段更新
     */
    const updateSingle = async (changedValues) => {
        let changeKey = Object.keys(changedValues)[0];
        if (!Object.values(changedValues)[0]) {
            changedValues[Object.keys(changedValues)[0]] = "nullstring"
        }
        if (changedValues.planTime) {
            changedValues.planBeginTime = changedValues.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            changedValues.planEndTime = changedValues.planTime[1].format('YYYY-MM-DD 23:59:59')
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

        if (changeKey === "projectVersion") {
            changedValues.projectVersion = {
                id: changedValues.projectVersion
            }
        }

        if (changeKey === "sprint") {
            changedValues.sprint = {
                id: changedValues.sprint,
                sprintName: changedValues.sprintName
            }
        }

        if (changeKey === "stage") {
            changedValues.stage = {
                id: changedValues.stage
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

        if (changeKey === "reporter") {
            changedValues.builder = {
                id: changedValues.builder
            }
        }

        if (changeKey === "estimateTime") {
            setEstimateTimeValue(changedValues.estimateTime)
        }

        if (changeKey === "surplusTime") {
            setSurplusTimeValue(changedValues.surplusTime)
        }

        if (changeKey === "parentWorkItem") {
            // 判断选择事项是否能被设置为父级
            if (changedValues.parentWorkItem === "nullstring") {
                changedValues.parentWorkItem = {
                    id: "nullstring"
                }
            } else {
                // const disableChange = await determineUpdate(changedValues.parentWorkItem.value)
                // if (!disableChange) {
                //     setWorkInfo({ ...workInfo })
                //     return
                // } else {
                //     changedValues.parentWorkItem = {
                //         id: changedValues.parentWorkItem.value,
                //         title: changedValues.parentWorkItem.label
                //     }
                // }
                changedValues.parentWorkItem = {
                    id: changedValues.parentWorkItem.value,
                    title: changedValues.parentWorkItem.label
                }
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
        update(data, changedValues, changeKey)

        setFieldName("")
    }

    const update = (data, changedValues, changeKey) => {
        editWork(data).then(res => {
            if (res.code === 0) {
                setWorkInfo({ ...workInfo, ...changedValues })
                getTransitionList(workInfo?.workStatusNode?.id, workInfo?.workType?.flow?.id)
                //  更新列表数据

                if (props.match.path.indexOf("/work") > -1 && (changeKey === "assigner" || changeKey === "workPriority")
                ) {
                    searchWorkById(workId).then((res) => {
                        if (res) {
                            // workList[workIndex - 1] = res
                            // 修改列表中数据
                            const list = changeWorkItemList(workList, res)
                            setWorkList([...list])
                        }
                    })
                }

                if (changeKey === "parentWorkItem") {
                    searchWorkById(workId).then((res) => {
                        const list = changeWorkItemParent(workList, changedValues.parentWorkItem?.id, res)
                        setWorkList([...list])
                    })

                }

                if (props.match.path === "/project/:id/stagePlan" && changeKey === "stage") {
                    updateWorkTree(StageStore.stageList, changedValues.stage?.id, workId)
                }
            }
            if (res.code === 3001) {
                message.info(res.msg)
                if (changeKey === "parentWorkItem") {
                    detailForm.setFieldsValue({
                        parentWorkItem: workInfo.parentWorkItem ? { value: workInfo.parentWorkItem?.id, label: workInfo.parentWorkItem?.title } : null
                    })
                }

                if (changeKey === "preDependWorkItem") {
                    detailForm.setFieldsValue({
                        preDependWorkItem: workInfo.preDependWorkItem ? { value: workInfo.preDependWorkItem?.id, label: workInfo.preDependWorkItem?.title } : null
                    })
                }

            }
        })
    }

  

    /**
     * 更新预估时间
     * @param {预估时间} input
     */
    const updataEstimateTime = (input) => {
        const value = input.target.value
        if (value < 0){
            message.info("预估时间不能小于0")
            return;
        }
        setEstimateTimeValue(value)
        const data = {
            updateField: "estimateTime",
            id: workId,
            estimateTime: value
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                setWorkInfo({ ...workInfo, estimateTime: value })
            }
        })
        setFieldName("")
    }

    /**
     * 更新剩余时间
     * @param {剩余时间} input
     */
    const updataSurplusTime = (input) => {
        const value = input.target.value
        if (value < 0){
            message.info("剩余时间不能小于0")
            return;
        }
        setSurplusTimeValue(value)
        const data = {
            updateField: "surplusTime",
            id: workId,
            surplusTime: value
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                setWorkInfo({ ...workInfo, surplusTime: value })
            }
        })
        setFieldName("")
    }
    
    /**
     * 自定义表单字段更新
     */
    const updateExtData = (changedValues, allValues) => {
        console.log(changedValues, allValues, formList)

        createSelectRelation(changedValues)

        let extData = JSON.parse(workInfo.extData)
        let data = {
            extData: JSON.stringify({
                ...extData,
                ...changedValues,
            }),
            id: workId,
            updateField: "extData"
        }
        workInfo.extData = JSON.stringify({
            ...extData,
            ...changedValues,
        })
        editWork(data)
    }

    /**
     * 创建时间与字段选项的关联关系
     * @param {*} changedValues 
     */
    const createSelectRelation = (changedValues) => {
        //创建关联关系 
        let fieldId = "";
        let selectItemId = "";
        const key = Object.keys(changedValues)[0];
        const code = key.replace("System", '');
        const formItem = formList.filter(item => item.code === code);
        const fieldType = formItem[0]?.fieldType.code;
        fieldId = formItem[0]?.id;
        if (fieldType === "select" || fieldType === "radio" || fieldType === "checkbox") {
            const selectItemList = formItem[0]?.selectItemList;
            if (fieldType === "select" || fieldType === "radio") {
                const select = selectItemList.filter(item => item.value === Object.values(changedValues)[0]);
                selectItemId = select[0]?.id;
                const params = {
                    fieldId: fieldId,
                    selectItemId: select[0]?.id,
                    relationId: workId
                }
                //创建时间与单个字段选项的关联关系
                createSelectItemRelation(params)
            }
            if (fieldType === "checkbox") {
                console.log(Object.values(changedValues)[0])
                const values = Object.values(changedValues)[0];
                const select = selectItemList.filter(item => values.indexOf(item.value) !== -1);

                const ids = select.map(item => item.id)
                console.log(ids)
                const params = {
                    fieldId: fieldId,
                    selectItemIds: ids,
                    relationId: workId
                }
                //创建时间与多选字段选项的关联关系
                createCheckboxSelectItemRelation(params)
            }
        }

    }

    // 鼠标放置的字段的名字
    const [hoverFieldName, setHoverFieldName] = useState("")
    // 聚焦的字段的名字
    const [fieldName, setFieldName] = useState("")
    // 点击字段
    const changeStyle = (value, fieldCode) => {
        if (!isPermissionField(fieldCode)) {
            return;
        }
        setFieldName(value)
    }

    // 转换描述编辑模式setEditorType
    const [editorType, setEditorType] = useState(false);
    // 描述内容
    const [slateValue, setSlateValue] = useState()

    // 转换描述编辑模式
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

    // 取消编辑描述
    const cancel = () => {
        setEditorType(false);
        setSlateValue(workInfo.desc)
    }

    
    // 根据id 或者事项标题查找可被关联的上级事项
    const searchParentByWord = useDebounce((value) => {
        const params = {
            id: workId,
            projectId: projectId,
            workTypeId: workInfo.workType.id,
            title: value,
            likeId: value
        }
        findCanBeRelationParentWorkItemList(params).then(res => {
            if (res.code === 0) {
                setParentList(res.data.dataList);
            }
        })
    }, [500])

    /**
     * 根据id 或者事项标题查找可被关联成的前置事项列表
     */
    const searchPerByWord = useDebounce((value) => {
        const params = {
            id: workId,
            projectId: projectId,
            workTypeId: workInfo.workType.id,
            title: value,
            likeId: value
        }
        findCanBeRelationPerWorkItemList(params).then(res => {
            if (res.code === 0) {
                setPreWorkList(res.data.dataList);
            }
        })
    }, [1000])

    /**
     * 更新描述
     */
    const updataDesc = useDebounce((value) => {
        setSlateValue();
        let data = {
            id: workId,
            desc: value,
            updateField: "desc"
        }
        editWork(data).then(res => {
            if (res.code === 0) {
                setSlateValue(value);
                workInfo.desc = value
            }
        })
    }, [500])


    //自定义表单列表
    const [visableCustomForm, setVisableCustomForm] = useState(false);

    /**
     * 展开自定义表单
     */
    const openCustomForm = () => {
        setVisableCustomForm(!visableCustomForm)
        setMoreVisible(!moreVisible)
    }

    /**
     * 展开更多描述
     */
    const showMoreDesc = () => {
        setMoreDesc(!moreDesc);
    }

     /**
     * 查找当前用户是否有当前的功能权限
     * @param {功能编码} code 
     * @returns 
     */
    const isPermissionField = (code) => {
        return permissionFieldList.indexOf(code) > -1 ? false : true
    }

    /**
     * 鼠标进入表单，显示为编辑模式
     * @param {*} code 
     */
    const onMouseEnter = (code) => {
        if (!isPermissionField(code)) {
            setHoverFieldName(code)
        }

    }

     /**
     * 点击描述，转为可编辑模式
     */
    const switchEditorDesc = () => {
        console.log(isPermissionField("desc"))
        if (!isPermissionField("desc")) {
            setEditorType(true)
        }

    }

    const setStatuStyle = (status) => {
        let name;
        switch (status) {
            case "TODO":
                name = "work-status-todo";
                break;
            case "DONE":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    return (
        <Provider {...store}>
            <div className="work-info">
                <div className="work-info-left">
                    <div className="other-title">
                        基本信息
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
                                    <Form.Item label="优先级" name="workPriority"
                                               hasFeedback={false}
                                               validateStatus={"validating"}
                                    >
                                        <Select
                                            placeholder="无"
                                            className="work-select"
                                            key="selectWorkPriority"
                                            bordered={fieldName === "workPriority" ? true : false}
                                            suffixIcon={fieldName === "workPriority" || hoverFieldName == "workPriority" ? <CaretDownOutlined /> : false}
                                            onFocus={() => changeStyle("workPriority", "workPriority")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => onMouseEnter("workPriority")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            allowClear
                                            getPopupContainer={() => detailTopFormRef.current}
                                            disabled={!isPermissionField("workPriority")}
                                            dropdownMatchSelectWidth={false} // 下拉菜单不自适应宽度
                                        >
                                            {
                                                priorityList && priorityList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "3px"
                                                        }}>
                                                            <ImgComponent
                                                                src={item.iconUrl}
                                                                alt=""
                                                                className="img-icon"
                                                            />
                                                            {item.name}
                                                        </div>
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>



                                    {
                                        (projectType === "scrum" || projectType === "kanban" || projectType === "hybrid") && <Form.Item
                                            label="所属迭代" name="sprint"
                                            hasFeedback={showValidateStatus === "sprint" ? true : false}
                                            validateStatus={validateStatus}
                                        >
                                            <WorkDetailSelect
                                                selectList={sprintList}
                                                workId={workId}
                                                workDetailMetaData={workDetailMetaData}
                                                sprint={workInfo?.sprint}
                                                hoverFieldName={hoverFieldName}
                                                setHoverFieldName={setHoverFieldName}
                                                workStore={workStore}
                                                workStatusCode={workInfo.workStatusCode}
                                                disabled={isPermissionField("sprint")}
                                            />
                                        </Form.Item>
                                    }

                                    {
                                        (projectType === "nomal" || projectType === "hybrid" || projectType === "ipd") && <Form.Item
                                            label="所属阶段" name="stage"
                                            hasFeedback={showValidateStatus === "stage" ? true : false}
                                            validateStatus={validateStatus}
                                        >
                                            <Select
                                                placeholder="无"
                                                className="work-select"
                                                key="selectStage"
                                                bordered={fieldName === "stage" ? true : false}
                                                suffixIcon={fieldName === "stage" || hoverFieldName === "stage" ? <CaretDownOutlined /> : false}
                                                onFocus={() => changeStyle("stage", "stage")}
                                                onBlur={() => setFieldName("")}
                                                onMouseEnter={() => onMouseEnter("stage")}
                                                onMouseLeave={() => setHoverFieldName("")}
                                                getPopupContainer={() => formRef.current}
                                                disabled={isPermissionField("stage")}
                                            >
                                                {
                                                    stageList && stageList.map((item) => {
                                                        return <Select.Option value={item.id} key={item.id}>
                                                            {item.stageName}
                                                        </Select.Option>
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    }
                                    {/*/!* 空占位符 - 方法3 *!/*/}
                                    <Form.Item
                                        label=" "
                                        colon={false}
                                        style={{ marginBottom: 0, padding: '4px 0' }} // 调整间距
                                    >
                                        <div style={{ height: '32px' }}></div>
                                    </Form.Item>

                                    {/*<Form.Item label="需求类型" name="eachType"*/}
                                    {/*           hasFeedback={showValidateStatus === "eachType" ? true : false}*/}
                                    {/*           validateStatus={validateStatus}*/}
                                    {/*>*/}
                                    {/*    <Select*/}
                                    {/*        placeholder="无"*/}
                                    {/*        className="work-select"*/}
                                    {/*        key="selectEachType"*/}
                                    {/*        bordered={fieldName === "eachType" ? true : false}*/}
                                    {/*        suffixIcon={fieldName === "eachType" || hoverFieldName == "eachType" ? <CaretDownOutlined /> : false}*/}
                                    {/*        onFocus={() => changeStyle("eachType", "demandType")}*/}
                                    {/*        onBlur={() => setFieldName("")}*/}
                                    {/*        onMouseEnter={() => onMouseEnter("demandType")}*/}
                                    {/*        onMouseLeave={() => setHoverFieldName("")}*/}
                                    {/*        allowClear*/}
                                    {/*        getPopupContainer={() => formRef.current}*/}
                                    {/*        disabled={isPermissionField("demandType")}*/}
                                    {/*    >*/}
                                    {/*        {*/}
                                    {/*            selectItemList && selectItemList.map((item) => {*/}
                                    {/*                return <Select.Option value={item.id} key={item.id}>*/}
                                    {/*                    <Space>*/}
                                    {/*                        {item.name}*/}
                                    {/*                    </Space>*/}
                                    {/*                </Select.Option>*/}
                                    {/*            })*/}
                                    {/*        }*/}
                                    {/*    </Select>*/}
                                    {/*</Form.Item>*/}

                                    {
                                        visableCustomForm && <>
                                            <Form.Item
                                                label="审核人"
                                                name="reporter"
                                            >
                                                <Select
                                                    placeholder="无"
                                                    className="work-select"
                                                    key="selectWorkUser"
                                                    bordered={fieldName === "reporter" ? true : false}
                                                    suffixIcon={fieldName === "reporter" || hoverFieldName == "reporter" ? <CaretDownOutlined /> : false}
                                                    onFocus={() => changeStyle("reporter", "reporter")}
                                                    onBlur={() => setFieldName("")}
                                                    onMouseEnter={() => onMouseEnter("reporter")}
                                                    onMouseLeave={() => setHoverFieldName("")}
                                                    allowClear
                                                    getPopupContainer={() => formRef.current}
                                                    disabled={isPermissionField("reporter")}
                                                >
                                                    {
                                                        userList && userList.map((item) => {
                                                            return <Select.Option value={item.user?.id} key={item.id}><Space>{item.user?.nickname}</Space></Select.Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>

                                            <Form.Item label="创建人" name="builder"
                                                       hasFeedback={showValidateStatus === "builder" ? true : false}
                                                       validateStatus={validateStatus}
                                            >
                                                <div className="builder-and-more-info">
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        padding: "0 11px"
                                                    }}>
                                                        <UserIcon name={workInfo.builder.nickname} />
                                                        {workInfo.builder?.nickname ? workInfo.builder.nickname : workInfo.builder.name}
                                                    </div>
                                                </div>
                                            </Form.Item>


                                            <Form.Item name="estimateTime" label="预估/剩余工时"
                                                       hasFeedback={showValidateStatus === "estimateTime" ? true : false}
                                                       validateStatus={validateStatus}
                                            >
                                                <Input
                                                    type="number"
                                                    className="workLog-input"
                                                    suffix="小时"
                                                    bordered={fieldName === "estimateTime" ? true : false}
                                                    suffixIcon={fieldName === "estimateTime" || hoverFieldName == "estimateTime" ? <CaretDownOutlined /> : false}
                                                    onFocus={() => changeStyle("estimateTime", "estimateTime")}
                                                    onBlur={() => setFieldName("")}
                                                    onMouseEnter={() => setHoverFieldName("estimateTime")}
                                                    onMouseLeave={() => setHoverFieldName("")}
                                                    onChange={(value) => updataEstimateTime(value)}
                                                    value={estimateTimeValue}
                                                    disabled={isPermissionField("estimateTime")}
                                                />

                                                <Input
                                                    type="number"
                                                    className="workLog-input"
                                                    suffix="小时"
                                                    bordered={fieldName === "surplusTime" ? true : false}
                                                    suffixIcon={fieldName === "surplusTime" || hoverFieldName == "surplusTime" ? <CaretDownOutlined /> : false}
                                                    onFocus={() => changeStyle("surplusTime", "surplusTime")}
                                                    onBlur={() => setFieldName("")}
                                                    onMouseEnter={() => setHoverFieldName("surplusTime")}
                                                    onMouseLeave={() => setHoverFieldName("")}
                                                    onChange={(value) => updataSurplusTime(value)}
                                                    value={surplusTimeValue}
                                                    disabled={isPermissionField("surplusTime")}
                                                />

                                            </Form.Item>

                                            <Form.Item
                                                name="planTime" label="计划日期"
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
                                                    onFocus={() => changeStyle("planTime", "planTime")}
                                                    onBlur={() => setFieldName("")}
                                                    onMouseEnter={() => onMouseEnter("planTime")}
                                                    onMouseLeave={() => setHoverFieldName("")}
                                                    getPopupContainer={() => formRef.current}
                                                    disabled={isPermissionField("planTime")}
                                                />
                                            </Form.Item>
                                        </>
                                    }
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
                                    <Form.Item label="状态" name="workStatus"
                                    >
                                        <div className={`work-status ${setStatuStyle(workInfo.workStatusNode?.status)}`} style={{ padding: "0 11px" }}>{workInfo.workStatusNode?.name}</div>
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
                                            onFocus={() => changeStyle("module", "module")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => onMouseEnter("module")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            allowClear
                                            getPopupContainer={() => formRef.current}
                                            disabled={isPermissionField("module")}
                                        >
                                            {
                                                moduleList && moduleList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="所属版本" name="projectVersion"
                                               hasFeedback={showValidateStatus === "projectVersion" ? true : false}
                                               validateStatus={validateStatus}
                                    >
                                        <div className="builder-and-more-info">
                                            <WorkDetailVersionSelect
                                                selectList={selectVersionList}
                                                workId={workId}
                                                workDetailMetaData={workDetailMetaData}
                                                version={workInfo?.projectVersion}
                                                hoverFieldName={hoverFieldName}
                                                setHoverFieldName={setHoverFieldName}
                                                workStore={workStore}
                                                workStatusCode={workInfo.workStatusCode}
                                                disabled={isPermissionField("projectVersion")}
                                            />
                                            <div className="form-custom-open" onClick={() => openCustomForm()}>
                                                <svg className={`img-icon ${moreVisible ? "open" : "close"}`} aria-hidden="true">
                                                    <use xlinkHref="#icon-left"></use>
                                                </svg>
                                            </div>
                                        </div>
                                    </Form.Item>

                                    {
                                        visableCustomForm && <>
                                            <Form.Item label="负责人" name="assigner"
                                            >
                                                <div className="builder-and-more-info">
                                                    <Select
                                                        placeholder="无"
                                                        className="work-select"
                                                        key="selectAssigner"
                                                        bordered={fieldName === "assigner" ? true : false}
                                                        suffixIcon={fieldName === "assigner" || hoverFieldName == "assigner" ? <CaretDownOutlined /> : false}
                                                        onFocus={() => changeStyle("assigner", "assigner")}
                                                        onBlur={() => setFieldName("")}
                                                        onMouseEnter={() => onMouseEnter("assigner")}
                                                        onMouseLeave={() => setHoverFieldName("")}
                                                        getPopupContainer={() => detailTopFormRef.current}
                                                        disabled={!isPermissionField("assigner")}
                                                        dropdownMatchSelectWidth={false} // 下拉菜单不自适应宽度
                                                    >
                                                        {
                                                            userList && userList.map((item) => {
                                                                return <Select.Option value={item.user?.id} key={item.user?.id}>
                                                                    <div style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "3px"
                                                                    }}>
                                                                        <UserIcon name={item.user?.nickname} size={"small"} />
                                                                        {item.user?.nickname ? item.user?.nickname : item.user?.name}
                                                                    </div>
                                                                </Select.Option>
                                                            })
                                                        }
                                                    </Select>

                                                </div>
                                            </Form.Item>
                                            <Form.Item label="事项类型" name="workType"
                                                       hasFeedback={showValidateStatus === "workType" ? true : false}
                                                       validateStatus={validateStatus}
                                            >
                                                <div style={{ padding: "0 11px" }}>{workInfo.workTypeSys?.name}</div>
                                            </Form.Item>

                                            <Form.Item name="percent" label="进度"
                                                       hasFeedback={showValidateStatus === "percent" ? true : false}
                                                       validateStatus={validateStatus}
                                            >
                                                <div style={{ padding: "0 11px" }}>
                                                    <CircleProgress
                                                        percent={
                                                            workInfo?.estimateTime === 0 || null ? 0 : (workInfo?.estimateTime - workInfo?.surplusTime) * 100 / workInfo?.estimateTime
                                                        }
                                                        size={"mini"}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <Form.Item name="buildTime" label="创建时间"
                                                       hasFeedback={showValidateStatus === "buildTime" ? true : false}
                                                       validateStatus={validateStatus}
                                            >
                                                <div style={{ padding: "0 11px" }}>{workInfo.buildTime}</div>
                                            </Form.Item>
                                        </>
                                    }
                                </Form>
                            </div>

                        </div>
                        <Drawer
                            title={"更多信息"}
                            visible={moreVisible && false}
                            onClose={() => setMoreVisible(false)}
                            footer={null}
                            width={400}
                            height={"100%"}
                            className={"work-detail-more-drawer"}
                        >
                            <div className={"work-detail-more-modal"} ref={moreFormRef}>
                                <Form
                                    {...moreLayout}
                                    initialValues={{ remember: true }}
                                    form={detailForm}
                                    onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                                    labelAlign="left"
                                    layout={"vertical"}
                                    colon={false}
                                >
                                    <Form.Item
                                        label="审核人"
                                        name="reporter"
                                    >
                                        <Select
                                            placeholder="无"
                                            className="work-select"
                                            key="selectWorkUser"
                                            bordered={false}
                                            suffixIcon={fieldName === "reporter" || hoverFieldName == "reporter" ? <CaretDownOutlined /> : false}
                                            onFocus={() => changeStyle("reporter", "reporter")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => onMouseEnter("reporter")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            allowClear
                                            getPopupContainer={() => moreFormRef.current}
                                            disabled={isPermissionField("reporter")}
                                        >
                                            {
                                                userList && userList.map((item) => {
                                                    return <Select.Option value={item.user?.id} key={item.id}><Space>{item.user?.nickname}</Space></Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="planTime" label="计划日期"
                                        hasFeedback={showValidateStatus === "planTime" ? true : false}
                                        validateStatus={validateStatus}
                                    >
                                        <RangePicker
                                            locale={locale}
                                            format={dateFormat}
                                            allowClear={false}
                                            className="work-select"
                                            bordered={false}
                                            suffixIcon={fieldName === "planTime" || hoverFieldName == "planTime" ? <CaretDownOutlined /> : false}
                                            onFocus={() => changeStyle("planTime", "planTime")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => onMouseEnter("planTime")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            getPopupContainer={() => moreFormRef.current}
                                            disabled={isPermissionField("planTime")}
                                        />
                                    </Form.Item>

                                    <Form.Item name="estimateTime" label="预估/剩余工时"
                                               hasFeedback={showValidateStatus === "estimateTime" ? true : false}
                                               validateStatus={validateStatus}
                                    >
                                        <Input
                                            type="number"
                                            className="workLog-input"
                                            suffix="小时"
                                            bordered={false}
                                            suffixIcon={fieldName === "estimateTime" || hoverFieldName == "estimateTime" ? <CaretDownOutlined /> : false}
                                            onFocus={() => changeStyle("estimateTime", "estimateTime")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => setHoverFieldName("estimateTime")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            onChange={(value) => updataEstimateTime(value)}
                                            value={estimateTimeValue}
                                            disabled={isPermissionField("estimateTime")}
                                        />

                                        <Input
                                            type="number"
                                            className="workLog-input"
                                            suffix="小时"
                                            bordered={false}
                                            suffixIcon={fieldName === "surplusTime" || hoverFieldName == "surplusTime" ? <CaretDownOutlined /> : false}
                                            onFocus={() => changeStyle("surplusTime", "surplusTime")}
                                            onBlur={() => setFieldName("")}
                                            onMouseEnter={() => setHoverFieldName("surplusTime")}
                                            onMouseLeave={() => setHoverFieldName("")}
                                            onChange={(value) => updataSurplusTime(value)}
                                            value={surplusTimeValue}
                                            disabled={isPermissionField("surplusTime")}
                                        />

                                    </Form.Item>

                                    <Form.Item name="percent" label="进度"
                                               hasFeedback={showValidateStatus === "percent" ? true : false}
                                               validateStatus={validateStatus}
                                    >
                                        <div style={{ padding: "0 11px" }}>
                                            <Progress
                                                percent={
                                                    workInfo?.estimateTime === 0 || null ? 0 :
                                                        Number(
                                                            ((workInfo?.estimateTime - workInfo?.surplusTime) * 100 / workInfo?.estimateTime)
                                                                .toFixed(2)
                                                        )
                                                }
                                                status={"normal"}
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item name="buildTime" label="创建时间"
                                               hasFeedback={showValidateStatus === "buildTime" ? true : false}
                                               validateStatus={validateStatus}
                                    >
                                        <div style={{ padding: "0 11px" }}>{workInfo.buildTime}</div>
                                    </Form.Item>
                                </Form>
                            </div>

                        </Drawer>


                        {
                            visableCustomForm && <>
                                <div className="detail-bottom">
                                    <Form
                                        {...layoutBottom}
                                        initialValues={{ remember: true }}
                                        form={detailForm}
                                        onValuesChange={(changedValues, allValues) => updateSingle(changedValues, allValues)}
                                        labelAlign="left"
                                        colon={false}
                                    >

                                        {/*<Form.Item*/}
                                        {/*    name="parentWorkItem" label="上级事项"*/}
                                        {/*    hasFeedback={showValidateStatus === "parentWorkItem" ? true : false}*/}
                                        {/*    validateStatus={validateStatus}*/}
                                        {/*>*/}
                                        {/*    <SelectSimple*/}
                                        {/*        name="parentWorkItem"*/}
                                        {/*        onSearchChange={(value) => searchParentByWord(value)}*/}
                                        {/*        title={"无"}*/}
                                        {/*        simpleClassName={fieldName === "parentWorkItem" ? "select-focused" : ""}*/}
                                        {/*        onFocus={() => changeStyle("parentWorkItem", "parentWorkItem")}*/}
                                        {/*        onBlur={() => setFieldName("")}*/}
                                        {/*        suffixIcon={fieldName === "parentWorkItem" || hoverFieldName == "parentWorkItem" ? true : false}*/}
                                        {/*        onMouseEnter={() => setHoverFieldName("parentWorkItem")}*/}
                                        {/*        onMouseLeave={() => setHoverFieldName("")}*/}
                                        {/*        disabled={isPermissionField("parentWorkItem")}*/}
                                        {/*    >*/}
                                        {/*        {*/}
                                        {/*            parentList && parentList.length > 0 ? parentList.map(item => {*/}
                                        {/*                    return <SelectItem*/}
                                        {/*                        value={item.id}*/}
                                        {/*                        label={item.title}*/}
                                        {/*                        key={item.id}*/}
                                        {/*                        imgUrl={item.workTypeSys?.iconUrl}*/}
                                        {/*                    />*/}
                                        {/*                })*/}
                                        {/*                :*/}
                                        {/*                <ProjectEmpty description="没有可选事项~" />*/}
                                        {/*        }*/}
                                        {/*    </SelectSimple>*/}
                                        {/*</Form.Item>*/}

                                        {/*<Form.Item name="preDependWorkItem" label="前置事项"*/}
                                        {/*           hasFeedback={showValidateStatus === "preDependWorkItem" ? true : false}*/}
                                        {/*           validateStatus={validateStatus}*/}
                                        {/*>*/}
                                        {/*    <SelectSimple*/}
                                        {/*        name="preDependWorkItem"*/}
                                        {/*        onSearchChange={(value) => searchPerByWord(value)}*/}
                                        {/*        title={"无"}*/}
                                        {/*        simpleClassName={fieldName === "preDependWorkItem" ? "select-focused" : ""}*/}
                                        {/*        onFocus={() => changeStyle("preDependWorkItem", "preDependWorkItem")}*/}
                                        {/*        onBlur={() => setFieldName("")}*/}
                                        {/*        suffixIcon={fieldName === "preDependWorkItem" || hoverFieldName == "preDependWorkItem" ? true : false}*/}
                                        {/*        onMouseEnter={() => setHoverFieldName("preDependWorkItem")}*/}
                                        {/*        onMouseLeave={() => setHoverFieldName("")}*/}
                                        {/*        disabled={isPermissionField("preDependWorkItem")}*/}
                                        {/*    >*/}
                                        {/*        {*/}
                                        {/*            preWorkList && preWorkList.length > 0 ? preWorkList.map(item => {*/}
                                        {/*                    return <SelectItem*/}
                                        {/*                        value={item.id}*/}
                                        {/*                        label={item.title}*/}
                                        {/*                        key={item.id}*/}
                                        {/*                        imgUrl={item.workTypeSys?.iconUrl}*/}
                                        {/*                    >*/}
                                        {/*                        <div>事项</div>*/}
                                        {/*                    </SelectItem>*/}
                                        {/*                })*/}
                                        {/*                :*/}
                                        {/*                <ProjectEmpty description="没有可选事项~" />*/}
                                        {/*        }*/}
                                        {/*    </SelectSimple>*/}

                                        {/*</Form.Item>*/}
                                    </Form>
                                </div>
                                {/*<div ref={exFormRef}>*/}
                                {/*    {*/}
                                {/*        visableCustomForm ? <Form*/}
                                {/*                {...layoutExForm}*/}
                                {/*                initialValues={{ remember: true }}*/}
                                {/*                form={extDataForm}*/}
                                {/*                labelAlign="left"*/}
                                {/*                onValuesChange={(changedValues, allValues) => updateExtData(changedValues, allValues)}*/}
                                {/*                className="exdata"*/}
                                {/*                colon={false}*/}
                                {/*            >*/}
                                {/*                {*/}
                                {/*                    formList && formList.map((item, index) => {*/}
                                {/*                        return <Form.Item*/}
                                {/*                            label={item.name}*/}
                                {/*                            name={`System${item.code}`}*/}
                                {/*                            id={item.id}*/}
                                {/*                            key={item.id}*/}
                                {/*                            className="exdata-item"*/}
                                {/*                        >*/}
                                {/*                            <SwitchPreliminaryType*/}
                                {/*                                code={item.fieldType.code}*/}
                                {/*                                bordered={fieldName === `System${item.code}` ? true : false}*/}
                                {/*                                showArrow={fieldName === `System${item.code}` ? true : false}*/}
                                {/*                                onMouseEnter={() => onMouseEnter(`System${item.code}`)}*/}
                                {/*                                onMouseLeave={() => setFieldName("")}*/}
                                {/*                                fieldId={item.id}*/}
                                {/*                                // onChange={onChange}*/}
                                {/*                                data={item.selectItemList}*/}
                                {/*                                getPopupContainer={() => exFormRef.current}*/}
                                {/*                                disabled={isPermissionField(item.code)}*/}
                                {/*                            />*/}
                                {/*                        </Form.Item>*/}
                                {/*                    })*/}
                                {/*                }*/}
                                {/*            </Form>*/}
                                {/*            : <></>*/}
                                {/*    }*/}
                                {/*</div>*/}
                            </>
                        }

                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="other-title">描述</div>
                    </div>

                    <div className={`work-detail-box desc-box ${moreDesc ? "more-desc":""}`}>

                        <Fragment>
                            {
                                editorType ? <Fragment>
                                        <div style={{ border: " #f0f0f0 solid 1px", height: "300px" }}>
                                            <DocumentEditor
                                                value={slateValue}
                                                ticket={ticket}
                                                tenant={tenant}
                                                base_url={base_url}
                                                viewImageUrl = "/image"
                                                img_url = {base_url==='/' ? '':base_url}
                                                minHeight={300}
                                                onChange={(value) => updataDesc(value)}
                                                {...props}
                                            />
                                        </div>

                                        <div className="desc-botton">
                                            <Button onClick={() => cancel()}>取消</Button>
                                            <Button type="primary" onClick={() => editorDesc()}>确定</Button>
                                        </div>
                                    </Fragment>
                                    :
                                    <div onClick={() => switchEditorDesc()} className="desc-preview" ref={descPreviewRef}>
                                        {
                                            slateValue && <PreviewEditor
                                                value={slateValue}
                                                base_url={base_url}
                                                viewImageUrl = "/image"
                                                img_url = {base_url==='/' ? '':base_url}
                                                ticket={ticket}
                                                tenant={tenant}
                                                {...props}
                                            />
                                        }

                                    </div>
                            }
                        </Fragment>
                    </div>
                    <div className="work-detail-box more-desc-box">
                        {
                            descPreviewHeight > 342 &&
                            <div className="form-custom-open" onClick={() => showMoreDesc()}>
                                <svg className={`img-icon ${moreDesc ? "open" : "close"}`} aria-hidden="true">
                                    <use xlinkHref="#icon-left"></use>
                                </svg>
                            </div>
                        }
                    </div>

                    <div className="work-detail-box comment-box">
                        <WorkBasicInfoBottom {...props}/>
                    </div>
                </div>
            </div>
        </Provider>
    )
};
export default inject("workStore")(observer(WorkBasicInfo));
