import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const CaseContentCommon = (props) =>{
    const {breadcrumb,tabBarExtraContent,tabItem,changeTap} = props

    return(
        <>
            <div 
            className={"case-tabs-box"}
             >
                {
                breadcrumb
                    ?<div className={"breadcrumb-title_between"}>
                        {breadcrumb}
                    </div>
                    :null
                }

                <Tabs
                    defaultActiveKey="1"
                    tabBarExtraContent={tabBarExtraContent}
                    onChange={changeTap}
                >
                    {tabItem.map(item => (
                        <TabPane tab={item.label} key={item.key}>
                            {item.children}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        </>
    )
}

export default CaseContentCommon;