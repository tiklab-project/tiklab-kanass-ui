/*
 * @Descripttion: 仪表盘查看视图
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "./ViewInsight.scss";
import ReportItem from "./ReportItem"
import { withRouter } from "react-router";
import { Empty } from "antd";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css"
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ViewInsight = (props) => {
    const { insightStore } = props;
    const { findInsight } = insightStore;
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
                    list.lg.map(item => {
                        item.static = true;
                    })
                    setReportList(list)
                    setInsightDetail(res.data)
                }

            }
        })
    }, [])

    /**
     * 跳转到编辑视图
     */
    const goEditInsight = () => {
        props.history.push(`/index/home/insight/newInsight/${props.match.params.id}`)
    }

    return (
        <div className="view-insight">
            <Breadcumb firstText="仪表盘列表" firstUrl="/index/home/insight/list" secondText={insightDetail && insightDetail.insightName}>
                <Button onClick={() => goEditInsight()} type="primary"> 编辑</Button>
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
                                reportList && reportList.lg && reportList.lg.length > 0 && reportList.lg.map((item, index) => {
                                    return (<div key={item.i} data-grid={item}>

                                        <ReportItem isView={true} reportType={item.data.type} index={index} key={index} condition={item} editInsight={item.data.isEdit} />

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
    )
}

export default withRouter(inject("insightStore")(observer(ViewInsight)));