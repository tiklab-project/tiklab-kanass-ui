import React, { Children } from "react";
import "./DyncmicTimeAxis.scss";
import DyncmicItem from "../../../common/overviewComponent/DynamicItem"
const DyncmicTimeAxis = (props) => {
    const { logList } = props;
    const data = [
        {
            date: "07.27",
            children: [
                {
                    time: "14:59",
                    name: "管理员添加了事项",
                    desc: "项目中涉及到删除的都是在点击后直接删除，没有提示删除信息"
                },
                {
                    time: "14:59",
                    name: "darth更新了史诗#52-6的状态",
                    desc: "处理中"
                },
                {
                    time: "14:59",
                    name: "管理员添加了事项",
                    desc: "项目中涉及到删除的都是在点击后直接删除，没有提示删除信息"
                },
            ]
        },
        {
            date: "07.26",
            children: [
                {
                    time: "14:59",
                    name: "darth更新了史诗#52-6的状态",
                    desc: "处理中"
                },
                {
                    time: "14:59",
                    name: "管理员添加了事项",
                    desc: "项目中涉及到删除的都是在点击后直接删除，没有提示删除信息"
                },
                {
                    time: "14:59",
                    name: "darth更新了史诗#52-6的状态",
                    desc: "处理中"
                }
            ]
        }
    ]

    const getIconName = (type) => {
        let name = ""
        switch (type) {
            case "KANASS_LOGTYPE_WORKUPDATEMASTER":
                name = "dynamic-update";
                break;
            case "KANASS_LOGTYPE_WORKITEMADD":
                name = "dynamic-add";
                break;
            case "KANASS_LOGTYPE_PROJECTADD":
                name = "dynamic-add";
                break;
            case "KANASS_LOGTYPE_WORKUPDATESTATUS":
                name = "dynamic-update";
                break;

        }
        return name;
    }

    return <div className="dyncmic-timeaxis">
        {/* <div className="dyncmic-timeaxis-title">最近动态</div> */}
        <div className="dyncmic-timeaxis-title">
            <div className="name">最新动态</div>
            <div className="more">
                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-rightjump"></use>
                </svg>
            </div>
        </div>
        <div className="dyncmic-timeaxis-content">
            {
                logList.map((item, index) => {
                    return <div key={item.date} className="dyncmic-timeaxis-box">
                        <div className="dyncmic-timeaxis-date">
                            <div className="dyncmic-timeaxis-date-content">
                                {item.date}
                            </div>
                        </div>
                        {
                            item.children.map((dyncmicItem, dyncmicIndex) => {
                                return <div
                                    className={`dyncmic-timeaxis-item ${index === logList.length - 1 && dyncmicIndex === item.children.length - 1 ? "" : "dyncmic-showtimeaxis-item"}`}>

                                    <div className="dyncmic-timeaxis-item-time">{dyncmicItem.createTime.slice(10, 16)}</div>
                                    <div className="dyncmic-timeaxis-item-name">
                                        <div className="dynamic-user-icon">A</div>
                                    </div>
                                    {/* <div 
                                        className={`dyncmic-timeaxis-item-content `}>
                                        <div className="dyncmic-timeaxis-item-name">{dyncmicItem.name}</div>
                                        <div className="dyncmic-timeaxis-item-desc">{dyncmicItem.desc}</div>
                                    </div> */}
                                    <DyncmicItem content={dyncmicItem.data} type={dyncmicItem.actionType.id} key={dyncmicItem.id} />
                                    <svg className="img-25" aria-hidden="true">
                                        <use xlinkHref={`#icon-${getIconName(dyncmicItem.actionType.id)}`}></use>
                                    </svg>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>

    </div>
}

export default DyncmicTimeAxis;