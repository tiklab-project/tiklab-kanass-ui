import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
const finWorkList = (router, workStore, params) => {
    const setValue = () => {
        let type = "";
        if (router.indexOf("/work") > -1) {
            type = "system"

        }
        if (router.indexOf("/projectDetail/:id/work") > -1) {
            type = "project"

        }
        if (router.indexOf("/:id/sprintdetail/:sprint/work") > -1) {
            type = "sprint"

        }
        if (router.indexOf("/:id/versiondetail/:version/work") > -1) {
            type = "version"

        }
        goWorkItem(type, workStore, params)
    }
    setValue();


}


const goWorkItem = (type, workStore, params) => {
    const { sprintId, versionId, projectId } = params;
    const { setSearchConditionNull, setSearchCondition, searchCondition } = workStore;
    let initValues = {
        ...searchCondition,
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    }
    switch (type) {
        case "sprint":
            initValues = { ...initValues, projectIds: [projectId], sprintId: sprintId };
            break;
        case "version":
            initValues = { ...initValues, projectIds: [projectId], versionId: versionId };
            break;

        case "project":
            initValues = { ...initValues, projectIds: [projectId] };
            break;
        case "system":
            initValues = { ...initValues, projectIds: [] };
            break;
        default:
            break;
    }
    setSearchConditionNull().then(res => {
        setSearchCondition(initValues)
        getWorkList(workStore);
    })
}

const getWorkList = (workStore) => {
    const { viewType, workShowType, getWorkBoardList } = workStore;
    if (viewType === "tile" && workShowType !== "bodar") {
        getPageList(workStore);
    } else if (viewType === "tree" && workShowType !== "bodar") {
        getPageTree(workStore);
    } else if (workShowType === "bodar") {
        getWorkBoardList()
    }
}


const getPageTree = (workStore) => {
    const { getWorkConditionPageTree, setWorkIndex, setWorkId, workShowType, setQuickFilterValue } = workStore;

    getWorkConditionPageTree().then((res) => {
        if (res.code === 0) {
            const list = res.data.dataList;
            if (workShowType === "list") {
                if (list.length > 0) {
                    setWorkIndex(1)
                    const workItem = list[0];
                    setWorkId(workItem.id)
                    setSessionStorage("detailCrumbArray", [{ id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
                } else {
                    setWorkId(0)
                    setWorkIndex(0)
                }
            }
        }
    })
}

const getPageList = (workStore) => {
    const { getWorkConditionPage, setWorkIndex, setWorkId, workShowType } = workStore;
    getWorkConditionPage().then((res) => {
        const list = res.data.dataList
        if (list.length > 0) {
            if (workShowType === "list") {
                // setWorkIndex(1)
                // setWorkId(res.dataList[0].id)
                // setSessionStorage("detailCrumbArray", [{ id: res.dataList[0].id, title: res.dataList[0].title, iconUrl: res.dataList[0].workTypeSys.iconUrl }])
            }
        } else {
            setWorkIndex(0)
            setWorkId(0)
        }
    })
}


// 事项更换上级之后把当前事项从父级的下级移除
const deleteAndQueryDeepData = (originalArray, indexes) => {
    if (indexes.length === 0) {
        return undefined; // 如果索引数组为空，返回 undefined
    }

    const currentIndex = indexes.shift(); // 获取当前层级的下标
    if (currentIndex < 0 || currentIndex >= originalArray.length) {
        return undefined; // 下标越界，返回 undefined 表示未找到数据
    }

    if (indexes.length === 0) {
        // 如果索引数组为空，表示找到了要删除的数据，将其删除并返回
        return originalArray.splice(currentIndex, 1)[0];
    }

    const currentLevelData = originalArray[currentIndex].children; // 获取当前层级的数据
    const result = deleteAndQueryDeepData(currentLevelData, indexes); // 递归查询下一层级的数据

    // 如果递归后返回了 undefined，表示在更深的层级未找到数据，则将当前层级的数据删除
    // if (result === undefined) {
    //   originalArray.splice(currentIndex, 1);
    // }

    return result;
}

// 给事项添加父事项之后，更改列表
const changeWorkItemParent = (originalArray, newParentId, workItem) => {
    const deleteItem = deleteOldChildren(originalArray, workItem.id);
    console.log(deleteItem)
    const newWorkItem = { ...workItem, children: deleteItem.children }
    // 更新下级的treepath
    if(newWorkItem.children && newWorkItem.children.length > 0){
        updateTreePath(newWorkItem)
    }
    console.log(newWorkItem)
    originalArray = addNewParentChildren(originalArray, newParentId, newWorkItem)
    return originalArray

}

const updateTreePath = (newWorkItem) => {
    const id = newWorkItem.id;
    const treePath = id  + ";" + newWorkItem.treePath
    newWorkItem.children.map(item => {
        item.treePath = treePath;
    })
}

const deleteOldChildren = (originalArray, workItemId) => {
    let deletedNode = null;

    // 递归删除函数
    function recursiveDelete(nodes, id) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
          // 删除当前节点
          nodes.splice(i, 1);
          deletedNode = node;
          return true; // 找到并删除了节点，退出循环
        }
        if (node.children && node.children.length > 0) {
          if (recursiveDelete(node.children, id)) {
            // 在子节点中找到了并删除了节点，退出循环
            return true;
          }
        }
      }
      return false; // 没有找到匹配的节点
    }
  
    // 遍历树的每个节点，查找匹配的节点并删除
    recursiveDelete(originalArray, workItemId);
  
    // 返回被删除的节点
    return deletedNode;
}

const addNewParentChildren = (originalArray, newParentId, workItem) => {
    if(newParentId && newParentId !== "nullstring"){
        originalArray.map(item => {
            if (item.id === newParentId) {
                if (item.children && item.children.length >= 0) {
                    item.children.push(workItem)
                } else {
                    item.children = [workItem];
                }
            } else {
                if (item.children && item.children.length > 0) {
                    addNewParentChildren(item.children, newParentId, workItem)
                }
            }
            return item
        })
    }else {
        originalArray.unshift(workItem)
    }
    
    return originalArray;

}

const changeWorkItemList = (originalArray, workItem) => {
    originalArray.forEach((item, index) => {
        if (item.id === workItem.id) {
            // 替换整个对象
            originalArray[index] = { ...workItem, children: item.children };
        } else if (item.children && item.children.length > 0) {
            // 递归调用以检查子元素
            changeWorkItemList(item.children, workItem);
        }
    });
    return originalArray;
};
export { finWorkList, deleteAndQueryDeepData, changeWorkItemParent, changeWorkItemList };