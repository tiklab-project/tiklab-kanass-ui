import React, {useEffect, useState} from "react";
import {message, Space, Table} from "antd";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import TestRepositoryAdd from "../../test/components/TestRepositoryAdd";
import TestRepositoryStore from "../../test/store/TestRepositoryStore";
import {observer,Provider} from "mobx-react";
import {applyJump} from "tiklab-core-ui";

const BindTestHubo = (props) => {
    const {activeKey,setTestAddvisible,testAddvisible} = props
    const store = {
        testRepositoryStore: TestRepositoryStore
    }
    const { deleteProjectTestRepositoryByCondition,
        findProjectTestRepositoryList, findSystemUrl,
    } = TestRepositoryStore;

    const projectId = props.match.params.id;
    const [projectTestList, setProjectTestList] = useState()
    // 列表的列
    const columns = [
        {
            title: "项目名称",
            dataIndex: "testRepositoryName",
            key: "name",
            align: "left",

            render: (text, record) => <div className="repository-title" onClick={() => goRepository(record)}>
                {
                    record.iconUrl ?
                        <img
                            src={(record.iconUrl)}
                            alt=""
                            className="icon-30"
                        />
                        :
                        <img
                            src={('images/repository1.png')}
                            alt=""
                            className="icon-30"
                        />
                }
                <span className="repository-name">{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "user",
            key: "user",
            align: "left",
            width: "20%",
        },
        {
            title: '操作',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <Space size="small">
                    {/* <span className="repository-delete" onClick={() => delteRepository(record.id)}>删除</span> */}
                    <DeleteModal deleteFunction={delteRepository} id={record.id}  />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if(activeKey==="testhubo") {
            findProjectTestRepositoryList({projectId: projectId}).then(res => {
                if (res.code === 0) {
                    setProjectTestList(res.data)
                }

            })
        }
    }, [projectId,activeKey]);

    const goRepository = (data) => {
        findSystemUrl({ name: "testhubo" }).then(res => {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            applyJump(`${testUrl}/#/project/${data.id}/testcase`)
        })

    }

    const delteRepository = (id) => {
        deleteProjectTestRepositoryByCondition({ repositoryId: id, projectId: projectId }).then(data => {
            if (data.code === 0) {
                message.info('删除成功');
                findProjectTestRepositoryList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setProjectTestList(res.data)
                    }
                })
            }
        })
    }

    return(
        <Provider {...store}>
            <Table
                columns={columns}
                dataSource={projectTestList}
                rowKey={(record) => record.id}
                pagination={false}
                onChange={false}
                scroll={{x: "100%"}}
            />
            <TestRepositoryAdd
                projectId={projectId}
                testAddvisible={testAddvisible}
                setTestAddvisible={setTestAddvisible}
                setProjectTestList={setProjectTestList}
            />
        </Provider>
)


}

export default observer(BindTestHubo);