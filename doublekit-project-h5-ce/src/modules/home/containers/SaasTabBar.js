/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-22 15:27:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-26 09:22:41
 */
import React, { useState } from 'react';
import { verifyUserSaasHOC } from "doublekit-portal-h5";
import ProjectTabBar from './projectTabBar';
import { inject,observer } from 'mobx-react';
const SaasTabBar = (props) => {
        
    const {location,portalLoginStore}  = props;
    return(
        <SassPortal
            location = {location} 
            portalLoginStore = {portalLoginStore}
            wechatApplicationType= {"project"}
            accUrl = {authData.authAccConfig ? authData.authAccConfig.accUrl : "http://192.168.10.7:4001"}
            {...props}
        >
    
            <ProjectTabBar {...props}/>
        </SassPortal>
    )
}

const IndexSaasHoc = verifyUserSaasHOC(SaasTabBar, "project")
export default inject("portalLoginStore")(observer(IndexSaasHoc));

