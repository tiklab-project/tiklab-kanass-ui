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

const removeNodeInTree = (tree, id, setWorkId, setSessionStorage) => { // 通过id从数组（树结构）中移除元素
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
                setWorkId(0)
                setSessionStorage("detailCrumbArray", null)
            }
        } else {
            removeNodeChildren(tree[i], tree[i].children, id, setWorkId, setSessionStorage)
        }

    }
}

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


export { removeNodeInTree};