/*
 * @Descripttion: 全局搜索结果页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React,{ useEffect, useRef, useState} from "react";
import { Pagination } from 'antd';
import "./Search.scss";
import { Row, Col,Tabs } from 'antd';
import project from "../../../assets/images/project.png";
import { observer } from "mobx-react";
import SearchStore from "../store/Search";
import WorkStore from "../../../work/store/WorkStore"
const { TabPane } = Tabs;

const SearchResult = (props) => {
    const {getSearchSore,sortList,searchForPage,keyword,searchCondition,setKeyWord,searchList,getSearch} = SearchStore;
    // 设置事项id
    const {setWorkId} = WorkStore;
    // 最后一个翻页所需的当前页最后的条数
    const [lastRecord,setLastRecord] = useState()
    // 搜索结果条数
    const [itemList,setItem] = useState([])
    // 当前tab key
    const [tabs,setTabs] = useState()
    // tab的文字显示
    const table = (data) => {
        switch(data){
            case "Project": 
                return "项目";
            case "WorkItem": 
                return "事项";
        }
    }
    

    useEffect(() => {
        if(sortList.length !== 0){
            setTabs(sortList[0].index)
            searchForPage({currentPage: 1,index: sortList[0].index,keyword: keyword}).then((res)=> {
                if(res.code === 0){
                    setItem(res.data.dataList)
                    setLastRecord(res.data.lastRecord)
                }
            })
        }
        return 
    }, [sortList,keyword])

    // 输入中
    const [showRes,setShow] = useState("hidden")
    const changeValue = (value) =>{
        console.log(searchList,showRes)
        setShow("show")
        setKeyWord(value.target.value)
        getSearch(value.target.value)
        
    }

    const changeTab = (activeKey) => {
        searchForPage({currentPage: 1,index: activeKey,}).then((res)=> {
            if(res.code === 0){
                setItem(res.data.dataList)
                setLastRecord(res.data.lastRecord)
            }
        })
    }

    const toProject = async(id) => {
        localStorage.setItem("projectId",id)
        await props.history.push("/index/prodetail/survey")
        setShow("hidden")
        // location.reload();

    }

    const toWorkItem = async(id) => {
        setWorkId(id)
        await props.history.push("/index/prodetail/work")
        setShow("hidden")
        // location.reload();

    }
    const changePage = (page) => {
        searchForPage({currentPage: page,lastRecord:lastRecord}).then((res)=> {
            if(res.code === 0){
                setItem(res.data.dataList)
                setLastRecord(res.data.lastRecord)
            }
        })
    }
    const searchInput = useRef()
    const submit = (value) => {
        if(value.keyCode === 13) {
            getSearchSore(value.target.value)
            setKeyWord(value.target.value)
        }else {
            setKeyWord(searchInput.current.value)
            getSearchSore(searchInput.current.value)
        }
        setShow("hidden")
        
    }

    const hiddenBox = ()=> {
        setShow("hidden")
    }
    const showBox = ()=> {
        setShow("show")
    }
    return (
        <Row>
            <Col span={12} offset={6}>
                <div className="search-resule" 
                >
                    <div tabIndex="-1"
                        onFocus={showBox}
                        onBlur={hiddenBox}
                    >
                        <div className="search-box">
                            <input className="search-input" value = {keyword} ref={searchInput} onChange={changeValue} onKeyDown={submit}/>
                            <div className="search-botton" onClick={submit}>搜索</div>
                        </div>
                        <div 
                            className={`show-box ${(searchList.length !== 0 && showRes === "show") ?   null : "hidden-box"}`} 
                        >
                            {
                                searchList && searchList.map((item,index)=> {
                                    return (
                                        <div className="sort-box" key={index}>
                                            
                                            {
                                                (()=> {
                                                    switch(item.index) {
                                                        case "Project": 
                                                            return <div className="sort-title">项目</div>;
                                                        case "WorkItem":
                                                            return <div className="sort-title">事项</div>;
                                                    }
                                                })()
                                            }
                                            {
                                                item.dataList && item.dataList.map((toItem)=> {
                                                    return <div className="item-box" key={toItem.id}>
                                                                {
                                                                    (()=> {
                                                                        switch(item.index) {
                                                                            case "Project": 
                                                                                return <div className="item-one" onClick={()=>toProject(toItem.id)}>
                                                                                            <img src={project} alt="" className="img-icon-right"/>
                                                                                            <span>{toItem.projectName}</span>
                                                                                        </div>;
                                                                            case "WorkItem":
                                                                                return <div className="item-one" onClick={()=>toWorkItem(toItem.id, toItem.project.id)}>
                                                                                            <img src={project} alt="" className="img-icon-right"/>
                                                                                            <span>{toItem.title}</span>
                                                                                        </div>;
                                                                        }
                                                                    })()
                                                                }    
                                                            </div>
                                                })
                                            }
                                        </div>)
                                })
                            }
                    </div>
                    
                    </div>
                    <Tabs defaultActiveKey={tabs} type="card" size={'default'} onChange={changeTab}>
                        {
                            sortList && sortList.map((item)=> {
                                return <TabPane tab={`${table(item.index)}(${item.totalRecord})`} key={item.index} className = "search-contant-list">
                                {
                                    itemList && itemList.map((itemWork)=> {
                                        return <div className="project-box" key={itemWork.id}>
                                                <div className="project-item">
                                                {
                                                    (()=> {
                                                        switch(item.index) {
                                                            case "Project": 
                                                                return <div className="project-contant" onClick={()=>toProject(itemWork.id)}>
                                                                    <div className="project-title">{itemWork.projectName}</div>
                                                                    <div >
                                                                        <span className="project-item-name">项目ID:   </span>{itemWork.id}
                                                                    </div>
                                                                    <div>
                                                                        <span className="project-item-name">项目详情:  </span>
                                                                        协同办公项目协同办公项目协同办公项目协同办公项目协同办公项目
                                                                    </div>
                                                                </div>
                                                            case "WorkItem":
                                                                return <div className="project-contant" onClick={()=>toWorkItem(itemWork.id)}>
                                                                    <div className="project-title">{itemWork.title}</div>
                                                                    <div >
                                                                        <span className="project-item-name">事项ID:</span>{itemWork.id}
                                                                    </div>
                                                                    <div>
                                                                        <span className="project-item-name">事项类型:  </span>
                                                                        <span>{itemWork.workType ? itemWork.workType.name : ""}</span>
                                                                    </div>
                                                                </div>
                                                        }
                                                    })()
                                                } 
                                                </div>
                                            </div>
                                    })
                                }
                                </TabPane>
                            })
                        }
                    </Tabs>
                    <Pagination defaultCurrent={1} {...searchCondition} onChange={changePage} />
                </div>
            </Col>
        </Row>
        
    )
}
export default observer(SearchResult);