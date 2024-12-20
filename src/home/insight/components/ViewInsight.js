/*
 * @Descripttion: 仪表盘查看视图
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:37:31
 */

import React, { useEffect, useState } from "react";
import { Provider, observer } from "mobx-react";
import "./ViewInsight.scss";
import ReportItem from "./ReportItem"
import { withRouter } from "react-router";
import { Col, Empty, Row, Spin } from "antd";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css"
import { Responsive, WidthProvider } from "react-grid-layout";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import InsightStore from "../store/InsightStore"
const ResponsiveGridLayout = WidthProvider(Responsive);

const ViewInsight = (props) => {
    const store = {
        insightStore: InsightStore
    }
    const { findInsight } = InsightStore;
    // 仪表盘详情
    const [insightDetail, setInsightDetail] = useState()
    // 仪表盘报告列表
    const [reportList, setReportList] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        /**
        * 获取仪表盘的详情
        */
        const params = new FormData();
        params.append("id", props.match.params.id)
        setLoading(true)
        findInsight(params).then(res => {
            if (res.code === 0) {
                if (res.data.data) {
                    const list = JSON.parse(res.data.data);
                    console.log("view", list)
                    list.lg.map(item => {
                        item.static = true;
                    })
                    setReportList(list)

                }
                setInsightDetail(res.data)

            }
            setLoading(false)
        })
        return;
    }, [])

    /**
     * 跳转到编辑视图
     */
    const goEditInsight = () => {
        props.history.push(`/index/newInsight/${props.match.params.id}`)
    }

    return (
        <Provider {...store}>
            <div className="view-insight">
                <Breadcumb firstText="仪表盘" firstUrl="/index/insightlist" secondText={insightDetail && insightDetail.insightName}>
                    <Button onClick={() => goEditInsight()} type="primary">编辑</Button>
                </Breadcumb>
                <div className="view-insight-content">
                    <Spin spinning={loading} tip="加载中..." >
                        {
                            reportList && reportList.lg && reportList.lg.length > 0 ?
                                <ResponsiveGridLayout
                                    className="view-insight-layout"
                                    layouts={reportList}
                                    rowHeight={30}
                                    measureBeforeMount={true}
                                    breakpoints={{ lg: 1200 }}
                                >
                                    {
                                        reportList && reportList.lg && reportList.lg.length > 0 && reportList.lg.map((item, index) => {
                                            return (<div key={item.i} data-grid={item}>

                                                <ReportItem
                                                    isView={true}
                                                    reportType={item.data.type}
                                                    index={index}
                                                    key={index}
                                                    condition={item}
                                                    editInsight={item.data.isEdit}
                                                />

                                            </div>)
                                        })
                                    }

                                </ResponsiveGridLayout>
                                :
                                <Empty
                                    // image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    // imageStyle={{
                                    //     height: 60,
                                    // }}
                                    description={
                                        <span>
                                            暂无报表，请编辑
                                        </span>
                                    }
                                >
                                    <div className="empty-action-save" onClick={() => goEditInsight()}>
                                        <div>
                                            去编辑
                                        </div>
                                    </div>
                                </Empty>
                        }
                    </Spin>


                </div>
            </div>
        </Provider>

    )
}

export default withRouter(observer(ViewInsight));