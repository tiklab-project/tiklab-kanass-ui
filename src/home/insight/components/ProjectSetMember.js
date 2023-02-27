import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, DatePicker, Empty } from 'antd';
import "./ProjectSetMember.scss";
import * as echarts from 'echarts';


const ProjectSetMember = (props) => {
    const { insightStore,index, editInsight,isView, condition } = props;
    const { statisticsProjectUserCount, findAllProjectSet,reportList } = insightStore;
    const [isEditor, setIsEditor] = useState(editInsight ? true: false);
    const [form] = Form.useForm();
    const [projectSetList, setProjectSetList] = useState([])
    const [projectUserList, setProjectUserList] = useState([])


    useEffect(() => {
         findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    useEffect(() => {
        if(isEditor){
            const value = {
                projectSetId: condition.data.data.projectSetId
            }
            form.setFieldsValue({projectSetId: condition.data.data.projectSetId})
            statisticsProjectUser(value)
        }
        
    },[isEditor])

    /**
     * 处理统计数据
     */
     const statisticsProjectUser = (value) => {
        const chartDom = document.getElementById('project-user')
        statisticsProjectUserCount(value).then(res => {
            if (res.code === 0) {
                const projectUserList = res.data;
                const axisValue = []
                const yAxisValue = []
                console.log(projectUserList)
                setProjectUserList(projectUserList)
                if (projectUserList.length > 0) {
                    projectUserList.map(item => {
                        axisValue.push(item.project.projectName)
                        yAxisValue.push(item.count)
                    })
                    console.log(axisValue, yAxisValue)
                    let myChart = echarts.init(chartDom);
                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {},
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: ['项目1']
                        },
                        series: [
                            {
                                name: '项目成员',
                                type: 'bar',
                                data: [2]
                            }
                        ]
                    };
                    myChart.setOption(option);
                }

            }
        })
    }

    const editReport = (values) => {
        setIsEditor(!isEditor)
        reportList.lg[index].data.data = values;
        reportList.lg[index].data.isEdit = true;
        statisticsProjectUser(values)
    }

    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }
    
    const onFinishFailed = (values) => {
        console.log(values);
    };

    return (
        <Fragment>
            <div className="projectset-user"  key = {condition.i} data-grid={condition}>
                <div className="projectset-user-top">
                    <div className="projectset-user-title">
                        <div>
                            项目成员对比sa
                        </div>
                        {
                            !isView && <div className="report-action">
                                <div onClick={() => setIsEditor(!isEditor)}
                                    className="report-action-edit"
                                >
                                    {isEditor ? "编辑" : "取消"}
                                </div>
                                <div
                                    onClick={() => deleteReport()}
                                    className="report-action-delete"
                                >
                                    删除
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {
                    isEditor ? <div className="projectset-user-content" id="project-user">
                        {
                            projectUserList.length <= 0 && <Empty />
                        }
                    </div>
                    :
                    <Form
                        name="form"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={editReport}
                        onFinishFailed={onFinishFailed}
                        wrapperCol={{ span: 12 }}
                        labelCol={{ span: 6 }}
                        layout = "vertical"
                    >   
                        <Form.Item name="projectSetId" label="项目集" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择项目集"
                            >
                                {
                                    projectSetList && projectSetList.map(item => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    
                        <Form.Item
                            wrapperCol={{ offset: 6, span: 8 }}
                        >
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </div>

        </Fragment >

    )
}

export default inject("insightStore")(observer(ProjectSetMember));