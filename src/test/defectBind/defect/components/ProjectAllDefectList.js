import React from "react";
import { observer} from "mobx-react";
import PageCenter from "../../../../common/pageContent/PageCenter";
import ProjectAllDefectCommonList from "./ProjectAllDefectCommonList";

/**
 * 绑定的缺陷列表
 */
const ProjectAllDefectList = (props) =>{



    return(
        <PageCenter>
            <div className={"content-box-center"}>
                <div  className={"header-box-space-between"} style={{margin:"10px 8px"}} >
                    <div className={'header-box-title'}>缺陷</div>
                </div>
                <ProjectAllDefectCommonList/>
            </div>
        </PageCenter>
    )
}

export default observer(ProjectAllDefectList);