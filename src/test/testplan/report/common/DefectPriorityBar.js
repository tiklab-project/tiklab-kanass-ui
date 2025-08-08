import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts';


// data数据
// {
//     "total": 4,
//     "progressStatusCount": 1,
//     "doneStatusCount": 1,
//     "todoStatusCount": 2,
//     "lowCount": 1,
//     "mediumCount": 3,
//     "highCount": 0
// }
const DefectPriorityBar = ({ data = {} }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const option = useMemo(() => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params) => {
                const value = params[0].value ?? 0;
                return `${params[0].name}: ${value}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['低优先级', '中优先级', '高优先级'],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: [
            {
                name: '缺陷优先级统计',
                type: 'bar',
                barWidth: '60%',
                data: [
                    { 
                        value: data.lowCount || 0, 
                        itemStyle: { color: '#52c41a' },
                        name: '低优先级'
                    },
                    { 
                        value: data.mediumCount || 0, 
                        itemStyle: { color: '#faad14' },
                        name: '中优先级'
                    },
                    { 
                        value: data.highCount || 0, 
                        itemStyle: { color: '#ff4d4f' },
                        name: '高优先级'
                    }
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => {
                        return params.value || 0;
                    }
                }
            }
        ]
    }), [data]);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.setOption(option);
        }
    }, [option]);

    useEffect(() => {
        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Card 
            title="缺陷优先级统计" 
            style={{ 
                background: '#f7f8f9',
                height: '100%',
                borderRadius: 12,
            }}
            headStyle={{ textAlign: 'left' }}
        >
            <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
        </Card>
    );
};

export default DefectPriorityBar;
