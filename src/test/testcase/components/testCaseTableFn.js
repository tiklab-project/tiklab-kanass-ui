import React from "react";
import {CASE_TYPE, caseTypeToRouter} from "../../../common/dictionary/dictionary";
import {getUser} from "tiklab-core-ui";
import {getVersionInfo} from "tiklab-core-ui";
import {useHistory} from "react-router";

import {UserOutlined} from "@ant-design/icons";
import HideDelete from "../../../common/caseCommon/hideDelete/HideDelete";
import {Avatar, Space} from "antd";
import testcaseStore from "../store/testcaseStore";
import WorkTestStore from "../../../work/store/WorkTestStore";


const {findTestCaseList, findTestCaseStatusNum} = testcaseStore;

//再根据不同的用例类型跳到不同的页面
export const switchCaseTypeFn = (record,history)=>{
    const projectId = localStorage.getItem("projectId")

    //跳转路由
    const toCaseDetail = (setId,record,history)=>{
        sessionStorage.setItem(`${setId}`,record.id);
        history.push(`/project/${projectId}/testcaseList/${caseTypeToRouter[record.caseType]}/${record.id}`)
    }

    switch (record.caseType) {
        case CASE_TYPE.FUNCTION:
            toCaseDetail("functionId",record,history)
            break;
    }
}


export const findTestCaseTableListFn = (params) =>{
    return findTestCaseList(params);
}

export const findTestCaseStatusCountFn = (params) =>{
    return findTestCaseStatusNum(params);
}



export const SwitchCaseTypeView = ({record,testCaseRecent,projectId}) =>{
    let history = useHistory();

    const switchCaseTypeView = (record) =>{
        switch (record.caseType) {
            case CASE_TYPE.FUNCTION:
            case CASE_TYPE.API_UNIT:
            case CASE_TYPE.API_SCENE:
            case CASE_TYPE.API_PERFORM:
                return <span className={"link-text"}  onClick={()=>switchCaseType(record)}>{record.name}</span>
            default:
                return null
        }
    }

    //再根据不同的用例类型跳到不同的页面
    const switchCaseType = (record)=>{
        switch (record.caseType) {
            case CASE_TYPE.FUNCTION:
                toCaseDetail("functionId",record)
                break;

        }
    }

    //跳转路由
    const toCaseDetail = (setId,record)=>{
        sessionStorage.setItem(`${setId}`,record.id);
        history.push(`/project/${projectId}/testcase/${caseTypeToRouter[record.caseType]}/${record.id}`)

        //最近访问
        let params = {
            repository:{id:projectId},
            user:{id:getUser().userId},
            testCase:{id:record.id},
        }
        testCaseRecent(params)
    }

    return(
        <>
            {switchCaseTypeView(record)}
        </>
    )
}





export  const ShowDeleteView = ({record,deleteFn}) =>{
    switch (record.caseType||record.type) {
        case CASE_TYPE.FUNCTION:
        case CASE_TYPE.API_UNIT:
        case CASE_TYPE.API_SCENE:
        case CASE_TYPE.API_PERFORM:
        case CASE_TYPE.TEST_PLAN:
        case CASE_TYPE.WEB_SCENE:
        case CASE_TYPE.APP_SCENE:
            return  <HideDelete deleteFn={() =>deleteFn(record)}/>
        default:
            return null
    }
}

export const rowStyle = (caseType,style)=>{
    if(getVersionInfo().expired===true){
        if(caseType===CASE_TYPE.WEB_SCENE||caseType===CASE_TYPE.APP_SCENE){
            return {...style}
        }else {
            return {}
        }
    }
}

export const showCreateUser = (director) =>{
    if(director&&director.nickname){
        return <div className={"ws-user-item"}>
            <Space>
                <Avatar style={{width:"24px",height:"24px",lineHeight:"24px",verticalAlign: 'middle',}}>{director?.nickname[0]}</Avatar>
                <span className={"text-ellipsis"}>{director?.nickname} </span>
            </Space>
        </div>
    }else {
        return <div className={"ws-user-item"}>
            <div className={"display-flex-gap"}>
                <Avatar  style={{flex:"none"}} size="small" icon={<UserOutlined />} />
                <span> 未设置 </span>
            </div>
        </div>
    }
}

const {createWorkTestCase, deleteWorkTestCaseRele} = WorkTestStore;

export const createWorkTestCaseFn = async (testCaseId, workItemId, projectId) => {
    const param = [{
        testCaseId: testCaseId,
        workItemId: workItemId,
        projectId: projectId
    }]
    await createWorkTestCase(param)
}

export const deleteWorkTestCaseFn = (testCaseId, workItemId) => {
    const param = {
        testCaseId: testCaseId,
        workItemId: workItemId,
        // projectId: projectId
    }
    deleteWorkTestCaseRele(param)
}
