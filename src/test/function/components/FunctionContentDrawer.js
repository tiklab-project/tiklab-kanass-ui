import React, { useState} from "react";
import FunctionDetail from "./FunctionDetail";
import {observer} from "mobx-react";
import "./functionStyle.scss"
import {Drawer,Space} from "antd";
import {showCaseTypeView} from "../../../common/caseCommon/CaseCommonFn";

const FunctionContentDrawer = ({record,deleteFn}) =>{

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return(
        <>
            <Space>

                <span className={"link-text"} onClick={showDrawer}>{record.name}</span>
            </Space>

            <Drawer
                title={
                    <Space>
                        <div style={{
                            // marginTop: "5px",
                            borderRadius: "5px",
                            width: "20px",
                            height: "20px",
                            overflow: "hidden"
                        }}>
                            {showCaseTypeView(record.caseType, "icon-m")}
                        </div>
                        {record.name}
                    </Space>
                }
                placement="right"
                onClose={onClose}
                visible={open}
                width={860}
                className={"drawer-content-main drawer-content-header-no-bottom"}
                destroyOnClose={true}
            >
                <div className={"drawer-content-padding"}>
                    <FunctionDetail
                        functionId={record.id}
                        deleteFn={deleteFn}
                    />
                </div>
            </Drawer>
        </>
    )
}

export default observer(FunctionContentDrawer);