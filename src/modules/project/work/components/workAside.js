import React, { useRef, useState, useContext } from 'react';
import { ShopTwoTone, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Pagination, Select } from 'antd';
import { observer, inject } from "mobx-react";
import { getDomainTenant } from 'doublekit-core-ui';
const { Option } = Select;

const WorkAside = (props) => {
    // 选择事务
    const workAsie = useRef()

    const { changeWork, total, workList, workStore } = props;
    const { searchCondition, getWorkConditionPageTree,getWorkConditionPage, setWorkId, workId,viewType } = workStore;
    const [expandedTree, setExpandedTree] = useState([])
    const tenant = getDomainTenant();
    const [isAsc, setIsAsc] = useState(true)
    // 点击选择事项列表
    const changeWorkChilden = (id, index) => {

        changeWork(id, index + 1)
        // 测试
        // setSelectKey(id)
        if (props.route.path === "/index/prodetail/workMessage/:id") {
            props.history.push("/index/prodetail/work")
            setWorkId(id)
        }
    }

    // 拉动菜单栏的宽度
    const changWidth = () => {
        const oBox = workAsie.current;
        workAsie.current.onmousemove = function (e) {
            const dx = e.offsetX;
            const dy = e.offsetY;
            let a = "";
            let b = "";
            if (dx > oBox.offsetWidth - 10 && dx < oBox.offsetWidth && dy > 0 && dy < oBox.offsetHeight) {
                oBox.style.cursor = "w-resize"
                oBox.onmousedown = function (e) {
                    const iEvent = e || event;
                    const dx = iEvent.clientX;//当你第一次单击的时候，存储x轴的坐标。
                    const dw = oBox.offsetWidth;//存储默认的div的宽度。
                    const disright = oBox.offsetLeft + oBox.offsetWidth;//存储默认div右边距离屏幕左边的距离。
                    if (iEvent.clientX > oBox.offsetLeft + oBox.offsetWidth - 10) {//判断鼠标是否点在右边还是左边，看图1理解
                        b = 'right';
                    }
                    if (iEvent.clientX < oBox.offsetLeft + 10) {//同理
                        b = 'left';
                    }
                    if (iEvent.clientY < oBox.offsetTop + 10) {
                        a = 'top';
                    }
                    if (iEvent.clientY > oBox.offsetTop + oBox.offsetHeight - 10) {
                        a = 'bottom';
                    }
                    document.onmousemove = function (ev) {
                        const iEvent = ev || event;
                        if (b == 'right') {
                            oBox.style.width = dw + (iEvent.clientX - dx) + 'px';
                            //此时的iEvent.clientX的为你拖动时一直改变的鼠标的X坐标，例如你拖动的距离为下图的绿色部分，第二个黑点就表示你此时的iEvent.clientX
                            //所以，此时的盒子宽度就等于绿色部分的距离加上原本盒子的距离，看图2
                            if (oBox.offsetWidth <= 250) {//当盒子缩小到一定范围内的时候，让他保持一个固定值，不再继续改变
                                oBox.style.width = '250px';
                            }
                            if (oBox.offsetWidth >= 500) {
                                oBox.style.width = '500px';
                                oBox.style.left = disright - oBox.offsetWidth + 'px';//防止抖动
                            }
                        }
                        if (b == 'left') {
                            oBox.style.width = dw - (iEvent.clientX - dx) + 'px';//iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。 图3
                            oBox.style.left = disright - oBox.offsetWidth + 'px';//disright表示盒子右边框距离左边的距离，disright-当前的盒子宽度，就是当前盒子距离左边的距离
                            if (oBox.offsetWidth <= 250) {
                                oBox.style.width = '250px';
                                oBox.style.left = disright - oBox.offsetWidth + 'px';//防止抖动
                            }
                        }

                    };
                    document.onmouseup = function () {
                        document.onmousedown = null;
                        document.onmousemove = null;
                    };
                    return false;
                }
            } else {
                oBox.style.cursor = "default"
            }
        }
    }

    const changePage = (page) => {
        const values = {
            pageParam: {
                pageSize: 10,
                currentPage: page,
            }
        }
        if (viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                changeWork(res.dataList[0].id, 1);
            })
        }
        if (viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                changeWork(res.dataList[0].id, 1);
            })
        }

    }

    //树的层级
    let num = 0;

    const Spans = (num) => {
        let span = []
        for (let i = 0; i < num; i++) {
            span.push(<span style={{ width: "20px" }} key={i}></span>)

        }
        return span;
    }

    // 树的展开与闭合
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = async key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key));
        }
    }

    const TreeSecondDom = (children, faid) => {
        return (
            <ul className="work-aside-ul child">
                {
                    children && children.map((childItem, index) => {
                        return (
                            <li key={childItem.id} className={isExpandedTree(faid) ? null : 'work-aside-hidden'} >
                                <div
                                    className={`work-aside-item work-aside-child ${childItem.id === workId ? "work-aside-select" : ""}`}
                                    onClick={(event) => changeWorkChilden(childItem.id)}
                                >
                                    {Spans(num)}
                                    <img src={`${img_url}/file/${childItem.workType.iconUrl}?tenant=${tenant}`} width="15px" height="15px" alt="" />
                                    <div className="work-aside-item-name">
                                        <div className="id">{childItem.id}</div>
                                        <div className="name">{childItem.title}</div>
                                    </div>
                                    <div className="work-aside-item-icon">
                                        {
                                            childItem.children && childItem.children.lenght > 0 ?
                                                (isExpandedTree(childItem.id) ?
                                                    <DownOutlined onClick={() => setOpenOrClose(childItem.id)} /> :
                                                    <UpOutlined onClick={() => setOpenOrClose(childItem.id)} />
                                                ) : ""
                                        }
                                    </div>
                                </div>
                                {
                                    childItem.children && childItem.children.lenght > 0 && TreeSecondDom(childItem.children, childItem.id)
                                }
                            </li>
                        )
                    })
                }
            </ul>

        )

    }


    const TreeDom = (item, index) => {
        return (
            <li key={item.id}>
                <div
                    className={`work-aside-item work-aside-child ${item.id === workId ? "work-aside-select" : ""}`}
                    onClick={(event) => changeWorkChilden(item.id, index)}
                >
                    {Spans(num)}
                    <img src={`${img_url}/file/${item.workType.iconUrl}?tenant=${tenant}`} width="15px" height="15px" alt="" />
                    <div className="work-aside-item-name">
                        <div className="id">{item.id}</div>
                        <div className="name" id={item.id}>{item.title}</div>
                    </div>
                    <div className="work-aside-item-icon">
                        {
                            item.children && item.children.length > 0 ?
                                (isExpandedTree(item.id) ?
                                    <DownOutlined onClick={() => setOpenOrClose(item.id)} /> :
                                    <UpOutlined onClick={() => setOpenOrClose(item.id)} />
                                ) : ""
                        }
                    </div>
                </div>
                {
                    item.children && item.children.length > 0 && TreeSecondDom(item.children, item.id)
                }
            </li>

        )

    }

    const attribute = [
        {
            value: "id",
            title: "ID"
        },
        {
            value: "title",
            title: "标题"
        },
        {
            value: "workType",
            title: "类型"
        },
        {
            value: "assigner",
            title: "经办人"
        },
        {
            value: "workStatus",
            title: "事项状态"
        }
    ]
    const [sortType,setSortType] = useState()

    const saveSortType = (vlaue) => {
        setSortType(vlaue)
        sorter(vlaue)
    }
    const upDownSort= () => {
        setIsAsc(!isAsc);
        sorter(sortType)
    }

    const sorter = (sortType) => {
        const sortParams = [];
        if(isAsc){
            sortParams.push({
                name: sortType,
                orderType: "asc"
            })
        }else {
            sortParams.push({
                name: sortType,
                orderType: "desc"
            })
        }
        searchCondition.orderParams = sortParams;
        if(viewType === "tree"){
            getWorkConditionPageTree()
        }
        if(viewType === "tile"){
            getWorkConditionPage()
        }
    }
    return (
        <div className="work-aside" ref={workAsie} onMouseMove={changWidth}>
            <div className="work-aside-option">
                <div className="work-aside-sort">
                    <Select style={{ width: 120 }} onChange={saveSortType}>
                        {
                            attribute && attribute.map((item) => {
                                return <Select.Option value={item.value} key={item.value}>{item.title}</Select.Option>
                            })
                        }
                    </Select>
                    {
                        isAsc ? 
                        <svg aria-hidden="true" className="work-aside-sort-icon" onClick={()=>upDownSort("asc")}>
                            <use xlinkHref="#iconshengxu"></use>
                        </svg>
                        :
                        <svg aria-hidden="true" className="work-aside-sort-icon" onClick={()=>upDownSort("desc")}>
                            <use xlinkHref="#iconjiangxu"></use>
                        </svg>
                    }
                </div>
                <div className="work-aside-fixed">
                    <div className="work-aside-contant" >
                        <ul className="work-aside-ul">
                            {
                                workList && workList.map((item, index) => {
                                    return TreeDom(item, index, 0)
                                })
                            }
                        </ul>
                    </div>
                </div>
                <Pagination simple total={total} pageSize="10" defaultCurrent="1" current={searchCondition.pageParam.currentPage} className="work-aside-page" onChange={changePage} />
            </div>
        </div>
    )
}

export default inject("workStore")(observer(WorkAside));