import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import "../functionStyle.scss"
import FunctionDetail from "../FunctionDetail";
import EditableTitle from "../../../../common/caseCommon/EditableTitle";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";
import {useParams} from "react-router";
import {LeftOutlined} from "@ant-design/icons";
import PageCenter from "../../../../common/caseCommon/PageCenter";

const FunctionContentListView = (props) =>{
    const {funcUnitStore,testcaseStore} = props;
    const {deleteTestCase} = testcaseStore
    const {testCaseInfo,funcUnitInfo,updateFuncUnit,findFuncUnit} = funcUnitStore

    const {caseId} = useParams()
    const functionId = caseId;
    const projectId = localStorage.getItem("projectId")

    // 处理标题保存
    const handleTitleSave = async (newTitle) => {
        const params = {
            id:funcUnitInfo.id,
            testCase: {
                ...funcUnitInfo.testCase,
                name:newTitle,
            }
        }
        updateFuncUnit(params).then(()=>{
            findFuncUnit(functionId)
        })
    };

    const deleteFn = async () => {
        await deleteTestCase(funcUnitInfo.id,CASE_TYPE.FUNCTION)
        window.dispatchEvent(new CustomEvent('testcase-close-tab', { detail: { tabKey: functionId } }));
    }

    return(
        <PageCenter>
            <div className={"display-flex-gap"} style={{marginTop:"10px"}}>
                <LeftOutlined
                    onClick={()=>props.history.push(`/project/${projectId}/testcase/caseDetail/info`)}
                    style={{marginBottom:"8px"}}
                />
                <EditableTitle
                    value={testCaseInfo?.name}
                    onSave={handleTitleSave}
                    level={5}
                    placeholder="请输入用例名称"
                />
            </div>
           


            <FunctionDetail functionId={functionId} deleteFn={deleteFn}/>

        </PageCenter>
    )
}

export default inject('funcUnitStore',"testcaseStore")(observer(FunctionContentListView));