import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, {useEffect, useRef} from "react";

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

/**
 * 性能测试数据展示
 */
const PerformInstanceCommon = (props) =>{
    const {option,data} = props;

    const echartsRef = useRef(null);


    useEffect(() => {
        // 创建一个echarts实例，返回echarts实例。不能在单个容器中创建多个echarts实例
        let myChart = echarts.init(echartsRef.current);

        // 设置图表实例的配置项和数据
        myChart.setOption(option)

        // 组件卸载
        return () => {
            // myChart.dispose() 销毁实例。实例销毁后无法再被使用
            myChart.dispose()
        }
    },[data])



    return( <div style={{width: "100%", height: "100%"}}  ref={echartsRef} />)
}

export default PerformInstanceCommon;