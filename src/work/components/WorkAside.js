import React, { useRef, useState, useEffect } from 'react';
import { observer, inject } from "mobx-react";
import WorkListHead from "./WorkListHead";
import WorkListFilter from "./WorkListFilter";
import "./WorkAside.scss"
import { Spin } from 'antd';
import { getUser } from 'tiklab-core-ui';
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import setImageUrl from '../../common/utils/setImageUrl';

const WorkAside = (props) => {
    // 选择事务
    const workAside = useRef()
    const workAsideList = useRef()
    const { workStore } = props;
    const { tableLoading, getWorkConditionPageTree, getWorkConditionPage, setWorkId,
        workId, viewType, setWorkIndex, workList, currentPage, createRecent, totalPage,
        searchCondition, total } = workStore;
    const [expandedTree, setExpandedTree] = useState([]);
    const project = JSON.parse(localStorage.getItem("project"));
    const tenant = getUser().tenant;

    // 点击选择事项列表
    const changeWorkChilden = (workItem, index) => {
        setWorkId(workItem.id)
        setWorkIndex(index + 1)
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])

    }

    // 拉动菜单栏的宽度
    const changWidth = () => {
        const oBox = workAside.current;
        workAside.current.onmousemove = function (e) {
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
                            if (oBox.offsetWidth <= 300) {//当盒子缩小到一定范围内的时候，让他保持一个固定值，不再继续改变
                                oBox.style.width = '300px';
                            }
                            if (oBox.offsetWidth >= 500) {
                                oBox.style.width = '500px';
                                oBox.style.left = disright - oBox.offsetWidth + 'px';//防止抖动
                            }
                        }
                        if (b == 'left') {
                            oBox.style.width = dw - (iEvent.clientX - dx) + 'px';//iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。 图3
                            oBox.style.left = disright - oBox.offsetWidth + 'px';//disright表示盒子右边框距离左边的距离，disright-当前的盒子宽度，就是当前盒子距离左边的距离
                            if (oBox.offsetWidth <= 300) {
                                oBox.style.width = '300px';
                                oBox.style.left = disright - oBox.offsetWidth + 'px';//防止抖动
                            }
                        }

                    };
                    document.onmouseup = function () {
                        document.onmousedown = null;
                        document.onmousemove = null;
                    };
                    return true;
                }
            } else {
                oBox.style.cursor = "default"
            }
        }
    }

    const changePage = () => {
        const values = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition?.pageParam?.currentPage + 1,
            }
        }
        if (viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                setWorkId(res.dataList[0]?.id)
                setWorkIndex(1)

            })
        }
        if (viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                setWorkId(res.dataList[0]?.id)
                setWorkIndex(1)
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

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    const TreeSecondDom = (children, faIndex, faid, deep) => {
        return (
            <div className={`work-aside-ul ${isExpandedTree(faid) ? null : 'work-aside-hidden'} `} key={faIndex}>
                {
                    children && children.map((childItem, index) => {
                        return (
                            <div key={childItem.id}>
                                <div
                                    key={childItem.id}
                                    style={{ paddingLeft: deep * 16 + 10 }}
                                    className={`work-aside-item work-aside-child  ${childItem.id === workId ? "work-aside-select" : ""}`}
                                    onClick={(event) => changeWorkChilden(childItem, faIndex)}
                                >
                                    {/* {Spans(num)} */}
                                    <div className="work-aside-item-icon">
                                        {
                                            childItem.children && childItem.children.length > 0 ?
                                                (isExpandedTree(childItem.id) ?
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-workDown"></use>
                                                    </svg> :
                                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(childItem.id)}>
                                                        <use xlinkHref="#icon-workRight"></use>
                                                    </svg>
                                                ) :
                                                <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-point"></use>
                                            </svg>
                                        }
                                    </div>
                                    {
                                        childItem.workTypeSys?.iconUrl ?
                                            <img
                                                src = {setImageUrl(childItem.workTypeSys.iconUrl)}
                                                alt=""
                                                className="img-icon-right"
                                            />
                                            :
                                            <img
                                                src={('images/workType1.png')}
                                                alt=""
                                                className="img-icon-right"
                                            />
                                    }
                                    <div className="work-aside-item-name">
                                        <div className="work-aside-item-first">
                                            <span>{childItem.id}</span>
                                        </div>
                                        <div className="work-aside-item-second" id={childItem.id}>{childItem.title}</div>
                                    </div>
                                    <div className={`work-aside-status ${setStatuStyle(childItem.workStatusNode.id)}`}>
                                        {childItem.workStatusNode.name}
                                    </div>
                                </div>
                                {
                                    childItem.children && childItem.children.length > 0 && TreeSecondDom(childItem.children, faIndex, childItem.id, deep + 1)
                                }
                            </div>
                        )
                    })
                }
            </div>

        )

    }


    const TreeDom = (item, index, deep) => {
        return (
            <div key={item.id}>
                <div
                    className={`work-aside-item work-aside-child ${item.id === workId ? "work-aside-select" : ""}`}
                    onClick={(event) => changeWorkChilden(item, index)}
                >
                    {/* {Spans(num)} */}
                    <div className="work-aside-item-icon">
                        {
                            item.children && item.children.length > 0 ?
                                (isExpandedTree(item.id) ?
                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                        <use xlinkHref="#icon-workDown"></use>
                                    </svg> :
                                    <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                        <use xlinkHref="#icon-workRight"></use>
                                    </svg>
                                ) :
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-point"></use>
                                </svg>
                        }
                    </div>
                    {
                        item.workTypeSys?.iconUrl ? 
                        <img
                            src = {setImageUrl(item.workTypeSys?.iconUrl)}
                            alt=""
                            className="img-icon-right"
                        />
                        :
                        <img
                            src={('images/workType1.png')}
                            alt=""
                            className="img-icon-right"
                        />
                    }

                    <div className="work-aside-item-name">
                        <div className="work-aside-item-first">
                            <span>{item.id}</span>
                        </div>
                        <div className="work-aside-item-second" id={item.id}>{item.title}</div>
                    </div>
                    <div className={`work-aside-status ${setStatuStyle(item.workStatusNode.id)}`}>
                        {item.workStatusNode.name}
                    </div>

                </div>
                {
                    item.children && item.children.length > 0 && TreeSecondDom(item.children, index, item.id, deep + 1)
                }
            </div>

        )

    }

    const [workAsideTop, setWorkAside] = useState()
    const [showWorkListFilter, setShowWorkListFilter] = useState(true)
    useEffect(() => {
        if (workAsideList.current) {
            setWorkAside(workAsideList.current.scrollTop)
        }
        return;
    }, [workAsideList.current])

    const onScroll = (e) => {
        const scrollTop = e.target.scrollTop
        if (scrollTop > workAsideTop) {
            setShowWorkListFilter(false)
        } else {
            setShowWorkListFilter(true)
        }
        setWorkAside(scrollTop)
    }

    return (
        <div className="work-aside" ref={workAside} onMouseMove={changWidth}>
            <WorkListHead />
            <div className="work-aside-option">
                <div className="work-aside-search">
                    <WorkListFilter showWorkListFilter={showWorkListFilter} />
                </div>
                <Spin spinning={tableLoading} delay={500}>
                    <div className={`work-aside-fixed`} ref={workAsideList}>
                        <div className="work-aside-contant" >
                            <div className="work-aside-ul">
                                {
                                    workList && workList.map((item, index) => {
                                        return TreeDom(item, index, 0)
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Spin>

                <div className="work-aside-bottom" >
                    <div>{workList.length}个, 共{total}个</div>
                    {
                        currentPage < totalPage ? <div className="work-aside-button" onClick={() => changePage()}>点击加载</div>
                            :
                            <div style={{ paddingLeft: "10px" }}>已加载全部</div>

                    }
                </div>

                {/* </div> */}
            </div>

        </div>
    )
}

export default inject("workStore")(observer(WorkAside));