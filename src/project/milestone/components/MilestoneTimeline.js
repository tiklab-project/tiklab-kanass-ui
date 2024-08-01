import React from "react";
import "./MilestoneTimeline.scss"
const MilestoneTimeline = (props) => {
    const { milestonelist } = props;
    const colors = ["#7CB342", "#FFB202", "#00ACC2", "#546E79", "#FF7042"]
    return <div className="milestone-timeline">
        {
            milestonelist && milestonelist.map((item, index) => {

                if (index % 2 === 1) {
                    return (
                        <div className="milestone-timeline-item odd" key = {item.id}>
                            <div className="timeline-item-svg timeline-item-top">
                                <svg className="milestone-icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-milestone${index % 5 + 1}`}></use>
                                </svg>
                            </div>
                            <div className={`timeline-item-line ${index === milestonelist.length - 1 ? "timeline-item-last" : ""}`} style={{ backgroundColor: colors[index % 5] }}>
                                <div className="timeline-item-triangle" style={{ borderTop: `12px solid ${colors[index % 5]}` }}>

                                </div>
                            </div>
                            <div className="timeline-item-bottom">
                                <div className="timeline-item-date">{item.milestoneTime}</div>
                                <div className="timeline-item-name">{item.name}</div>
                            </div>
                        </div>
                    )
                }
                if (index % 2 === 0) {
                    return (
                        <div className="milestone-timeline-item even" key = {item.id}>
                            <div className="timeline-item-top">
                                <div className="timeline-item-date">{item.milestoneTime}</div>
                                <div className="timeline-item-name">{item.name}</div>
                            </div>

                            <div className={`timeline-item-line ${index === 0 ? "timeline-item-first" : ""} ${index === milestonelist.length - 1 ? "timeline-item-last" : ""}`} style={{ backgroundColor: colors[index % 5] }}>
                                <div className="timeline-item-triangle" style={{ borderBottom: `12px solid ${colors[index % 5]}` }}>

                                </div>
                            </div>
                            <div className="timeline-item-svg timeline-item-bottom">
                                <svg className="milestone-icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-milestone${index % 5 + 1}`}></use>
                                </svg>
                            </div>
                        </div>
                    )
                }
            })
        }



        {/* </div> */}

    </div>
}
export default MilestoneTimeline;