import React, { useState, useEffect, useImperativeHandle, Fragment } from "react";
import { Form, Input, Select, DatePicker, message } from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import moment from 'moment';
import { getUser } from "thoughtware-core-ui";
import "./WorkAddPage.scss";
import Button from "../../common/button/Button";
import { DocumentEditor, PreviewEditor } from "thoughtware-slate-ui";
import { setSessionStorage } from "../../common/utils/setSessionStorage";

const { RangePicker } = DatePicker;

const WorkAddPage = (props) => {
    const [form] = Form.useForm();
    const { workStore, workType, workAddPageRef, setShowAddModel, setIsEditStart, handleCancel } = props;
    const { moduleList, selectSprintList, userList, findProjectList, projectList,
        getModuleList, findSelectSprintList, getSelectUserList, addWork,
        findPriority, priorityList, getWorkTypeList, workId, findFormConfig, formList,
        findFieldList, setWorkId, findWorkItemById, workShowType, getWorkBoardList, 
        selectVersionList, findSelectVersionList
    } = workStore;

    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    // 全局不一定存在
    const project = JSON.parse(localStorage.getItem("project"));
    const projectType = project?.projectType?.type;
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const [slateValue, setSlateValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]");
    const [selectItem, setSelectItem] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            parentWorkItem: workId,
            project: projectId,
            sprint: sprintId,
            assigner: project?.master.id,
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })
        getForm(workType.form.id)

        switch (workType.workType.code) {
            case "demand":
            case "epic":
                findFieldList({ code: "demandType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "task":
                findFieldList({ code: "taskType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "defect":
                findFieldList({ code: "bugType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            default:
                break;
        }
        if (projectId) {

            getModuleList(projectId).then(res => {
                if (res.code === 0) {
                    form.setFieldsValue({
                        module: moduleList[0]?.id
                    })
                }
            })
            if(projectType === "scrum"){
                findSelectSprintList(projectId).then(res => {
                    if (res.code === 0) {
                        form.setFieldsValue({
                            sprint: sprintId ? sprintId : res.data[0]?.id
                        })
                    }
                })
            }
           
            findSelectVersionList(projectId).then(res => {
                if (res.code === 0) {
                    if(res.data.length > 0) {
                        form.setFieldsValue({
                            projectVersion: versionId ? versionId : res.data[0]?.id
                        })
                    }
                    
                }
            })
            getSelectUserList(projectId);
        }
        if (!projectId) {
            findProjectList();
        }
        findPriority().then(res => {
            if (res.code === 0) {
                form.setFieldsValue({
                    workPriority: priorityList[0]?.id
                })
            }
        });
        getWorkTypeList({ projectId: projectId });

        return;
    }, [])
    // 获取自定义表单
    const getForm = (id) => {
        findFormConfig({ id: id })
    }

    const selectProject = (option) => {
        console.log(option)
        getModuleList(option)
        if(projectType === "scrum"){
            findSelectSprintList(option)
        }
        
        getSelectUserList(option);
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            values.builder = getUser().userId;
            values.project = values.project ? values.project : projectId;
            if(projectType) {
                values.sprint = values.sprint ? values.sprint : null;
            }
            
            values.planBeginTime = values.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            values.planEndTime = values.planTime[1].format('YYYY-MM-DD 23:59:59')
            values.workType = workType.id;
            values.desc = slateValue;
            values.extData = {}
            if(versionId){
                values.versionId = versionId
            }
            let keys = Object.keys(values)
            keys = keys.map((item) => {
                return item.slice(6)
            })
            formList && formList.map((item) => {
                if (keys.indexOf(item.code) !== -1) {
                    values.extData = Object.assign({ [`System${item.code}`]: values[`System${item.code}`] }, values.extData)
                }

                return 0;
            })
            setLoading(true)
            addWork(values).then((res) => {
                setWorkId(res.data)
                setSessionStorage("detailCrumbArray", [{ id: res.data, title: values.title, iconUrl: workType.workType.iconUrl }])
                if (res.code === 0) {
                    setLoading(false)
                    if (workShowType === "bodar") {
                        getWorkBoardList()
                        message.success({
                            content: '添加成功',
                            className: 'custom-class',
                            style: {
                                marginTop: '20vh',
                            },
                            duration: 1
                        });
                        setShowAddModel(false)
                    } else {
                        findWorkItemById(res.data).then(data => {
                            if (data.code === 0) {
                                message.success({
                                    content: '添加成功',
                                    className: 'custom-class',
                                    style: {
                                        marginTop: '20vh',
                                    },
                                    duration: 1
                                });
                                setShowAddModel(false)
                            }
                        })
                    }
                } else {
                    message.error({
                        content: '添加失败',
                        className: 'custom-class',
                        style: {
                            marginTop: '20vh',
                        },
                    });
                }

            })

        })
    };


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
    
    const changeWorkItem = (changedValues) => {
        setNewWorkItem({ ...newWorkItem, ...changedValues })
        setIsEditStart(true)
    }

    const changeDesc = (value) => {
        setSlateValue(value)
        setIsEditStart(true)
    }
    return (
        <Fragment>
            <div className="work-add-page">
                <div className="work-add-page-content">
                    <div className="work-add-page-title">添加{workType.workType.name}</div>
                    <div className="work-add-page-form">
                        <Form
                            initialValues={{ remember: true }}
                            form={form}
                            className="work-add-form"
                            layout="vertical"
                            labelAlign="right"
                            labelCol={{
                                span: 24,
                            }}
                            wrapperCol={{
                                span: 20
                            }}
                            onValuesChange={(changedValues, allValues) => changeWorkItem(changedValues)}
                        >
                            <Form.Item
                                label="标题"
                                name="title"
                                rules={[{ required: true, message: '请输入标题!' }]}
                            >
                                <Input placeholder="事项标题"/>
                            </Form.Item>
                            {
                                props.match.path === "/work/worklist/:statetype" &&
                                <Form.Item
                                    label="所属项目"
                                    name="project"
                                    rules={[{ required: true, message: '请输入!' }]}
                                    bordered={false}
                                >
                                    <Select
                                        placeholder="项目"
                                        allowClear
                                        className="work-select"
                                        key="selectProject"
                                        onSelect={selectProject}
                                    >
                                        {
                                            projectList && projectList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            }
                            <Form.Item
                                label="负责人"
                                name="assigner"
                                rules={[{ required: true, message: '请输入负责人!' }]}
                            >
                                <Select
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
                            {
                                selectItem && <Form.Item label={selectItem?.name} name="eachType">
                                    <Select
                                        placeholder="无"
                                        className="work-select"
                                        key="selectEachType"
                                        allowClear
                                    >
                                        {
                                            selectItem && selectItem?.selectItemList.map((item) => {
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

                            {/* <Form.Item
                            label="报告人"
                            name="reporter"
                            rules={[{ required: false, message: '请输入报告人!' }]}
                        >
                            <Select
                                placeholder="报告人"
                                className="work-select"
                                key="selectWorkUser"
                            >
                                {
                                    userList && userList.map((item) => {
                                        return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item> */}


                            <Form.Item
                                label="优先级"
                                name="workPriority"
                                rules={[{ required: false, message: '请输入优先级!' }]}
                            >
                                <Select
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
                            {
                                projectType === "scrum" &&  <Form.Item
                                label="所属迭代"
                                name="sprint"
                                rules={[{ required: false, message: '请输入所属迭代!' }]}
                                wrapperCol={{
                                    span: 16,
                                }}
                            >
                                <Select
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
                            <Form.Item
                                label="所属模块"
                                name="module"
                                rules={[{ required: false, message: '请输入所属模块!' }]}
                            >
                                <Select
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

                            <Form.Item
                                name="planTime"
                                label="计划日期"
                                wrapperCol={{
                                    span: 16,
                                }}
                            >
                                <RangePicker />
                            </Form.Item>

                            <Form.Item
                                name="planTakeupTime"
                                label="计划用时"
                                hidden={true}
                            >
                                <Input suffix="小时" type="number" className="" />
                            </Form.Item>
                            <Form.Item
                                label="描述"
                                wrapperCol={{
                                    span: 18,
                                }}
                            >
                                <div style={{ width: "fit-content", border: " #f0f0f0 solid 1px" }}>
                                    <DocumentEditor
                                        focusEditor={true}
                                        value={slateValue}
                                        onChange={(value) => changeDesc(value)}
                                        minHeight={300}
                                        ticket={ticket}
                                        tenant={tenant}
                                        base_url={base_url}
                                        maxHeight={500}
                                        {...props}
                                    />
                                </div>

                            </Form.Item>

                        </Form>
                    </div>

                    <div className="work-add-button">
                        <Button loading = {loading} type="primary" onClick={() => onFinish()}>创建</Button>
                        <Button onClick={() => handleCancel()}>取消</Button>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}
export default inject("workStore")(observer(WorkAddPage));