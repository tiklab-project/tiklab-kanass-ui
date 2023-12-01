/*
 * @Descripttion: 首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { withRouter } from 'react-router';
import { renderRoutes } from "react-router-config";
import "./Insight.scss"
const Insight = (props) => {
    const { route } = props;
  
    return (
        
        <>
         {renderRoutes(route.routes)}
        </>
    );
}


export default withRouter(Insight);