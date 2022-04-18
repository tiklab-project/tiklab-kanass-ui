import React, { Fragment, useEffect, useRef, useState } from "react";
import { Breadcrumb, Divider, Table, Tabs, Form, Select, Button, InputNumber } from 'antd';
import { observer, inject } from "mobx-react";
import ReportAddOrEdit from "./reportAddOrEdit"

const { TabPane } = Tabs;


const StatisticsBulidAndEndWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticBuildAndEndWorkItem, findReportList } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
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
                        collectionType: reportData.collectionType
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
                collectionType:  values.collectionType
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
    const countType= [
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
            <Breadcrumb>
                <Breadcrumb.Item>统计</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">事项状态统计</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
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
            <Table
                columns={columns}
                dataSource={statisticsWorkList}
                pagination={{ defaultCurrent: 1, total: 30 }}
                rowKey={(record, index) => record.time}
                className="statistics-work-table"
            />

            <Tabs activeKey={activeKey} type="card" size="small" onTabClick={clickTab}>
                <TabPane tab="柱状图" key="bar">
                    <div id="workBar" style={{ width: "800px", height: "500px" }}>

                    </div>
                </TabPane>
                {/* <TabPane tab="饼图" key="pie">
                    <div id="workPie" style={{ width: "500px", height: "500px" }} />
                </TabPane> */}
            </Tabs>
            <ReportAddOrEdit
                fromData={fromData}
                visible={visible}
                setVisible={setVisible}
                reportType="statisticBulidWork"
            />
        </div>
    )

}
export default inject('staisticStore')(observer(StatisticsBulidAndEndWork));