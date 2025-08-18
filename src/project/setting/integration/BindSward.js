import React, {useEffect, useState} from "react";
import {message, Space, Table} from "antd";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import {applyJump} from "tiklab-core-ui";
import WikiRepositoryAdd from "../../wiki/repository/components/WikiRepositoryAdd";
import {observer,Provider} from "mobx-react";
import WikiRepositoryStore from "../../wiki/repository/store/WikiRepositoryStore";

const BindSward = (props) => {
    const {activeKey,wikiAddvisible,setWikiAddvisible} = props

    const store = {
        wikiRepositoryStore: WikiRepositoryStore
    }
    const { deleteProjectWikiRepositoryByCondition,
        findProjectWikiRepositoryList, findSystemUrl,
    } = WikiRepositoryStore;

    const projectId = props.match.params.id;
    const [projectWikiList, setProjectWikiList] = useState()

    // 列表的列
    const columns = [
        {
            title: "知识库名称",
            dataIndex: "kanassRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                <img
                    src={('images/repository1.png')}
                    alt=""
                    className="icon-30"
                />
                <span className="repository-name" onClick={() => goWikiDetail(record)} >{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "userName",
            key: "master",
            align: "left",
            width: "20%",
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "20%"
        },
        {
            title: '操作',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <Space size="small">
                    <DeleteModal deleteFunction={deleteRepository} id={record.id} />
                </Space>
            ),
        }
    ];

    useEffect(() => {
        if(activeKey==="sward"){
            findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setProjectWikiList(res.data)
                }
            })
        }
    }, [projectId,activeKey]);


    const deleteRepository = (id) => {
        deleteProjectWikiRepositoryByCondition({ repositoryId: id, projectId: projectId }).then(data => {
            if (data.code === 0) {
                message.info('删除成功');

                findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setProjectWikiList(res.data)
                    }
                })
            }
        })
    }

    const goWikiDetail = (data) => {

        findSystemUrl({ name: "sward" }).then(res => {
            let kanassUrl;
            if (res.code === 0 && res.data.length > 0) {
                kanassUrl = res.data[0]?.systemUrl
            }
            applyJump(`${kanassUrl}/#/repository/${data.id}/overview`)
        })
    }



    return (
        <Provider {...store}>

            <Table
                columns={columns}
                dataSource={projectWikiList}
                rowKey={(record) => record.id}
                pagination={false}
                onChange={false}
                scroll={{x: "100%"}}
            />
            <WikiRepositoryAdd
                projectId={projectId}
                wikiAddvisible={wikiAddvisible}
                setWikiAddvisible={setWikiAddvisible}
                setProjectWikiList={setProjectWikiList}
            />
        </Provider>
    )
}

export default observer(BindSward);