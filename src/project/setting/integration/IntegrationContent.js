import React, {useState} from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { Col, Row } from "antd";
import BindSward from "./BindSward";
import { withRouter } from 'react-router';
import "./integrationStyle.scss"

const IntegrationContent = (props) => {

    const [showSward, setShowSward] = useState(false)
    const [wikiAddvisible, setWikiAddvisible] = useState(false)

    const goUrl = (path) => {
        const pathname = props.match.url;
        props.history.push(`${pathname}/${path}`)
    }
    return (
        <Row className={"integration-content-row"} style={{height: "100%", overflow: "unset"}}>
            <Col
                sm={24}
                md={24}
                lg={{ span: 24 }}
                xl={{ span: "18", offset: "3" }}
                xxl={{ span: "18", offset: "3" }}
            >
                <div className={"project-set-integration"}>

                        <>
                            <Breadcumb firstText="服务集成" />
                            <div
                                className={"integration-item"}
                                onClick={() => goUrl("sward")}
                            >
                                <div className={"integration-item-left"}>
                                    <div className={"integration-item-icon"}>
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-link"></use>
                                        </svg>
                                    </div>
                                    <div className={"integration-item-content"}>
                                        <div className={"integration-item-title"}>sward</div>
                                        <div className={"integration-item-subtitle"}>关联知识库</div>
                                    </div>
                                </div>
                                <div className={"integration-item-right"}>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-pageRight"></use>
                                    </svg>
                                </div>
                            </div>
                        </>


                    {showSward && (
                        <BindSward
                            activeKey={"sward"}
                            setShowSward={setShowSward}
                            {...props}
                        />
                    )}
                </div>
            </Col>
        </Row>
    )
}

export default withRouter(IntegrationContent);