import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./Page.scss";

/**
 * 分页
 */
const PaginationCommon = props => {

    const { currentPage, changePage, totalPage, total, showRefresh, refresh } = props
    return <>
        {
            totalPage > 1 && <div className="pagination-box">
                <div className="work-aside-page-total">
                    共{total}条
                </div>
                <div className="pagination-box-center">
                    <span
                        className={`${currentPage === 1 ? "pagination-box-ban" : "pagination-box-allow"}`}
                        onClick={() => currentPage === 1 ? null : changePage(currentPage - 1)}
                    >
                        <LeftOutlined />
                    </span>
                    <span className="pagination-box-current">{currentPage}</span>
                    <span> / {totalPage && totalPage}</span>
                    <span
                        className={`${currentPage === totalPage ? "pagination-box-ban" : "pagination-box-allow"}`}
                        onClick={() => currentPage === totalPage ? null : changePage(currentPage + 1)}
                    >
                        <RightOutlined />
                    </span>
                </div>
                {
                    showRefresh && <div className="pagination-box-ref" onClick={() => refresh()} >
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-refresh"></use>
                        </svg>
                    </div>
                }

            </div>
        }
    </>


}

export default PaginationCommon