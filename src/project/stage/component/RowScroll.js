/*
 * @Descripttion: 自定义横向滚动轴
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-18 14:45:06
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 16:24:38
 */
import React,{useRef,useEffect} from "react";


const RowScroll =(props)=> {
    const {timerOuter,timerCore,ganttOuter,ganttCore,ganttWidth,scrollLeft} = props;
    // 滑块
    const rowScrollRef = useRef();
    // 滚动轴
    const boxRowScrollRef = useRef();

    useEffect(() => {
        // 滑块dom
        const scrollSlider = rowScrollRef.current;
        // 滚动轴dom
        const boxScroll = boxRowScrollRef.current;
        // 滑块起始位置
        const left = scrollLeft / (ganttWidth - 1000) * (boxScroll.offsetWidth - scrollSlider.offsetWidth);
        scrollSlider.style.left = left + "px";
        return;
    }, [scrollLeft])
    
    /**
     * 横向滚动轴的拖动
     */
    const sliderChangeX = (value,srollWidth)=> {
        // console.log(value)
        const timerOuterDom = timerOuter.current;
        const timerCoreDom = timerCore.current;
        
        const ganttOuterDom = ganttOuter.current;
        const ganttCoreDom = ganttCore.current;

        const timerCoreDomWidth = timerCoreDom.offsetWidth;
        const timerOuterDomWidth = timerOuterDom.offsetWidth;

        const ganttOuterDomWidth = ganttOuterDom.offsetWidth;
        const ganttCoreDomWidth = ganttCoreDom.offsetWidth;

        const timerSilder = (timerCoreDomWidth - timerOuterDomWidth) * value / srollWidth;
        const ganttSilder = (ganttCoreDomWidth - ganttOuterDomWidth) * value / srollWidth;
        
        timerOuterDom.scrollTo({left:timerSilder})
        ganttOuterDom.scrollTo({left:ganttSilder})
    }
    
    /**
     * 滑块移动
     */
    const rowScroll = () => {
        const scrollSlider = rowScrollRef.current;
        const boxScroll = boxRowScrollRef.current
        const sliderLeft = scrollSlider.offsetLeft;
        scrollSlider.onmousedown = (e) => {
            const iEvent = e || event;
            const startX=iEvent.clientX;//当你第一次单击的时候，存储x轴的坐标。
            
            //判断鼠标是否点在右边还是左边
            document.onmousemove=(ev) => {
                //向左移动
                if(ev.clientX < startX){ 
                    scrollSlider.style.left = sliderLeft+(ev.clientX-startX)+"px";
                    if(scrollSlider.offsetLeft <=0){
                        scrollSlider.style.left = "0px";
                    }
                    if(scrollSlider.offsetLeft > boxScroll.offsetWidth - scrollSlider.offsetWidth ){
                        scrollSlider.style.left = boxScroll.offsetWidth - scrollSlider.offsetWidth + "px";
                    }
                }
                // 向右移动
                if(ev.clientX > startX){
                    scrollSlider.style.left = sliderLeft+(ev.clientX-startX)+"px";
                    if(scrollSlider.offsetLeft >= boxScroll.offsetWidth - scrollSlider.offsetWidth ){
                        scrollSlider.style.left = boxScroll.offsetWidth - scrollSlider.offsetWidth + "px";
                    }
                    if(scrollSlider.offsetLeft < 0){
                        scrollSlider.style.left = "0px";
                    }
                }
                sliderChangeX(scrollSlider.offsetLeft ,boxScroll.offsetWidth - scrollSlider.offsetWidth)
            }
            document.onmouseup=function(){
                document.onmousedown=null;
                document.onmousemove=null;
            };
            return false;
        }
    }

    return (
        <div className="scroll-row">
            <div style={{width: "150px"}}></div>
            <div className="scroll-box" ref={boxRowScrollRef}>
                <div className="scroll-slider" 
                    onMouseMove={rowScroll}
                    ref={rowScrollRef}
                ></div>
            </div>
        </div>
    )
}

export default RowScroll;
