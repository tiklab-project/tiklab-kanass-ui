import React, { Fragment, useEffect, useRef, useState } from "react";
import { Breadcrumb, Divider, Table, Tabs, Form, Select, Button } from 'antd';
import { observer, inject } from "mobx-react";
import ReportAddOrEdit from "./reportAddOrEdit"

const { TabPane } = Tabs;


const StatisticsWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticWorkItem, findReportList } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const columns = [
        {
            title: '姓名',
            dataIndex: 'statisticalTitle',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: '数量',
            dataIndex: 'groupCount',
            key: 'num',
        },
        {
            title: '百分比',
            dataIndex: 'percentText',
            key: 'pre',
        }
    ];
    let [xaixs, setXaixs] = useState([]);
    let [yaixs, setYaixs] = useState([]);
    let [preData, setPreData] = useState([]);
    const [statisticsWorkList, setStatisticsWorkList] = useState([])
    const reportId = props.match.params.id;
    useEffect(() => {
        if (reportId !== "statisticWork") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0) {
                    let reportData = data.data.reportData;
                    reportData = JSON.parse(reportData);
                    const params = { field: reportData.statistical}
                    form.setFieldsValue({
                        statistical: reportData.statistical
                    })
                    setStatisticsData(params)
                }
            })
        }

        return;
    }, [reportId])

    const setStatisticsData = (params) => {
        statisticWorkItem(params).then(data => {
            // setXaixs([]);
            xaixs = []
            yaixs = []
            preData = []
            data.data.map((item) => {
                xaixs.push(item.statisticalTitle);
                yaixs.push(item.groupCount);
                preData.push({ name: item.statisticalTitle, value: item.percent });
                return 0;
            })
            setXaixs(xaixs);
            setYaixs(yaixs);
            setPreData(preData);
            setStatisticsWorkList(data.data);
        })
    }
    useEffect(() => {
        if (xaixs.length > 0) {
            if (activeKey === "bar") {
                setBar()
            }
            if (activeKey === "pie") {
                setPie()
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
            series: [{
                name: '人数',
                type: 'bar',
                data: yaixs
            }]
        });
    }

    const addReport = (values) => {
        setFromData(values)
        setVisible(true)
    }

    const viewReport = () => {
        form.validateFields().then((values) => {
            const params = { field: values.statistical }
            setStatisticsData(params)
        })
    }

    const setPie = () => {
        const workPieDom = document.getElementById('workPie')
        if (!workPieDom) return
        const workPie = echarts.init(workPieDom);
        workPie.setOption({
            title: { text: '事项状态统计' },
            legend: {
                orient: 'vertical',
                left: 10,
                top: 30,
                data: xaixs,
            },
            tooltip: {},
            series: [{
                name: '百分比',
                type: 'pie',
                avoidLabelOverlap: false,
                radius: ['50%', '70%'],
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                data: preData
            }]
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
        if (key === "bar") {
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
    const statisticalList = [
        {
            value: "state",
            title: "状态"
        },
        {
            value: "assigner",
            title: "经办人"
        },
        {
            value: "builder",
            title: "创建人"
        },
        {
            value: "reporter",
            title: "报告人"
        },
        {
            value: "workType",
            title: "事项类型"
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
                <Form.Item name="statistical" label="统计项" rules={[{ required: true }]}>
                    <Select
                        placeholder="请选择一个统计项"
                        onChange={onGenderChange}
                    >
                        {
                            statisticalList && statisticalList.map(item => {
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
                rowKey={(record, index) => record.statisticalId}
                className="statistics-work-table"
            />

            <Tabs activeKey={activeKey} type="card" size="small" onTabClick={clickTab}>
                <TabPane tab="柱状图" key="bar">
                    <div id="workBar" style={{ width: "500px", height: "500px" }}>

                    </div>
                </TabPane>
                <TabPane tab="饼图" key="pie">
                    <div id="workPie" style={{ width: "500px", height: "500px" }} />
                </TabPane>
            </Tabs>
            <ReportAddOrEdit
                fromData={fromData}
                visible={visible}
                setVisible={setVisible}
                reportType="statisticWork"
            />
        </div>
    )

}
export default inject('staisticStore')(observer(StatisticsWork));