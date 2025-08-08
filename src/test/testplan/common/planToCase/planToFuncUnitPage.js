import React, {useState} from "react";
import {inject, observer} from "mobx-react";
import FunctionDetail from "../../../function/components/FunctionDetail";
import {Drawer} from "antd";

const PlanToFuncUnitPage = (props) =>{
    const {record,testPlanId} = props;

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    return(
        <>
            <span className={"link-text"} onClick={showDrawer}>{record.name}</span>
            <Drawer
                title={record.name}
                placement="right"
                onClose={onClose}
                visible={open}
                width={860}
                className={"drawer-content-main drawer-content-header-no-bottom"}
                destroyOnClose={true}
            >
                <div className={"drawer-content-padding"}>
                    <FunctionDetail
                        testPlanId={testPlanId}
                        functionId={record?.id}
                        {...props}
                    />
                </div>
            </Drawer>
        </>
    )
}

export default inject("funcUnitStore")(observer(PlanToFuncUnitPage));