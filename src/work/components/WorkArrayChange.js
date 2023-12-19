const setWorkTitle = (tree, id, newTitle) => {
    if (id) {
        tree.map(ele => {
            if (ele.id === id) {
                ele.title = newTitle
            } else {
                if (ele.children) {
                    setWorkTitle(ele.children, id, newTitle)
                }
            }
            return ele;
        })
    }
    return tree
}

export {setWorkTitle};