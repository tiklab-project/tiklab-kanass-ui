import React, { useState, useEffect } from "react";
import { Tabs, Card, Descriptions, Spin, Row, Col } from 'antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, FileTextOutlined, BugOutlined } from '@ant-design/icons';
import { observer } from "mobx-react";
import testReportStore from "../store/testReportStore";
import TestReportInstanceListCommon from "../common/TestReportInstanceListCommon";
import CaseBindDefectList from "../../../integrated/teamwire/defect/components/CaseBindDefectList";
import TestInstancePie from "./TestInstancePie";
import DefectPie from "./DefectPie";
import moment from "moment";
import "./TestReportDetail.scss";


/**
 * 测试报告详情
 */
const TestReportDetailCommon = (props) => {
    const { toInstanceDetailFn } = props
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
                <Descriptions column={{xs: 1, sm: 2}}>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{color: '#999'}}>
                                <CalendarOutlined style={{marginRight: 8}}/>
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
                            <div className="info-label" style={{color: '#999'}}>
                                <ClockCircleOutlined style={{marginRight: 8}}/>
                                报告天数
                            </div>
                        }
                    >
                        {formatDuration(testReportInfo?.startTime, testReportInfo?.endTime)}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{color: '#999'}}>
                                <UserOutlined style={{marginRight: 8}}/>
                                创建人
                            </div>
                        }
                    >
                        {testReportInfo?.createUser?.nickname || '未知'}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <div className="info-label" style={{color: '#999'}}>
                                <UserOutlined style={{marginRight: 8}}/>
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
                            <div className="info-label" style={{color: '#999'}}>
                                <FileTextOutlined style={{marginRight: 8}}/>
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
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col span={12}>
                    <TestInstancePie data={reportSummaryInfo?.instanceStatusSummary}/>
                </Col>
                <Col span={12}>
                    <DefectPie data={reportSummaryInfo?.defectSummary}/>
                </Col>
            </Row>


            {/*<Card*/}
            {/*    title={<div><FileTextOutlined/> 历史记录</div>}*/}
            {/*    style={{*/}
            {/*        // background: '#f7f8f9',*/}
            {/*        height: '100%',*/}
            {/*        borderRadius: 12,*/}
            {/*        margin: "16px 0"*/}
            {/*    }}*/}
            {/*    headStyle={{ textAlign: 'left' }}*/}
            {/*    bordered={false}*/}
            {/*>*/}
            <div className={"title-bold"} style={{marginTop: 36}}><FileTextOutlined/> 历史记录</div>
            <TestReportInstanceListCommon
                notShow={true}
                startTime={testReportInfo?.startTime}
                endTime={testReportInfo?.endTime}
                belongId={testReportInfo?.testPlan?.id}
                toInstanceDetailFn={toInstanceDetailFn}
            />
            {/*</Card>*/}


            {/*<Card*/}
            {/*    title={<div><BugOutlined/> 缺陷统计</div>}*/}
            {/*    style={{*/}
            {/*        // background: '#f7f8f9',*/}
            {/*        height: '100%',*/}
            {/*        borderRadius: 12,*/}
            {/*    }}*/}
            {/*    headStyle={{textAlign: 'left'}}*/}
            {/*>*/}
            <div className={"title-bold"} style={{marginTop: 36}}><BugOutlined/> 缺陷统计</div>
            <CaseBindDefectList
                // isPlanDefect={true}
                notShow={true}
                startTime={testReportInfo?.startTime}
                endTime={testReportInfo?.endTime}
                testPlanId={testReportInfo?.testPlan?.id}
                {...props}
            />
            {/*</Card>*/}


            {/* 标签页内容 */}
            {/*<Card className="report-content-card">*/}
            {/*    <Tabs*/}
            {/*        defaultActiveKey="1"*/}
            {/*        className="report-tabs"*/}
            {/*        size="large"*/}
            {/*    >*/}
            {/*        <Tabs.TabPane*/}
            {/*            tab={*/}
            {/*                <span>*/}
            {/*                    <FileTextOutlined/>*/}
            {/*                    历史记录*/}
            {/*                </span>*/}
            {/*            }*/}
            {/*            key="1"*/}
            {/*        >*/}
            {/*            <div className="tab-content">*/}
            {/*                {loading ? (*/}
            {/*                    <div style={{textAlign: 'center', padding: '20px'}}>*/}
            {/*                        <Spin tip="加载中..."/>*/}
            {/*                    </div>*/}
            {/*                ) : (*/}
            {/*                    <TestReportInstanceListCommon*/}
            {/*                        startTime={testReportInfo?.startTime}*/}
            {/*                        endTime={testReportInfo?.endTime}*/}
            {/*                        belongId={testReportInfo?.testPlan?.id}*/}
            {/*                        toInstanceDetailFn={toInstanceDetailFn}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            </div>*/}
            {/*        </Tabs.TabPane>*/}
            {/*        <Tabs.TabPane*/}
            {/*            tab={*/}
            {/*                <span>*/}
            {/*                    <BugOutlined/>*/}
            {/*                    缺陷统计*/}
            {/*                </span>*/}
            {/*            }*/}
            {/*            key="2"*/}
            {/*        >*/}
            {/*            <div className="tab-content">*/}
            {/*                {loading ? (*/}
            {/*                    <div style={{textAlign: 'center', padding: '20px'}}>*/}
            {/*                        <Spin tip="加载中..."/>*/}
            {/*                    </div>*/}
            {/*                ) : (*/}
            {/*                    <CaseBindDefectList*/}
            {/*                        isPlanDefect={true}*/}
            {/*                        startTime={testReportInfo?.startTime}*/}
            {/*                        endTime={testReportInfo?.endTime}*/}
            {/*                        testPlanId={testReportInfo?.testPlan?.id}*/}
            {/*                        {...props}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            </div>*/}
            {/*        </Tabs.TabPane>*/}
            {/*    </Tabs>*/}
            {/*</Card>*/}
        </>
    );
};

export default observer(TestReportDetailCommon);