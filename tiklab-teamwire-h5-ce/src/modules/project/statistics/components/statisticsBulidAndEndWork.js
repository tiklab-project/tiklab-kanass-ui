import React, { useEffect, useState } from "react";
import { Form, Select, Button, InputNumber } from 'antd';
import { NavBar, Tabs } from 'antd-mobile';
import { observer, inject } from "mobx-react";
import ReportAddOrEdit from "./reportAddOrEdit"
import echarts from "../../../../common/echarts/echarts";
import { withRouter } from "react-router";


const StatisticsBulidAndEndWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticBuildAndEndWorkItem, findReportList } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const projectId = localStorage.getItem("projectId");
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
        // echarts.dispose()
        if (reportId !== "statisticBulidWork") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0) {
                    let reportData = data.data.reportData;
                    reportData = JSON.parse(reportData);
                    form.setFieldsValue({
                        dateRanger: reportData.dateRanger,
                        cellTime: reportData.cellTime,
                        collectionType: reportData.collectionType
                    })
                    const params = {
                        dateRanger: reportData.dateRanger,
                        cellTime: reportData.cellTime,
                        collectionType: reportData.collectionType,
                        projectId: projectId
                    }
                    setStatisticsData(params)
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
            title: { text: '事项状态统计' },
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

    const addReport = (values) => {
        setFromData(values)
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


    // useEffect(() => {
    //     if (workPie) {
    //         setPie()
    //     }
    // }, [workPie])

    const onGenderChange = (value) => {

    };

    const onFinish = (values) => {
        console.log(values);
    };

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

    return (
        <div className="statistics-work">
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={() => props.history.goBack()}
            >
                <div className="title-top">
                    迭代详情
                </div>
            </NavBar>
            <div className="statistics-work-content">
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={addReport}
                    onFinishFailed={onFinishFailed}
                    labelAlign="left"
                    layout="inline"
                >
                    <Form.Item name="cellTime" label="期间" rules={[{ required: true }]}>
                        <Select
                            placeholder="请选择期间"
                            onChange={onGenderChange}
                        >
                            {
                                dateList && dateList.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
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
                            onChange={onGenderChange}
                        >
                            {
                                countType && countType.map(item => {
                                    return <Option value={item.value} key={item.value}>{item.title}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={() => viewReport()}>
                            查看报表
                        </Button>
                        <Button type="primary" htmlType="submit">
                            保存报表
                        </Button>
                    </Form.Item>
                </Form>
                <div id="workBar" style={{ width: "90vw", height: "500px" }}></div>            
                {/* <Tabs activeKey={activeKey} type="card" size="small" onChange={clickTab}>
                    <Tabs.Tab title="柱状图" key="bar">
                       
                    </Tabs.Tab>
                   
                </Tabs> */}
            </div>
        </div>
    )

}
export default withRouter(inject('staisticStore')(observer(StatisticsBulidAndEndWork)));