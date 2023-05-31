import React, { useEffect, useState } from "react";
import { Form, Select, DatePicker, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import ProjectReportAddOrEdit from "./ReportAddOrEdit"
import echarts from "../../common/echarts/echarts";
import moment from "moment";
import { withRouter } from "react-router";

const { RangePicker } = DatePicker;


const ProjectStaticsTotalEndTrend = (props) => {
    const { statisticsStore } = props;
    const { statisticsWorkItemTotalCountList, findProjectList } = statisticsStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const startTime = moment().subtract(7, "days").startOf("days");
    const endTime = moment().endOf("days");
    const dateFormat = 'YYYY-MM-DD';
    const reportId = props.match.params.id;
    const [projectList, setProjectList] = useState();
    useEffect(() => {
        form.setFieldsValue({
            dateRanger: [moment(startTime, dateFormat), moment(endTime, dateFormat)],
            cellTime: "day",
            workItemTypeCode: "all",
        })
        const params = {
            cellTime: "day",
            startDate: startTime.format("YYYY-MM-DD HH:mm:ss"),
            endDate: endTime.format("YYYY-MM-DD HH:mm:ss"),
            workItemTypeCode: "all",
            projectId: projectId,
            projectSetId: projectSetId,
            sprintId: sprintId
        }
        setStatisticsData(params)
        if (projectSetId) {
            findProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        return;
    }, [reportId])

    /**
     * 处理统计数据
     */
    const setStatisticsData = (params) => {
        const chartDom = document.getElementById('workBar');
        echarts.dispose(chartDom)
        statisticsWorkItemTotalCountList(params).then(res => {
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
                    const dateList = list.dateList;
                    dateList.pop();
                    const axisValue = dateList.map(item => {
                        return item.slice(0, 10)
                    })
                    let myChart = echarts.init(chartDom);
                    let option = {
                        title: {
                            text: '事项累计新建趋势'
                        },
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

    const addReport = () => {
        form.validateFields().then((values) => {
            const params = {
                startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
                cellTime: values.cellTime,
                workItemTypeCode: values.workItemTypeCode
            }
            setFromData(params)
        })
        setVisible(true)
    }

    const viewReport = () => {
        form.validateFields().then((values) => {
            const params = {
                startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
                cellTime: values.cellTime,
                workItemTypeCode: values.workItemTypeCode,
                projectId: projectId
            }
            setStatisticsData(params)
        })
    }

    const changField = (changedValues, allValues) => {
        const params = {
            startDate: allValues.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            endDate: allValues.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            projectId: projectId,
            projectSetId: projectSetId,
            sprintId: sprintId,
            ...allValues,
        }
        setStatisticsData(params)
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
        <div className="statistics-work">
            <div className="statistics-work-top">
                <div className="statistics-work-title">事项累计新建趋势</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={addReport}
                    onFinishFailed={onFinishFailed}
                    layout="inline"
                    onValuesChange={(changedValues, allValues) => changField(changedValues, allValues)}
                >

                    {
                        projectSetId && <Form.Item name="projectId" label="项目">
                            <Select
                                placeholder="项目"
                                allowClear
                                style={{
                                    width: 120,
                                }}
                            >
                                {
                                    projectList && projectList.map(item => {
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
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
                    {/* <div className="statics-submit">
                        <Button type="primary" htmlType="button" style={{ marginRight: "10px" }} onClick={() => viewReport()}>
                            查看报表
                        </Button>
                        <PrivilegeProjectButton code={'ReportAdd'} domainId={projectId}  {...props}>
                            <Button type="primary" htmlType="submit" onClick={() => addReport()}>
                                保存报表
                            </Button>
                        </PrivilegeProjectButton>
                    </div> */}
                </Form>
            </div>

            <div className="statistics-work-content">
                <div id="workBar" style={{ height: "500px", marginTop: "20px" }} />
                <ProjectReportAddOrEdit
                    fromData={fromData}
                    visible={visible}
                    setVisible={setVisible}
                    reportType="newtotaltrend"
                    type="work"
                    {...props}
                />
            </div>
        </div>
    )

}
export default withRouter(inject('statisticsStore')(observer(ProjectStaticsTotalEndTrend)));