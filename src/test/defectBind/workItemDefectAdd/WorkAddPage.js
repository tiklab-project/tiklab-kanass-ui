/*
 * @Descripttion: 事项添加信息页面
 */
import React, {useState, useEffect, useImperativeHandle, Fragment, useRef} from "react";
import {Form, Input, Select, DatePicker, message, Button, Tooltip, Space, Table} from "antd";
import { observer } from "mobx-react";
import 'moment/locale/zh-cn';
import moment from 'moment';
import "./WorkAddPage.scss";
import { DocumentEditor } from "tiklab-slate-ui";
import workItemStore from "./WorkStore";
import {useHistory} from "react-router-dom";
import workItemBindStore from "../defect/store/WorkItemBindStore";
import {getUser} from "tiklab-core-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import setImageUrl from "../../../common/utils/setImageUrl";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import Dragger from "antd/es/upload/Dragger";
import {createWorkTestCaseFn} from "../../testcase/components/testCaseTableFn";

const { RangePicker } = DatePicker;

const WorkAddPage = (props) => {
    const { testPlanId,projectId, workAddPageRef, setShowAddModel, setIsEditStart, handleCancel,caseId} = props;

    const [form] = Form.useForm();
    const { moduleList, selectSprintList, userList,  projectList,
         stageList, addWork,
        priorityList, workId,
        setWorkId,
        selectVersionList,
        findWorkItemCreateMetaData, createWorkAttach
    } = workItemStore;
    const {createWorkItemBind,findWorkItemBindPage} = workItemBindStore;
    const editorRef = useRef(null);


    const { ticket,tenant } =getUser()


    const sprintId = null;
    const versionId =  null;

    const [projectType, setProjectType] = useState( {});
    const [slateValue, setSlateValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]");
    const [selectItem, setSelectItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const [workType, setWorkType] = useState();

    const repositoryId = sessionStorage.getItem("repositoryId")
    const path = history.location.pathname;

    // 上传附件的信息
    const upload_url = env === "local" ? base_url : "";
    const formRef = useRef();

    useEffect(() => {
        form.setFieldsValue({
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })
        const param = {projectId: projectId}
        findWorkItemCreateMetaData(param).then(res => {
            if(res.code !== 0) {
                message.error("请求错误");
                return
            }

            setWorkType(res.data?.workTypeDm)

            // 事项子类型下拉框
            setSelectItem(res.data.fieldList[0][0])
            form.setFieldsValue({
                eachType: res.data.fieldList[0][0]?.selectItemList[0]?.id,
            })


            // 设置优先级
            form.setFieldsValue({
                workPriority: res.data.fieldList[1][0]?.selectItemList[0].id
            })

            const project = res.data.project;

            if (project){
                form.setFieldsValue({
                    parentWorkItem: workId,
                    project: projectId,
                    sprint: sprintId,
                    assigner: project?.master.id,
                    planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
                })

                // 设置模块
                // form.setFieldsValue({
                //     module: res.data.moduleList[0]?.id
                // })

                // 设置所选版本、迭代、计划
                // 敏捷模型
                console.log("sprintId:  " + sprintId)
                if (projectType === 'scrum'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }

                // 瀑布模型
                if (projectType === 'nomal'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // 看板模型
                if (projectType === 'kanban'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }


                // 混合模型
                if (projectType === 'hybrid'){

                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }

                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // ipd模型
                if (projectType === 'ipd'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                if (projectType !== "nomal" && projectType !== "ipd"){
                    if (versionId) {
                        form.setFieldsValue({
                            projectVersion: versionId
                        })
                    } else {
                        if (res.data.versionList.length > 0) {
                            form.setFieldsValue({
                                projectVersion: res.data.versionList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                projectVersion: null
                            })
                        }
                    }
                }
            }


        });

        return;
    }, [projectId])

    const containerRef = useRef(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    const handleMouseEnter = () => {
        setIsEditorFocused(true);
    };

    const handleMouseLeave = () => {
        setIsEditorFocused(false);
    };

    /**
     * 在项目内添加事项或者选择项目之后， 设置表单初始化值
     * @param {*} project
     */
    const getProjectValue = (project) => {
        const projectId = project.id;
        const projectType = project.projectType.type;
        setProjectType(projectType)
        form.setFieldsValue({
            parentWorkItem: workId,
            project: projectId,
            // sprint: sprintId,
            assigner: project?.master.id,
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })


    }


    // 选择项目
    const selectProject = (value, option) => {
        getProjectValue(option.project)
    }

    //提交表单
    const onFinish = () => {
        form.validateFields().then((values) => {
            if (values.title.length > 100) { // 假设标题最大长度为100
                message.error({
                    content: '标题长度不能超过100个字符',
                    className: 'custom-class',
                    style: {
                        marginTop: '20vh',
                    },
                });
                return;
            }

            console.log(values)
            // values.builder = getUser().userId;
            values.planBeginTime = values.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            values.planEndTime = values.planTime[1].format('YYYY-MM-DD 23:59:59')
            values.workType = workType?.id;
            values.desc = slateValue;
            values.project = projectId ? projectId : values.project;
            values.fieldId = selectItem?.id;

            setLoading(true)
            addWork(values).then((res) => {
                setWorkId(res.data)

                for (let attach of attachList) {
                    attach = {
                        ...attach,
                        workItem: {
                            id: res.data
                        }
                    }

                    createWorkAttach(attach)
                }

                if (res.code === 0) {
                    message.success({
                        content: '添加成功',
                        className: 'custom-class',
                        style: {
                            marginTop: '20vh',
                        },
                        duration: 1
                    });

                    setShowAddModel(false)

                    bindWorkItem(res.data)

                    createWorkTestCaseFn(caseId, res.data, projectId)
                } else {
                    message.error({
                        content: '添加失败',
                        className: 'custom-class',
                        style: {
                            marginTop: '20vh',
                        },
                    });
                }


                setLoading(false)
            })

        })
    };

    /**
     * 绑定缺陷
     * @param id
     */
    const bindWorkItem = (id) => {
        let param = {
            repositoryId:repositoryId,
            testCase:{id:caseId},
            workItem:{id:id},
            testPlanId:testPlanId,
        }
        createWorkItemBind(param).then(async ()=> {
            await findWorkItemBindPage({
                caseId: caseId,
                testPlanId:testPlanId
            })
        })
    };

    const [attachList, setAttachList] = useState([])
    // 上传附件
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
            if (status === 'done') {
                const res = info.file.response;
                const params = {
                    attachId: res.data,
                    attachmentName: info.file.name,
                    attachmentUrl: res.data,
                    type: info.file.type
                }
                setAttachList([...attachList, params])
                message.success(`${info.file.name} 文件上传成功.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        }
    }
    // 文件列表的
    const attachColums = [
        {
            title: '文件',
            dataIndex: 'attachmentName',
            key: 'name',
            width: "30%",
            render: (text, record) => {
                return (
                    record.type.indexOf("image") === -1 ?
                        <a href={setImageUrl("/file/" + record.attachmentUrl)}
                           target="_blank"
                        >
                            {text}
                        </a>
                        :
                        <a href={setImageUrl("/image/" + record.attachmentUrl)}
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
            width: "10%",
            render: (text, record) => <Tooltip title={record.attachmentName.split('.').pop()}>{record.attachmentName.split('.').pop()}</Tooltip>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => <Space size="middle">
                <DeleteModal deleteFunction={deleteAttach} id={record.attachId} getPopupContainer={formRef.current} />
            </Space>
        }
    ]

    const deleteAttach = (attachId) => {
        setAttachList(attachList.filter(item => item.attachId !== attachId))
    }

    // 暴露方法给父级组件
    useImperativeHandle(workAddPageRef, () => ({
        submit: onFinish,
        onReset: onReset
    }))

    const onReset = () => {
        form.resetFields();
    };

    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD';
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

    const [newWorkItem, setNewWorkItem] = useState();

    /**
     * 修改值
     * @param {字段值} changedValues
     */
    const changeWorkItem = (changedValues) => {
        setNewWorkItem({ ...newWorkItem, ...changedValues })
        setIsEditStart(true)
    }

    /**
     * 修改内容
     * @param {内容} value
     */
    const changeDesc = (value) => {
        setSlateValue(value)
        setIsEditStart(true)
    }

    /**
     * 搜索计划关键字
     * @param {搜索关键字} value
     */
    const searchStage = (value) => {
        console.log(value)
        // findStageList({ projectId: projectId, stageName: value })
    }

    return (
        <Fragment>
            <div className="work-add-page">
                <div className="work-add-page-content">
                    <div className="work-add-page-form">
                        <div className="left">
                            <Form
                                initialValues={{ remember: true }}
                                form={form}
                                className="work-add-form"
                                layout="vertical"
                                labelAlign="right"
                                onValuesChange={(changedValues, allValues) => changeWorkItem(changedValues)}
                            >
                                <Form.Item
                                    label="标题"
                                    name="title"
                                    rules={[{ required: true, message: '请输入标题!' }]}
                                >
                                    <Input placeholder="事项标题" />
                                </Form.Item>

                                <Form.Item
                                    label="描述"
                                >
                                    {
                                        <div className="work-desc">
                                            <div
                                                ref={containerRef}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave} className="work-item-desc" style={{ width: "100%", border: " #f0f0f0 solid 1px" }}>
                                                <DocumentEditor
                                                    ref={editorRef}
                                                    focusEditor={true}
                                                    value={slateValue}
                                                    onChange={(value) => changeDesc(value)}
                                                    minHeight={150}
                                                    ticket={ticket}
                                                    tenant={tenant}
                                                    base_url={base_url}
                                                    viewImageUrl = "/image"
                                                    img_url = {base_url === '/' ? '' : base_url}
                                                    maxHeight={150}
                                                    {...props}
                                                />
                                            </div>
                                        </div>
                                    }
                                </Form.Item>

                                <Form.Item
                                    label={"附件"}
                                >
                                    <Fragment>
                                        <div ref={formRef}>
                                            {
                                                attachList && attachList.length > 0 && (
                                                    <Fragment>
                                                        <Table columns={attachColums}
                                                               dataSource={attachList}
                                                               pagination={false}
                                                               bordered={false}
                                                               rowKey={(record) => record.attachId}
                                                               scroll={{x: "100%"}}
                                                        />
                                                    </Fragment>
                                                )
                                            }
                                        </div>
                                        <div className="work-detail-upload">
                                            <Dragger className="work-detail-upload" {...filesParams}>
                                                <p className="ant-upload-drag-icon">
                                                    <svg className="icon-20" aria-hidden="true">
                                                        <use xlinkHref="#icon-uploadImg-gray"></use>
                                                    </svg>上传附件
                                                </p>
                                            </Dragger>
                                        </div>
                                    </Fragment>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="right">
                            <Form
                                initialValues={{ remember: true }}
                                form={form}
                                className="work-add-form"
                                layout="vertical"
                                labelAlign="right"
                                onValuesChange={(changedValues, allValues) => changeWorkItem(changedValues)}
                            >
                                {
                                    (path.includes("/projectSet") || path.includes("/product") || path === "/worklist" || path === "/workbodar") &&
                                    <Form.Item
                                        label="所属项目"
                                        name="project"
                                        rules={[{ required: true, message: '请输入!' }]}
                                        bordered={false}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="项目"
                                            allowClear
                                            className="work-select"
                                            key="selectProject"
                                            onSelect={selectProject}
                                        >
                                            {
                                                projectList && projectList.map((item) => {
                                                    return <Select.Option project={item} value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                {
                                    selectItem &&
                                    <Form.Item
                                        label={selectItem?.name || "事项类型"}
                                        name="eachType"
                                        // wrapperCol={{
                                        //     span: 10,
                                        // }}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="无"
                                            className="work-select"
                                            key="selectEachType"
                                            allowClear
                                        >
                                            {
                                                selectItem && selectItem?.selectItemList?.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>
                                                        <img
                                                            src={('images/project1.png')}
                                                            alt=""
                                                            className="img-icon-right"
                                                        />
                                                        {item.name}
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                <Form.Item
                                    label="优先级"
                                    name="workPriority"
                                    rules={[{ required: false, message: '请输入优先级!' }]}
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="优先级"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkPriority"
                                    >
                                        {
                                            priorityList && priorityList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="负责人"
                                    name="assigner"
                                    rules={[{ required: true, message: '请输入负责人!' }]}
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="负责人"
                                        className="work-select"
                                        key="selectWorkUser"
                                        showSearch
                                    >
                                        {
                                            userList && userList.map((item) => {
                                                return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="planTime"
                                    label="计划日期"
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <RangePicker />
                                </Form.Item>

                                <Form.Item
                                    label="所属模块"
                                    name="module"
                                    rules={[{ required: false, message: '请输入所属模块!' }]}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="模块"
                                        allowClear
                                        className="work-select"
                                        key="selectModule"
                                    >
                                        {
                                            moduleList && moduleList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                {
                                    (projectType === "nomal" || projectType === "ipd" || projectType === "hybrid") && <Form.Item
                                        label="所属阶段"
                                        name="stage"
                                        rules={[{ required: true, message: '请输入所属阶段!' }]}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="阶段"
                                            allowClear
                                            className="work-select"
                                            key="selectSprint"
                                            onSearch={searchStage}
                                            showSearch
                                        >
                                            {
                                                stageList && stageList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.stageName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                {
                                    (projectType === "scrum" || projectType === "kanban" || projectType === "hybrid") && <Form.Item
                                        label="所属迭代"
                                        name="sprint"
                                        rules={[{ required: false, message: '请输入所属迭代!' }]}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="迭代"
                                            allowClear
                                            className="work-select"
                                            key="selectSprint"
                                        >
                                            {
                                                selectSprintList && selectSprintList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }

                                {
                                    (projectType !== "nomal" && projectType !== "ipd") &&
                                    <Form.Item
                                        label="所属版本"
                                        name="projectVersion"
                                        rules={[{ required: false, message: '请输入所属版本!' }]}
                                    >
                                        <Select
                                            placeholder="版本"
                                            allowClear
                                            className="work-select"
                                            key="selectProjectVersion"
                                        >
                                            {
                                                selectVersionList && selectVersionList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }

                                <Form.Item
                                    name="planTakeupTime"
                                    label="计划用时"
                                    hidden={true}
                                >
                                    <Input suffix="小时" type="number" className="" />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    <div className="work-add-button">
                        <Button loading={loading} type="primary" onClick={() => onFinish()}>创建</Button>
                        <Button onClick={() => handleCancel()}>取消</Button>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}
export default observer(WorkAddPage);
