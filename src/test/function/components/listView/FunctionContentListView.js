import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import "../functionStyle.scss"
import FunctionDetail from "../FunctionDetail";
import EditableTitle from "../../../../common/caseCommon/EditableTitle";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";
import {useParams} from "react-router";

const FunctionContentListView = (props) =>{
    const {funcUnitStore,testcaseStore} = props;
    const {deleteTestCase} = testcaseStore
    const {testCaseInfo,funcUnitInfo,updateFuncUnit,findFuncUnit} = funcUnitStore

    const {caseId} = useParams()
    const functionId = caseId;

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
        <div className={"content-box-center"}>
           
            <EditableTitle
                value={testCaseInfo?.name}
                onSave={handleTitleSave}
                level={5}
                placeholder="请输入用例名称"
            />

            <FunctionDetail functionId={functionId} deleteFn={deleteFn}/>

        </div>
    )
}

export default inject('funcUnitStore',"testcaseStore")(observer(FunctionContentListView));