import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker } from 'antd';
import "./NewWorkItemTrend.scss";
import * as echarts from 'echarts';
import moment from "moment";

const { RangePicker } = DatePicker;

const NewWorkItemTrend = (props) => {
    const { insightStore, index, isView, editInsight,condition } = props;
    const { statisticsNewWorkItemCount, findAllProject, reportList } = insightStore;
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    const [form] = Form.useForm();
    const [projectList, setProjectList] = useState([]);

    const startTime = moment().subtract(7, "days").startOf("days");
    const endTime = moment().endOf("days");
    const dateFormat = 'YYYY-MM-DD';

    useEffect(() => {

        findAllProject().then(res => {
            setProjectList(res.data)
        })
    }, [])

    useEffect(() => {
        const data  =condition.data.data;
        if (isEditor) {
            const params = {
                startDate: data.startDate,
                endDate: data.endDate,
                cellTime: data.cellTime,
                workItemTypeCode: data.workItemTypeCode,
                projectId: data.projectId

            }
            setStatisticsData(params)

            const formData = {
                dateRanger:[moment(data.startDate, 'YYYY-MM-DD HH:mm:ss'), moment(data.endDate, 'YYYY-MM-DD HH:mm:ss')],
                cellTime: data.cellTime,
                workItemTypeCode: data.workItemTypeCode,
                projectId: data.projectId
            }

            form.setFieldsValue(formData)
        }

    }, [isEditor])

    /**
     * 处理统计数据
     */
    const setStatisticsData = (value) => {

        const chartDom = document.getElementById('new-trend')
        statisticsNewWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const list = res.data;
                let seriesValue = []
                if (list.projectCountList.length > 0) {
                    const legendDate = list.projectCountList.map(item => {
                        seriesValue.push({
                            name: item.project.projectName,
                            type: 'line',
                            stack: 'Total',
                            data: item.countList
                        })
                        return item.project.projectName
                    })
                    const axisValue = list.dateList.map(item => {
                        return item.slice(0, 10)
                    })
                    let myChart = echarts.init(chartDom);
                    let option = {
                        // title: {
                        //     text: '新增事项趋势'
                        // },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: legendDate
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: axisValue
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: seriesValue
                    };
                    myChart.setOption(option);
                }
            }
        })
    }

    const editReport = (values) => {

        const params = {
            startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            cellTime: values.cellTime,
            workItemTypeCode: values.workItemTypeCode,
            projectId: values.projectId
        }

        setIsEditor(!isEditor)
        setStatisticsData(params)
        reportList.lg[index].data.data = params;
        reportList.lg[index].data.isEdit = true;
        console.log(params, index, reportList)
        // setFromData(params)
        // setVisible(true)
    }

    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    const onFinishFailed = (values) => {
        console.log(values);
    };
    const dateList = [
        {
            value: "day",
            title: "天"
        },
        {
            value: "week",
            title: "周"
        },
        {
            value: "month",
            title: "月"
        },
        {
            value: "quarter",
            title: "季度"
        },
        {
            value: "year",
            title: "年"
        }
    ]
    const workItemType = [
        {
            value: "all",
            title: "全部"
        },
        {
            value: "demand",
            title: "需求"
        },
        {
            value: "task",
            title: "任务"
        },
        {
            value: "defect",
            title: "缺陷"
        }
    ]

    return (
        <Fragment>
            <div className="new-trend">
                <div className="new-trend-top">
                    <div className="new-trend-title">
                        <div>
                            新建项目趋势
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
                    isEditor ? <div className="new-trend-content" id="new-trend" />
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
                            <Form.Item name="projectId" label="项目" rules={[{ required: true }]}>
                                <Select
                                    placeholder="请选择项目"
                                >
                                    {
                                        projectList && projectList.map(item => {
                                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item name="cellTime" label="期间" rules={[{ required: true }]}>
                                <Select
                                    placeholder="请选择期间"
                                >
                                    {
                                        dateList && dateList.map(item => {
                                            return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item name="dateRanger" label="开始结束时间" rules={[{ required: true }]}>
                                <RangePicker />
                            </Form.Item>
                            <Form.Item name="workItemTypeCode" label="统计事项类型" rules={[{ required: true }]}>
                                <Select
                                    placeholder="请选择统计事项类型"
                                >
                                    {
                                        workItemType && workItemType.map(item => {
                                            return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
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

export default inject("insightStore")(observer(NewWorkItemTrend));