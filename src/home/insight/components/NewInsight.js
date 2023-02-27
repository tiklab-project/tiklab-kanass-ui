import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { message, Col, Row, Empty } from "antd"
import "./NewInsight.scss";
import ReportItem from "./ReportItem"
import ReportList from "./ReportList"
import { withRouter } from "react-router";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import "../../../../node_modules/react-resizable/css/styles.css"
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button"

const ResponsiveGridLayout = WidthProvider(Responsive);
const NewInsight = (props) => {
    const { insightStore } = props;
    const { reportList, updateInsight, findInsight, setReportList } = insightStore;
    const [insightDetail, setInsightDetail] = useState();
    const [showReportList, setShowReportList] = useState(false);
    const [reportIndex, setReportIndex] = useState(1)
    useEffect(() => {
        const params = new FormData();
        params.append("id", props.match.params.id)
        findInsight(params).then(res => {
            if (res.code === 0) {
                if (res.data.data) {

                    const report = JSON.parse(res.data.data)
                    setReportList(report)
                    const index = report.lg.length + 1
                    setReportIndex(index)
                } else {
                    setReportList({ lg: [] })
                }
                setInsightDetail(res.data)

            }
        })
    }, [])
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

    const onLayoutChange = (layout, layouts) => {
        console.log(layout, layouts, reportList)
        const list = reportList.lg.map((item, index) => {
            const data = item.data;
            item = layout[index];
            item.data = data;
            return item

        })
        setReportList({ lg: list })
        console.log(list, reportList)
    }

    return (
        <div>
            {/* <Row style={{ height: "calc(100vh - 48px)", overflow: "auto" }}>
                <Col flex="1 1 150px" xs={24} sm={24} md={24} lg={24} xxl={{ span: "18", offset: "3" }}> */}
                    <div className="new-insight">
                        <div className="new-insight-left">

                            <Breadcumb firstText="仪表盘列表" firstUrl="/index/home/insight/list" secondText={insightDetail && insightDetail.insightName}>
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
                                        onLayoutChange={onLayoutChange}
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
                {/* </Col> */}
                <ReportList
                    showReportList={showReportList}
                    reportIndex={reportIndex}
                    setReportIndex={setReportIndex}
                    setShowReportList={setShowReportList}
                />

        </div>



    )
}

export default withRouter(inject("insightStore")(observer(NewInsight)));