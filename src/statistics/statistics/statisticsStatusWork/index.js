
import React, { useEffect, useState } from "react";
import { Table, Tabs, Form, Select, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import echarts from "../../../common/echarts/echarts";
import { withRouter } from "react-router";
import statisticStore from "../store/StatisticStore";

const StatisticsStatusWork = (props) => {
    const { statisticWorkItem, findProjectList } = statisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;

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

    const [projectList, setProjectList] = useState()
    useEffect(() => {
        const params = { collectionField: "state", projectId: projectId, sprintId: sprintId, projectSetId: projectSetId }
        form.setFieldsValue({
            collectionField: "state",
            projectId: projectId
        })
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


    // useEffect(() => {
    //     if (workPie) {
    //         setPie()
    //     }
    // }, [workPie])

    const onGenderChange = (value) => {

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

    const changField = (changedValues, allValues) => {
        console.log(allValues)
        const params = {
            projectId: projectId,
            projectSetId: projectSetId,
            sprintId: sprintId,
            ...allValues
        }
        setStatisticsData(params)
    }
    return (
        <>
            <div className="statistics-work-top">
                <div className="statistics-work-title">事项状态统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinishFailed={onFinishFailed}
                    labelAlign="left"
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

                    <Form.Item name="collectionField" label="统计项" rules={[{ required: true }]}>
                        <Select
                            placeholder="选择一个统计项"
                            onChange={onGenderChange}
                        >
                            {
                                statisticalList && statisticalList.map(item => {
                                    return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>


            <div className="statistics-work-content">

                <Table
                    columns={columns}
                    dataSource={statisticsWorkList}
                    rowKey={(record) => record.statisticalId}
                    className="statistics-work-table"
                    pagination={false}
                />
                <div id="workBar" className="statistics-work-bar" style={{ width: "100%", height: "500px" }} />
            </div>
        </>
    )

}
export default withRouter(StatisticsStatusWork);