const appendNodeInTree = (id, tree, obj, setType) => {
    if (id) {
        tree.forEach(ele => {
            if (ele.id === id) {
                switch (setType) {
                    case "inset":
                        ele.children ? ele.children.push(...obj) : ele.children = obj;
                        break;
                    case "overview":
                        ele.children = obj
                        break;
                    default:
                        ele.children ? ele.children.push(...obj) : ele.children = obj;
                        break
                }
            } else {
                if (ele.children) {
                    appendNodeInTree(id, ele.children, obj, setType)
                }
            }
        })
    } else {
        tree.push(...obj)
    }

    return tree
}

// const removeNodeInTree = (fTree, tree, id, setWorkId, setSessionStorage) => { // 通过id从数组（树结构）中移除元素
//     if (!tree || !tree.length) {
//         return
//     }
//     for (let i = 0; i < tree.length; i++) {
//         if (tree[i].id === id) {
//             tree.splice(i, 1);
//             // 设置删除之后定位的事项
//             if (tree.length > 0) {
//                 if (i !== tree.length) {
//                     setWorkId(tree[i].id)
//                     setSessionStorage("detailCrumbArray",
//                         [{ id: tree[i].id, title: tree[i].title, iconUrl: tree[i].workTypeSys.iconUrl }])
//                 } else {
//                     setWorkId(tree[i - 1].id)
//                     setSessionStorage("detailCrumbArray",
//                         [{ id: tree[i - 1].id, title: tree[i - 1].title, iconUrl: tree[i - 1].workTypeSys.iconUrl }])
//                 }
//             } else {
//                 if(fTree != null){
//                     setWorkId(fTree.id)
//                     setSessionStorage("detailCrumbArray",
//                             [{ id: fTree.id, title: fTree.title, iconUrl: fTree.workTypeSys.iconUrl }])
//                 }else {
//                     setWorkId(0)
//                     setSessionStorage("detailCrumbArray", null)

//                 }

//             }
//             return
//         } else {
//             removeNodeInTree(tree[i], tree[i].children, id, setWorkId, setSessionStorage)
//         }

//     }
// }



const removeNodeChildren = (fNode, tree, id, setWorkId, setSessionStorage) => {
    if (!tree || !tree.length) {
        return
    }

    for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
            tree.splice(i, 1);
            if (tree.length > 0) {
                if (i !== tree.length) {
                    setWorkId(tree[i].id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: tree[i].id, title: tree[i].title, iconUrl: tree[i].workTypeSys.iconUrl }])
                } else {
                    setWorkId(tree[i - 1].id)
                    setSessionStorage("detailCrumbArray",
                        [{ id: tree[i - 1].id, title: tree[i - 1].title, iconUrl: tree[i - 1].workTypeSys.iconUrl }])
                }
            } else {
                setWorkId(fNode.id)
                setSessionStorage("detailCrumbArray",
                    [{ id: fNode.id, title: fNode.title, iconUrl: fNode.workTypeSys.iconUrl }])
            }

        } else {
            removeNodeInTree(tree, tree[i].children, id)
        }

    }
}


/**
 * 删除事项，包括下级
 * @param {列表} tree 
 * @param {id} id 
 * @returns 
 */

const removeNodeInTree = (tree, parentNode, id) => {
    if (!tree || !tree.length) {
        return
    }
    // 遍历数组中的每个节点
    let jumpNode = null;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            tree.splice(i, 1);
            if(tree.length === 0){
                jumpNode = parentNode;
            } else if(tree.length === i){
                jumpNode = tree[i - 1]
            } else {
                jumpNode = tree[i];
            }
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            const jumpNode1 = removeNodeInTree(node.children, node, id);
            if (jumpNode1) {
                jumpNode =  jumpNode1; // 如果子节点中找到了要删除的节点，则返回该节点
            }
        }
    }
    return jumpNode;
}


/**
 * 删除事项，不删除下级
 * @param {列表} tree 
 * @param {id} id 
 * @returns 
 */
const removeNodeInTreeAddChildren = (tree, parentNode, id) => {
    if (!tree || !tree.length) {
        return
    }
    // 遍历数组中的每个节点
    let jumpNode = null;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            if (tree[i].children && tree[i].children.length > 0) {
                tree.splice(i, 1, ...tree[i].children);
                jumpNode = tree[i];
            } else {
                tree.splice(i, 1);
                if (tree.length === 0) {
                    jumpNode = parentNode;
                } else if (tree.length === i) {
                    jumpNode = tree[i - 1]
                } else {
                    jumpNode = tree[i];
                }
            }
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            const jumpNode1 = removeNodeInTreeAddChildren(node.children, node, id);
            if (jumpNode1) {
                jumpNode = jumpNode1; // 如果子节点中找到了要删除的节点，则返回该节点
            }
        }
    }
    return jumpNode;
}

export { removeNodeInTree, removeNodeInTreeAddChildren };