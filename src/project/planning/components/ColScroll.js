/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-18 18:28:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 09:18:04
 */
import React,{useRef,useEffect} from "react";

const ColScroll =(props)=> {
    const {timerOuter,timerCore,ganttOuter,ganttCore} = props;

    /**
     * 纵向滚动轴的拖动
     */
    const sliderChangeY = (value, scrollHeight) => {
        const timerOuterDom = timerOuter.current;
        const timerCoreDom = timerCore.current;

        const ganttOuterDom = ganttOuter.current;
        const ganttCoreDom = ganttCore.current;

        const timerCoreDomHeight = timerCoreDom.offsetHeight;
        const timerOuterDomHeight = timerOuterDom.offsetHeight;

        console.log("timerCoreDomHeight: " + timerCoreDomHeight)
        console.log("timerOuterDomHeight: " + timerOuterDomHeight)

        const ganttOuterDomHeight = ganttOuterDom.offsetHeight;
        const ganttCoreDomHeight = ganttCoreDom.offsetHeight + 30;

        console.log("ganttOuterDomHeight: " + ganttOuterDomHeight)
        console.log("ganttCoreDomHeight: " + ganttCoreDomHeight)

        const maxGanttScroll = ganttCoreDomHeight - ganttOuterDomHeight;
        const timerSilder = (timerCoreDomHeight - timerOuterDomHeight) * value / scrollHeight;
        let ganttSilder = (ganttCoreDomHeight - ganttOuterDomHeight) * value / scrollHeight;// 因为列表底部增加了20px的加载更多div，所以gantt部分也增加20px

        // if (ganttSilder > maxGanttScroll){
        //     ganttSilder = maxGanttScroll;
        //
        //     // ganttCoreDom.style.height = "calc(100% - 85px)"
        // }
        console.log(timerSilder)
        console.log(ganttSilder)
        timerOuterDom.scrollTo({ top: timerSilder })
        ganttOuterDom.scrollTo({ top: ganttSilder })
    }

    const colScrollRef = useRef();
    const boxColScrollRef = useRef()
    const colScroll = () => {
        const scrollSlider = colScrollRef.current;
        const boxScroll = boxColScrollRef.current
        const sliderTop = scrollSlider.offsetTop;
        scrollSlider.onmousedown = (e) => {
            const iEvent = e || event;
            const startY = iEvent.clientY;//当你第一次单击的时候，存储x轴的坐标。

            //判断鼠标是否点在右边还是左边，看图1理解
            document.onmousemove = (ev) => {
                if (ev.clientY < startY) { //左边
                    scrollSlider.style.top = sliderTop + (ev.clientY - startY) + "px";
                    if (scrollSlider.offsetTop <= 0) {
                        scrollSlider.style.top = "0px";
                    }
                    if (scrollSlider.offsetTop > boxScroll.offsetHeight - scrollSlider.offsetHeight) {
                        scrollSlider.style.top = boxScroll.offsetHeight - scrollSlider.offsetHeight + "px";
                    }
                }
                if (ev.clientY > startY) {
                    scrollSlider.style.top = sliderTop + (ev.clientY - startY) + "px";
                    if (scrollSlider.offsetTop >= boxScroll.offsetHeight - scrollSlider.offsetHeight) {
                        scrollSlider.style.top = boxScroll.offsetHeight - scrollSlider.offsetHeight + "px";
                    }
                    if (scrollSlider.offsetTop < 0) {
                        scrollSlider.style.top = "0px";
                    }
                }
                sliderChangeY(scrollSlider.offsetTop, boxScroll.offsetHeight - scrollSlider.offsetHeight)
            }
            document.onmouseup = function () {
                document.onmousedown = null;
                document.onmousemove = null;
            };
            return false;
        }
    }

    return(
        <div className="scroll-gantt-col">
            <div className="scroll-box" ref={boxColScrollRef}>
                <div className="scroll-slider"
                     onMouseMove={colScroll}
                     ref={colScrollRef}
                ></div>
            </div>
        </div>
    )
}

export default ColScroll;