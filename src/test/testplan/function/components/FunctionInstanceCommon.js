import React, {useEffect, useState} from "react";
import {Card, Col, Descriptions, Row, Tag} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined} from "@ant-design/icons";
import * as echarts from "echarts";
import "./FunctionInstanceStyle.scss"

const FunctionInstanceCommon = (props) => {
    const {planInfo,reportInfo} = props;
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        // 等待DOM加载完成
        const initChart = () => {
            const chartDom = document.getElementById('testResultPieChart');
            if (chartDom) {
                // 如果已存在实例，先销毁
                if (chartInstance) {
                    chartInstance.dispose();
                }

                // 创建新实例
                const chart = echarts.init(chartDom);
                setChartInstance(chart);

                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 'bottom',
                        data: ['成功', '失败', '未执行']
                    },
                    graphic: {
                        type: 'text',
                        left: 'center',
                        top: 'middle',
                        style: {
                            text: [
                                `{a|${reportInfo?.successRate||0}%}`,
                                '{b|成功}'
                            ].join('\n'),
                            textAlign: 'center',
                            rich: {
                                a: {
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    fontFamily: '黑体, sans-serif',
                                    color: '#79da1c',
                                    lineHeight: 36
                                },
                                b: {
                                    fontSize: 14,
                                    fontWeight: 'normal',
                                    fontFamily: 'sans-serif',
                                    color: '#666',
                                    lineHeight: 24
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: '测试结果',
                            type: 'pie',
                            radius: ['45%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: true,
                                position: 'inside',
                                formatter: '{d}%'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            },
                            data: [
                                {
                                    value: reportInfo?.successCount||0,
                                    name: '成功',
                                    itemStyle: { color: '#79da1c' }
                                },
                                {
                                    value: reportInfo?.failCount||0,
                                    name: '失败',
                                    itemStyle: { color: '#e8515e' }
                                },
                                {
                                    value: reportInfo?.notExecutedCount||0,
                                    name: '未执行',
                                    itemStyle: { color: '#ececec' }
                                }
                            ]
                        }
                    ]
                };

                // 设置图表选项
                chart.setOption(option);

                // 添加窗口大小改变时的自适应
                window.addEventListener('resize', () => {
                    chart.resize();
                });
            }
        };

        // 初始化图表
        initChart();

        // 清理函数
        return () => {
            if (chartInstance) {
                chartInstance.dispose();
            }
            window.removeEventListener('resize', () => {
                chartInstance?.resize();
            });
        };
    }, [reportInfo]);

    const getStatusTag = (status) => {
        const statusConfig = {
            0: {
                color: 'default',
                icon: <ClockCircleOutlined />,
                text: '未执行'
            },
            1: {
                color: 'processing',
                icon: <ClockCircleOutlined />,
                text: '进行中'
            },
            2: {
                color: 'success',
                icon: <CheckCircleOutlined />,
                text: '已完成'
            }
        };
        const config = statusConfig[status] || statusConfig[0];
        return <Tag icon={config.icon} color={config.color}>{config.text}</Tag>;
    };


    return(
        <Row gutter={[16, 16]}>
            {/* 计划信息 */}
            <Col span={24}>
                <Card title="计划信息">
                    <Descriptions column={2}>
                        <Descriptions.Item label="计划名称">{planInfo?.name}</Descriptions.Item>
                        <Descriptions.Item label="计划编号">{planInfo?.id}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{planInfo?.createTime}</Descriptions.Item>
                        <div>
                            当前状态：{getStatusTag(planInfo?.state)}
                        </div>
                        <Descriptions.Item label="开始时间">{planInfo?.startTime}</Descriptions.Item>
                        <Descriptions.Item label="预计结束">{planInfo?.endTime}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>

            {/* 测试结果统计图表 */}
            <Col span={12}>
                <Card title="测试结果统计">
                    <div
                        id="testResultPieChart"
                        style={{
                            height: '400px',
                            width: '100%',
                            minHeight: '300px'
                        }}
                    ></div>
                </Card>
            </Col>

            {/* 测试结果详情 */}
            <Col span={12}>
                <Card title="测试结果详情">
                    <div style={{
                        padding: '20px',
                        height: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around'
                    }}>

                        {/* 总数 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 0'
                        }}>
                            <div style={{
                                width: '60px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <FileTextOutlined style={{
                                    fontSize: '32px',
                                    color: '#1890ff'
                                }}/>
                            </div>
                            <div style={{
                                marginLeft: '20px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>用例总数</span>
                                <span style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#1890ff',
                                    marginTop: '4px'
                                }}>{reportInfo?.total||0}</span>
                            </div>
                        </div>


                        {/* 成功数据 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 0'
                        }}>
                            <div style={{
                                width: '60px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <CheckCircleOutlined style={{
                                    fontSize: '32px',
                                    color: '#79da1c'
                                }}/>
                            </div>
                            <div style={{
                                marginLeft: '20px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>测试成功数</span>
                                <span style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#79da1c',
                                    marginTop: '4px'
                                }}>{reportInfo?.successCount||0}</span>
                            </div>
                        </div>

                        {/* 失败数据 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 0'
                        }}>
                            <div style={{
                                width: '60px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <CloseCircleOutlined style={{
                                    fontSize: '32px',
                                    color: '#e8515e'
                                }}/>
                            </div>
                            <div style={{
                                marginLeft: '20px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>测试失败数</span>
                                <span style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#e8515e',
                                    marginTop: '4px'
                                }}>{reportInfo?.failCount||0}</span>
                            </div>
                        </div>

                        {/* 未执行数据 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 0'
                        }}>
                            <div style={{
                                width: '60px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <ClockCircleOutlined style={{
                                    fontSize: '32px',
                                    color: '#999999'
                                }}/>
                            </div>
                            <div style={{
                                marginLeft: '20px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>未执行数</span>
                                <span style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#999999',
                                    marginTop: '4px'
                                }}>{reportInfo?.notExecutedCount||0}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default FunctionInstanceCommon