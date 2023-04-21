/*
 * @Descripttion: 路线图表格页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { observer, inject } from "mobx-react";
import { Graph } from '@antv/x6';
import "./LineMap.scss";
import "./Epic.scss"
import { withRouter } from "react-router";
import epicDate from "./epic.json"
const EpicLineMap = (props) => {
    // 获取当前年月日
    useEffect(() => {
        initGraph()
    }, [])

    const initGraph = () => {
        Graph.registerNode(
            'lane',
            {
                inherit: 'rect',
                markup: [
                    {
                        tagName: 'rect',
                        selector: 'body',
                    },
                    {
                        tagName: 'rect',
                        selector: 'name-rect',
                    },
                    {
                        tagName: 'text',
                        selector: 'name-text',
                    },
                ],
                attrs: {
                    body: {
                        fill: '#FFF',
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                    },
                    'name-rect': {
                        width: 200,
                        height: 30,
                        fill: '#5F95FF',
                        stroke: '#fff',
                        strokeWidth: 1,
                        x: -1,
                    },
                    'name-text': {
                        ref: 'name-rect',
                        refY: 0.5,
                        refX: 0.5,
                        textAnchor: 'middle',
                        fontWeight: 'bold',
                        fill: '#fff',
                        fontSize: 12,
                    },
                },
            },
            true,
        )

        Graph.registerNode(
            'lane-rect',
            {
                inherit: 'rect',
                width: 100,
                height: 60,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
            },
            true,
        )

        Graph.registerNode(
            'lane-polygon',
            {
                inherit: 'polygon',
                width: 80,
                height: 80,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                        refPoints: '0,10 10,0 20,10 10,20',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
            },
            true,
        )

        Graph.registerEdge(
            'lane-edge',
            {
                inherit: 'edge',
                attrs: {
                    line: {
                        stroke: '#A2B1C3',
                        strokeWidth: 2,
                    },
                },
                label: {
                    attrs: {
                        label: {
                            fill: '#A2B1C3',
                            fontSize: 12,
                        },
                    },
                },
            },
            true,
        )

        const graph = new Graph({
            container: document.getElementById('container'),
            connecting: {
                router: 'orth',
            },
            translating: {
                restrict(cellView) {
                    const cell = cellView.cell
                    // const parentId = cell.prop('parent')
                    // if (parentId) {
                    //     const parentNode = graph.getCellById(parentId)
                    //     if (parentNode) {
                    //         return parentNode.getBBox()

                    //     }
                    // }
                    if (cell.isNode()) {
                        const parent = cell.getParent()
                        if (parent) {
                            return parent.getBBox()
                        }
                    }

                    return null
                },
            },
        })


        const cells = []
        epicDate.forEach((item) => {
            if (item.shape === 'lane-edge') {
                cells.push(graph.createEdge(item))
            } else {
                cells.push(graph.createNode(item))
            }
        })
        graph.resetCells(cells)
        graph.zoomToFit({ padding: 10, maxScale: 1 })
    }


    return (
        <div className="epic-linemap" id="container">

        </div>
    )
}

export default withRouter(inject(
    "workStore"
)(observer(EpicLineMap))); 