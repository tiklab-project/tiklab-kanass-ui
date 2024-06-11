/*
 * @Descripttion: 项目成员事项对比
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button } from 'antd';
import "./userWorkItem.scss";
import * as echarts from 'echarts';


const UserWorkItem = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsUserWorkItemCount, findAllProject, reportList } = insightStore;
    const isEdit = condition.data.isEdit;
    // 是否编辑视图
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    // 统计条件的表单
    const [form] = Form.useForm();
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    const [userList, setUserList] = useState([])
    const [project, setProject] = useState({})
    // 所有项目的列表
    const [projectList, setProjectList] = useState([]);
    const [chart, setChart] = useState(null)

    useEffect(() => {
        /**
        * 查找所有项目集并设置默认项目集
        */
        

        findAllProject().then(res => {
            setProjectList(res.data)
        })
        return;
    }, [])

    /**
    * 处于编辑状态时，初始化筛选表单
    */
   //condition.data.data.projectId 
    useEffect(() => {
        if (isEditor) {
            const params = { projectId: condition.data.data.projectId }
            statisticsUserWorkItem(params)
        } else {
            if(!project){
                form.setFieldsValue({ projectId: null })
            }else {
                form.setFieldsValue({ projectId: condition.data.data.projectId })
            }
            
        }
        return;
    }, [isEditor])

    useEffect(() => {
        if (chart) {
            chart.resize();
        }
        return null;
    }, [condition.w])

    /**
     * 处理统计数据
     */
    const statisticsUserWorkItem = (data) => {
        const chartDom = document.getElementById(`user-workitem-${index}`)
        statisticsUserWorkItemCount(data).then(res => {
            if (res.code === 0) {
                const userList = res.data.userCount;
                setUserList(userList)
                const project = res.data.project;
                setProject(project)
                if (project) {
                    const series = [];
                    const yAxisValue = [];
                    const seriesWorkItem = [];
                    const seriesDemand = [];
                    const seriesTask = [];
                    const seriesBug = [];

                    userList.map((item, index) => {
                        yAxisValue.push(item.user.nickname ? item.user.nickname : item.user.name)
                        seriesWorkItem.push(item.workItemTypeCount.workItem)
                        seriesDemand.push(item.workItemTypeCount.demand)
                        seriesTask.push(item.workItemTypeCount.task)
                        seriesBug.push(item.workItemTypeCount.bug)
                    })
                    series.push(
                        {
                            name: "demand",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesDemand
                        },
                        {
                            name: "task",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesTask
                        },
                        {
                            name: "bug",
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: seriesBug
                        },
                    )
                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
                    let option = {
                        title: {
                            text: res.data.project.projectName
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                // Use axis to trigger tooltip
                                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
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
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: yAxisValue
                        },
                        series: series
                    };
                    myChart.setOption(option);
                }

            }
        })
    }

    /**
     * 编辑保存统计条件
     * @param {表单数据} value 
     */
    const editReport = (values) => {
        setIsEditor(!isEditor)
        reportList.lg[index].data.data = values;
        reportList.lg[index].data.isEdit = true;
        // statisticsUserWorkItem(values)
    }

    /**
     * 删除报表
     */
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <Fragment>
            <div className="user-workitem" key={condition.i} data-grid={condition}>
                <div className="user-workitem-top">
                    <div className="user-workitem-title">
                        <div>
                            项目的成员事项对比
                        </div>
                        {
                            !isView && <div className="report-action">
                                {
                                    isEdit && <div onClick={() => setIsEditor(!isEditor)}
                                        className="report-action-edit"
                                    >
                                        {isEditor ? "编辑" : "取消"}
                                    </div>
                                }
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
                    isEditor ? <div className="user-workitem-content" id={`user-workitem-${index}`} >
                        {
                            project ? <>
                                {
                                    userList.length < 0 && <Empty image="/images/nodata.png" description="该项目中没有成员~" />
                                }
                            </>
                                :
                                <div className="delete-warning">
                                    <img src={('/images/warning.png')} alt="" width="20px" height="20px" />
                                    项目不能被查看或者被删除，请修改配置或者删除
                                </div>
                        }
                    </div>
                        :
                        <Form
                            name="form"
                            form={form}
                            initialValues={{ remember: true }}
                            onFinish={editReport}
                            wrapperCol={{ span: 12 }}
                            labelCol={{ span: 6 }}
                            layout="vertical"
                        >
                            <Form.Item name="projectId" label="项目" rules={[{ required: true }]}>
                                <Select
                                    placeholder="请选择项目"
                                >
                                    {
                                        projectList && projectList.map(item => {
                                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
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

export default inject("insightStore")(observer(UserWorkItem));