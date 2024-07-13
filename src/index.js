import { ItemList } from './task-handler';
import { createItemForm, createListForm } from './form-handler';
import './style.css';

(() => {
    const main = document.getElementById("main");
    const side = document.getElementById("sidebar");
    const mainContent = document.createElement("div");
    mainContent.className = "main-content";

    const TaskShelfList = {};

    main.append(mainContent);
    TaskShelfList['default'] = new TaskShelf("default");
    mainContent.append(TaskShelfList['default'].createDOMList());

    const testBtn = document.createElement('button');
    testBtn.textContent = "ADD NEW PROJ TASK LIST";

    let i = 0;
    main.append(testBtn);
    testBtn.addEventListener('click', () => {
        TaskShelfList[`proj${i}`] = new TaskShelf(`proj${i}`)
        mainContent.append(TaskShelfList[`proj${i}`].createDOMList());
        i++
    });

    // main.append(createForm());
    function createSideBar() {
        const grid = document.createElement('div');
        grid.classList.add('side-grid');

        grid.textContent = "testing sidebar";

        return grid;
    };

    side.append(createSideBar());
})();

function FormHandler() {
    
}

function TaskShelf(name) {
    const taskList = ItemList(name);
    const container = document.createElement('div');
    let index = 0;

    // two parts: create DOM + add new item to task list
    // refactor consideration: separate the responsibility into 2 functions
    this.createCard = () => {
        const newItem = document.createElement('div');
        const itemObj = taskList.createItem(`${name}${index}`, `random ${name}${index++} on the side of the road`);
        const removeBtn = document.createElement('button');

        removeBtn.classList.add('task-remove');
        removeBtn.textContent = "Remove Task";

        newItem.classList.add('task-card');
        newItem.textContent = itemObj.desc;
        newItem.appendChild(removeBtn);

        removeBtn.addEventListener('click', () => {
            deleteCard(itemObj, newItem);
        }, { once: true });

        return newItem;
    }

    // simply remove the element in DOM and the item in the task list
    function deleteCard(taskItem, DomElement) {
        DomElement.remove();
        taskList.deleteItem(taskItem);
        taskList.printToConsole();
    }

    this.createDOMList = () => {
        container.replaceChildren(); // refresh current tree
        container.classList.add('main-container');

        const grid = document.createElement('div');
        const addBtn = document.createElement('button');

        grid.classList.add('main-grid');
        container.append(grid);
        grid.append(this.createCard(taskList));

        addBtn.textContent = "Add New Task";
        addBtn.id = "add-button"
        container.append(addBtn);

        container.addEventListener('click', (e) => {
            let target = e.target.id;

            if (target === "add-button") {
                grid.append(this.createCard(taskList));
            }
        });

        return container;
    }
}