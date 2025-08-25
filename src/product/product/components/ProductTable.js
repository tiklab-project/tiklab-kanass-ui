/*
 * @Descripttion: 产品列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-05 09:41:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:05:47
 */
import React, {useEffect, useState, Fragment, useRef} from 'react';
import {Table, Space, Row, Col, Empty, Spin, Progress} from 'antd';
import "./Product.scss";
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import InputSearch from "../../../common/input/InputSearch";
import { getUser } from 'tiklab-core-ui';
import Button from "../../../common/button/Button";
import ColorIcon from '../../../common/colorIcon/colorIcon';
import ProjectEmpty from '../../../common/component/ProjectEmpty';
import { PrivilegeButton } from 'tiklab-privilege-ui';
import CircleProgress from "../../../common/progress/CircleProgress";
import ProductAdd from "./ProductAdd";
import ProductOperateSelectModal from "./ProductOperateSelectModal";

const ProductTable = (props) => {
    const { productStore, } = props;
    const { getProductlist, productList, getUseList, findProductFocusList,
        deleteProductFocusByQuery, createProductFocus, findRecentProductList,
        findFocusProductList, findJoinProductList, createRecent, findProductCount, productPageParams, total,
        findProductPage
    } = productStore;

    const [name, setName] = useState("添加产品")
    const [recentLoading, setRecentLoading] = useState(true);
    const [activeTabs, setActiveTabs] = useState("1")
    const [focusProductList, setFocusProductList] = useState([])
    const [recentProductList, setRecentProductList] = useState([])
    const [productCount, setProductCount] = useState({
        total: 0,
        myFocus: 0,
        myCreated: 0
    })
    const [loading, setLoading] = useState(false);
    const userId = getUser().userId;
    const status = [
        "未开始",
        "进行中",
        "已结束",
    ]

    const [productAddVisible, setProductAddVisible] = useState(false);

    const productTableRef = useRef();

    useEffect(() => {
        // findRecentProductList({})
        setRecentLoading(true)
        findRecentProductList({}).then(res => {
            if (res.code === 0) {
                setRecentProductList(res.data)
                setRecentLoading(false)
            }
        })
        findProductCount({ name:null }).then(res => {
            if (res.code === 0){
                setProductCount(res.data)
            }
        })
        findProductFocus(userId)
        getUseList()
        return;
    }, [])

    /**
     * 查找关注的产品
     * @param {产品id} id 
     */
    const findProductFocus = (id) => {
        findProductFocusList({ masterId: id }).then(res => {
            if (res.code === 0) {
                const focusList = res.data;
                focusList.map(item => {
                    focusProductList.push(item.productId)
                })
                setFocusProductList(focusProductList)
            }
        })
    }


    const goProductDetail = (record) => {
        const params = {
            name: record.name,
            model: "product",
            modelId: record.id
        }
        createRecent(params)
        localStorage.setItem("product", JSON.stringify(record))
        props.history.push(`/product/${record.id}/project`)
    }

    const goToProductSet = (record) => {
        localStorage.setItem("product", JSON.stringify(record))
        props.history.push(`/product/${record.id}/set/basicInfo`)
    }

    const onSearch = (value) => {
        setLoading(true)
        findProductPage({
            name: value,
            pageParam: {
                pageSize: 5,
                currentPage: 1
            }
        }).then(res => {
            setLoading(false)
        })
        findProductCount({ name: value }).then(res => {
            if (res.code === 0){
                setProductCount(res.data)
            }
        })
    }

    const changePage = (page, pageSize) => {
        const values = {
            pageParam: {
                pageSize: pageSize,
                currentPage: page,
            }
        }
        setLoading(true)
        findProductPage(values).then(res => {
            setLoading(false);
        })
    }

    const pageDowm = (pagination) => {
        getProductlist({ current: pagination.current })
    }

    const addFocusProduct = (id) => {
        createProductFocus({ productId: id }).then(res => {
            if (res.code === 0) {
                focusProductList.push(id)
                setFocusProductList([...focusProductList])
            }
        })
    }
    const deleteFocusProduct = (id) => {
        const params = {
            masterId: userId,
            productId: id
        }
        deleteProductFocusByQuery(params).then(res => {
            if (res.code === 0) {
                const index = focusProductList.indexOf(id);
                if (index > -1) {
                    focusProductList.splice(index, 1);
                }
                setFocusProductList([...focusProductList])
            }
        })
    }

    // 列数据
    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "30%",
            render: (text, record) => <Space onClick={() => goProductDetail(record)} className="span-botton">
                <ColorIcon color={record.color} name={record.name} className="product-table-icon" />
                {text}
            </Space>,
        },
        {
            title: "关联项目",
            dataIndex: "projectNumber",
            key: "projectNumber",
            align: "left",
            width: "10%",
            render: (text, record) => <span>
                {text > 0 ? text : 0}
            </span>
        },
        {
            title: "项目状态",
            dataIndex: "status",
            key: "status",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <div className={`project-status project-status${text === "1" ? "-todo" : text === "2" ? "-process" : "-done"}`}>{status[text]}</div>
            )
        },
        {
            title: "进度",
            dataIndex: "progress",
            key: "progress",
            align: "left",
            width: "10%",
            render: (text, record) => (
                <>
                    <CircleProgress
                        percent={text}
                    />
                </>
            )
        },
        {
            title: "负责人",
            dataIndex: ["master", "nickname"],
            key: "master",
            align: "left",
            width: "15%"

        },
        {
            title: "创建时间",
            dataIndex: "creatTime",
            key: "creatTime",
            align: "left",
            width: "20%",
            render: (text, record) => <>
                {record?.creatTime?.substring(0, 10)}
            </>
        },
        {
            title: "操作",
            align: "left",
            width: "10%",
            render: (text, record) =>
                <div style={{ display: "flex", gap: "15px" }}>
                    {
                        focusProductList.indexOf(record.id) !== -1 ?
                            <svg className="svg-icon product-action-icon" aria-hidden="true" onClick={() => deleteFocusProduct(record.id)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon product-action-icon" aria-hidden="true" onClick={() => addFocusProduct(record.id)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <ProductOperateSelectModal
                        getPopupContainer={productTableRef}
                        productInfo={record}
                        productStore={productStore}
                        />
                </div>
        }
    ]

    const projectTab = [
        {
            title: '所有',
            key: '1',
            icon: "project",
            value: "total"
        },
        {
            title: '我收藏的',
            key: '3',
            icon: "productfocus",
            value: "myFocus"
        },
        {
            title: '我创建的',
            key: '4',
            icon: "productcreated",
            value: "myCreated"
        }
    ]

    const selectTabs = (key) => {
        setActiveTabs(key)
        switch (key) {
            case "1":
                findProductPage({ focusMasterId: null, creator: null, projectName: null })
                break;
            case "3":
                findProductPage({ focusMasterId: userId, creator: null, projectName: null })
                break;
            case "4":
                findProductPage({ focusMasterId: null, creator: userId, projectName: null });
                break
            default:
                break;
        }
    }



    return <div className="product-list">
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <Breadcumb firstText="产品">
                    {/*<PrivilegeButton code={'ProductAdd'}  {...props}>*/}
                        <Button
                            style={{ width: "fit-content" }}
                            type="primary" onClick={() => {setProductAddVisible(true)}} buttonText={name} >
                        </Button>
                    {/*</PrivilegeButton>*/}

                </Breadcumb>
                <div className="product-recent-box">
                    <div className="product-recent-box-title">
                        常用产品
                    </div>
                    <Spin spinning={recentLoading} tip="加载中..." >
                        <div className="recent-product">
                            {
                                recentProductList && recentProductList.length > 0 ? recentProductList.map((item, index) => {

                                    return <div className="product-item" key={item.id} onClick={() => goProductDetail(item)}>
                                        <div className="item-title">
                                            <ColorIcon color={item.color} name={item.name} className="item-icon" />
                                            <span className="item-name">{item.name}</span>
                                        </div>
                                        <div className="item-info">
                                            <div className="info-master">
                                                <span className="info-label" style={{ color: "#999" }}>
                                                    负责人
                                                </span>
                                                <span className="info-value">
                                                    {item.master?.nickname}
                                                </span>
                                            </div>
                                            <div className="info-project">
                                                <span className="info-label" style={{ color: "#999" }}>
                                                    关联项目
                                                </span>
                                                <span className="info-value">
                                                    {item.projectNumber}
                                                </span>
                                            </div>

                                        </div>
                                    </div>


                                })
                                    :
                                    <>
                                        {
                                            !recentLoading && <ProjectEmpty description="暂时没有点击过产品~" />
                                        }
                                    </>

                            }
                        </div>

                    </Spin>

                </div>
                <div className="product-search-tab">
                    <div className="product-tabs">
                        {
                            projectTab.map(item => {
                                return <div
                                    className={`product-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                    key={item.key}
                                    onClick={() => selectTabs(item.key)}
                                >
                                    {item.title}<span className="tabs-bar-num">{productCount[item.value]}</span>
                                </div>
                            })
                        }
                    </div>
                    <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索产品"} />
                </div>
                <div>
                    <div className="product-table-box" ref={productTableRef}>
                        <Spin spinning={loading} tip="加载中">
                            <Table
                                columns={columns}
                                dataSource={productList}
                                rowKey={record => record.id}
                                pagination={{
                                    total: total,
                                    pageSize: productPageParams.pageParam.pageSize,
                                    current: productPageParams.pageParam.currentPage,
                                    onChange: changePage,
                                    position: ["bottomCenter"],
                                    showTotal: () => `共${total}条`
                                }}
                                onChange={pageDowm}
                                className="product-table-item"
                                scroll={{
                                    x: "100%"
                                }}

                            />
                        </Spin>
                    </div>

                </div>
            </Col>
        </Row>
        <ProductAdd
            productAddVisible={productAddVisible}
            setProductAddVisible={setProductAddVisible}
        />
    </div>
}

export default withRouter(inject('productStore')(observer(ProductTable)));