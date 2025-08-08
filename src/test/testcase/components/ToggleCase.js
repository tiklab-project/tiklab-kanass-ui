import React, {useEffect, useRef, useState} from "react";
import {showCaseTypeInList, showCaseTypeView} from "../../../common/caseCommon/CaseCommonFn";
import {inject, observer} from "mobx-react";
import {useHistory} from "react-router";
import {Input, Spin, Tooltip} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import {switchCaseTypeFn} from "./testCaseTableFn";
import IconCommon from "../../../common/caseCommon/IconCommon";
import {debounce} from "../../../common/caseCommon/CaseCommonFn";

const ToggleCase = (props) =>{
    const {testcaseStore,caseId} = props
    const [visible, setVisible] = useState(false);
    const {findTestCaseList}=testcaseStore;

    const [caseList, setCaseList] = useState([]);
    const [totalPage, setTotalPage] = useState();
    const [pageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    let projectId = localStorage.getItem("projectId")
    let history = useHistory()
    const caseToggleRef = useRef(null);
    const [spinning, setSpinning] = useState(true);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // 检查点击的目标是否在下拉框内
            if (caseToggleRef.current && !caseToggleRef.current.contains(event.target)) {
                setVisible(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []); // 空数组表示仅在组件挂载和卸载时执行


    const toggle = () =>{
        setVisible(!visible)
        findPage()
        setSpinning(false)
    }

    const findPage = (params) =>{
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:1
            },
            projectId:projectId,
            ...params
        }
        findTestCaseList(param).then((res)=>{
            setCaseList(res.dataList)
            setTotalPage(res.totalPage);
        })
    }


    // 分页
    const onTableChange = (current) => {
        setCurrentPage(current)

        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:current
            },
        }

        findPage(param)
    }

    //搜索
    const onSearch = (e) =>{
        setCurrentPage(1)
        let param = {name: e.target.value}

        findPage(param)
    }


    return(
        <div className={"case-toggle"} ref={caseToggleRef}>
            <Tooltip placement="top" title={"切换用例"}>
            <div
                onClick={toggle}
                style={{
                    cursor: "pointer",
                    width: "20px",
                    height: "23px",
                    color: "#a3a3a3",
                    fontSize: "15px"
                }}
            >
                <CaretDownOutlined />
            </div>
            </Tooltip>

            <div className={`case-toggle-title ${visible === false ? 'testhubo-hide' : 'testhubo-show'}`}>
                <Spin spinning={spinning}>
                    <div style={{minHeight:"200px"}}>
                        <div className={"header-title"} style={{padding:"8px 5px 10px"}} >切换用例</div>
                        <Input
                            placeholder={`搜索用例名`}
                            onPressEnter={onSearch}
                            style={{
                                margin:"0 0 10px",
                                borderColor: "#e8e8e8",
                                height: "36px",
                            }}
                            prefix={<IconCommon
                                icon={"sousuo"}
                                className={"icon-s"}
                            />}
                            onChange={debounce(onSearch,500) }
                            allowClear
                        />

                        {
                            caseList&&caseList.map((item,index)=>{
                                return(
                                    <div
                                        key={item.id}
                                        className={` display-flex-between  toggle-case-item  ${caseId=== item.id ? 'toggle-case-item-selected' : ''}`}
                                        onClick={()=> {
                                            switchCaseTypeFn(item, history)
                                            setVisible(!visible)
                                        }}
                                    >
                                        <div className={"display-flex-gap toggle-case-item-title"}>
                                            <div>{showCaseTypeView(item.caseType)}</div>
                                            <span className={"text-ellipsis"}>{item.name}</span>
                                        </div>
                                        {
                                            showCaseTypeInList(item.caseType)
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>


                </Spin>
            </div>
        </div>
    )
}

export default inject("testcaseStore")(observer(ToggleCase));