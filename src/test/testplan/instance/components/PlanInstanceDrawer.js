import React, {useState} from "react";
import {Drawer} from "antd";
import {observer} from "mobx-react";
import {CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons";
import {renderRoutes} from "react-router-config";
import {useHistory} from "react-router";
import {TEST_TYPE} from "../../../common/dictionary/dictionary";

const PlanInstanceDrawer = (props) =>{
    const {instance,record} = props
    const [open, setOpen] = useState(false);
    const history = useHistory()

    const showDrawer = async () => {
        sessionStorage.setItem("testPlanInstanceId",instance.instanceId)
        history.push(`/plan/${sessionStorage.getItem("testPlanId")}/instanceInfo/${instance.instanceId}`)
        setOpen(true);
    }

    // 关闭弹框
    const onClose = () => {
        setOpen(false);
    };

    /**
     * 展示名称
     * @param instance
     */
    const recentInstance = (instance) => {
        if (record.type === TEST_TYPE.FUNCTION) return <span>--</span>

        if (!instance) {
            return <span>--</span>
        }

        let info = JSON.parse(instance?.resultInfo)

        switch (info && info.result) {
            case "0":
                return <><CloseCircleTwoTone twoToneColor={"red"}/> #{instance.executeNumber}</>
            case "1":
                return <><CheckCircleTwoTone twoToneColor={"#52c41a"}/> #{instance.executeNumber}</>
            default:
                return <> #{instance.executeNumber}</>
        }
    }


    return (
        <>
            <a onClick={showDrawer}>{recentInstance(instance)}</a>
            <Drawer
                placement="right"
                onClose={onClose}
                visible={open}
                width={800}
                destroyOnClose={true}
                // maskStyle={{background:"transparent"}}
                //contentWrapperStyle={{top:48,height:"calc(100% - 52px)"}}
                closable={false}
            >
                {
                    renderRoutes(props.route?.routes)
                }
            </Drawer>
        </>

    )
}

export default observer(PlanInstanceDrawer);