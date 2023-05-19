import React, { Fragment, useEffect, useState } from "react";
import { Table, message, Button, Row, Col } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./UrlData.scss";
import { observer, inject } from "mobx-react";
import UrlAddData from "./UrlAddData"
const UrlData = props => {
    const { urlDataStore } = props;
    const { findAllSystemUrl } = urlDataStore;
    const [urlDataList, setUrlDataList] = useState([]);
    const [modalTitle, setModalTitle] = useState()
    const [urlAddvisible, setUrlAddvisible] = useState()
    const [actionType, setActionType] = useState()
    const columns = [
        {
            title: '系统',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '地址',
            dataIndex: 'systemUrl',
            key: 'systemUrl',
        }
    ];

    useEffect(() => {
        findAllSystemUrl().then(res => {
            setUrlDataList(res.data)
        })
    }, [])

    const addUrl = () => {
        setModalTitle("添加地址")
        setUrlAddvisible(true)
        setActionType("add")
    }
    return (
        <Fragment>
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="url-data">
                        <Breadcumb
                            firstText="地址"
                        >
                            <div>
                                <Button type="primary" onClick={() => addUrl()}>
                                    添加地址
                                </Button>
                            </div>
                        </Breadcumb>
                        <Table columns={columns} dataSource={urlDataList} />
                    </div>
                </Col>
            </Row>
            <UrlAddData urlAddvisible = {urlAddvisible} 
                setUrlAddvisible = {setUrlAddvisible} 
                modalTitle = {modalTitle} 
                actionType = {actionType}
                setUrlDataList = {setUrlDataList}    
            />
        </Fragment>

    )
}

export default inject("urlDataStore")(observer(UrlData));