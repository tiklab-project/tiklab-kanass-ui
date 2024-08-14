/*
 * @Descripttion: 项目集的项目成员对比
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Form, Select, Button, Empty } from 'antd';
import "./ProjectSetMember.scss";
import * as echarts from 'echarts';
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import ImgComponent from "../../../common/imgComponent/ImgComponent";


const ProjectSetMember = (props) => {
    const { insightStore, index, editInsight, isView, condition } = props;
    const { statisticsProjectUserCount, findAllProjectSet, reportList } = insightStore;
    const isEdit = condition.data.isEdit;
    // 是否编辑视图
    const [isEditor, setIsEditor] = useState(editInsight ? true : false);
    // 统计条件的表单
    const [form] = Form.useForm();
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    // 统计项目成员的列表
    const [projectUserList, setProjectUserList] = useState([])
    const [projectSet, setProjectSet] = useState({});
    const [chart, setChart] = useState(null)
    useEffect(() => {
        /**
         * 查找所有项目集并设置默认项目集
         */
        findAllProjectSet().then(res => {
            setProjectSetList(res.data)
        })
    }, [])

    /**
     * 处于编辑状态时，初始化筛选表单
     */
    useEffect(() => {
        if (isEditor) {
            const value = {
                projectSetId: condition.data.data.projectSetId
            }
            statisticsProjectUser(value)
        } else {
            if (!projectSet) {
                form.setFieldsValue({ projectSetId: null })
            } else {
                form.setFieldsValue({ projectSetId: condition.data.data.projectSetId })
            }

        }

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
    const statisticsProjectUser = (value) => {
        const chartDom = document.getElementById(`project-user-${index}`)
        statisticsProjectUserCount(value).then(res => {
            if (res.code === 0) {
                const projectUserList = res.data.projectUserCountList;
                const projectSet = res.data.projectSet;
                setProjectSet(projectSet)
                setProjectUserList(projectUserList)
                if (projectSet && projectUserList.length > 0) {
                    const axisValue = []
                    const yAxisValue = []
                    projectUserList.map(item => {
                        axisValue.push(item.project.projectName)
                        yAxisValue.push(item.count)
                    })
                    let myChart = echarts.init(chartDom);
                    setChart(myChart)
                    let option = {
                        title: {
                            text: projectSet.name

                        },
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
                            boundaryGap: [0, 1]
                        },
                        yAxis: {
                            type: 'category',
                            data: axisValue
                        },
                        series: [
                            {
                                name: '项目成员',
                                type: 'bar',
                                data: yAxisValue
                            }
                        ]
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
        // statisticsProjectUser(values)
    }

    /**
     * 删除报表
     */
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <Fragment>
            <div className="projectset-user" key={condition.i} data-grid={condition}>
                <div className="projectset-user-top">
                    <div className="projectset-user-title">
                        <div>
                            项目成员对比
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
                    isEditor ?
                        <div className="projectset-user-content" id={`project-user-${index}`}>
                            {
                                !projectSet ? <div className="delete-warning">
                                    <ImgComponent src={'warning.png'} alt="" width="20px" height="20px" />  项目集不能被查看或者被删除，请修改配置或者删除
                                </div>
                                    :
                                    <>
                                        {
                                            projectUserList.length <= 0 && 
                                            <ProjectEmpty description="项目集中没有项目~" />
                                        }
                                    </>
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