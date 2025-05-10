import React, {useState} from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { Col, Row, Tabs } from "antd";
import BindSward from "./BindSward";
import { withRouter } from 'react-router';
const { TabPane } = Tabs;
import "./integrationStyle.scss"
import BindTestHubo from "./BindTestHubo";
import Button from "../../../common/button/Button";

const IntegrationContent = (props) => {

    const [activeKey, setActiveKey] = useState("sward");
    const [wikiAddvisible, setWikiAddvisible] = useState(false)
    const [testAddvisible, setTestAddvisible] = useState(false)
    return (
        <Row>
            <Col
                sm={24}
                md={24}
                lg={{ span: 24 }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className={"project-set-integration"}>
                    <Breadcumb firstText="集成" >
                        {
                            activeKey==="sward"
                                ?<Button
                                    type="primary"
                                    onClick={() => setWikiAddvisible(true)}
                                >
                                    关联知识库
                                </Button>
                                :<Button
                                    type="primary"
                                    onClick={() => setTestAddvisible(true)}
                                >
                                    关联项目
                                </Button>
                        }

                    </Breadcumb>
                    <Tabs
                        activeKey={activeKey}
                        animated={{ inkBar: true, tabPane: true }}
                        style={{ marginTop: 16 }}
                        onChange={setActiveKey}
                    >
                        <TabPane
                            tab="sward"
                            key="sward"
                        >
                            <BindSward
                                activeKey={activeKey}
                                setWikiAddvisible={setWikiAddvisible}
                                wikiAddvisible={wikiAddvisible}
                                {...props}
                            />

                        </TabPane>
                        <TabPane
                            tab="testhubo"
                            key="testhubo"
                        >
                            <BindTestHubo
                                activeKey={activeKey}
                                setTestAddvisible={setTestAddvisible}
                                testAddvisible={testAddvisible}
                                {...props}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </Col>
        </Row>
    )
}

export default withRouter(IntegrationContent);