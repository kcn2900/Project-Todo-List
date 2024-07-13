import { ItemList } from './task-handler';
import { createItemForm, createListForm } from './form-handler';
import './style.css';

(() => {
    const main = document.getElementById("main");
    const side = document.getElementById("sidebar");
    const mainContent = document.createElement("div");
    mainContent.className = "main-content";
    main.append(mainContent);


    const itemForm = FormHandler();
    main.append(itemForm.ItemForm)

    const TaskShelfList = {};
    TaskShelfList['default'] = new TaskShelf("default");
    mainContent.append(TaskShelfList['default'].createDOMList());

    const testBtn = document.createElement('button');
    testBtn.textContent = "ADD NEW PROJ TASK LIST";

    let i = 0;
    main.append(testBtn);
    testBtn.addEventListener('click', () => {
        TaskShelfList[`proj${i}`] = new TaskShelf(`proj${i}`);

        const tempList = TaskShelfList[`proj${i}`].createDOMList();
        mainContent.append(tempList);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove List';
        TaskShelfList[`proj${i}`].appendToTaskList(removeBtn);

        removeBtn.addEventListener('click', () => {
            tempList.remove();
            delete TaskShelfList[`proj${i}`];
            removeBtn.remove();
        }, { once: true });

        i++;
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

// just create once, and then reuse
function FormHandler() {
    const ItemForm = createItemForm();
    const ListForm = createListForm();

    const showListForm = () => {
        if (ListForm.classList.contains('form-hidden')) {
            ListForm.classList.remove('form-hidden');
            ListForm.classList.add('form-shown');
        }
    };

    const hideListForm = () => {
        if (ListForm.classList.contains('form-shown')) {
            ListForm.classList.remove('form-shown');
            ListForm.classList.add('form-hiden');
        }
    };

    return { ItemForm, ListForm };
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

    // simply create DOM chain of Task List
    this.createDOMList = () => {
        container.classList.add('main-container');

        const grid = document.createElement('div');
        const addBtn = document.createElement('button');

        grid.classList.add('main-grid');
        container.append(grid);

        addBtn.textContent = "Add New Task";
        addBtn.id = "add-button"
        container.append(addBtn);
        container.addEventListener('click', createCardHelper);

        return container;
    };

    // for easier removal of container listener
    const createCardHelper = (e) => {
        const grid = container.querySelector('.main-grid');
        let target = e.target.id;

        if (target === "add-button") {
            grid.append(this.createCard());
        }
    }

    this.deleteDomList = () => {
        container.replaceChildren();
        container.removeEventListener('click', createCardHelper);
    };

    this.appendToTaskList = (element) => {
        container.append(element);
    }
}