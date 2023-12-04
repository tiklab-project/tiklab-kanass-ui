/*
 * @Descripttion: 仪表盘编辑视图
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { Provider, observer } from "mobx-react";
import { message, Empty, Row, Col } from "antd"
import "./NewInsight.scss";
import ReportItem from "./ReportItem"
import ReportList from "./ReportList"
import { withRouter } from "react-router";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css"
import { Responsive, WidthProvider } from "react-grid-layout";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button"
import InsightStore from "../store/InsightStore"
const ResponsiveGridLayout = WidthProvider(Responsive);
const NewInsight = (props) => {
    const store = {
        insightStore: InsightStore
    }
    const { reportList, updateInsight, findInsight, setReportList } = InsightStore;
    // 仪表盘详情
    const [insightDetail, setInsightDetail] = useState();
    // 是否显示可添加的报告列表弹窗
    const [showReportList, setShowReportList] = useState(false);
    // 当前仪表盘在列表中的索引，用于设置添加仪表盘时的位置
    const [reportIndex, setReportIndex] = useState(1)


    useEffect(() => {
        getInsightById()
        return;
    }, [])

    /**
     * 获取仪表盘的详情
     */
    const getInsightById = () => {
        const params = new FormData();
        params.append("id", props.match.params.id)
        findInsight(params).then(res => {
            if (res.code === 0) {
                if (res.data.data) {
                    const report = JSON.parse(res.data.data)
                    console.log(report)
                    setReportList(report)
                    const index = report.lg.length + 1
                    setReportIndex(index)
                } else {
                    setReportList({ lg: [] })
                }
                setInsightDetail(res.data)

            }
        })
    }

    /**
     * 保存编辑之后的仪表盘
     */
    const saveInsight = () => {
        const insightId = props.match.params.id
        const params = {
            id: insightId,
            data: JSON.stringify(reportList)
        }
        const array = reportList.lg.filter(item => {
            return item.data.isEdit === false
        })
        if (array && array.length > 0) {
            message.error('表单未设置参数，请设置');

        } else {
            updateInsight(params).then(res => {
                if (res.code === 0) {
                    props.history.push(`/index/home/insight/viewInsight/${insightId}`)
                }
            })
        }

    }

    /**
     * 添加仪表盘模块到仪表盘
     * @param {模块数据} layout 
     * @param {模块数据列表} layouts 
     */
    const addLayout = (layout, layouts) => {
        const list = reportList.lg.map((item, index) => {
            const data = item.data;
            // 把新的仪表盘的位置信息添加到仪表盘报告列表中
            item = layout[index];
            item.data = data;
            return item

        })
        setReportList({ lg: list })
    }

    return (
        <Provider {...store}>
            <>
                {/* <Row className="new-insight-row">
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}> */}
                        <div className="new-insight">
                            <div className="new-insight-left">

                                <Breadcumb firstText="仪表盘" firstUrl="/index/home/insight/list" secondText={insightDetail && insightDetail.insightName}>
                                    <div className="insight-head-action">
                                        <Button onClick={() => setShowReportList(true)} type="primary">添加</Button>
                                        <Button onClick={() => saveInsight()} type="primary">保存</Button>
                                        <Button onClick={() => props.history.goBack()}>取消</Button>
                                    </div>

                                </Breadcumb>

                                <div className="new-insight-content">
                                    {
                                        reportList && reportList.lg.length > 0 ? <ResponsiveGridLayout
                                            className="layout"
                                            layouts={reportList}
                                            rowHeight={30}
                                            measureBeforeMount={true}
                                            breakpoints={{ lg: 1200 }}
                                            onLayoutChange={addLayout}
                                        >
                                            {
                                                reportList.lg && reportList.lg.length > 0 && reportList.lg.map((item, index) => {
                                                    return (<div key={item.i} data-grid={item}>

                                                        <ReportItem isView={false} reportType={item.data.type} index={index} key={index} condition={item} editInsight={item.data.isEdit} />

                                                    </div>)
                                                })
                                            }

                                        </ResponsiveGridLayout>
                                            :
                                            <Empty
                                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                imageStyle={{
                                                    height: 60,
                                                }}
                                                description={
                                                    <span>
                                                        暂无报表，请添加
                                                    </span>
                                                }
                                            >
                                                <div className="empty-action-save" onClick={() => setShowReportList(true)}>
                                                    <div>
                                                        添加
                                                    </div>
                                                </div>
                                            </Empty>
                                    }
                                </div>
                            </div>
                        </div>
                        <ReportList
                            showReportList={showReportList}
                            reportIndex={reportIndex}
                            setReportIndex={setReportIndex}
                            setShowReportList={setShowReportList}
                        />
                    {/* </Col>
                </Row> */}


            </>
        </Provider>




    )
}

export default withRouter(observer(NewInsight));