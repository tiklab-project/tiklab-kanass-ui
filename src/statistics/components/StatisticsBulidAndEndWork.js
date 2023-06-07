import React, { useEffect, useState } from "react";
import { Table, Tabs, Form, Select, InputNumber, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import ProjectReportAddOrEdit from "./ReportAddOrEdit"
import echarts from "../../common/echarts/echarts";
import { withRouter } from "react-router";
import { exportPDF } from "./exportPDFDom"

const StatisticsBulidAndEndWork = (props) => {
    const { statisticsStore } = props;
    const { statisticBuildAndEndWorkItem, findProjectList } = statisticsStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const [projectList, setProjectList] = useState()

    const columns = [
        {
            title: '时间',
            dataIndex: 'time',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: '创建数量',
            dataIndex: 'buildCount',
            key: 'num',
        },
        {
            title: '完成数量',
            dataIndex: 'endCount',
            key: 'pre',
        }
    ];
    let [xaixs, setXaixs] = useState([]);
    let [buildYaixs, setBuildYaixs] = useState([]);
    let [endYaixs, setEndYaixs] = useState([]);
    const [statisticsWorkList, setStatisticsWorkList] = useState([])
    const reportId = props.match.params.id;

    useEffect(() => {
        form.setFieldsValue({
            dateRanger: "7",
            cellTime: "day",
            collectionType: "count"
        })
        const params = {
            dateRanger: "7",
            cellTime: "day",
            collectionType: "count",
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
        statisticBuildAndEndWorkItem(params).then(data => {
            setXaixs([]);
            xaixs = []
            buildYaixs = []
            endYaixs = []
            data.data.map((item) => {
                xaixs.push(item.time);
                buildYaixs.push(item.buildCount);
                endYaixs.push(item.endCount);
                return 0;
            })
            setXaixs(xaixs);
            setBuildYaixs(buildYaixs);
            setEndYaixs(endYaixs)
            setStatisticsWorkList(data.data);
        })
    }

    useEffect(() => {
        if (xaixs.length > 0) {
            if (activeKey === "bar") {
                setBar()
            }
        }
        return
    }, [statisticsWorkList, reportId])

    const setBar = () => {
        const workBar = echarts.init(document.getElementById('workBar'));
        workBar.setOption({
            // title: { text: '事项状态统计' },
            tooltip: {},
            xAxis: {
                data: xaixs
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '创建时间',
                    type: 'line',
                    data: buildYaixs
                },
                {
                    name: '完成时间',
                    type: 'line',
                    data: endYaixs
                }
            ]
        });
    }

    const addReport = () => {

        form.validateFields().then((values) => {
            setFromData(values)
        })
        setVisible(true)
    }

    const viewReport = () => {
        form.validateFields().then((values) => {
            const params = {
                dateRanger: values.dateRanger,
                cellTime: values.cellTime,
                collectionType: values.collectionType,
                projectId: projectId
            }
            setStatisticsData(params)
        })
    }

    const clickTab = (key) => {
        setActiveKey(key)
        if (key === "pie") {
            let timer = setInterval(() => {
                if (document.getElementById('workPie')) {
                    setPie();
                    clearInterval(timer)
                }
            }, 100);
        }
    }

    const onFinishFailed = (values) => {
        console.log(values);
    };

    const changField = (changedValues, allValues) => {
        const params = {
            
            projectId: projectId,
            projectSetId: projectSetId,
            sprintId: sprintId,
            ...allValues,
        }
        setStatisticsData(params)
    }

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
    const countType = [
        {
            value: "count",
            title: "计数"
        },
        {
            value: "countTotal",
            title: "累计"
        }
    ]
    const onExportPDF = () => {
        exportPDF('事项字段统计', [titleRef.current, pdfRef.current])
    }
    return (
        <div className="statistics-work">
            <div className="statistics-work-top">
                <div className="statistics-work-title">事项创建与解决统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={addReport}
                    onFinishFailed={onFinishFailed}
                    labelAlign="left"
                    layout="inline"
                    onValuesChange = {(changedValues, allValues) =>changField(changedValues, allValues)}
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
                    <Form.Item name="dateRanger" label="统计时长" rules={[{ required: true }]}>
                        <InputNumber min={1} max={500} />
                    </Form.Item>
                    <Form.Item name="collectionType" label="统计方式" rules={[{ required: true }]}>
                        <Select
                            placeholder="请选择统计方式"
                        >
                            {
                                countType && countType.map(item => {
                                    return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <div className="statics-submit">
                        <Button type="primary" htmlType="submit" onClick={() => onExportPDF()}>
                            导出报表
                        </Button>
                    </div>
                </Form>
            </div>

            <div className="statistics-work-content">

                <Table
                    columns={columns}
                    dataSource={statisticsWorkList}
                    rowKey={(record) => record.time}
                    className="statistics-work-table"
                    pagination={false}
                />

                {/* <Tabs activeKey={activeKey} type="card" size="small" onTabClick={clickTab}>
                    <TabPane tab="柱状图" key="bar">
                       
                    </TabPane>
                </Tabs> */}
                 <div id="workBar" className="statistics-work-bar" style={{ width: "100%", height: "500px" }}></div>
                <ProjectReportAddOrEdit
                    fromData={fromData}
                    visible={visible}
                    setVisible={setVisible}
                    reportType="bulidend"
                    type="work"
                    {...props}
                />
            </div>
        </div>
    )

}
export default withRouter(inject('statisticsStore')(observer(StatisticsBulidAndEndWork)));