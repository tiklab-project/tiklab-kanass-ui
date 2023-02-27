import React, { useEffect, useState, useRef } from "react";
import { Form, DatePicker, Select } from 'antd';
import Button from "../../common/button/Button";
import moment from 'moment';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
const { RangePicker } = DatePicker;
const WorkFilterHigh = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore, labelHidden, setFiltetModal } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const heightFilter = useRef()
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    // 解析store数据
    const { getWorkConditionPage, getWorkConditionPageTree, workShowType,
        getWorkBoardList, getWorkGanttListTree, setWorkId, setWorkIndex,
        viewType, priorityList, findPriority, getsprintlist, sprintList,
        getModuleList, moduleList, searchCondition, getWorkStatus, workStatusList } = workStore;

    const [ stateNodeList, setStateNodeList] = useState([])
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;

    const [flowIds, setFlowIds] = useState();

    useEffect(() => {
        findPriority()
        getsprintlist(projectId)
        getModuleList(projectId)
        getWorkStatus()
        console.log(workStatusList)
        // findDmFlowList({ domainId: projectId }).then(res => {
        //     console.log("flowId", res)
        //     if (res.code === 0) {
        //         const lisflowIds = [];
        //         res.data.map(item => {
        //             lisflowIds.push(item.flow.id)
        //         })
        //         setFlowIds(lisflowIds)
        //         findStateNodeList({inFlowIds: lisflowIds}).then(res => {
        //             if (res.code === 0) {
        //                 if (res.data.length > 0) {
        //                     res.data.map(item => {
        //                         stateNodeList.push(item.node.id)
        //                     })
        //                 }
        //             }
        //             setStateNodeList(stateNodeList)
        //         })
        //     }
        // })
    }, [])

    useEffect(() => {
        initForm()
    }, [searchCondition])

    //查找事务
    const changeField = (changedValues, allValues) => {
        console.log(changedValues, allValues, Object.keys(changedValues))
        const field = Object.keys(changedValues)[0];
        let value;
        if (field === "createdDate") {
            value = {
                buildTimeStart: changedValues.createdDate ? changedValues.createdDate[0].format('YYYY-MM-DD') : null,
                buildTimeEnd: changedValues.createdDate ? changedValues.createdDate[1].format('YYYY-MM-DD') : null
            }
        }
        if (field === "planStartDate") {
            value = {
                planStartDateStart: changedValues.planStartDate ? changedValues.planStartDate[0].format('YYYY-MM-DD') : null,
                planStartDateEnd: changedValues.planStartDate ? changedValues.planStartDate[1].format('YYYY-MM-DD') : null
            }
        }
        if (field === "planEndDate") {
            value = {
                planEndDateStart: changedValues.planEndDate ? changedValues.planEndDate[0].format('YYYY-MM-DD') : null,
                planEndDateEnd: changedValues.planEndDate ? changedValues.planEndDate[1].format('YYYY-MM-DD') : null
            }
        }
        if (field === "workPriorityIds") {
            value = {
                workPriorityIds: changedValues.workPriorityIds,
            }
        }

        if (field === "sprintIds") {
            value = {
                sprintIds: changedValues.sprintIds,
            }
        }

        if (field === "moduleIds") {
            value = {
                moduleIds: changedValues.moduleIds,
            }
        }
        findWorkItem(value)

    };

    const resetFilter = () => {
        form.resetFields()
        const value = {
            buildTimeStart: null,
            buildTimeEnd: null,
            planStartDateStart: null,
            planStartDateEnd: null,
            planEndDateStart: null,
            planEndDateEnd: null,
            planEndDate: null,
            workPriorityIds: null,
            sprintIds: null,
            moduleIds: null
        }
        findWorkItem(value)
    }

    const findWorkItem = (value) => {
        if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
            getWorkConditionPageTree(value).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList?.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(value).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(value)
        }
        if (workShowType === "time") {
            getWorkGanttListTree(value)
        }
    }
    const dateFormat = "YYYY-MM-DD"
    const initForm = () => {
        console.log(searchCondition)
        form.setFieldsValue({
            workStatusIds: searchCondition.workStatusIds,
            createdDate: searchCondition.buildTimeEnd ? [moment(searchCondition.buildTimeStart, dateFormat), moment(searchCondition.buildTimeEnd, dateFormat)] : null,
            planStartDate: searchCondition.planStartDateStart ? [moment(searchCondition.planStartDateStart, dateFormat), moment(searchCondition.planStartDateEnd, dateFormat)] : null,
            planEndDate: searchCondition.planEndDateStart ? [moment(searchCondition.planEndDateStart, dateFormat), moment(searchCondition.planEndDateEnd, dateFormat)] : null,
            workPriorityIds: searchCondition.workPriorityIds,
            sprintIds: searchCondition.sprintIds,
            moduleIds: searchCondition.moduleIds
        })
    }

    return (
        <div className="height-filter" ref={heightFilter}>
            <Form
                form={form}
                name="control-hooks"
                // onFinish={search}
                // layout={l?ayout}
                className="workitem-filter-height"
                labelAlign="left"
                initialValues={{
                    workPriorityIds: ['56035266d43ed3e87d1919fcde3848ea']

                }}
                onValuesChange={(changedValues, allValues) => changeField(changedValues, allValues)}
                {...formItemLayout}

            >
                <Form.Item name="workStatusIds" label={labelHidden ? null : "状态123"} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="状态"
                        className="work-select"
                        key="assigner"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    >
                        {
                            workStatusList && workStatusList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name="createdDate" label={labelHidden ? null : "创建日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>

                <Form.Item name="planStartDate" label={labelHidden ? null : "计划开始日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>

                <Form.Item name="planEndDate" label={labelHidden ? null : "计划结束日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>

                <Form.Item name="workPriorityIds" label={labelHidden ? null : "优先级"} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="优先级"
                        className="work-select"
                        key="status"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    // bordered={false}
                    >
                        {
                            priorityList && priorityList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="sprintIds" label={labelHidden ? null : "所属迭代"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="所属迭代"
                        className="work-select"
                        key="assigner"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    >
                        {
                            sprintList && sprintList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="moduleIds" label={labelHidden ? null : "所属模块"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="所属模块"
                        className="work-select"
                        key="assigner"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    >
                        {
                            moduleList && moduleList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <div className="workitem-filter-height-botton">
                    <Button onClick={() => resetFilter()}>重置</Button>
                    <Button onClick={() => setFiltetModal(false)}>取消</Button>
                    <Button type="primary" onClick={() => setFiltetModal(false)}>确定</Button>
                </div>
            </Form>
        </div>

    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterHigh)));