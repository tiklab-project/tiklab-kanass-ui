/*
 * @Descripttion: 仪表盘查看视图
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { Provider, observer } from "mobx-react";
import "./ViewInsight.scss";
import ReportItem from "./ReportItem"
import { withRouter } from "react-router";
import { Col, Empty, Row } from "antd";
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
    useEffect(() => {
        /**
        * 获取仪表盘的详情
        */
        const params = new FormData();
        params.append("id", props.match.params.id)
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
        })
        return;
    }, [])

    /**
     * 跳转到编辑视图
     */
    const goEditInsight = () => {
        props.history.push(`/home/insight/newInsight/${props.match.params.id}`)
    }

    return (
        <Provider {...store}>
            {/* <Row className="view-insight-row">
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}> */}
                    <div className="view-insight">
                        <Breadcumb firstText="仪表盘" firstUrl="/home/insight/list" secondText={insightDetail && insightDetail.insightName}>
                            <Button onClick={() => goEditInsight()} type="primary">编辑</Button>
                        </Breadcumb>
                        <div className="view-insight-content">
                            {
                                reportList && reportList.lg && reportList.lg.length > 0 ?
                                    <ResponsiveGridLayout
                                        className="layout"
                                        layouts={reportList}
                                        rowHeight={30}
                                        measureBeforeMount={true}
                                        breakpoints={{ lg: 1200 }}
                                    >
                                        {
                                            console.log(reportList)
                                        }
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
                                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                        imageStyle={{
                                            height: 60,
                                        }}
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

                        </div>
                    </div>
                {/* </Col>
            </Row> */}

        </Provider>

    )
}

export default withRouter(observer(ViewInsight));