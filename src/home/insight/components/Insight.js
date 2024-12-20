/*
 * @Descripttion: 仪表盘页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:06:12
 */
import React from 'react';
import { withRouter } from 'react-router';
import "./Insight.scss";
import InsightStore from '../store/InsightStore';
import InsightList from './InsightList';
import ViewInsight from './ViewInsight';
import NewInsight from './NewInsight';

const Insight = (props) => {
    const { insightView } = InsightStore;
    return (
        <>
            {
                insightView === "list" && <InsightList />
            }
            {
                insightView === "view" && <ViewInsight />
            }
            {
                insightView === "new" && <NewInsight />
            }
        </>
    );
}


export default withRouter(Insight);