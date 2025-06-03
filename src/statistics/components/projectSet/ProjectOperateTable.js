/*
 * @Descripttion: 项目的事项进展
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Progress, Pagination, Empty, Select, Form, Button, Spin } from 'antd';
import "./ProjectOperateTable.scss";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import StatisticsStore from "../../store/StatisticsStore";
const { Option } = Select;

const ProjectOperateTable = (props) => {
    // const { insightStore, index, condition, editInsight, isView } = props;
    const { statisticsProjectOperateList, findAllProjectSet, setProjectSetId, reportList } = StatisticsStore;
    // const isEdit = condition.data.isEdit;
    // 项目进展列表
    const [projectOperateList, setProjectOPerteList] = useState([])
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    const [projectSet, setProjectSet] = useState({})
    // 统计表单
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        /**
         * 查找所有项目集并设置默认项目集
         */
        findAllProjectSet().then(res => {
            setProjectSetList(res.data)
            setProjectSetId(res.data[0].id)
        })
        return;
    }, [])

    const onValuesChange = (changeValue,allValues) => {
        setLoading(true);
        statisticsProjectOperateList({ projectSetId: allValues.projectSetId }).then(res => {
                        if (res.code === 0) {
                            setProjectOPerteList(res.data.projectOperateReportList)
                            setProjectSet(res.data.projectSet)
                            setLoading(false)
                        }
                    })
    }

    // /**
    //  * 处于编辑状态时，初始化筛选表单
    //  */
    // useEffect(() => {
    //     if (isEditor) {
    //         setLoading(true)
    //         statisticsProjectOperateList({ projectSetId: condition.data.data.projectSetId }).then(res => {
    //             if (res.code === 0) {
    //                 setProjectOPerteList(res.data.projectOperateReportList)
    //                 setProjectSet(res.data.projectSet)
    //                 setLoading(false)
    //             }
    //         })
    //     } else {
    //         if (!projectSet) {
    //             form.setFieldsValue({ projectSetId: null })
    //         } else {
    //             form.setFieldsValue({ projectSetId: condition.data.data.projectSetId })
    //         }
    //
    //     }
    //     return;
    // }, [isEditor])

    // /**
    //  * 编辑保存统计条件
    //  * @param {表单数据} value
    //  */
    // const editReport = (value) => {
    //     // statisticsProjectOperateList(value).then(res => {
    //     //     if (res.code === 0) {
    //     //         setProjectOPerteList(res.data)
    //     //     }
    //     // })
    //     reportList.lg[index].data.data = value;
    //     reportList.lg[index].data.isEdit = true;
    //     setIsEditor(!isEditor)
    // }

    // /**
    //  * 删除报表
    //  */
    // const deleteReport = () => {
    //     reportList.lg.splice(index, 1)
    // }

    return (
        <div className="statistics">
            <div className="statistics-top">
                <div className="statistics-work-title">项目进度统计</div>
                <Form
                    name="form"
                    form={form}
                    initialValues={{ remember: true }}
                    onValuesChange={(changedValues, allValues) => {onValuesChange(changedValues, allValues)}}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
                >
                    <Form.Item name="projectSetId"
                               label="项目集"
                               rules={[{ required: true }]}
                               style={{flex: '1 1 300px'}}
                    >
                        <Select
                            style={{ width: '100%', maxWidth: '250px' }}
                            placeholder="请选择项目集"
                        >
                            {
                                projectSetList && projectSetList.map(item => {
                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className="project-operate">
                <div className="project-operate-box">
                    <div className="project-operate-title">
                        <div className="operate-title">
                            <div>
                                项目进展
                            </div>
                        </div>
                    </div>

                    <Spin spinning={loading} tip="加载中..." >
                        <Fragment>

                            {
                                projectSet ? <>
                                        {
                                            projectOperateList?.length > 0 ?
                                                <div className="project-operate-table-box">
                                                    <div className="project-operate-table">
                                                        <div className="project-operate-col head">
                                                            <div className="project-operate-row">项目名字</div>
                                                            <div className="project-operate-row">当前进展</div>

                                                            <div className="project-operate-row">新增/完成事项</div>
                                                            <div className="project-operate-row">存量事项</div>
                                                            {/* <div className="project-operate-row">事项交付周期</div> */}

                                                            <div className="project-operate-row">新增/完成需求</div>
                                                            <div className="project-operate-row">存量需求</div>
                                                            {/* <div className="project-operate-row">需求交付周期</div> */}

                                                            <div className="project-operate-row">新增/完成任务</div>
                                                            <div className="project-operate-row">存量任务</div>
                                                            {/* <div className="project-operate-row">任务交付周期</div> */}

                                                            <div className="project-operate-row">新增/修复缺陷</div>
                                                            <div className="project-operate-row">存量缺陷</div>
                                                            {/* <div className="project-operate-row">缺陷修复周期</div> */}

                                                            <div className="project-operate-row">已超期事项</div>
                                                        </div>
                                                        {
                                                            projectOperateList.map((item) => {
                                                                return (
                                                                    <div className="project-operate-col" key={item.projectId}>
                                                                        <div className="project-operate-row">{item.projectName}</div>
                                                                        <div className="project-operate-row">
                                                                            <Progress
                                                                                type="circle"
                                                                                strokeColor={{
                                                                                    '0%': '#108ee9',
                                                                                    '100%': '#87d068',
                                                                                }}
                                                                                percent={80}
                                                                                showInfo={false}
                                                                                width={30}
                                                                                strokeWidth={20}
                                                                                strokeLinecap="butt"
                                                                            />
                                                                            <span>{item.precent}</span>
                                                                        </div>
                                                                        <div className="project-operate-row">{item.newWorkItemCount}/{item.endWorkItemCount}</div>
                                                                        <div className="project-operate-row">{item.noEndWorkItemCount}</div>
                                                                        {/* <div className="project-operate-row">{item.workItemEndAveragePeriod}</div> */}

                                                                        <div className="project-operate-row">{item.newDemand}/{item.endDemandCount}</div>
                                                                        <div className="project-operate-row">{item.noEndDemandCount}</div>
                                                                        {/* <div className="project-operate-row">{item.demandEndAveragePeriod}</div> */}

                                                                        <div className="project-operate-row">{item.newTask}/{item.endTaskCount}</div>
                                                                        <div className="project-operate-row">{item.noEndTaskCount}</div>
                                                                        {/* <div className="project-operate-row">{item.taskEndAveragePeriod}</div> */}

                                                                        <div className="project-operate-row">{item.newBug}/{item.endBugCount}</div>
                                                                        <div className="project-operate-row">{item.noEndBugCount}</div>
                                                                        {/* <div className="project-operate-row">{item.bugEndAveragePeriod}</div> */}

                                                                        <div className="project-operate-row">{item.overdueWorkItemCount}</div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    {
                                                        !loading && <ProjectEmpty description="请选择项目集~" />
                                                    }
                                                </>

                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            !loading && <div className="delete-warning">
                                                <ImgComponent src={'warning.png'} alt="" width="20px" height="20px" />
                                                项目集不能被查看或者被删除，请修改配置或者删除
                                            </div>
                                        }
                                    </>

                            }

                        </Fragment>
                    </Spin>

                </div>


            </div>
        </div>



    )
}

export default (observer(ProjectOperateTable));