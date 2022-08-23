import React, { useEffect, useState } from "react";
import { Table,Form, Select } from 'antd';
import { NavBar, Tabs, Button } from 'antd-mobile';
import { observer, inject } from "mobx-react";
import echarts from "../../../../common/echarts/echarts";
import { withRouter } from "react-router";
import "./statistics.scss"


const StatisticsWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticWorkItem } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState();
    const projectId =  localStorage.getItem("projectId");
    const [statisticType, setStatisticType] = useState({label: "状态", value: "state"});
    let [xaixs, setXaixs] = useState([]);
    let [yaixs, setYaixs] = useState([]);
    let [preData, setPreData] = useState([]);
    const [statisticsWorkList, setStatisticsWorkList] = useState()
    const reportId = props.match.params.id;
    useEffect(() => {
        // echarts.dispose()
        if (reportId !== "workall") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0 && data.data) {
                    let reportData = data.data.reportData;
                    reportData = JSON.parse(reportData);
                    const params = { collectionField: reportData.statistical,projectId: projectId}
                    form.setFieldsValue({
                        statistical: reportData.statistical,
                        projectId: projectId
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
            const params = { 
                collectionField: statisticType.value,
                projectId: projectId
            }
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
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    迭代详情
                </div>
            </NavBar>
            <div className="statistics-work-content">
                <div className="statistics-filter">
                    <div className="statistics-dropdown">统计项:
                    </div>
                    <div className="statistics-dropdown-value">{statisticType.label}</div> 
                    <Button size='mini' color='primary' style={{marginRight: "10px"}} onClick={() => viewReport()}>
                        查看报表
                    </Button>
                    <Button size='mini' color='primary'>
                        保存报表
                    </Button> 
                </div>
                <Tabs activeKey={activeKey} type="card" size="small" onChange={clickTab}>
                    <Tabs.Tab title="柱状图" key="bar">
                        <div id="workBar" style={{ width: "90vw", height: "500px" }}>

                        </div>
                    </Tabs.Tab>
                    <Tabs.Tab title="饼图" key="pie">
                        <div id="workPie" style={{ width: "90vw", height: "500px" }} />
                    </Tabs.Tab>
                </Tabs>
                {/* <ReportAddOrEdit
                    fromData={fromData}
                    visible={visible}
                    setVisible={setVisible}
                    reportType="work"
                    {...props}
                /> */}
            </div>
        </div>
    )

}
export default withRouter(inject('staisticStore')(observer(StatisticsWork)));