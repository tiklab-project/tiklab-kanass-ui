import React, {useEffect,useState} from "react";
import PageCenter from "../../../common/caseCommon/PageCenter";
import {Breadcrumb, Space,message} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import testPlanStore from "../plan/store/testPlanStore";
import MenuSelect from "../../../common/caseCommon/menuSelect/MenuSelect";
import {renderRoutes} from "react-router-config";
import HideDelete from "../../../common/caseCommon/hideDelete/HideDelete";

const PlanDetailMenu = (props) => {
    const {findTestPlan,deleteTestPlan} = testPlanStore

    const projectId = localStorage.getItem('projectId')
    const testPlanId = sessionStorage.getItem('testPlanId')
    const [testPlanInfo, setTestPlanInfo] = useState({});
    const [currentMenu, setCurrentMenu] = useState(1);

    useEffect(async () => {
        let data =  await findTestPlan(testPlanId)
        setTestPlanInfo(data)
    }, []);



    const functionLeftMenu=[
        {
            "icon":"test-case-group",
            "title":"测试用例",
            "key":1,
            "router":`/project/${projectId}/testcase/planDetail/case`
        },
        {
            "icon":"baogao",
            "title":"测试历史",
            "key":2,
            "router":`/project/${projectId}/testcase/planDetail/functionTestInstance`
        },
        {
            "icon":"quexian",
            "title":"缺陷列表",
            "key":3,
            "router":`/project/${projectId}/testcase/planDetail/defect`
        },
        {
            "icon":"baogao",
            "title":"测试报告",
            "key":4,
            "router":`/project/${projectId}/testcase/planDetail/report`
        }
    ]

    const selectMenuItem = (curMenu) => {
        setCurrentMenu(curMenu.key)
        props.history.push(curMenu.router)
    }

    const deleteFn = (record) => {
        deleteTestPlan(testPlanId).then(() => {
            message.success("删除成功")
            toPlanList()
        })
    }

    const toPlanList = () => {
        props.history.push(`/project/${projectId}/testcase/testplan`)
    }


    return(
        <PageCenter>
            <div className="content-box-center">
                <Breadcrumb style={{marginTop: '10px'}}>
                    <Breadcrumb.Item
                        onClick={() =>toPlanList()}
                        style={{cursor: "pointer"}}
                    >
                        <Space>
                            <LeftOutlined/>
                            <span style={{fontWeight: "bold", fontSize: "16px"}}>测试计划</span>
                        </Space>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span style={{fontWeight: "bold", fontSize: "16px"}}>{testPlanInfo?.name}</span>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className={"display-flex-between"} style={{margin: "12px 0px 24px",borderBottom: "1px solid #e9e9e9"}}>
                    <MenuSelect
                        menuItems={functionLeftMenu}
                        selectFn={selectMenuItem}
                        selected={currentMenu}
                        style={{width: "320px"}}
                    />

                    <HideDelete deleteFn={deleteFn}/>
                </div>

                <div >
                    {
                        renderRoutes(props.route.routes)
                    }
                </div>
            </div>
        </PageCenter>
    )
}

export default observer(PlanDetailMenu);