const appendNodeInTree = (tree, id, workItem) => {
    for(let i =0; i< tree.length; i++){
        if(tree[i].id === id){
            if(!tree[i].childrenWorkItem){
                tree[i].childrenWorkItem = [];
            }
            tree[i].childrenWorkItem.push(workItem)
            return tree;
        }else{
            if(tree[i].children){
                appendNodeInTree(tree[i].children, id, workItem)
            }
        }
    }
    return tree;
}

const appendStageInTree = (tree, id, stage) => {
    if(!id){
        tree.unshift(stage)
    }else {
        for(let i =0; i< tree.length; i++){
            if(tree[i].id === id){
                if(!tree[i].children){
                    tree[i].children = [];
                }
                tree[i].children.unshift(stage)
                return tree;
            }else{
                if(tree[i].children){
                    appendStageInTree(tree[i].children, id, stage)
                }
            }
        }
    }

  
    return tree;
}
/**
 * 删除事项，包括下级
 * @param {列表} tree 
 * @param {id} id 
 * @returns 
 */

const removeNodeInTree = (tree, id) => {
    if (!tree || !tree.length) {
        return
    }
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            tree.splice(i, 1);
            return;
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            removeNodeInTree(node.children, id);
        }
        if (node.childrenWorkItem) {
            removeNodeInTree(node.childrenWorkItem, id);
        }
    }
}


/**
 * 删除事项，不删除下级
 * @param {列表} tree 
 * @param {id} id 
 * @returns 
 */
const removeNodeInTreeAddChildren = (tree, id) => {
    if (!tree || !tree.length) {
        return
    }
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            if (tree[i].children && tree[i].children.length > 0) {
                tree.splice(i, 1, ...tree[i].children);
            } else {
                tree.splice(i, 1);
            }
            return;
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
           removeNodeInTreeAddChildren(node.children, id);
        }
        if (node.childrenWorkItem) {
            removeNodeInTreeAddChildren(node.childrenWorkItem, id);
        }
    }
}


const updateTree = (tree, moveToId, id) => { // 通过id从数组（树结构）中移除元素
    const deleteNode = removeNodeForUpdate(tree, id)
    tree = insertNode(tree, moveToId, deleteNode)
    console.log(deleteNode)
    return tree;
}


const removeNodeForUpdate = (tree, id) => {
    // 遍历数组中的每个节点
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        // 如果当前节点的ID匹配要删除的ID，则从数组中删除该节点
        if (node.id === id) {
            tree.splice(i, 1);
            return node; // 结束函数，因为已经删除了节点
        }

        // 递归调用，处理当前节点的子节点
        if (node.children) {
            const deletedNode = removeNodeForUpdate(node.children, id);
            if (deletedNode) {
                return deletedNode; // 如果子节点中找到了要删除的节点，则返回该节点
            }
        }
    }
}


const insertNode = (tree, moveToId, node) => {
    if(!moveToId){
        tree.unshift(node);
    }else {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === moveToId) {
                if (tree[i].children != null) {
                    tree[i].children.unshift(node)
                } else {
                    tree[i].children = []
                    tree[i].children.unshift(node)
                }
                return true; // 插入成功后返回true
            } else {
                if (tree[i].children != null) {
                    if (insertNode(tree[i].children, moveToId, node)) {
                        return true; // 如果在子节点中成功插入了新节点，则返回true
                    }
                }
            }
        }
    }

    
}
// 更新父级
export { appendNodeInTree, appendStageInTree, updateTree, removeNodeInTree, removeNodeInTreeAddChildren };