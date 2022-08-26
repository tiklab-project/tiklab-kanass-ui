import React, { useEffect, useState } from "react";
import { Table,Form, Select } from 'antd';
import { NavBar, Tabs, Button, Picker } from 'antd-mobile';
import { observer, inject } from "mobx-react";
import echarts from "../../../../common/echarts/echarts";
import { withRouter } from "react-router";
import ReportAddOrEdit from "./reportAddOrEdit";
import "./statisticsWork.scss"


const StatisticsWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticWorkItem } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState();
    const projectId =  localStorage.getItem("projectId");
    const [statisticType, setStatisticType] = useState({label: "状态", value: "state"});
    const [statisticalVisible, setStatisticalVisible] = useState(false)
    let [xaixs, setXaixs] = useState([]);
    let [yaixs, setYaixs] = useState([]);
    let [preData, setPreData] = useState([]);
    const [statisticsWorkList, setStatisticsWorkList] = useState()
    const reportId = props.match.params.id;
    const statistic ={
        state: "状态",
        assigner: "经办人",
        builder: "创建人",
        reporter: "报告人",
        workType: "事项类型"
    }

    useEffect(() => {
        if (reportId !== "workall") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0 && data.data) {
                    let reportData = data.data.reportData;
                    reportData = JSON.parse(reportData);
                    const params = { collectionField: reportData.statistical,projectId: projectId}
                    
                    setStatisticType({label: statistic[reportData.statistical], value: reportData.statistical})
                    setStatisticsData(params)
                }
            })
        }
        if (reportId === "workall") {
            const params = { collectionField: "state",projectId: projectId}
            setStatisticsData(params)
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


    const addReport = () => {
      
        setFromData({statistical: statisticType.value})
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

    const statisticalList = [
        {
            value: "state",
            label: "状态"
        },
        {
            value: "assigner",
            label: "经办人"
        },
        {
            value: "builder",
            label: "创建人"
        },
        {
            value: "reporter",
            label: "报告人"
        },
        {
            value: "workType",
            label: "事项类型"
        }
    ]

    
    const selectStatisticsType = (value,extend) => {
        setStatisticType(extend.items[0])
    }
    return (
        <div className="statistics-work">
            <div className="statistics-work-top">
                <div className="statistics-work-top-left" onClick={() => props.history.goBack()}>
                    <svg className="statistics-work-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="statistics-work-title">事项状态统计</div>
                <div style={{width: "30px"}}></div>
            </div>
            <div className="statistics-work-content">
                <div className="statistics-filter">
                    <div className="statistics-dropdown">统计项:
                    </div>
                    <div className="statistics-dropdown-value" onClick={() => setStatisticalVisible(true)}>{statisticType.label}</div> 
                    <Button size='mini' color='primary' style={{marginRight: "10px"}} onClick={() => viewReport()}>
                        查看报表
                    </Button>
                    <Button size='mini' color='primary' onClick={() => addReport()}>
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
                <Picker
                    columns={[statisticalList]}
                    visible={statisticalVisible}
                    onClose={() => {
                        setStatisticalVisible(false)
                    }}
                    onConfirm={(value,extend) => selectStatisticsType(value,extend)}
                />
                <ReportAddOrEdit
                    fromData={fromData}
                    visible={visible}
                    setVisible={setVisible}
                    reportType="work"
                    {...props}
                />
            </div>
        </div>
    )

}
export default withRouter(inject('staisticStore')(observer(StatisticsWork)));