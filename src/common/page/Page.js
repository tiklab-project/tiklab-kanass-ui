import React from "react";
import {LeftOutlined,RightOutlined} from "@ant-design/icons";
import "./page.scss";

/**
 * 分页
 */
const PaginationCommon = props =>{

    const {currentPage,changePage,totalPage} = props

    return <div className="pagination-box">
                <span
                    className={`${currentPage===1?"pagination-box-ban":"pagination-box-allow"}`}
                    onClick={()=>currentPage===1? null :changePage(currentPage - 1)}
                >
                    <LeftOutlined/>
                </span>
                <span className="pagination-box-current">{currentPage}</span>
                <span> / {totalPage && totalPage}</span>
                <span
                    className={`${currentPage===totalPage?"pagination-box-ban":"pagination-box-allow"}`}
                    onClick={()=>currentPage===totalPage?null:changePage(currentPage + 1)}
                >
                    <RightOutlined/>
                </span>
         </div>
}

export default PaginationCommon