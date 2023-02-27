import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker } from 'antd';
import "./userWorkItem.scss";
import * as echarts from 'echarts';


const UserWorkItem = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsUserWorkItemCount, findAllProjectSet, reportList} = insightStore;
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    const [form] = Form.useForm();
    const [projectSetList, setProjectSetList] = useState([])

    useEffect(() => {
         findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    useEffect(() => {
        if(isEditor){
            const params = { projectId: condition.data.data.projectId }
            form.setFieldsValue({projectId: condition.data.data.projectId})
            statisticsUserWorkItem(params)
        }
        
    },[isEditor])

    /**
     * 处理统计数据
     */
     const statisticsUserWorkItem = (data) => {
        const chartDom = document.getElementById('user-workitem')
        statisticsUserWorkItemCount(data).then(res => {
            if (res.code === 0) {
                const userList = res.data;
                const types = ["demand", "task", "bug"];
                const series = [];
                const yAxisValue = [];
                const seriesWorkItem = [];
                const seriesDemand = [];
                const seriesTask = [];
                const seriesBug = [];

                userList.map((item, index) => {
                    yAxisValue.push(item.user.name)
                    seriesWorkItem.push(item.workItemTypeCount.workItem)
                    seriesDemand.push(item.workItemTypeCount.demand)
                    seriesTask.push(item.workItemTypeCount.task)
                    seriesBug.push(item.workItemTypeCount.bug)
                })
                series.push(
                    {
                        name: "demand",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesDemand
                    },
                    {
                        name: "task",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesTask
                    },
                    {
                        name: "bug",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesBug
                    },
                )
                let myChart = echarts.init(chartDom);
                let option = {
                    title: {
                        text: '项目成员'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: yAxisValue
                    },
                    series: series
                };
                myChart.setOption(option);
            }
        })
    }

    const editReport = (values) => {
        setIsEditor(!isEditor)
        reportList.lg[index].data.data = values;
        reportList.lg[index].data.isEdit = true;
        statisticsUserWorkItem(values)
    }

    const onFinishFailed = (values) => {
        console.log(values);
    };

    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <Fragment>
            <div className="user-workitem"  key = {condition.i} data-grid={condition}>
                <div className="user-workitem-top">
                    <div className="user-workitem-title">
                        <div>
                            项目成员对比
                        </div>
                        {
                            !isView && <div className="report-action">
                                <div onClick={() => setIsEditor(!isEditor)}
                                    className="report-action-edit"
                                >
                                    {isEditor ? "编辑" : "取消"}
                                </div>
                                <div
                                    onClick={() => deleteReport()}
                                    className="report-action-delete"
                                >
                                    删除
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {
                    isEditor ? <div className="user-workitem-content" id="user-workitem" />
                    :
                    <Form
                        name="form"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={editReport}
                        onFinishFailed={onFinishFailed}
                        wrapperCol={{ span: 12 }}
                        labelCol={{ span: 6 }}
                        layout = "vertical"
                    >   
                        <Form.Item name="projectSet" label="项目集" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择项目集"
                            >
                                {
                                    projectSetList && projectSetList.map(item => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    
                        <Form.Item
                            wrapperCol={{ offset: 6, span: 8 }}
                        >
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </div>

        </Fragment >

    )
}

export default inject("insightStore")(observer(UserWorkItem));