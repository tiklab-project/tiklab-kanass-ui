/*
 * @Descripttion: 日志添加
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect, useRef, useState } from "react";
import { Modal, InputNumber, Form, Input, Select } from 'antd';
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
import LogStore from "../store/LogStore";
import "./LogAdd.scss"
const { TextArea } = Input;

const LogAdd = (props) => {
    const { showLogAdd, setShowLogAdd, getContainer, changeTabs, activeTab, closeModal,
        workId, page, modalType, findWorkLogList, logInfo } = props;
    const { findWorkItemPage, createWorkLog, findJoinProjectList, projectList,
        findWorkItemAndUsedTime, updateWorkItem, updateWorkLog } = LogStore;
    const [addLog] = Form.useForm();
    // 搜索的事项列表
    const [workItemList, setWorkItemList] = useState([])
    // 用时
    const [takeupTime, setTakeupTime] = useState(0)
    // 剩余时间
    const [surplusTime, setSurplusTime] = useState(0)
    const [isCustomSurplusTime, setIsCustomSurplusTime] = useState(false)
    const [projectId, setProjectId] = useState(props.match.params.id)
    const logAdd = useRef(null);
    const path = props.location.pathname;
    // 搜索关键字
    const [value, setValue] = useState();
    const layout = {
        labelCol: { lg: { span: 6 }, xxl: { span: 4 } },
        wrapperCol: { lg: { span: 24 }, xxl: { span: 24 } },
    };
    useEffect(() => {
        console.log(showLogAdd)
        if (showLogAdd) {

            if (page === "workDetail") {
                getGemianTime()
                document.removeEventListener("mouseup", closeModal, false);
            } else {
                if (!projectId) {
                    findJoinProjectList({})
                }else {
                    findWorkItemPage({ projectId: projectId }).then(res => {
                        if (res.code === 0) {
                            setWorkItemList(res.data.dataList)
                        }
                    })
                }
                
            }


        } else {
            if (page === "workDetail") {
                document.addEventListener("mouseup", closeModal, false);
            }

        }

    }, [showLogAdd])

    const getGemianTime = () => {
        findWorkItemAndUsedTime({ id: workId }).then(res => {
            if (res.code === 0) {
                const info = res.data;
                setWorkItemList([info])
                const workSurplusTime = info.surplusTime;
                console.log(takeupTime)
                const surplus = workSurplusTime - takeupTime;
                setSurplusTime(workSurplusTime)
                setIsCustomSurplusTime(false)
                addLog.setFieldsValue({
                    workItem: info.id,
                    estimateTime: info.estimateTime,
                    usedTime: info.usedTime,
                    surplusTime: surplus < 0 ? 0 : surplus
                })

                if (modalType === "edit") {
                    setTakeupTime(logInfo?.takeupTime)
                    addLog.setFieldsValue({
                        takeupTime: logInfo?.takeupTime,
                        workContent: logInfo?.workContent
                    })
                }
            }
        })
    }

    /**
     * 添加日志
     */
    const creatLog = () => {
        addLog.validateFields().then((fieldsValue) => {
            const params = {
                project: {
                    id: projectId
                },
                workItem: {
                    id: fieldsValue.workItem
                },
                user: {
                    id: getUser().userId
                },
                takeupTime: fieldsValue.takeupTime,
                workContent: fieldsValue.workContent
            }

            if(modalType === "edit"){
                params.id = logInfo.id;
                updateWorkLog(params).then(res => {
                    if(res.code === 0){
                        const workParams = {
                            id: fieldsValue.workItem,
                            surplusTime: fieldsValue.surplusTime,
                            updateField: "surplusTime"
                        }
                        updateWorkItem(workParams).then(data => {
                            if(data.code === 0){
                                setShowLogAdd(false)
                                if (page === "projectLog") {
                                    findWorkLogList(activeTab)
                                } else {
                                    findWorkLogList()
                                }
                            }
                        })
                       
                    }
                })
            }else {
                createWorkLog(params).then(res => {
                    if(res.code === 0){
                        const workParams = {
                            id: fieldsValue.workItem,
                            surplusTime: fieldsValue.surplusTime,
                            updateField: "surplusTime"
                        }
                        updateWorkItem(workParams).then(data => {
                            if(data.code === 0){
                                setShowLogAdd(false)
                                if (page === "projectLog") {
                                    findWorkLogList(activeTab)
                                } else {
                                    findWorkLogList()
                                }
                            }
                        })
                       
                    }
                   
    
                })
            }
            

            
        })
    }

    /**
     * 关闭弹窗
     */
    const closeLogModal = () => {
        setShowLogAdd(false)
        setTakeupTime(0)
        if (page === "workDetail") {
            document.addEventListener("mouseup", closeModal, false);
        }

    }

    /**
     * 按照名称关键字搜索事项列表
     * @param {名称} value 
     */
    const searchWorkItem = (value) => {
        if (value) {
            findWorkItemPage({ title: value, projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setWorkItemList(res.data.dataList)
                }
            })
        }
    }


    /**
     * 根据搜索结果改变工时信息
     * @param {*} newValue 
     * @param {*} option 
     */
    const changeSearchTitle = (newValue, option) => {
        setValue(newValue);

        findWorkItemAndUsedTime({ id: newValue }).then(res => {
            if (res.code === 0) {
                const info = res.data;
                const workSurplusTime = info.surplusTime
                const surplus = workSurplusTime - takeupTime;
                setSurplusTime(workSurplusTime)
                setIsCustomSurplusTime(false)
                addLog.setFieldsValue({
                    estimateTime: info.estimateTime,
                    usedTime: info.usedTime,
                    surplusTime: surplus < 0 ? 0 : surplus
                })
            }
        })
    };
    const changeProject = (value) => {
        setProjectId(value)
        findWorkItemPage({ projectId: value }).then(res => {
            if (res.code === 0) {
                setWorkItemList(res.data.dataList)
                if (res.data.dataList.length > 0) {
                    setValue(res.data.dataList[0].id);
                } else {
                    setValue()
                }

            }
        })
    }

    const changeTakeupTime = (value) => {
        const time = value.target.value;
        if (!isCustomSurplusTime) {
            if (modalType === "edit") {
                const surplus = surplusTime - (time - takeupTime);
                addLog.setFieldsValue({
                    surplusTime: surplus < 0 ? 0 : surplus
                })
            } else {
                const surplus = surplusTime - time;
                addLog.setFieldsValue({
                    surplusTime: surplus < 0 ? 0 : surplus
                })
            }
        }

    }

    return (
        <Modal
            title={`${modalType === "add" ? '添加工时' : '编辑工时'}`}
            visible={showLogAdd}
            onOk={creatLog}
            onCancel={closeLogModal}
            destroyOnClose={true}
            closable={false}
        >
            <Form
                // {...layout}
                name="basic"
                form={addLog}
                preserve={false}
                layout="vertical"
                className="log-add"
            >
                {
                    path === "/log/list" && <Form.Item
                        label="项目"
                        name="project"
                        rules={[
                            {
                                required: true,
                                message: "请选择项目",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            value={value}
                            onChange={changeProject}
                            optionFilterProp='children'
                        >
                            {
                                projectList.length > 0 && projectList.map((item) => {
                                    return <Select.Option
                                        value={item.id}
                                        key={item.id}
                                        projectId={item.id}
                                    >{item.projectName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                }
                <Form.Item
                    label="事项"
                    name="workItem"
                    rules={[
                        {
                            required: true,
                            message: "请选择事项",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        value={value}
                        onSearch={searchWorkItem}
                        onChange={changeSearchTitle}
                        optionFilterProp='children'
                    >
                        {
                            workItemList.length > 0 && workItemList.map((item) => {
                                return <Select.Option
                                    value={item.id}
                                    key={item.id}
                                    projectId={item.project.id}
                                    surplusTime={item.surplusTime}
                                    planTakeupTime={item.planTakeupTime}
                                >{item.title}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <div className="log-add-time">
                    <Form.Item
                        label="预估用时"
                        name="estimateTime"
                        className="log-form-item"
                    >
                        <Input min={0} disabled={true} placeholder = {0} type="number" key="estimateTime" suffix="小时" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="已用时"
                        name="usedTime"
                        className="log-form-item"
                    >
                        <Input min={0} disabled={true} placeholder = {0} type="number" key="surplusTime" suffix="小时" style={{ width: '100%' }} />
                    </Form.Item>
                </div>
                <div className="log-add-time">
                    <Form.Item
                        label="登记用时"
                        name="takeupTime"
                        className="log-form-item"
                        rules={[
                            {
                                required: true,
                                message: '登记用时不能为空',
                            },
                        ]}

                    >
                        <Input
                            min={0}
                            type="number"
                            key="surplusTime"
                            suffix="小时"
                            placeholder = {0}
                            style={{ width: '100%' }}
                            onBlur={(value) => changeTakeupTime(value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="剩余用时"
                        name="surplusTime"
                        className="log-form-item"
                        rules={[
                            {
                                required: true,
                                message: '剩余用时不能为空',
                            },
                        ]}

                    >
                        <Input
                            min={0}
                            type="number"
                            key="surplusTime"
                            suffix="小时"
                            style={{ width: '100%' }}
                            placeholder = {0}
                            onChange={() => setIsCustomSurplusTime(true)}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="工作内容"
                    name="workContent"
                    rules={[
                        {
                            required: true,
                            message: '请输入工作内容',
                        },
                    ]}
                >
                    <TextArea rows={4} placeholder = "工作内容" />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default withRouter(observer(LogAdd));