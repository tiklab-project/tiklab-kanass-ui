import React, { useEffect, useState } from "react";
import { NavBar, Form, Button, Input, Picker } from 'antd-mobile';
import { observer, inject } from "mobx-react";
import ReportAddOrEdit from "./reportAddOrEdit"
import echarts from "../../../../common/echarts/echarts";
import { withRouter } from "react-router";
import "./statisticsBulidAndEndWork.scss"
import { number } from "echarts";

const StatisticsBulidAndEndWork = (props) => {
    const { staisticStore } = props;
    const { findReport, statisticBuildAndEndWorkItem, findReportList } = staisticStore;
    const [activeKey, setActiveKey] = useState("bar");
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const projectId = localStorage.getItem("projectId");

    let [xaixs, setXaixs] = useState([]);
    let [buildYaixs, setBuildYaixs] = useState([]);
    let [endYaixs, setEndYaixs] = useState([]);
    const [statisticsWorkList, setStatisticsWorkList] = useState([])

    const [cellTime, setCellTime] = useState({
        value: "day",
        label: "天"
    })
    const [datePickerVisible, setDatePickerVisible] = useState(false)

    const [collectionType, setCollectionType] = useState({
        value: "count",
        label: "计数"
    },)
    const [collectionPickerVisible, setCollectionPickerVisible] = useState(false)

    const [dateRanger, setDateRanger] = useState(7)
    const reportId = props.match.params.id;

    const dateList = [
        {
            value: "day",
            label: "天"
        },
        {
            value: "week",
            label: "周"
        },
        {
            value: "month",
            label: "月"
        },
        {
            value: "quarter",
            label: "季度"
        },
        {
            value: "year",
            label: "年"
        }
    ]

    const dateObject = {
        day: "天",
        week: "周",
        month: "月",
        quarter: "季度",
        year: "年"
    } 
    const countType = [
        {
            value: "count",
            label: "计数"
        },
        {
            value: "countTotal",
            label: "累计"
        }
    ]

    const countObject = {
        count: "计数",
        countTotal: "累计"
    }
    useEffect(() => {
        // echarts.dispose()
        if (reportId !== "bulidendall") {
            findReport({ id: reportId }).then(data => {
                if (data.code === 0) {
                    let reportData = data.data.reportData;
                    reportData = JSON.parse(reportData);
                    setCellTime({
                        value: reportData.cellTime,
                        label: dateObject[reportData.cellTime]
                    })
                    setCollectionType({
                        value: reportData.collectionType,
                        label: countObject[reportData.collectionType]
                    })
                    setDateRanger(reportData.dateRanger)

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
        if(reportId === "bulidendall"){
            const params = {
                dateRanger: "7",
                cellTime: "day",
                collectionType: "count",
                projectId: projectId
            }
            setStatisticsData(params)
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

    const addReport = () => {
        const values = {
            dateRanger: dateRanger,
            cellTime: cellTime.value,
            collectionType: collectionType.value
        }
        setFromData(values)
        setVisible(true)
    }

    const viewReport = () => {
        const params = {
            dateRanger: dateRanger,
            cellTime: cellTime.value,
            collectionType: collectionType.value,
            projectId: projectId
        }
        setStatisticsData(params)
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

    const selectDate = (value,extend) => {
        setCellTime(extend.items[0])   
    }

    const selectCollection = (value,extend) => {
        setCollectionType(extend.items[0])
    }
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
                    事项创建与解决统计
                </div>
            </NavBar>
            <div className="statistics-buidlend-content">
                <div className="statistics-buidlend-filter">
                    <div className="statistics-filter-form">
                        <div className="statistics-filter-item">
                            <div className="statistics-filter-label">期间:   </div>
                            <div
                                className="statistics-filter-value"
                                onClick={() => setDatePickerVisible(true)}
                            >
                                {cellTime.label}
                            </div>
                        </div>
                        <div className="statistics-filter-item">
                            <div className="statistics-filter-label">统计时长:   </div>
                            <div className="statistics-filter-value">
                                <Input
                                    placeholder='请输入数字'
                                    type = {"number"}
                                    style = {{"--font-size": "13px"}}
                                    value={dateRanger}
                                    onChange={val => {
                                        setDateRanger(val)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="statistics-filter-item">
                            <div className="statistics-filter-label">统计方式:   </div>
                            <div className="statistics-filter-value" onClick={() => setCollectionPickerVisible(true)}>{collectionType.label}</div>
                        </div>
                    </div>
                    <div className="statistics-filter-botton">
                        <Button size='mini' color='primary' style={{ marginRight: "10px" }} onClick={() => viewReport()}>
                            查看报表
                        </Button>
                        <Button size='mini' color='primary' onClick={() => addReport()}>
                            保存报表
                        </Button>
                    </div>

                </div>
                <div id="workBar" style={{ width: "90vw", height: "500px" }}></div>
                <Picker
                    columns={[dateList]}
                    visible={datePickerVisible}
                    onClose={() => {
                        setDatePickerVisible(false)
                    }}
                    onConfirm={(value,extend) => selectDate(value,extend)}
                />
                <Picker
                    columns={[countType]}
                    visible={collectionPickerVisible}
                    onClose={() => {
                        setCollectionPickerVisible(false)
                    }}
                    onConfirm={(value,extend) => selectCollection(value,extend)}
                />
                <ReportAddOrEdit
                    fromData={fromData}
                    visible={visible}
                    setVisible={setVisible}
                    reportType="bulidend"
                    {...props}
                />
            </div>
        </div>
    )

}
export default withRouter(inject('staisticStore')(observer(StatisticsBulidAndEndWork)));