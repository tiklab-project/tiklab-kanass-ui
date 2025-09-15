/*
 * @Descripttion: 根据事项字段统计事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:56:22
 */
import React, { useEffect, useRef, useState } from "react";
import {Table, Form, Select, Button, Empty} from 'antd';
import { observer, inject } from "mobx-react";
import echarts from "../../../common/echarts/echarts";
import { withRouter } from "react-router";
import { exportPDF } from "../../../common/pdf/exportPDFDom";
import StatisticsStore from "../store/StatisticStore";
import "./StatisticsStatusWork.scss"

const StatisticsWork = (props) => {
    const { statisticWorkItem, findProjectList } = StatisticsStore;
    const { index, statistical, noEdit, overviewTitle } = props
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const [isLoading, setIsLodaing] = useState(false);
    const titleRef = useRef();
    const pdfRef = useRef();
    const columns = [
        {
            title: '名称',
            dataIndex: 'statisticalTitle',
            key: 'name',
            render: text => <span>{text ? text : "暂无设置报告人"}</span>,
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
        const params = {
            collectionField: statistical ? statistical : "state",
            projectId: projectId,
            sprintId: sprintId,
            projectSetId: projectSetId
        }
        console.log()
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
                xaixs.push(item.statisticalTitle ? item.statisticalTitle : "暂无设置报告人");
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
        const workBar = echarts.init(document.getElementById(index ? 'workBar' + index : 'workBar'));
        workBar.setOption({
            tooltip: {},
            xAxis: {
                data: xaixs
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                // name: '人数',
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

    const statisticalList = [
        {
            value: "state",
            title: "状态"
        },
        {
            value: "assigner",
            title: "负责人"
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
        const params = {
            projectId: projectId,
            projectSetId: projectSetId,
            sprintId: sprintId,
            ...allValues
        }
        setStatisticsData(params)
    }

    const onExportPDF = async() => {
        setIsLodaing(true)
        await exportPDF('事项字段统计', [titleRef.current, pdfRef.current])
        setIsLodaing(false)
    }
    return (
        <div className="statistics-work">
            {
                !noEdit &&
                <div className="statistics-work-top" >
                    <div className="statistics-work-title" ref={titleRef}>事项状态统计</div>

                    <Form
                        name="form"
                        form={form}
                        initialValues={{ remember: true }}
                        labelAlign="left"
                        layout="inline"
                        onValuesChange={(changedValues, allValues) => changField(changedValues, allValues)}
                    >
                        {
                            projectSetId && <Form.Item name="projectId" label="项目">
                                <Select
                                    bordered={false}
                                    placeholder="项目"
                                    allowClear
                                    style={{
                                        width: 120,
                                        backgroundColor: '#f0f0f0'
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
                                bordered={false}
                                placeholder="选择一个统计项"
                                style={{
                                    width: 120,
                                    backgroundColor: '#f0f0f0'
                                }}
                            >
                                {
                                    statisticalList && statisticalList.map(item => {
                                        return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <div className="statics-submit">
                            <Button type="primary" htmlType="submit" loading = {isLoading} onClick={() => onExportPDF()}>
                                导出报表
                            </Button>
                        </div>
                    </Form>

                </div>
            }

            <div className="statistics-work-content" ref={pdfRef}>

                {
                    !noEdit &&
                    <Table
                        columns={columns}
                        dataSource={statisticsWorkList}
                        rowKey={(record) => record.statisticalId}
                        className="statistics-work-table"
                        pagination={false}
                        scroll={{x: "100%"}}
                        locale={{
                            emptyText: <Empty
                                imageStyle={{height: 100}}
                                description={<span>暂无数据</span>}
                            />
                        }}
                    />
                }
                <div className="statistics-area">
                    {
                        overviewTitle &&
                        <div className="statistics-title">
                            {overviewTitle}
                        </div>
                    }
                    <div id={`${index ? 'workBar' + index : 'workBar'}`} className="statistics-work-bar" />
                </div>
               
            </div>

        </div>
    )

}
export default withRouter(observer(StatisticsWork));