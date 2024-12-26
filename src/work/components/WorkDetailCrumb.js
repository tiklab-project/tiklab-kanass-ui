/*
 * @Descripttion: 事项详情面包屑
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:23
 */
import React from "react";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import "./WorkDetailCrumb.scss";
import ImgComponent from "../../common/imgComponent/ImgComponent";

const WorkDetailCrumb = (props) => {
    const { detailCrumbArray, workShowType, setDetailCrumbArray, setWorkId, setShowFlow, setIsModalVisible, projectId,versionId, sprintId
     } = props;

    const isDetail = () => {
        let isView = false;
        if (props.match.path === "/project/:id/work/:workId" || props.match.path === "/:id/version/:version/work/:workId"
            || props.match.path === "/:id/sprint/:sprint/work/:workId") {
            isView = true;
        }
        return isView;
    }

    /**
     * 返回事项列表
     */
    const goWorkList = () => {
        if (props.match.path === "/project/:id/work/:workId") {
            props.history.push(`/project/${projectId}/workitem`)
        }
        if (props.match.path === "/:id/version/:version/work/:workId") {
            props.history.push(`/${projectId}/version/${versionId}/workitem`)
        }
        if (props.match.path === "/:id/sprint/:sprint/work/:workId") {
            props.history.push(`/${projectId}/sprint/${sprintId}/workitem`)
        }

    }

    /**
     * 关闭事项详情抽屉
     */
    const closeDrawer = () => {
        setIsModalVisible(false)
        setWorkId(0)
    }

    /**
     * 点击面包屑，返回上级事项
     */
    const goCrumWork = (index, id) => {
        const lastCrum = detailCrumbArray[detailCrumbArray.length - 1];
        if (lastCrum.type === "flow") {
            setShowFlow(false)
        } else {
            setWorkId(id)
        }

        const array = detailCrumbArray.slice(0, index + 1)
        setSessionStorage("detailCrumbArray", array)
        setDetailCrumbArray(getSessionStorage("detailCrumbArray"))
    }


    return (
        <>
            {
                detailCrumbArray?.length > 0 &&
                <div className="work-detail-crumb-col">
                    <div className="work-detail-crumb">
                        {
                            isDetail() &&
                            <div className="work-detail-crumb-item" onClick={() => goWorkList()}>
                                <svg className="svg-icon work-detail-crumb-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-pageLeft"></use>
                                </svg>
                                事项 &nbsp;/ &nbsp;</div>
                        }
                        {
                            detailCrumbArray?.length > 0 && detailCrumbArray.map((item, index) => {
                                let html;
                                if (index === 0) {
                                    html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                        <ImgComponent
                                            src={item.iconUrl}
                                            alt=""
                                            className="img-icon-right"
                                        />

                                        <span className="work-detail-crumb-text">{item.code}</span>
                                    </div>
                                } else {
                                    html = <div className="work-detail-crumb-item" key={item.id} onClick={() => goCrumWork(index, item.id)}>
                                        <span style={{ padding: "0 10px" }}>/</span>
                                        <ImgComponent
                                            src={item.iconUrl}
                                            alt=""
                                            className="img-icon-right"
                                        />
                                        <span className="work-detail-crumb-text">{item.code}</span>
                                    </div>
                                }
                                return html

                            })
                        }
                    </div>
                    {
                        workShowType !== "list" && <div className="work-detail-close" onClick={() => closeDrawer()}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                    }
                </div>

            }
        </>
    )
}
export default WorkDetailCrumb;