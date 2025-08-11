import React, {useEffect, useRef, useState} from "react";
import ColorIcon from "../../../common/colorIcon/ColorIcon";
import {Tooltip} from "antd";
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import "./ProductChangeModal.scss"

const ProductChangeModal = (props) => {
    const { productStore, isShowText, theme } = props;
    const { findProductSortRecentTime, findProduct, findJoinProductList } = productStore;
    const [productAllList, setProductAllList] = useState()
    const [allProductList, setFindJoinProductList] = useState([])
    const productId = props.match.params.productId;
    // 点击显示弹窗按钮
    const setButton = useRef()
    // 弹窗的显示与不显示控制参数
    const [showMenu, setShowMenu] = useState(false);
    // 要切换到的项目
    const [selectProject, setSelectProject] = useState(false)
    // 弹窗
    const modelRef = useRef()
    // 项目集信息
    const [product, setProduct] = useState(JSON.parse(localStorage.getItem("product")))

    /**
     * 监听鼠标点击事件，控制弹窗的显示与不显示
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    /**
     * 获取全部项目集，用于切换
     */
    useEffect(() => {
        findProduct(productId).then(data => {
            if (data.code === 0) {
                setProduct(data.data)
                localStorage.setItem("product", JSON.stringify(data.data))
            }
        })
        findJoinProductList({}).then(res => {
            if (res.code === 0) {
                setFindJoinProductList(res.data)
            }
        })
        findProductSortRecentTime({ productId: product?.id }).then(res => {
            if (res.code === 0) {
                setProductAllList(res.data)
            }
        })


        // console.log("product:    ")
        // console.log(product)
        return
    }, [])

    /**
     * 显示弹窗框，并设置弹出框的位置
     */
    const showDropDown = () => {
        setShowMenu(!showMenu)
        modelRef.current.style.left = setButton.current.clientWidth
    }

    /**
     * 关闭弹窗
     * @param {点击dom} e
     * @returns
     */
    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    /**
     * 切换项目
     * @param {id} id
     */
    const selectProductId = (record) => {
        // 切换选中项目，获取项目详情
        findProduct(record.id).then(data => {
            if (data.code === 0) {
                props.history.push(`/product/${record.id}/overview`);
                localStorage.setItem("product", JSON.stringify(record))
                location.reload();
                setShowMenu(false)
            }
        });

    }

    /**
     * 鼠标放置，改变当前列表的背景色
     * @param {项目集id} id
     */
    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    /**
     * 鼠标离开，恢复原来背景
     */
    const handleMouseOut = () => {
        setSelectProject("")
    }

    return (
        <div className="change-product">
            <div onClick={() => showDropDown()} ref={setButton}>
                {
                    isShowText ? <div className="product-change-title">
                            <ColorIcon color={product.color} name={product.name} className="product-icon" />
                            <div className={`product-text `} >
                                <div>
                                    {product?.name}
                                </div>
                            </div>
                            <div className={`product-toggleCollapsed`}>
                                <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg>
                            </div>
                        </div>
                        :
                        <Tooltip placement="right" title={product?.name}>
                            <div className="product-change-icon">
                                <ColorIcon color={product.color} name={product.name} className="product-icon" />
                                {/* <svg className="icon-15" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg> */}
                            </div>
                        </Tooltip>

                }

            </div>

            <div
                className={`change-product-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-product-head">选择项目集</div>
                <div className={`change-product-item change-product-selectItem`}

                     key={product?.id}

                >
                    <ColorIcon color={product.color} name={product.name} className="product-icon" />
                    <div className="product-item-info">
                        <div className="product-name">
                            {product?.name}
                        </div>
                        <div className="product-type">
                            {product?.master?.nickname}
                        </div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    productAllList && productAllList.map((item) => {
                        return <div className={`change-product-item ${item.id === selectProject ? "change-product-selectName" : ""}`}
                                    onClick={() => selectProductId(item)}
                                    key={item.id}
                                    onMouseOver={() => handleMouseOver(item.id)}
                                    onMouseOut={handleMouseOut}

                        >
                            <div className={`product-icon product-color-${item.color}`}>{item.name?.slice(0, 1)}</div>
                            <div className="product-item-info">
                                <div className="product-name">
                                    {item.name}
                                </div>
                                <div className="product-type">
                                    {item.master?.nickname}
                                </div>
                            </div>
                        </div>
                    })
                }
                {
                    allProductList.length > 6 && <div className="change-product-more" onClick={() => props.history.push("/product")}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("productStore")(observer(ProductChangeModal)));