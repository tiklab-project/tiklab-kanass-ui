/*
 * @Descripttion: 竖向滚动轴
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-18 18:28:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 09:18:04
 */
import React, { useEffect, useRef } from "react";

const CoLScroll = (props) => {
    const { timerOuter, timerCore, ganttOuter, ganttCore } = props;
    console.log("存在")
    // 滑块
    const colScrollRef = useRef();
    // 滚轴
    const boxColScrollRef = useRef()

    useEffect(() => {
        if (timerCore.current.offsetHeight > 0) {
            const timerHeight = timerCore.current.offsetHeight;
            const boxHeight = boxColScrollRef.current.offsetHeight;
            const timerOuterHeight = timerOuter.current.offsetHeight;
            const tranlate = timerHeight / boxHeight;
            const colScrollHeight = Math.floor(timerOuterHeight / tranlate);
            colScrollRef.current.style.height = colScrollHeight;
            console.log(colScrollHeight)
        }

        
    }, [timerCore.current.offsetHeight])
    useEffect(() => {
        const handleWheel = (e) => {
            const scrollSlider = colScrollRef.current;
            const boxScroll = boxColScrollRef.current
            const sliderTop = scrollSlider?.offsetTop;

            // 向下移动
            if (e.deltaY > 0) {
                scrollSlider.style.top = sliderTop + e.deltaY + "px";
                if (scrollSlider.offsetTop >= boxScroll.offsetHeight - scrollSlider.offsetHeight) {
                    scrollSlider.style.top = boxScroll.offsetHeight - scrollSlider.offsetHeight + "px";
                }
                if (scrollSlider.offsetTop < 0) {
                    scrollSlider.style.top = "0px";
                }
            }

            if (e.deltaY < 0) {
                scrollSlider.style.top = sliderTop + e.deltaY + "px";
                if (scrollSlider.offsetTop <= 0) {
                    scrollSlider.style.top = "0px";
                }
                if (scrollSlider.offsetTop > boxScroll.offsetHeight - scrollSlider.offsetHeight) {
                    scrollSlider.style.top = boxScroll.offsetHeight - scrollSlider.offsetHeight + "px";
                }
            }

            sliderChangeY(scrollSlider.offsetTop, boxScroll.offsetHeight - scrollSlider.offsetHeight);
        }

        window.addEventListener('wheel', handleWheel)
        return () => {
            window.removeEventListener('wheel', handleWheel)
        }
    }, [colScrollRef.current])
    /**
     * 纵向滚动轴的拖动
     */
    const sliderChangeY = (value, scrollHeight) => {
        const timerOuterDom = timerOuter.current;
        const timerCoreDom = timerCore.current;

        const ganttOuterDom = ganttOuter.current;
        const ganttCoreDom = ganttCore.current;

        const timerCoreDomWidth = timerCoreDom.offsetHeight;
        const timerOuterDomWidth = timerOuterDom.offsetHeight;

        const ganttOuterDomWidth = ganttOuterDom.offsetHeight;
        const ganttCoreDomWidth = ganttCoreDom.offsetHeight;


        const timerSilder = (timerCoreDomWidth - timerOuterDomWidth) * value / scrollHeight;
        const ganttSilder = (ganttCoreDomWidth - ganttOuterDomWidth) * value / scrollHeight;

        timerOuterDom.scrollTo({ top: timerSilder })
        ganttOuterDom.scrollTo({ top: ganttSilder })
    }

    // 移动滚轴
    const colScroll = () => {
        const scrollSlider = colScrollRef.current;
        const boxScroll = boxColScrollRef.current
        const sliderTop = scrollSlider.offsetTop;
        scrollSlider.onmousedown = (e) => {
            const iEvent = e || event;
            //当你第一次单击的时候，存储x轴的坐标。
            const startY = iEvent.clientY;

            //判断鼠标是否点在右边还是左边
            document.onmousemove = (ev) => {
                // 向上移动
                if (ev.clientY < startY) {
                    scrollSlider.style.top = sliderTop + (ev.clientY - startY) + "px";
                    if (scrollSlider.offsetTop <= 0) {
                        scrollSlider.style.top = "0px";
                    }
                    if (scrollSlider.offsetTop > boxScroll.offsetHeight - scrollSlider.offsetHeight) {
                        scrollSlider.style.top = boxScroll.offsetHeight - scrollSlider.offsetHeight + "px";
                    }
                }
                // 向下移动
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
            // 取消监听事件
            document.onmouseup = function () {
                document.onmousedown = null;
                document.onmousemove = null;
            };
            return false;
        }
    }

    return (
        <div className="scroll-col">
            <div className="scroll-box" ref={boxColScrollRef}>
                <div className="scroll-slider"
                    onMouseMove={colScroll}
                    ref={colScrollRef}
                ></div>
            </div>
        </div>
    )
}

export default CoLScroll;