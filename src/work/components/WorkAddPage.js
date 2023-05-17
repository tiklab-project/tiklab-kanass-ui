import React, { useState, useEffect, useRef, useImperativeHandle, Fragment } from "react";
import { Form, InputNumber, Input, Select, DatePicker, message, Upload, Col } from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import moment from 'moment';
import { getUser } from "tiklab-core-ui";
import "./WorkAddPage.scss";
import Button from "../../common/button/Button";

const { RangePicker } = DatePicker;

const WorkAddPage = (props) => {
    const [form] = Form.useForm();
    const { workStore, workType, workAddPageRef, getWorkDetail, setShowAddModel } = props;
    console.log(props)
    const { moduleList, sprintList, userList, findProjectList, projectList,
        getModuleList, getsprintlist, getSelectUserList, addWork,
        findPriority, priorityList,getWorkTypeList, workShowType, getWorkBoardList,
        workId, findFormConfig, formList, getWorkConditionPageTree,
        getWorkConditionPage, viewType, findFieldList, setWorkId, setDetailCrumbArray
    } = workStore;

    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const [slateValue, setSlateValue] = useState([
        {
            type: "paragraph",
            children: [{ text: "" }],
        },
    ])
    const [selectItem, setSelectItem] = useState()
    useEffect(() => {
        form.setFieldsValue({
            parentWorkItem: workId,
            project: projectId,
            sprint: sprintId,
            assigner: getUser().userId,
            reporter: getUser().userId,
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })
        getForm(workType.form.id)

        switch(workType.workType.code) {
            case "demand":
                findFieldList({code: "demandType"}).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "task":
                findFieldList({code: "taskType"}).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "defect":
                findFieldList({code: "bugType"}).then(res => {
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
                if(res.code === 0){
                    form.setFieldsValue({
                        module: moduleList[0]?.id
                    })
                }
            })
            getsprintlist(projectId).then(res => {
                if(res.code === 0){
                    form.setFieldsValue({
                        sprint: sprintId ? sprintId : sprintList[0]?.id
                    })
                }
            })
            getSelectUserList(projectId);
        }
        if (!projectId) {
            findProjectList();
        }
        findPriority().then(res => {
            if(res.code === 0){
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
        getModuleList(option)
        getsprintlist(option)
        getSelectUserList(option);
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            values.builder = getUser().userId;
            values.project = values.project ? values.project : projectId;
            values.sprint = values.sprint ? values.sprint : null;
            values.planBeginTime = values.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            values.planEndTime = values.planTime[1].format('YYYY-MM-DD HH:mm:ss')
            values.workType = workType.id;
            values.desc = JSON.stringify(slateValue);
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
            addWork(values).then((res) => {
                setWorkId(res.data)
                setDetailCrumbArray([{ id: res.data, title: values.title, iconUrl: workType.workType.iconUrl }])
                if (res.code === 0) {
                    //树状视图
                    if (workShowType === "bodar") {
                        getWorkBoardList()
                    } else if (workShowType === "table" && viewType === "tree") {
                        getWorkConditionPageTree()
                    } else if (workShowType === "table" && viewType === "tile") {
                        getWorkConditionPage()
                    } else if (workShowType === "list") {
                        getWorkConditionPageTree()
                    }
                    setShowAddModel(false)
                    message.success({
                        content: '添加成功',
                        className: 'custom-class',
                        style: {
                            marginTop: '20vh',
                        },
                    });

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

    return (
        <Fragment>
            <div className="work-add-page">
                <div className="work-add-page-left">
                    <div className="work-add-page-title">添加{workType.workType.name}</div>
                    <Form
                        initialValues={{ remember: true }}
                        form={form}
                        className="work-add-left-form"
                        layout="horizontal"
                        labelAlign="right"
                        labelCol={{
                            span: 3,
                        }}
                        wrapperCol={{
                            span: 12,
                        }}
                    >
                        <Form.Item
                            label="标题"
                            name="title"
                            labelCol={{
                                span: 3,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            rules={[{ required: true, message: '请输入标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        {
                            props.match.path === "/index/work/worklist/:statetype" &&
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
                                        return <Select.Option value={item.user.id} key={item.user.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        {
                            selectItem &&  <Form.Item label={selectItem?.name} name="eachType">
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
                                                className="img-icon"
                                            />
                                            {item.name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        }
                       
                        <Form.Item
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
                                        return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>


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



                        <Form.Item
                            label="所属迭代"
                            name="sprint"
                            rules={[{ required: false, message: '请输入所属迭代!' }]}
                            labelCol={{
                                span: 3,
                            }}
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
                                    sprintList && sprintList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
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
                            labelCol={{
                                span: 3,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            >
                            <RangePicker />
                        </Form.Item>
                        
                        <Form.Item
                            name="planTakeupTime"
                            label="计划用时"
                        >
                            <Input suffix="小时" type="number" className="" />
                        </Form.Item>
                    </Form>
                    <div className="work-add-button">
                        <Button type="primary" onClick={() => onFinish()}>创建</Button>
                        <Button onClick={() => setShowAddModel(false)}>取消</Button>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}
export default inject("workStore", "workChild")(observer(WorkAddPage));