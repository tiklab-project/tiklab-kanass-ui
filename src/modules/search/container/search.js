import React,{Fragment, useEffect, useState} from "react";
import { SearchOutlined } from '@ant-design/icons';
import "../components/search.scss"
import project from "../../../assets/images/project.png"

import { observer, inject } from "mobx-react";

const Search = (props) => {
    const {searchStore,workStore } = props;
    const {getSearch,searchList,getSearchSore,setKeyWord} = searchStore;
    const {setWorkId} = workStore;
    useEffect(() => {
        console.log(props)
        return
    }, [])

    // 输入中
    const changeValue = (value) =>{
        console.log(searchList,show)
        setShow("show")
        getSearch(value.target.value)
        
    }


    const [show,setShow] = useState("hidden")
    const toProject = async(id) => {
        localStorage.setItem("projectId",id)
        await props.history.push("/index/prodetail/survey")
        setShow("hidden")

    }
    const toWorkItem = async(id,pid) => {
        setWorkId(id)
        localStorage.setItem("projectId",pid)
        await props.history.push("/index/prodetail/work")
        setShow("hidden")
        // location.reload();

    }

    const submit = (value) => {
        if(value.keyCode === 13) {
            getSearchSore(value.target.value)
            setKeyWord(value.target.value)
            props.history.push("/index/searchResult")
            setShow("hidden")
        }
    }
    const hiddenBox = ()=> {
        setShow("hidden")
    }
    const showBox = ()=> {
        setShow("show")
    }
    return (
        <Fragment>
            <div className="search"
                tabIndex="-1"
                onFocus={showBox}
                onBlur={hiddenBox}
            >
                <div className="search-box" >
                    <SearchOutlined />
                    <input 
                        className="search-input" 
                        onChange={changeValue} 
                        onKeyDown={submit}
                    />
                </div>
                <div 
                    className={`show-box ${(searchList.length !== 0 && show === "show") ?  null : "hidden-box" }`} 
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
                                                                                        <img src={project} alt=""/>
                                                                                        <span>{toItem.projectName}</span>
                                                                                    </div>;
                                                                        case "WorkItem":
                                                                            return <div className="item-one" onClick={()=>toWorkItem(toItem.id, JSON.parse(toItem.project).id)}>
                                                                                        <img src={project} alt=""/>
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
        </Fragment>
    )
}
export default inject("searchStore","workStore")(observer(Search));