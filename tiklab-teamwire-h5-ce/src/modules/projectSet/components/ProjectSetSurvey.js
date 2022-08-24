/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 16:33:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:01:21
 */
import React, { useEffect,useState } from "react";
import { Card, Picker, Input, DatePicker } from 'antd-mobile';
import "./ProjectSetSurvey.scss";
import { inject, observer } from "mobx-react";
import dayjs from 'dayjs';
import { withRouter } from "react-router";
const ProjectSetSurvey = (props) => {
    const {projectSurveyStore, projectSetStore} = props;
    const {findProjectSet, updateProjectSet} = projectSetStore;
    const [projectSet, setProjectSet] = useState();
    const [projectKey, setProjectKey] = useState();

    const projectSetId = props.match.params.id;

    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);

    const [basicColumns, setbasicColumns] = useState([]);
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState()
    const [nameValue, setNameValue] = useState()

    useEffect(() => {

        findProjectSet(projectSetId).then(res => {
            setProjectSet(res.data)
            setNameValue(res.data.name)
        })

    }, [])


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


    const changeProjectInfo = (value) => {
        projectSet[projectKey] = value[0]

        const data = {
            id: projectSetId,
            [projectKey] : value[0]
        }
        updateProjectSet(data)
    }

    const updataProjectName = (value) => {
        const data = {
            id: projectSetId,
            name : value
        }
        updateProjectSet(data)
        setNameValue(value)
    }

    const showStartTimePicker = (key) => {
        setPlanStartPickerVisible(true)
        
    }

    const updateStartTime = (updateData) => {
        let data = {
            startTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: projectSetId
        }
        updateProjectSet(data)
        projectSet.startTime = dayjs(updateData).format('YYYY-MM-DD')
    
    }

    const showEndTimePicker = (key) => {
        setPlanEndPickerVisible(true)
    }

    const updatePlanEnd = (updateData) => {
        let data = {
            endTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: projectSetId,
        }
        updateProjectSet(data)
        projectSet.endTime = dayjs(updateData).format('YYYY-MM-DD')
    }

    return (
        <div className="projectset-survey">
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                title='项目集详情'
                style={{ backgroundColor: "#fff" }}
            >   
                 <div className="projectset-info-item name-item">
                    <span>
                        项目集名称：
                    </span>
                    <span>
                        {projectSet && <Input
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
                <div className="projectset-info-item">
                    <span>
                        项目数量：
                    </span>
                    <span>
                        {projectSet && statusSet(projectSet.projectNumber)}
                    </span>

                </div>
                <div className="projectset-info-item">
                    <span>
                        创建人：
                    </span>
                    <span>
                        {projectSet && projectSet.master.name}
                    </span>
                </div>
                {/* <div className="projectset-info-item">
                    <span>
                        成员数量：
                    </span>
                    <span>
                        {projectSet && projectSet.member}
                    </span>
                </div> */}
                <div className="projectset-info-item">
                    <span>
                        开始时间：
                    </span>
                    <span onClick={() => showStartTimePicker("startTime")}>
                        {projectSet && projectSet.startTime}
                    </span>

                </div>
                <div className="projectset-info-item">
                    <span>
                        结束时间：
                    </span>
                    <span onClick={() => showEndTimePicker("endTime")}>
                    {projectSet && projectSet.endTime}
                    </span>

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
            <DatePicker
                visible={planStartPickerVisible}
                precision = 'day'
                onClose={() => {
                    setPlanStartPickerVisible(false)
                }}
                onConfirm={(value,extend) => updateStartTime(value)}
            >
            </DatePicker>
            <DatePicker
                visible={planEndPickerVisible}
                precision = 'day'
                onClose={() => {
                    setPlanEndPickerVisible(false)
                }}
                onConfirm={(value,extend) => updatePlanEnd(value)}
            >
            </DatePicker>
        </div>

    )
}

export default withRouter(inject("projectSetStore")(observer(ProjectSetSurvey)));