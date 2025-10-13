import React, {Fragment, useEffect, useRef, useState} from "react";
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
import Button from "../../../../common/button/Button";
import { DocumentEditor, PreviewEditor, EditorBig } from "tiklab-slate-ui";
import { SwitchPreliminaryType } from "tiklab-form-ui";
import "tiklab-slate-ui/es/tiklab-slate.css";
import { getUser } from 'tiklab-core-ui';
import {useDebounce} from "../../../../common/utils/debounce";

const FunctionInstanceCommon = (props) => {
    let {findTestReport, testReportInfo, getTestReportSummary, updateTestReport } = testReportStore;
    let testReportId = sessionStorage.getItem("testReportId");
    const [loading, setLoading] = useState(false);
    const [reportSummaryInfo,getReportSummaryInfo] = useState({})
    // 转换描述编辑模式setEditorType
    const [editorType, setEditorType] = useState(false);
    // 描述内容
    const [slateValue, setSlateValue] = useState()
    const [moreDesc, setMoreDesc] = useState(false);
    const [descPreviewHeight, setDescPreviewHeight] = useState(0);
    const descPreviewRef = (node) => {
        if (node) {
            setDescPreviewHeight(node.getBoundingClientRect().height);
        }
    };

    // 转换描述编辑模式
    const editorDesc = () => {
        // setLoading(true)
        setEditorType(false);
        setSlateValue(testReportInfo?.desc)

    }

    // 取消编辑描述
    const cancel = () => {
        console.log("取消编辑")
        setEditorType(false);
        setSlateValue(testReportInfo?.desc)

        if (descPreviewRef.current){
            setDescPreviewHeight(descPreviewRef.current.getBoundingClientRect().height)
        }

    }

    /**
     * 点击描述，转为可编辑模式
     */
    const switchEditorDesc = () => {
        setEditorType(true)
    }

    /**
     * 更新描述
     */
    const updataDesc = useDebounce((value) => {
        // setSlateValue();
        // setSlateValue(value)
        const param = {
            id: testReportId,
            desc: value
        }
        updateTestReport(param).then(res => {
            if (res.code === 0) {
                setSlateValue(value);
                testReportInfo.desc = value
            }
        });
    }, [500])

    /**
     * 展开更多描述
     */
    const showMoreDesc = () => {
        setMoreDesc(!moreDesc);
    }

    const ticket = getUser().ticket;
    const tenant = getUser().tenant;

    useEffect(async() => {
        setLoading(true);

        const res = await findTestReport(testReportId);

        setSlateValue(res?.desc)

        setLoading(false);
    }, [testReportId,testReportInfo?.testPlan?.id]);

    useEffect(() => {
        if (descPreviewRef.current) {
            console.log('descPreviewHeight:', descPreviewRef.current.getBoundingClientRect().height);
        }
    }, [testReportId, slateValue, moreDesc]);

    useEffect(async() => {
        // setLoading(true);
        let data = await getTestReportSummary(testReportId);

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

    const operateIcon = (
        <>
            <svg className="icon-22" aria-hidden="true" onClick={() => switchEditorDesc()}>
                <use xlinkHref={`#icon-edit`}></use>
            </svg>
        </>
    )
    return (
        <>
            {/* 报告详情卡片 */}
            <Card className="report-info-card" loading={loading} title={"报告总结"} extra={operateIcon}>
                <div className={`desc-box ${(moreDesc || editorType) ? "more-desc":""}`}>

                    <Fragment>
                        {
                            editorType ? <Fragment>
                                    <div style={{ border: " #f0f0f0 solid 1px", minHeight: "250px" }}>
                                        <DocumentEditor
                                            value={slateValue}
                                            ticket={ticket}
                                            tenant={tenant}
                                            base_url={base_url}
                                            viewImageUrl = "/image"
                                            img_url = {base_url==='/' ? '':base_url}
                                            minHeight={300}
                                            onChange={(value) => updataDesc(value)}
                                            {...props}
                                        />
                                    </div>

                                    <div className="desc-botton">
                                        <Button onClick={() => cancel()}>取消</Button>
                                        <Button type="primary" onClick={() => editorDesc()}>确定</Button>
                                    </div>
                                </Fragment>
                                :
                                <div className="desc-preview" ref={descPreviewRef}>
                                    {
                                        slateValue && <PreviewEditor
                                            value={slateValue}
                                            base_url={base_url}
                                            viewImageUrl = "/image"
                                            img_url = {base_url==='/' ? '':base_url}
                                            ticket={ticket}
                                            tenant={tenant}
                                            {...props}
                                        />
                                    }

                                </div>
                        }
                    </Fragment>
                </div>

                <div className="more-desc-box">
                    {
                        !editorType && descPreviewHeight > 342 &&
                        <div className="form-custom-open" onClick={() => showMoreDesc()}>
                            <svg className={`img-icon ${moreDesc ? "open" : "close"}`} aria-hidden="true">
                                <use xlinkHref="#icon-left"></use>
                            </svg>
                        </div>
                    }
                    {/*<div className="form-custom-open" onClick={() => showMoreDesc()}>*/}
                    {/*    <svg className={`img-icon ${moreDesc ? "open" : "close"}`} aria-hidden="true">*/}
                    {/*        <use xlinkHref="#icon-left"></use>*/}
                    {/*    </svg>*/}
                    {/*</div>*/}
                </div>
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