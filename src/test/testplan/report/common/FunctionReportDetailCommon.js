import React, {useEffect, useState} from "react";
import {Card, Col, Descriptions, Row, Spin, Tabs} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    FileTextOutlined, UserOutlined
} from "@ant-design/icons";
import testReportStore from "../store/testReportStore";
import moment from "moment/moment";
import DefectPie from "./DefectPie";
// import CaseBindDefectList from "../../../integrated/teamwire/defect/components/CaseBindDefectList";
import "./TestReportDetail.scss";
import FunctionReportTestStatisticPie from "./FunctionReportTestStatisticPie";
import DefectPriorityBar from "./DefectPriorityBar"
import CaseBindDefectList from "../../../defectBind/defect/components/CaseBindDefectList";


const FunctionInstanceCommon = (props) => {
    let {findTestReport, testReportInfo, getTestReportSummary } = testReportStore;
    let testReportId = sessionStorage.getItem("testReportId");
    const [loading, setLoading] = useState(false);
    const [reportSummaryInfo,getReportSummaryInfo] = useState({})

    useEffect(async() => {
        setLoading(true);

        await findTestReport(testReportId);

        setLoading(false);
    }, [testReportId,testReportInfo?.testPlan?.id]);

    useEffect(async() => {
        // setLoading(true);
        let data = await getTestReportSummary(testReportId);

        //返回的数据
        // {
        //     "instanceStatusSummary": {
        //         "total": 4,
        //         "failCount": 0,
        //         "successCount": 4
        //     },
        //     "defectSummary": {
        //         "total": 3,
        //         "progressStatusCount": 1,
        //         "doneStatusCount": 1,
        //         "todoStatusCount": 1,
        //         "lowCount": 0,
        //         "mediumCount": 3,
        //         "highCount": 0
        //     }
        // }


        if(data!==null){
            getReportSummaryInfo(data)
        }
        // setLoading(false);
    }, [testReportId]);


    let formatDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return '-';
        const duration = moment(endTime).diff(moment(startTime), 'days');
        return duration === 0 ? '当天完成' : `${duration} 天`;
    };


    if(!testReportInfo) {
        return null
    };

    return (
        <>
            {/* 报告详情卡片 */}
            <Card className="report-info-card" loading={loading}>
                <Descriptions column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{ color: '#999' }}>
                                <CalendarOutlined style={{ marginRight: 8 }} />
                                时间范围
                            </div>
                        }
                    >
                        {testReportInfo?.startTime && testReportInfo?.endTime ?
                            `${moment(testReportInfo?.startTime).format('YYYY-MM-DD')} 至 ${moment(testReportInfo?.endTime).format('YYYY-MM-DD')}` :
                            testReportInfo?.startTime ?
                                `${moment(testReportInfo?.startTime).format('YYYY-MM-DD')} 至 进行中` :
                                '未设置'
                        }
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{ color: '#999' }}>
                                <ClockCircleOutlined style={{ marginRight: 8 }} />
                                报告天数
                            </div>
                        }
                    >
                        {formatDuration(testReportInfo?.startTime, testReportInfo?.endTime)}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{ color: '#999' }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                创建人
                            </div>
                        }
                    >
                        {testReportInfo?.createUser?.nickname || '未知'}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{ color: '#999' }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                创建时间
                            </div>
                        }
                    >
                        {testReportInfo?.createTime ?
                            moment(testReportInfo?.createTime).format('YYYY-MM-DD HH:mm:ss') :
                            '未知'
                        }
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{ color: '#999' }}>
                                <FileTextOutlined style={{ marginRight: 8 }} />
                                描述
                            </div>
                        }
                        span={2}
                    >
                        {testReportInfo?.desc || '暂无描述'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 统计图表 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <FunctionReportTestStatisticPie testPlanId={testReportInfo?.testPlan?.id} />
                </Col>
                <Col span={12}>
                    <DefectPie data={reportSummaryInfo?.defectSummary} />
                </Col>
                {/*<Col span={12}>*/}
                {/*    <DefectPriorityBar data={reportSummaryInfo?.defectSummary} />*/}
                {/*</Col>*/}
            </Row>

            <div style={{ margin: "30px 0px 10px",fontSize:'16px',fontWeight:'600' }}>缺陷</div>
            {/* 标签页内容 */}
            <Card className="report-content-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin tip="加载中..." />
                    </div>
                ) : (
                    <CaseBindDefectList
                        isPlanDefect={true}
                        startTime={testReportInfo?.startTime}
                        endTime={testReportInfo?.endTime}
                        testPlanId={testReportInfo?.testPlan?.id}
                        {...props}
                    />
                )}
            </Card>
        </>
    );
}

export default FunctionInstanceCommon