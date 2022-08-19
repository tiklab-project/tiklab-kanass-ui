/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 16:33:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:01:21
 */
import React, { useEffect,useState } from "react";
import { Card, Picker, Input } from 'antd-mobile';
import "../components/survey.scss";
import { inject, observer } from "mobx-react";
import moment from 'moment';
import * as echarts from "echarts"
const Survey = (props) => {
    const {projectSurveyStore} = props;
    const {findProject,findProjectBurnDowmChartPage, updateProject} = projectSurveyStore;
    const [project, setProject] = useState();
    const [projectKey, setProjectKey] = useState();
    const projectId = localStorage.getItem("projectId");
    const [basicColumns, setbasicColumns] = useState([]);
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState()
    const [nameValue, setNameValue] = useState()

    useEffect(() => {
        const timerXaixs = ["2022-03-09", "2022-03-10", "2022-03-11", "2022-03-12",
            "2022-03-13", "2022-03-14", "2022-03-15"
        ];
        const workCountYaixs = [10,7,5,4,3,2,1];
        const Yaxis = [10,8,6,4,2,2,0];
        // burnDownChart(timerXaixs, workCountYaixs, Yaxis)

        findProject(projectId).then(res => {
            setProject(res.data)
            setNameValue(res.data.projectName)
        })

    }, [])

    useEffect(()=> {
        if(project){
            findProjectBurnDowmChartPage(projectId).then(res => {
                if (res.code === 0) {
                    let timerXaixs = [];
                    let workCountYaixs = [];
                    let Yaxis = [];
                    if(res.data.dataList.length >0){
                        res.data.dataList.map((item, index) => {
                            timerXaixs.push(item.recordTime);
                            workCountYaixs.push(item.remainWorkItemCount);
                            Yaxis.push(item.totalWorkItemCount * (7 - index) / 7);
                            return;
                        })
                    }else {
                        timerXaixs.push(moment().format("YYYY-MM-DD"));
                        Yaxis.push(project.worklItemNumber);
                        workCountYaixs.push(project.worklItemNumber);
                        let i = 1;
                        for(i=1; i <= 6; i++){
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(project.worklItemNumber);
                            Yaxis.push(project.worklItemNumber * (7 - i) / 7);
                        }
                    }
                    burnDownChart(timerXaixs, workCountYaixs, Yaxis)
                }
            })
        }

    },[project])

    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "1":
                data = "未开始";
                break;
            case "2":
                data = "已启动";
                break;
            case "3":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }

    const modelName = (value) => {
        let data = ""
        switch (value) {
            case "workItem":
                data = "事项";
                break;
            case "sprint":
                data = "迭代";
                break;
            case "project":
                data = "项目";
                break;
            default:
                break;

        }
        return data;
    }

    const typeName = (value) => {
        let data = ""
        switch (value) {
            case "add":
                data = "添加";
                break;
            case "update":
                data = "更新";
                break;
            case "delete":
                data = "删除";
                break;
            default:
                break;

        }
        return data;
    }

    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('burn-down'));
        let option;
        option = {
            // title: {
            //     text: '燃尽图'
            // },
            color: ['#5470c6', '#91cc75'],
            xAxis: {
                type: 'category',
                data: timerXaixs
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                data: ['real', 'ideal']
            },
            series: [
                {
                    data: workCountYaixs,
                    name: 'real',
                    // stack: 'Total',
                    type: 'line'
                },
                {
                    name: 'ideal',
                    type: 'line',
                    // stack: 'Total',
                    data: Yaxis
                },
            ]
        };
        burnDown.setOption(option)
    }

    const status = [
        [
            { label: '未开始', value: '1' },
            { label: '已启动', value: '2' },
            { label: '已结束', value: '3' }
        ]
    ]
    const showStatusPicker = (value) => {
        setbasicColumns(status)
        setVisible(true)
        setValue([project[value]])
        setProjectKey(value)
    }

    const changeProjectInfo = (value) => {
        project[projectKey] = value[0]

        const data = {
            id: projectId,
            [projectKey] : value[0]
        }
        updateProject(data)
    }

    const updataProjectName = (value) => {
        const data = {
            id: projectId,
            projectName : value
        }
        updateProject(data)
        setNameValue(value)
    }
    return (
        <div style={{ backgroundColor: "#F4F5F7" }} className="project-survey">
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                title='项目详情'
                style={{ backgroundColor: "#fff" }}
            >   
                 <div className="project-info-item name-item">
                    <span>
                        项目名称：
                    </span>
                    <span>
                        {project && <Input
                            placeholder='请输入内容'
                            value={nameValue}
                            onChange={val => {
                                updataProjectName(val)
                            }}
                            style = {{
                                "--font-size" : "12px",
                                "--text-align" : "right"
                            }}
                        />}
                    </span>

                </div>
                <div className="project-info-item">
                    <span>
                        项目动态：
                    </span>
                    <span onClick={() => showStatusPicker("projectState")}>
                        {project && statusSet(project.projectState)}
                    </span>

                </div>
                <div className="project-info-item">
                    <span>
                        创建人：
                    </span>
                    <span>
                    {project && project.master.name}
                    </span>
                </div>
                <div className="project-info-item">
                    <span>
                        成员数量：
                    </span>
                    <span>
                    {project && project.member}
                    </span>
                </div>
                <div className="project-info-item">
                    <span>
                        开始时间：
                    </span>
                    <span>
                    {project && project.startTime}
                    </span>

                </div>
                <div className="project-info-item">
                    <span>
                        结束时间：
                    </span>
                    <span>
                    {project && project.endTime}
                    </span>

                </div>
            </Card>
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                title='项目详情'
                style={{ backgroundColor: "#fff",marginTop: "10px" }}
            >
                <div className="burn-down" id="burn-down" style={{ width: "100%", height: "500px" }}>

                </div>
            </Card>
            <Picker
                columns={basicColumns}
                visible={visible}
                onClose={() => {
                    setVisible(false)
                }}
                value={value}
                onConfirm={value => changeProjectInfo(value)}
            />
        </div>

    )
}

export default inject("projectSurveyStore")(observer(Survey));