import React, {useState} from "react";
import DemandSelect from "./DemandSelect";
import "./demandStyle.scss"
import {Modal} from "antd";
import {observer} from "mobx-react";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
import {deleteWorkTestCaseFn} from "../../../testcase/components/testCaseTableFn";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import {withRouter} from "react-router";

/**
 * 关联需求
 */
const Demand = (props)=>{
    const {demandInfo,caseInfo,updateFn,setDemandInfo, permissionCodeList} = props

    const [visible, setVisible] = useState(false);
    const projectId = props.match.params.id;

    const isPermissionCode = (code) => {
        if (permissionCodeList === undefined || permissionCodeList.length === 0){
            return false
        }
        return permissionCodeList.includes(code)
    }

    const showModal = () => {
        if (!isPermissionCode('test_case_update')){
            return;
        }
        console.log(demandInfo)
        setVisible(true);
    }

    const unBind = ()=>{
        let param = {
            ...caseInfo.testCase,
            id:caseInfo.id,
            demand:{id: "nullstring"}
        }

        updateFn(param)
        // 删除事项下的关联关系
        deleteWorkTestCaseFn(caseInfo.id, demandInfo.id)
    }

    const onCancel = () => { setVisible(false) };

    return(
        <>
            {
                demandInfo?.title && caseInfo && demandInfo
                    ?<div style={{display:"flex",alignItems:"center"}}>
                        <ImgComponent
                            src={"workType1.png"}
                            alt=""
                            className="icon-15"
                        />
                        <span style={{padding:"0 10px", maxWidth:"150px", overflow:"hidden", textOverflow: "ellipsis", whiteSpace:"nowrap"}}>{demandInfo?.title}</span>
                        <PrivilegeProjectButton code={'test_case_update'} domainId={projectId}  {...props}>
                            <div style={{cursor:"pointer",marginLeft:"auto", padding:"0 5px"}} onClick={unBind}>
                                <svg className="icon-18" aria-hidden="true" onClick={unBind}>
                                    <use xlinkHref={`#icon-unLink`}></use>
                                </svg>
                            </div>
                        </PrivilegeProjectButton>
                    </div>

                    :<span onClick={showModal} style={{padding:"0",cursor:"pointer"}}>未设置</span>
            }

            <Modal
                destroyOnClose={true}
                title={"关联需求"}
                className={"func-demand-add-modal"}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                centered
                width={600}
                maskClosable={false}
            >
                <DemandSelect
                    caseInfo={caseInfo}
                    updateFn={updateFn}
                    setDemandInfo={setDemandInfo}
                    onCancel={onCancel}
                />
            </Modal>
        </>
    )
}

export default observer(withRouter(Demand));