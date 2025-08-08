import React from "react";
import { Breadcrumb } from 'antd';
import { observer } from "mobx-react";
import testReportStore from "../store/testReportStore";
import {useHistory} from "react-router";
import FunctionInstanceCommon from "../common/FunctionReportDetailCommon";
import {LeftOutlined} from "@ant-design/icons";


/**
 * 测试报告详情
 */
const PlanReportDetail = (props) => {
    let { testReportInfo } = testReportStore;

    const projectId = localStorage.getItem('projectId');

    return (
        <>
            <div className=" test-report-box">
                {/* 面包屑导航 */}
                <div className="breadcrumb-section">
                    <Breadcrumb>
                        <Breadcrumb.Item
                            className="breadcrumb-link"
                            onClick={() => props.history.push(`/project/${projectId}/planDetail/report`)}
                        >
                            <LeftOutlined/>
                             测试报告
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{testReportInfo?.name || '详情'}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {/* 报告详情 */}
                <FunctionInstanceCommon
                    {...props}
                />

            </div>
        </>
    );
};

export default observer(PlanReportDetail);