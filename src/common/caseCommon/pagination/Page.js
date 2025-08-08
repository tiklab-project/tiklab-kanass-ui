import React from "react";
import {LeftOutlined, RedoOutlined, RightOutlined} from "@ant-design/icons";
import "./page.scss";
import {Tooltip} from "antd";

/**
 * 分页
 */
const PaginationCommon = props =>{

    const {currentPage,changePage,totalPage,totalRecord,findPage} = props

    return(
        <>
            {
                totalPage
                    ? <div className="pagination-box">
                        {
                            totalRecord && <div className={"pagination-total-record"}>共{totalRecord}条</div>
                        }
                        <span
                            className={`${currentPage === 1 ? "pagination-box-ban" : "pagination-box-allow"}`}
                            onClick={() => currentPage === 1 ? null : changePage(currentPage - 1)}
                        >
                            <LeftOutlined/>
                        </span>
                        <span className="pagination-box-current">{currentPage}</span><span> / {totalPage ? totalPage : 1}</span>
                        <span
                            className={`${currentPage === totalPage ? "pagination-box-ban" : "pagination-box-allow"}`}
                            onClick={() => currentPage === totalPage ? null : changePage(currentPage + 1)}
                        >
                            <RightOutlined/>
                        </span>
                        {
                            findPage && <RedoOutlined style={{margin: "0 0 0 40px"}} onClick={() => findPage()}/>
                        }
                    </div>
                    :null
            }
        </>

    )
}

export default PaginationCommon