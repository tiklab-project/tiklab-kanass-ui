import React, {useEffect, useState} from "react";
import {useDebounce} from "../../../../common/utils/debounce";
import ColorIcon from "../../../../common/colorIcon/ColorIcon";
import CircleProgress from "../../../../common/progress/CircleProgress";
import {Col, Row, Space, Table} from "antd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import {observer, Provider} from "mobx-react";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import Button from "../../../../common/button/Button";
import InputSearch from "../../../../common/input/InputSearch";
import {SelectItem, SelectSimple} from "../../../../common/select";
import {withRouter} from "react-router";
import ProductPlanAddEditModal from "./ProductPlanAddEditModal";
import ProductPlanStore from "../store/ProductPlanStore";
import { getUser } from "tiklab-core-ui"
import "./ProductPlanList.scss"

const ProductPlanList = (props) => {
    const store = {
        productPlanStore: ProductPlanStore
    }
    const productId = props.match.params.productId;
    const { findAllProductPlanState, findProductPlanPage, uselist, getUseList,
        productPlanList, setProductPlanList, deleproductPlanList, createProductPlanFocus, findProductPlanFocusList,
        deleteProductPlanFocus, total, createRecent, productPlanPageParams, findProductPlanCount
    } = ProductPlanStore;

    const product = JSON.parse(localStorage.getItem("product"));
    // 登录者id
    const userId = getUser().userId;
    // tab的key
    const [activeTabs, setActiveTabs] = useState("all")
    // 弹窗显示
    const [visible, setVisible] = React.useState(false);
    // 操作类型， edit,add
    const [type, setType] = useState();

    // 计划id
    const [productPlanId, setProductPlanId] = useState();

    const [productPlanStateList, setProductPlanStateList] = useState([])

    const [springCount, setProductPlanCount] = useState({
        total: 0,
        myCreated: 0,
        myFocus: 0
    })
    /**
     * 获取关注的计划, 获取项目的所有计划，获取所有计划状态
     */
    useEffect(() => {
        // getFocusProductPlan()
        // findProductPlanList({ productId: productId });
        findAllProductPlanState().then(res => {
            if (res.code === 0) {
                setProductPlanStateList(res.data)
            }
        });
        findProductPlanCount().then(res => {
            setProductPlanCount(res.data)
        })
        selectTabs(activeTabs, 1)
        return;
    }, [])

    /**
     * 到计划详情
     * @param {计划id} id
     */
    const goProductPlanDetail = (id, productPlanName) => {
        const params = {
            name: productPlanName,
            model: "productPlan",
            modelId: id,
            product: { id: product.id },
            // productType: { id: product.productType.id },
        }
        createRecent(params)
        // props.history.push({ pathname: `/${productId}/productPlan/${id}/workitem` })
        props.history.push(`/product/${productId}/planDetail/${id}/type/demand`)
        localStorage.setItem("productPlanId", id);
    }

    /**
     * 根据名字模糊搜索计划
     * @param {输入框的值} data
     */
    const onSearch = useDebounce((data) => {
        findProductPlanPage({
            productPlanName: data,
            pageParam: {
                pageSize: 5,
                currentPage: 1,
            }
        })
        findProductPlanCount().then(res => {
            setProductPlanCount(res.data)
        })
    }, [500])

    /**
     * 显示添加或者编辑弹窗
     * @param {操作类型， edit,add} type
     * @param {计划id} id
     */
    const showModal = (type, id) => {
        setType(type)
        setVisible(true)
        if (id) {
            setProductPlanId(id)
        }

    }


    /**
     * 取消关注
     * @param {计划id} productPlanId
     */
    const deleteFocusProductPlan = (productPlanId, index) => {
        const params = {
            productPlanId: productPlanId,
            masterId: userId,
            productId: productId
        }
        deleteProductPlanFocus(params).then(data => {
            if (data.code === 0) {
                productPlanList[index].focusIs = false
                setProductPlanList([...productPlanList])
                findProductPlanCount().then(res => {
                    setProductPlanCount(res.data)
                })
            }
        })
    }


    /**
     * 添加关注的计划
     * @param {计划id} productPlanId
     */
    const addFocusProductPlan = (productPlanId, index) => {
        const params = {
            productPlanId: productPlanId,
            masterId: userId,
            productId: productId
        }
        createProductPlanFocus(params).then(data => {
            if (data.code === 0) {
                productPlanList[index].focusIs = true
                setProductPlanList([...productPlanList])
                findProductPlanCount().then(res => {
                    setProductPlanCount(res.data)
                })
            }
        })
    }



    /**
     * tab 数组
     */
    const productPlanTab = [
        {
            title: '全部',
            key: 'all',
            icon: "all",
            value: "total"
        },
        {
            title: '我创建的',
            key: 'build',
            icon: "programconcern",
            value: "myCreated"
        },
        {
            title: '我关注的',
            key: 'focus',
            icon: "programconcern",
            value: "myFocus"
        }
    ]

    /**
     * tab 切换
     * @param {tab key} key
     */
    const selectTabs = (key, page) => {
        setActiveTabs(key)
        const params = {
            productId: productId,
            pageParam: {
                pageSize: productPlanPageParams.pageParam.pageSize,
                currentPage: page,
            }
        }
        switch (key) {
            case "all":
                findProductPlanPage({ followersId: null, builderId: null, ...params });
                break;
            case "build":
                findProductPlanPage({ builderId: userId, followersId: null, ...params });
                break;
            case "focus":
                findProductPlanPage({ followersId: userId, builderId: null, ...params });
                break;
            default:
                break;
        }
    }

    /**
     * 删除计划
     * @param {计划id} id
     */
    const deleProductPlanList = (id) => {
        deleproductPlanList(id).then(res => {
            if (res.code === 0) {
                selectTabs(activeTabs, 1)
            }

        })
    }

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "000000":
                name = "productPlan-status-todo";
                break;
            case "111111":
                name = "productPlan-status-process";
                break;
            case "222222":
                name = "productPlan-status-done";
                break;
            default:
                name = "productPlan-status-process";
                break;
        }
        return name;
    }

    const changePage = (page, pageSize) => {
        selectTabs(activeTabs, page)
    }

    const selectaProductPlanState = (value) => {
        console.log(value)
        const params = {
            productPlanStateIds: value,
            pageParam: {
                pageSize: productPlanPageParams.pageParam.pageSize,
                currentPage: 1,
            }
        }
        findProductPlanPage(params);
        findProductPlanCount().then(res => {
            setProductPlanCount(res.data)
        })
    }

    const columns = [
        {
            title: "计划名称",
            dataIndex: "productPlanName",
            key: "productPlanName",
            width: "25%",
            render: (text, record) => (
                <div className="productPlan-item" onClick={() => goProductPlanDetail(record.id, text)}>

                    <ColorIcon name={text} className="icon-32" color={record.color} />
                    <span className="productPlan-name" onClick={() => goProductPlanDetail(record.id, text)}>{text}</span>
                </div>
            ),
        },
        {
            title: "计划日期",
            dataIndex: "data",
            key: "startTime",
            align: "left",
            width: "25%",
            render: (text, record) => <span>{record.startTime?.slice(0, 10)} ~ {record.endTime?.slice(0, 10)}</span>,
        },
        {
            title: "事项",
            dataIndex: "workNumber",
            key: "workNumber",
            align: "left"
        },
        {
            title: "状态",
            dataIndex: ["productPlanState", "name"],
            key: "productPlanState",
            align: "left",
            render: (text, record) => <div className={`productPlan-status ${setStatuStyle(record.productPlanState.id)}`}>
                {text}
            </div>
        },
        {
            title: "进度",
            dataIndex: "progress",
            key: "progress",
            align: "left",
            render: (text, record) => (
                <>
                    <CircleProgress
                        percent={
                            record?.workNumber === 0 ? 0 : (record?.workDoneNumber / record?.workNumber) * 100
                        }
                    />
                </>
            )
        },
        {
            title: "操作",
            key: "action",
            width: "100px",
            render: (text, record, index) => (
                <Space size="middle">
                    {
                        record.focusIs ?
                            <svg className="svg-icon" aria-hidden="true" onClick={() => deleteFocusProductPlan(record.id, index)}>
                                <use xlinkHref="#icon-view"></use>
                            </svg>
                            :
                            <svg className="svg-icon" aria-hidden="true" onClick={() => addFocusProductPlan(record.id, index)}>
                                <use xlinkHref="#icon-noview"></use>
                            </svg>
                    }
                    <svg className="svg-icon" aria-hidden="true" onClick={() => showModal("edit", record.id)}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <PrivilegeProjectButton code={'ProductPlanDelete'} domainId={productId}  {...props}>
                        <DeleteModal deleteFunction={deleProductPlanList} id={record.id} />
                    </PrivilegeProjectButton>

                </Space>

            ),
        },
    ];

    return (<Provider {...store}>
            <div className="product-productPlan">
                <Row>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "3" }}>
                        <div className="product-productPlan-list">
                            <Breadcumb
                                firstText="计划"
                            >
                                <div className="productPlan-botton">
                                    <PrivilegeProjectButton code={'SpintAdd'} domainId={productId}  {...props}>
                                        <Button type="primary" className="productPlan-botton-add" onClick={() => showModal("add")}>
                                            添加计划
                                        </Button>
                                    </PrivilegeProjectButton>

                                </div>
                            </Breadcumb>
                            <div className="productPlan-filter">
                                <div className="productPlan-tabs">
                                    {
                                        productPlanTab.map(item => {
                                            return <div
                                                className={`productPlan-tab ${activeTabs === item.key ? "active-tabs" : ""}`}
                                                key={item.key}
                                                onClick={() => selectTabs(item.key, 1)}
                                            >
                                                {item.title}<span className="tabs-bar-num">{springCount[item.value]}</span>
                                            </div>
                                        })
                                    }
                                </div>
                                <div className="productPlan-filter-right">
                                    <InputSearch
                                        placeholder="搜索计划"
                                        allowClear
                                        style={{ width: 200 }}
                                        onChange={onSearch}
                                    />
                                    <SelectSimple
                                        name="productPlanStateIds"
                                        onChange={(value) => selectaProductPlanState(value)}
                                        title={"状态"}
                                        ismult={true}
                                        value={productPlanPageParams?.productPlanStateIds}
                                        suffixIcon={true}
                                    >
                                        {
                                            productPlanStateList.map(item => {
                                                return <SelectItem
                                                    value={item.id}
                                                    label={item.name}
                                                    key={item.id}
                                                />
                                            })
                                        }
                                    </SelectSimple>

                                </div>

                            </div>
                            <div className="product-productPlan-contant">
                                <div className="productPlan-box">
                                    <Table
                                        columns={columns}
                                        dataSource={productPlanList}
                                        rowKey={(record) => record.id}
                                        // pagination={false}
                                        onSearch={onSearch}
                                        scroll={{ x: "100%" }}
                                        pagination={{
                                            total: total,
                                            pageSize: productPlanPageParams.pageParam.pageSize,
                                            current: productPlanPageParams.pageParam.currentPage,
                                            onChange: changePage,
                                            position: ["bottomCenter"],
                                            showTotal: () => `共${total}条`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ProductPlanAddEditModal
                    type={type}
                    productPlanId={productPlanId}
                    productId={productId}
                    uselist={uselist}
                    getUseList={getUseList}
                    productPlanStateList={productPlanStateList}
                    setVisible={setVisible}
                    visible={visible}
                    setActiveTabs={setActiveTabs}
                    selectTabs={selectTabs}
                    {...props}
                />
            </div>
        </Provider>

    )

}

export default withRouter(observer(ProductPlanList));