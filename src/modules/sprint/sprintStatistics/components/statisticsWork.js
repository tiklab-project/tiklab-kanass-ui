import React,{Fragment,useEffect, useState} from "react";
import {Table,Tabs  } from 'antd';
import * as echarts from 'echarts';
import { observer, inject } from "mobx-react";
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const { TabPane } = Tabs;


const SprintStatisticsWork =(props)=> {
    const {sprintStatisticStore } = props;
    const {getStaticsWorkList,statisticsWorkList,workXaixs,workYaixs,workPreData} = sprintStatisticStore;
    const sprintId = localStorage.getItem("sprintId")
    const columns = [
        {
            title: '姓名',
            dataIndex: ['workStatus','name' ],
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

    
    useEffect(() => {
        getStaticsWorkList(sprintId).then(()=> {
            setBar() 
        }) 
    }, [])
    const setBar = ()=> {
        const workBar = echarts.init(document.getElementById('workBar'));
        workBar.setOption({
            title: { text: '事项状态统计' },
            tooltip: {},
            xAxis : {
                data: workXaixs
            },
            yAxis : {},
            series: [{
                name: '人数',
                type: 'bar',
                data: workYaixs
            }]
        });
    }

    const setPie = ()=> {
        const workPie = echarts.init(document.getElementById('workPie'));
        workPie.setOption({
            title: { text: '事项状态统计' },
            legend: {
                orient: 'vertical',
                left: 10,
                top: 30,
                data: workXaixs,
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
                data: workPreData
            }]
        })
    }

    
    const clickTab = (key)=> {
        if(key === "pie"){
            setWorkPie(document.getElementById('workPie'))
        }
    }
    
    const [workPie,setWorkPie] = useState("")
    useEffect(() => {
        if(workPie !== ""){
            setPie()
        }
    }, [workPie])

    return (
        <Fragment>
            <Table 
                columns = {columns} 
                dataSource = {statisticsWorkList} 
                pagination = {{defaultCurrent:1, total:30}}
                // rowKey={(record) => record.workStatus.id}
            />

            <Tabs defaultActiveKey="bar" type="card" size="small" onTabClick={clickTab} className="bar-pie">
                <TabPane tab="柱状图" key="bar">
                    <div id="workBar" style={{width: "500px",height: "500px"}}>

                    </div>
                </TabPane>
                <TabPane tab="饼图" key="pie">
                    <div id ="workPie" style={{width: "500px",height: "500px"}}></div>
                </TabPane>
            </Tabs>
        </Fragment>
    )
    
} 
export default inject('sprintStatisticStore')(observer(SprintStatisticsWork));