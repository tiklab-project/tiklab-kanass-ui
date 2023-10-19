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
import { Progress, Pagination, Empty, Select, Form, Button } from 'antd';
import "./ProjectOperateTable.scss";
const { Option } = Select;

const ProjectOperateTable = (props) => {
    const { insightStore, index, condition, editInsight,isView } = props;
    const { statisticsProjectOperateList, findAllProjectSet, setProjectSetId, reportList } = insightStore;
    // 项目进展列表
    const [projectOperateList, setProjectOPerteList] = useState([])
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState([])
    // 是否编辑状态
    const [isEditor, setIsEditor] = useState(editInsight ? true : false)
    // 统计表单
    const [form] = Form.useForm();

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

    /**
     * 处于编辑状态时，初始化筛选表单
     */
    useEffect(() => {
        if (isEditor) {
            
            statisticsProjectOperateList({projectSetId: condition.data.data.projectSetId}).then(res => {
                if (res.code === 0) {
                    setProjectOPerteList(res.data)
                }
            })
        }else {
            form.setFieldsValue({projectSetId: condition.data.data.projectSetId})
        }
        return;
    }, [isEditor])

    /**
     * 编辑保存统计条件
     * @param {表单数据} value 
     */
    const editReport = (value) => {
        // statisticsProjectOperateList(value).then(res => {
        //     if (res.code === 0) {
        //         setProjectOPerteList(res.data)
        //     }
        // })
        reportList.lg[index].data.data = value;
        reportList.lg[index].data.isEdit = true;
        setIsEditor(!isEditor)
        console.log(index, reportList)
    }

    /**
     * 删除报表
     */
    const deleteReport = () => {
        reportList.lg.splice(index, 1)
    }

    return (
        <div className="project-operate" key = {condition.i} data-grid={condition}>
            <div >
                <div className="project-operate-title">
                    <div className="operate-title">
                        <div>
                            项目进展
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
                    isEditor ?
                        <Fragment>
                            {
                                projectOperateList.length > 0 ?
                                    <Fragment>
                                        <div className="project-operate-table">
                                            <div className="project-operate-col head">
                                                <div className="project-operate-row">项目名字</div>
                                                <div className="project-operate-row">当前进展</div>

                                                <div className="project-operate-row">新增/完成事项</div>
                                                <div className="project-operate-row">存量事项</div>
                                                <div className="project-operate-row">事项交付周期</div>

                                                <div className="project-operate-row">新增/完成需求</div>
                                                <div className="project-operate-row">存量需求</div>
                                                <div className="project-operate-row">需求交付周期</div>

                                                <div className="project-operate-row">新增/完成任务</div>
                                                <div className="project-operate-row">存量任务</div>
                                                <div className="project-operate-row">任务交付周期</div>

                                                <div className="project-operate-row">新增/修复缺陷</div>
                                                <div className="project-operate-row">存量缺陷</div>
                                                <div className="project-operate-row">缺陷修复周期</div>

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
                                                            <div className="project-operate-row">{item.workItemEndAveragePeriod}</div>

                                                            <div className="project-operate-row">{item.newDemand}/{item.endDemandCount}</div>
                                                            <div className="project-operate-row">{item.noEndDemandCount}</div>
                                                            <div className="project-operate-row">{item.demandEndAveragePeriod}</div>

                                                            <div className="project-operate-row">{item.newTask}/{item.endTaskCount}</div>
                                                            <div className="project-operate-row">{item.noEndTaskCount}</div>
                                                            <div className="project-operate-row">{item.taskEndAveragePeriod}</div>

                                                            <div className="project-operate-row">{item.newBug}/{item.endBugCount}</div>
                                                            <div className="project-operate-row">{item.noEndBugCount}</div>
                                                            <div className="project-operate-row">{item.bugEndAveragePeriod}</div>

                                                            <div className="project-operate-row">{item.overdueWorkItemCount}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className="project-operate-page">
                                            <Pagination defaultCurrent={1} total={1} />
                                        </div>
                                    </Fragment>
                                    :
                                    <Empty />
                            }
                        </Fragment>
                        :
                        <Form
                            name="form"
                            form={form}
                            initialValues={{ remember: true }}
                            wrapperCol={{ span: 6 }}
                            labelCol={{ span: 3 }}
                            onFinish={editReport}
                            layout = "vertical"
                        >
                            <Form.Item name="projectSetId" label="项目集">
                                <Select
                                    placeholder="请选择项目集"
                                >
                                    {
                                        projectSetList && projectSetList.map(item => {
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 3, span: 6 }}>
                                <Button type="primary" htmlType="submit">
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                }
            </div>


        </div>


    )
}

export default inject("insightStore")(observer(ProjectOperateTable));