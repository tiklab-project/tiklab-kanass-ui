/*
 * @Descripttion: 完成事项趋势
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:04:22
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker, Empty } from 'antd';
import echarts from "../../../common/echarts/echarts"
import "./EndWorkItemTrend.scss";
import moment from "moment";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const { RangePicker } = DatePicker;


const EndWorkItemTrend = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const isEdit = condition.data.isEdit;
    console.log(condition.data.isEdit, "EndWorkItemTrend")
    const { statisticsEndWorkItemCount, findAllProject, reportList } = insightStore;

    // 仪表盘是否处于编辑模块
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    // 表单
    const [form] = Form.useForm();
    // 所有项目的列表
    const [projectList, setProjectList] = useState([]);
    const [projectCountList, setProjectCountList] = useState({})


    const [chart, setChart] = useState();
    
    useEffect(() => {
        /**
         * 查找所有项目列表
         */
        findAllProject().then(res => {
            setProjectList(res.data)
        })
        return;
    }, [])


    /**
     * 处于编辑状态，初始化统计条件表单
     */
    useEffect(() => {
        const data = condition.data.data;

        if (isEditor) {
            const params = {
                startDate: data.startDate,
                endDate: data.endDate,
                cellTime: data.cellTime,
                workItemTypeCode: data.workItemTypeCode,
                projectId: data.projectId
            }
            setStatisticsData(params)
        } else {
            if (data) {
                const formData = {
                    dateRanger: data.startDate ? [moment(data.startDate, 'YYYY-MM-DD HH:mm:ss'), moment(data.endDate, 'YYYY-MM-DD HH:mm:ss')] : null,
                    cellTime: data.cellTime,
                    workItemTypeCode: data.workItemTypeCode,
                    projectId: projectCountList ? data.projectId : null
                }

                form.setFieldsValue(formData)
            }
        }
        return;
    }, [isEditor])

    useEffect(() => {
        if (chart) {
            chart.resize();
        }
        return null;
    }, [condition.w])

    /**
     * 处理统计数据
     */
    const setStatisticsData = (params) => {
        const chartDom = document.getElementById(`end-trend-${index}`)
        statisticsEndWorkItemCount(params).then(res => {
            if (res.code === 0) {
                const list = res.data;
                let seriesValue = []
                const projectCountList = list.projectCountList
                setProjectCountList(list.projectCountList)
                if (projectCountList) {
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
                        setChart(myChart)
                        let option = {
                            // title: {
                            //     text: '新增完成事项趋势'
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

            }
        })
    }

    /**
     * 编辑报表统计条件
     * @param {表单数据} values 
     */
    const editReport = (values) => {
        const params = {
            startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            cellTime: values.cellTime,
            workItemTypeCode: values.workItemTypeCode,
            projectId: values.projectId

        }

        setIsEditor(!isEditor)
        // setStatisticsData(params)

        reportList.lg[index].data.data = params;
        reportList.lg[index].data.isEdit = true;
    }

    // 统计的时间单位
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

    // 统计的事项类型
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

    // 删除当前统计模块
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }
    return (
        <Fragment>
            <div className="end-trend" key={condition.i} data-grid={condition}>
                <div className="end-trend-top">
                    <div className="end-trend-title">
                        <div>
                            完成事项趋势
                            {/* <ImgComponent src={"warning.png"} alt="" width="20px" height="20px" /> */}
                        </div>
                        {
                            !isView && <div className="report-action">
                                {
                                    isEdit && <div onClick={() => setIsEditor(!isEditor)}
                                        className="report-action-edit"
                                    >
                                        {isEditor ? "编辑" : "取消"}
                                    </div>
                                }

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
                    isEditor ? <div className="end-trend-content" id={`end-trend-${index}`} >

                        {
                            !projectCountList && <div className="delete-warning">
                                <ImgComponent src={"warning.png"} alt="" width="20px" height="20px" />
                                项目不能被查看或者被删除，请修改配置或者删除
                            </div>
                        }
                    </div>
                        :
                        <Form
                            name="form"
                            form={form}
                            initialValues={{ remember: true }}
                            onFinish={editReport}
                            wrapperCol={{ span: 12 }}
                            labelCol={{ span: 6 }}
                            layout="vertical"
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

export default inject("insightStore")(observer(EndWorkItemTrend));