import React from "react";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import "./WorkDetailCrumb.scss";
import ImgComponent from "../../common/imgComponent/ImgComponent";

const WorkDetailCrumb = (props) => {
    const { detailCrumbArray, workShowType, setDetailCrumbArray, setWorkId, setShowFlow, setIsModalVisible, projectId } = props;
    const isDetail = () => {
        let isView = false;
        if (props.match.path === "/projectDetail/:id/work/:workId" || props.match.path === "/:id/versiondetail/:version/work/:workId"
            || props.match.path === "/:id/sprintdetail/:sprint/work/:workId") {
            isView = true;
        }
        return isView;
    }

    const goWorkList = () => {
        if (props.match.path === "/projectDetail/:id/work/:workId") {
            props.history.push(`/projectDetail/${projectId}/workTable`)
        }
        if (props.match.path === "/:id/versiondetail/:version/work/:workId") {
            props.history.push(`/${projectId}/versiondetail/${versionId}/workTable`)
        }
        if (props.match.path === "/:id/sprintdetail/:sprint/work/:workId") {
            props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`)
        }

    }

    const closeDrawer = () => {
        setIsModalVisible(false)
        setWorkId(0)
    }

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