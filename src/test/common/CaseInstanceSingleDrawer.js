import React from "react";
import LazyComponent from "../../common/Lazy";
import {CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons";
import {CASE_TYPE, TEST_TYPE} from "../../common/dictionary/dictionary";
import ExtensionCommon from "../../common/ExtensionCommon/ExtensionCommon";

let ApiUnitInstanceSinglePage = LazyComponent(() => import("../api/http/unit/components/apiUnitInstanceSinglePage"));
let ApiSceneInstanceSinglePage = LazyComponent(() => import("../api/http/scene/components/apiSceneInstanceSinglePage"));
let ApiPerfInstanceSinglePage = LazyComponent(() => import("../api/http/perf/components/ApiPerfInstanceSinglePage"));


const CaseInstanceSingleDrawer = (props) =>{
    const {caseData,WebSceneInstanceSinglePage,AppSceneInstanceSinglePage} = props

    //再根据不同的用例类型跳到不同的页面
    const switchInstance = (record)=>{
        if(record.type===TEST_TYPE.FUNCTION)return

        let recentInstance = record.recentInstance
        let caseType = record.caseType

        if( recentInstance?.result===2){
            return <span>--</span>
        }

        switch (caseType) {
            case CASE_TYPE.API_UNIT:
                return  <ApiUnitInstanceSinglePage
                            apiUnitInstanceId={recentInstance.instanceId}
                            name={showRecent(recentInstance)}
                        />
            case CASE_TYPE.API_SCENE:

                return <ApiSceneInstanceSinglePage
                        apiSceneInstanceId={recentInstance.instanceId}
                        name={showRecent(recentInstance)}
                    />
            case CASE_TYPE.API_PERFORM:
                return <ApiPerfInstanceSinglePage
                        apiPerfInstanceId={recentInstance.instanceId}
                        name={showRecent(recentInstance)}
                    />

            case CASE_TYPE.WEB_SCENE:
                return WebSceneInstanceSinglePage&&<WebSceneInstanceSinglePage
                    webSceneInstanceId={recentInstance.instanceId}
                    name={showRecent(recentInstance)}
                />
            // case CASE_TYPE.WEB_SCENE:
            //     return <ExtensionCommon
            //         name={showRecent(recentInstance)}
            //         isHideIcon={true}
            //         extension={
            //             WebSceneInstanceSinglePage&&<WebSceneInstanceSinglePage
            //                 webSceneInstanceId={recentInstance.instanceId}
            //                 name={showRecent(recentInstance)}
            //             />
            //         }
            //     />
            case CASE_TYPE.APP_SCENE:
                return AppSceneInstanceSinglePage&&<AppSceneInstanceSinglePage
                    appSceneInstanceId={recentInstance.instanceId}
                    name={showRecent(recentInstance)}
                />
            // case CASE_TYPE.APP_SCENE:
            //     return  <ExtensionCommon
            //         extension={
            //             AppSceneInstanceSinglePage&&<AppSceneInstanceSinglePage
            //                 appSceneInstanceId={recentInstance.instanceId}
            //                 name={showRecent(recentInstance)}
            //             />
            //         }
            //         name={showRecent(recentInstance)}
            //         isHideIcon={true}
            //     />
        }
    }

    /**
     * 展示实例名称
     */
    const showRecent=(recentInstance)=>{
        switch (recentInstance.result) {
            case 0:
            case "fail":
                return <><CloseCircleTwoTone twoToneColor={"red"}/> #{recentInstance.executeNumber}</>
            case "success":
            case 1:
                return <><CheckCircleTwoTone twoToneColor={"#52c41a"}/> #{recentInstance.executeNumber}</>
            default:
                return <><CheckCircleTwoTone /> #{recentInstance.executeNumber}</>
        }
    }

    return(
        <>
            {
                switchInstance(caseData)
            }
        </>
    )
}


export default CaseInstanceSingleDrawer;