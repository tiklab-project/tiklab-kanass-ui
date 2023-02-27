import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, Empty } from 'antd';
import "./ProjectSetWorkItem.scss";
import * as echarts from 'echarts';


const ProjectSetWorkItem = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsProjectWorkItemCount, findAllProjectSet, reportList } = insightStore;
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    const [form] = Form.useForm();
    const [projectSetList, setProjectSetList] = useState([])
    const [projectWorkitem, setProjectWorkitem] = useState([])
    useEffect(() => {
         findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    useEffect(() => {
        if(isEditor){
            const params = { projectSetId: condition.data.data.projectSetId }
            form.setFieldsValue({projectSetId: condition.data.data.projectSetId})
            statisticsProjectWorkItem(params)
        }
        
    },[isEditor])

    /**
     * 处理统计数据
     */
     const statisticsProjectWorkItem = (value) => {
        const chartDom = document.getElementById('project-workitem')
        statisticsProjectWorkItemCount(value).then(res => {
            if (res.code === 0) {
                const projectList = res.data.project;
                const types = res.data.types;
                const series = []
                const yAxisValue = []
                setProjectWorkitem(projectList.project)
                if (projectList.project.length > 0) {
                    projectList.project.map((item, index) => {
                        yAxisValue.push(item.projectName)

                    })
                    projectList.countList.map((item, index) => {
                        // yAxisValue.push(item.projectName)
                        series.push({
                            name: types[index],
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: item
                        })
                    })
                    let myChart = echarts.init(chartDom);
                    let option = {
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

    const editReport = (values) => {
        setIsEditor(!isEditor)
        reportList.lg[index].data.data = values;
        reportList.lg[index].data.isEdit = true;
        statisticsProjectWorkItem(values)
    }

    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }
    

    const onFinishFailed = (values) => {
        console.log(values);
    };

    return (
        <Fragment>
            <div className="project-workitem"  key = {condition.i} data-grid={condition}>
                <div className="project-workitem-top">
                    <div className="project-workitem-title">
                        <div>
                            项目事项对比
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
                    isEditor ? <div className="project-workitem-content" id="project-workitem">
                        {
                            projectWorkitem.length <= 0 && <Empty />
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

export default inject("insightStore")(observer(ProjectSetWorkItem));