
/*
 * @Descripttion: 工时添加
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:01:34
 */
import React, { useEffect, useRef, useState } from "react";
import {Modal, InputNumber, Form, Input, Select, Button, Drawer} from 'antd';
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

    // 抽屉样式控制
    const drawerStyle = {
        right: showLogAdd ? 0 : "-400px",
        transition: "right 0.3s ease",
    };

    // 新增状态
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
        hasMore: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(showLogAdd)
        if (showLogAdd) {
            document.body.style.overflow = "hidden"; // 锁定主页面滚动
            if (page === "workDetail") {
                getGemianTime();
            } else {
                if (!projectId) {
                    findJoinProjectList({});
                } else {
                    findWorkItemPage({ projectId }).then((res) => {
                        if (res.code === 0) {
                            setWorkItemList(res.data.dataList);
                        }
                    });
                }
            }
        } else {
            document.body.style.overflow = ""; // 恢复滚动
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
            console.log(fieldsValue);
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
                takeupTime: fieldsValue.combinedTime.takeupTime,
                workContent: fieldsValue.workContent
            }

            if(modalType === "edit"){
                params.id = logInfo.id;
                updateWorkLog(params).then(res => {
                    if(res.code === 0){
                        const workParams = {
                            id: fieldsValue.workItem,
                            surplusTime: fieldsValue.combinedTime.surplusTime,
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
                            surplusTime: fieldsValue.combinedTime.surplusTime,
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
     * 关闭抽屉
     */
    const closeLogModal = () => {
        setShowLogAdd(false)
        setTakeupTime(0)
        addLog.resetFields();

    }

    /**
     * 按照名称关键字搜索事项列表
     * @param {名称} value
     */
    const searchWorkItem = async (value, isLoadMore = false, projectId) => {
        if (loading) return;

        setLoading(true);

        const params = {
            title: value,
            projectId: projectId,
            pageParam: {
                currentPage: isLoadMore ? pagination.current + 1 : 1,
                pageSize: pagination.pageSize
            },

        };

        try {
            const res = await findWorkItemPage(params);
            if (res.code === 0) {
                setPagination(prev => ({
                    ...prev,
                    current: isLoadMore ? prev.current + 1 : 1,
                    total: res.data.totalRecord,
                    hasMore: res.data.totalPage >= prev.current
                }));

                setWorkItemList(prev =>
                    isLoadMore ? [...prev, ...res.data.dataList] : res.data.dataList
                );
            }
        } finally {
            setLoading(false);
        }
    };


    /**
     * 根据搜索结果改变工时信息
     * @param {*} newValue
     * @param {*} option
     */
    const changeSearchTitle = (newValue, option) => {
        setValue(newValue);
        searchWorkItem(newValue, false, projectId)
    };
    const changeProject = (value) => {
        setProjectId(value)

        searchWorkItem(null, false, value)
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

    // 滚动到底部加载更多
    const handlePopupScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isBottom && pagination.hasMore && !loading) {
            searchWorkItem(value, true, projectId);
        }
    };

    return (
        // <>

        <div onClick={(e) => {
            console.log("点击事件")
            // e.stopPropagation()
        }}>
            <Modal
                title={modalType === "add" ? '添加工时' : '编辑工时'}
                placement="right"
                onCancel={closeLogModal}
                onOk={creatLog}
                visible={showLogAdd}
                width={500}
                maskClosable={false} // 禁止点击遮罩层关闭
                getContainer={false} // 确保Modal不在Drawer的DOM树中
                onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    e.nativeEvent.stopImmediatePropagation(); // 更彻底地阻止事件
                }}
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
                            onPopupScroll={handlePopupScroll}
                            loading={loading}
                            notFoundContent={loading ? '加载中...' : '无数据'}
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
                            {loading && pagination.hasMore && (
                                <Select.Option key="loading" disabled>
                                    加载中...
                                </Select.Option>
                            )}
                        </Select>
                    </Form.Item>

                    <div className="log-add-time-combined">
                        <Form.Item
                            label="预估用时 / 已用时"
                            className="log-form-item-combined"
                        >
                            <div className="combined-input-container">
                                <Input
                                    min={0}
                                    disabled={true}
                                    placeholder={0}
                                    type="number"
                                    key="estimateTime"
                                    suffix="小时"
                                    className="combined-input-left"
                                />
                                <Input
                                    min={0}
                                    disabled={true}
                                    placeholder={0}
                                    type="number"
                                    key="usedTime"
                                    suffix="小时"
                                    className="combined-input-right"
                                />
                            </div>
                        </Form.Item>
                    </div>

                    <div className="log-add-time-combined">
                        <Form.Item
                            label="登记用时 / 剩余用时"
                            name=""
                            rules={[
                                {
                                    required: true,
                                    message: "请填写登记用时和剩余用时",
                                },
                            ]}
                            className="log-form-item-combined"
                        >
                            <div className="combined-input-container">
                                <Form.Item name={["combinedTime", "takeupTime"]} noStyle>
                                    <Input
                                        min={0}
                                        type="number"
                                        key="takeupTime"
                                        suffix="小时"
                                        placeholder={0}
                                        className="combined-input-left"
                                        onBlur={(value) => changeTakeupTime(value)}
                                    />
                                </Form.Item>
                                <Form.Item name={["combinedTime", "surplusTime"]} noStyle>
                                    <Input
                                        min={0}
                                        type="number"
                                        key="surplusTime"
                                        suffix="小时"
                                        placeholder={0}
                                        className="combined-input-right"
                                        onChange={() => setIsCustomSurplusTime(true)}
                                    />
                                </Form.Item>

                            </div>
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
        </div>

    )
}

export default withRouter(observer(LogAdd));
