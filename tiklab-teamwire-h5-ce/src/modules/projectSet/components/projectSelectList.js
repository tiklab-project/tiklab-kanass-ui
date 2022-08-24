import React, { Fragment, useState, useEffect } from 'react'
import { CheckList, NavBar, Button, Toast,Empty } from 'antd-mobile';
import { inject, observer } from "mobx-react";

const ProjectSelectList = (props) => {
    const programId = props.match.params.id;
    console.log(props)
    const { projectSetStore } = props;
    const { findProjectIsOrNotRe, addRelevance } = projectSetStore;
    const [projectList, setProjectList] = useState();
    const [selectList, setSelectList] = useState()
    useEffect(() => {
        findProjectIsOrNotRe().then(res => {
            if (res.code === 0) {
                setProjectList(res.data.noRelatedProjects)
            }
        })
    }, [])

    const submit = () => {
        const value = {
            id: programId,
            ids: selectList
        }
        addRelevance(value).then((res) => {
            if (res.code === 0) {
                props.history.goBack()
                Toast.show({
                    icon: 'success',
                    content: '保存成功',
                })
            }
        })
    }

    return (<Fragment>
        <NavBar
            style={{
                '--height': '40px',
                '--border-bottom': '1px #eee solid',
            }}
            onBack={() => props.history.goBack()}
        >
            <div>项目选择</div>
        </NavBar>
        <div>
            {
                projectList && projectList.length > 0 ? <Fragment>
                    <CheckList
                        multiple={true}
                        onChange={(value) => setSelectList(value)}
                    >
                        {
                            projectList && projectList.map(item => {
                                return <CheckList.Item value={item.id} key={item.id}>{item.projectName}</CheckList.Item>
                            })
                        }
                    </CheckList>
                    <div style={{ padding: "10px" }}>
                        <Button block color='primary' size='middle' onClick={() => submit()}>
                            确定
                        </Button>
                    </div>
                </Fragment>
                :
                <Empty description='暂无数据' />
            }

        </div>


    </Fragment>

    )
}
export default inject("projectSetStore")(observer(ProjectSelectList));