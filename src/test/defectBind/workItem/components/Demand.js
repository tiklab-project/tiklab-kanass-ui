import React, {useState} from "react";
import DemandSelect from "./DemandSelect";
import "./demandStyle.scss"
import {Modal} from "antd";
import {observer} from "mobx-react";

/**
 * 关联需求
 */
const Demand = (props)=>{
    const {demandInfo,caseInfo,updateFn,setDemandInfo} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    }

    const unBind = ()=>{
        let param = {
            id:caseInfo.id,
            testCase:{
                ...caseInfo.testCase,
                workItemId : "nullstring",
            }
        }

        updateFn(param)
    }

    const onCancel = () => { setVisible(false) };

    return(
        <>
            {
                demandInfo?.name&&caseInfo.testCase.workItemId
                    ?<>
                        <span style={{padding:"0 10px"}}>{demandInfo?.name}</span>
                        <span onClick={unBind} style={{fontSize:"12px"}}>解绑</span>
                    </>

                    :<span onClick={showModal} style={{padding:"0 10px",cursor:"pointer"}}>未设置</span>
            }

            <Modal
                destroyOnClose={true}
                title={"关联的需求"}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                centered
                width={600}
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

export default observer(Demand);