/*
 * @Descripttion: 日志添加
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect, useState } from "react";
import { Modal, InputNumber, Form, Input, Select } from 'antd';
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
const { TextArea } = Input;

const LogAdd = (props) => {
    const { showLogAdd, setShowLogAdd, logStore, changeTabs, activeTab } = props;
    const { findWorkItemPage, addWorkLog, findJoinProjectList, projectList } = logStore;
    const [addLog] = Form.useForm();
    // 搜索的事项列表
    const [workItemList, setWorkItemList] = useState([])
    // 用时
    const [planTakeupTime, setPlanTakeupTime] = useState(0)
    // 剩余时间
    const [surplusTime, setSurplusTime] = useState(0)
    const [projectId, setProjectId] = useState(props.match.params.id)
    const path = props.location.pathname;
    console.log(props)
    // const [projectId, setProjectId] = useState()
    // 搜索关键字
    const [value, setValue] = useState();

    useEffect(()=> {
        if(!projectId) {
            findJoinProjectList({})
        }
        return;
    },[])
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
                takeupTime: fieldsValue.takeupTime,
                workContent: fieldsValue.workContent
            }
            addWorkLog(params).then(res => {
                changeTabs(activeTab)
                setShowLogAdd(false)
            })
        })
    }

    /**
     * 关闭弹窗
     */
    const closeModal = () => {
        setShowLogAdd(false)
    }

    /**
     * 按照名称关键字搜索事项列表
     * @param {名称} value 
     */
    const searchWorkItem = (value) => {
        console.log(value)
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
        setPlanTakeupTime(option.planTakeupTime)
        setSurplusTime(option.setSurplusTime)
        // setProjectId(option.projectId)
        setValue(newValue);
    };
    const changeProject = (value) => {
        setProjectId(value)
        findWorkItemPage({ projectId: value }).then(res => {
            if (res.code === 0) {
                setWorkItemList(res.data.dataList)
                if(res.data.dataList.length > 0){
                  setValue(res.data.dataList[0].id);  
                }else {
                    setValue()
                }
                
            }
        })
    }

    return (
        <Modal
            title={"添加日志"}
            visible={showLogAdd}
            onOk={creatLog}
            onCancel={closeModal}
            destroyOnClose={true}
            closable={false}
        >
            <Form
                // {...layout}
                name="basic"
                form={addLog}
                preserve={false}
                layout="vertical"

            >
                {
                    path === "/index/log" && <Form.Item
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

                <Form.Item
                    label="剩余用时"
                    name="surplusTime"
                >
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "40px" }}>{surplusTime ? surplusTime : 0}</div>
                        <div style={{ width: "20px" }}>/</div>
                        <div style={{ width: "40px" }}>{planTakeupTime ? planTakeupTime : 0}</div> 小时
                    </div>
                </Form.Item>
                <Form.Item
                    label="用时"
                    name="takeupTime"
                    rules={[
                        {
                            required: true,
                            message: '请输入用时',
                        },
                    ]}

                >
                    <InputNumber suffix="/小时" style={{ width: '30%' }} />
                </Form.Item>
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
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default withRouter(inject('logStore')(observer(LogAdd)));