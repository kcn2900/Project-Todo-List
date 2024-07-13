function ItemList(name) {
    const itemArr = [];
    const listName = name;

    const createItem = (title, desc, dueDate, priority) => {
        const id = new Date().getTime().toString().substring(4, 12);
        const newItem = new Item(title, desc, dueDate, priority, id);
        itemArr.push(newItem);
        return newItem;
    }

    const deleteItem = (item) => {
        for (let i = 0; i < itemArr.length; i++) {
            if (JSON.stringify(item) === JSON.stringify(itemArr[i])) {
                itemArr.splice(i, 1);
                return 1;
            }
        }
        return -1;
    }

    const printToConsole = () => {
        console.log(itemArr);
    }

    return { listName, createItem, deleteItem, printToConsole };
};

// add a note feature later
function Item(title, desc, dueDate, priority, id) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = id; // in case user creates duplicates
}

export { ItemList };