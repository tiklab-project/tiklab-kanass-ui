import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { Form, Input, Select, DatePicker, message } from "antd";
import { observer, inject } from "mobx-react";
import Editor from "./addWangEditor";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Forms from "../../../../common/forms/forms"
import { getUser } from "doublekit-core-ui";
const { RangePicker } = DatePicker;

const WorkAddPage = (props) => {
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 9 },
        },
    };

    const layoutDes = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };
    const { workStore, state, workAddPageRef, getWorkDetail } = props;
    const [typeWork, setTypeWork] = useState("")
    const [editWorkType, setEditWorkType] = useState("")
    const { projectList, moduleList, sprintList, userList, getProlist,
        getModuleList, getsprintlist, getSelectUserList, addWork,
        searchWorkById, editWork, priority, priorityList, workTypeList,
        getWorkType, editorContent, setEditorContent, workAllList,
        getWorkAllList, workShowType, getWorkBoardList,
        workId, workIndex, findFormConfig, formList, getWorkConditionPageTree,
        getWorkConditionPage, getWorkChildList, setChildWorkItem, viewType 
    } = workStore;

    const setEditor = useRef();
    const projectId = localStorage.getItem("projectId");
    // 初始化表格
    const initFrom = () => {
        searchWorkById(state.id).then((res) => {
            getForm(res.workType.id)
            form.setFieldsValue({
                project: res.project.id,
                assigner: res.assigner.id,
                reporter: res.reporter.id,
                module: res.module ? res.module.id : null,
                workPriority: res.workPriority ? res.workPriority.id : null,
                workType: res.workType.id,
                title: res.title,
                sprint: res.sprint ? res.sprint.id : null,
                parentWorkItem: res.parentWorkItem? res.parentWorkItem.id : null,
                predependworkitem: res.predependworkitem ? res.predependworkitem.id : null,
                planTakeupTime: res.planTakeupTime,
                plannedate: [moment(res.planBeginTime || getNowFormatDate(), dateFormat), moment(res.planEndTime || getNowFormatDate(), dateFormat)]
            })

            // 自定义表单的值
            if (res.extData) {
                form.setFieldsValue(JSON.parse(res.extData))
            }
            // getModuleList(res.project.id)
            // getsprintlist(res.project.id)
            setEditWorkType(res.workType.id)

            // 给富文本中的图片添加域名
            if (res.desc) {
                const reg = /\/file\/(.*?)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)/gm;
                const regChange = `${img_url}$&`;
                const descReplace = res.desc.replace(reg, regChange)
                setEditor.current.changeEditor(descReplace)
            } else {
                setEditor.current.changeEditor()
            }

        })
    }

    useEffect(() => {
        if (state.type === "edit") {
            initFrom()
        } else {
            form.setFieldsValue({
                workType: state.type,
                parentWorkItem: state.id,
                project: projectId,
                assigner: getUser().userId,
                plannedate: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
            })
            setEditor.current.changeEditor()
            getForm(state.type)
        }
        setTypeWork(state.typework)
        getProlist();
        getSelectUserList(projectId);
        priority();
        getWorkType();
        getWorkAllList();
        getModuleList(projectId)
        getsprintlist(projectId)
    }, [])

    // 获取自定义表单
    const getForm = (id) => {
        findFormConfig({ workTypeId: id })
    }
    
    const selectProject = (option) => {
        getModuleList(option)
        getsprintlist(option)
    }

    const onFinish = (setShowAddModel) => {
        form.validateFields().then((values) => {
            values.builder = getUser().userId;
            values.planBeginTime = values.plannedate[0].format('YYYY-MM-DD HH:mm:ss')
            values.planEndTime = values.plannedate[1].format('YYYY-MM-DD HH:mm:ss')
            const reg = new RegExp(img_url, "g");
            values.desc = editorContent.length > 0 ? editorContent.replace(reg, "") : "";
            values.extData = {}
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
            if (state.type !== "edit") {
                addWork(values).then((res) => {
                    if (res.code === 0) {
                        if (workShowType === "bodar") {
                            getWorkBoardList()
                        } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                            getWorkConditionPageTree()
                        } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                            getWorkConditionPage()
                        }
                        setShowAddModel(false)
                        message.success({
                            content: '添加成功',
                            className: 'custom-class',
                            style: {
                                marginTop: '20vh',
                            },
                        });
                        if (typeWork === 2) {
                            getWorkChildList(params).then((res) => {
                                if (res.code === 0) {
                                    setChildWorkItem(res.data.dataList)
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
            } else {
                values.id = state.id
                values.workType = editWorkType
                editWork(values).then((res) => {
                    // 编辑之后重新渲染
                    if (getWorkDetail) {
                        getWorkDetail(workId, workIndex)
                    }
                    if (workShowType === "bodar") {
                        getWorkBoardList()
                    } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                        getWorkConditionPageTree()
                    } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                        getWorkConditionPage()
                    }
                    setShowAddModel(false)
                })
            }
        })
    };


    useImperativeHandle(workAddPageRef, () => ({
        submit: onFinish,
        onReset: onReset
    }))

    // 子变父，隐藏上级事务
    const changWorkType = (option) => {
        setTypeWork(option.category)
    }

    const onReset = () => {
        form.resetFields();
    };

    // 计划日期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: false,
                message: 'Please select time!',
            },
        ]
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

    return (
        <div className="addDemand">
            <Form
                initialValues={{ remember: true }}
                form={form}
                className="addDemand-form"
                {...layout}
            >
                <Form.Item
                    label="所属项目"
                    name="project"
                    rules={[{ required: true, message: '请输入!' }]}
                >
                    <Select
                        placeholder="请选择项目"
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
                {
                    typeWork === 2 && state.type !== "edit" && <Form.Item
                        label="上级事务"
                        name="parentWorkItem"
                        rules={[{ required: true, message: '请输入!' }]}
                    >
                        <Select
                            placeholder="请选择上级事务"
                            allowClear
                            className="work-select"
                            key="selectWork"
                            onSelect={selectProject}
                        >
                            {
                                workAllList && workAllList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                }
                {
                    state.type !== "edit" && <Form.Item
                        label="事项类型"
                        name="workType"
                        rules={[{ required: true, message: '请输入事项类型!' }]}
                    >
                        <Select
                            placeholder="请选择事项类型"
                            allowClear
                            className="work-select"
                            key="selectWorkType"
                            onSelect={changWorkType}
                        >
                            {
                                workTypeList && workTypeList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id} category={item.category}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                }

                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="优先级"
                    name="workPriority"
                    rules={[{ required: false, message: '请输入优先级!' }]}
                >
                    <Select
                        placeholder="请选择优先级"
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
                >
                    <Select
                        placeholder="请选择负责人"
                        className="work-select"
                        key="selectWorkUser"
                    >
                        {
                            userList && userList.map((item) => {
                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label="报告人"
                    name="reporter"
                    rules={[{ message: '请输入报告人!' }]}
                >
                    <Select
                        placeholder="请选择报告人"
                        className="work-select"
                        key="selectWorkUser"
                    >
                        {
                            userList && userList.map((item) => {
                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                {
                    localStorage.getItem("projectTypeId") === "0" &&
                    <Form.Item
                        label="所属迭代"
                        name="sprint"
                        rules={[{ required: false, message: '请输入所属迭代!' }]}
                    >
                        <Select
                            placeholder="请选择迭代"
                            allowClear
                            className="work-select"
                            key="selectSprint"
                        >
                            {
                                sprintList && sprintList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                }
                <Form.Item
                    label="所属模块"
                    name="module"
                    rules={[{ required: false, message: '请输入所属模块!' }]}
                >
                    <Select
                        placeholder="请选择模块"
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

                <Form.Item name="plannedate" label="计划日期" {...rangeConfig}>
                    <RangePicker
                        locale={locale}
                        format={dateFormat}
                        showTime
                    />
                </Form.Item>

                <Form.Item name="planTakeupTime" label="计划用时">
                    <Input suffix="小时" style={{ width: "30%" }} />
                </Form.Item>

                <Form.Item
                    label="前置事项"
                    name="predependworkitem"
                    rules={[{ required: false, message: '请输入!' }]}
                >
                    <Select
                        placeholder="请选择前置事项"
                        allowClear
                        className="work-select"
                        key="preDependWorkItem"
                        listHeight={100}
                        showSearch
                        notFoundContent="请输入关键字搜索"
                    >
                        {
                            workAllList && workAllList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label="任务描述"
                    {...layoutDes}
                >
                    <Editor setEditorContent={setEditorContent} ref={setEditor}></Editor>
                </Form.Item>
                {
                    formList && formList.map((item, index) => {
                        return <Form.Item
                            label={item.name}
                            name={`System${item.code}`}
                            key={item.id}
                            rules={[{ required: item.required, message: '请输入!' }]}
                        ><Forms formType={item.fieldType.code} selectItemList={item.selectItemList} /></Form.Item>
                    })
                }
            </Form>
        </div>
    )
}
export default inject("workStore")(observer(WorkAddPage));