import { ItemList } from './task-handler';
import { FormHandler } from './form-handler';
import './style.css';

(() => {
    const main = document.getElementById("main");
    const side = document.getElementById("sidebar");
    const mainContent = document.createElement("div");
    mainContent.className = "main-content";
    main.append(mainContent);

    const TaskShelfList = {};
    TaskShelfList['default'] = new TaskShelf("default");
    mainContent.append(TaskShelfList['default'].createDOMList());

    const addListBtn = document.createElement('button');
    addListBtn.textContent = "ADD NEW PROJ TASK LIST";

    main.append(addListBtn);

    // have listener call a function in a task
    addListBtn.addEventListener('click', () => {
        TaskShelfList[`temp`] = new TaskShelf(`temp`);

        const tempListForm = TaskShelfList['temp'].generateListForm(mainContent);
        mainContent.append(tempListForm);

        tempListForm.querySelector(".form-submit").addEventListener('click', () => {
            const tempDOM = TaskShelfList['temp'].createDOMList();
            const tempName = TaskShelfList['temp'].getListName();

            // rearrange reference in the list
            Object.defineProperty(TaskShelfList, tempName,
                Object.getOwnPropertyDescriptor(TaskShelfList, 'temp')
            );
            delete TaskShelfList['temp'];

            mainContent.append(tempDOM);

            // attach remove button to individual task shelf
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove List';
            TaskShelfList[tempName].appendToTaskList(removeBtn);

            removeBtn.addEventListener('click', () => {
                tempDOM.remove();
                delete TaskShelfList[tempName];
                removeBtn.remove();
            }, { once: true });
        })
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

// Function to deal with the underlying task shelf data and DOM nodes
function TaskShelf(name) {
    const taskList = ItemList(name);
    const container = document.createElement('div');
    const form = FormHandler();

    // two parts: create DOM + add new item to task list
    // refactor consideration: separate the responsibility into 2 functions
    this.createCard = (obj) => {
        const newItem = document.createElement('div');
        /// const itemObj = taskList.createItem(`${name}${index}`, `random ${name}${index++} on the side of the road`);
        const itemObj = taskList.createItem(obj);
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
        const taskShelfLabel = document.createElement('div');
        console.log(taskList.listName);
        taskShelfLabel.textContent = taskList.listName;
        container.append(taskShelfLabel);

        container.classList.add('main-container');
        container.append(form.ItemForm);

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

    //
    const createCardHelper = (e) => {
        const grid = container.querySelector('.main-grid');
        let target = e.target.id;
        // show form and retrieve form data
        if (target === "add-button") {
            form.showItemForm();
            form.ItemForm.querySelector('.form-close').addEventListener('click',
                (e) => {
                    e.preventDefault();
                    form.hideItemForm();
                    form.clearItemFormData();
                }, { once: true })
            form.ItemForm.querySelector('.form-submit').addEventListener('click',
                (e) => {
                    e.preventDefault();
                    grid.append(this.createCard(form.getItemFormData()));
                    form.clearItemFormData();
                    form.hideItemForm();
                }, { once: true });
        }
    }

    // append List Form, grab title from user submitted data
    this.generateListForm = () => {
        form.showListForm();
        form.ListForm.querySelector('.form-submit').addEventListener(
            'click', (e) => {
                e.preventDefault();
                form.hideListForm();
                taskList.listName = form.getListFormData()['title'];
                form.clearListFormData();
            }, { once: true });
        return form.ListForm;
    }

    this.deleteDomList = () => {
        container.replaceChildren();
        container.removeEventListener('click', createCardHelper);
    };

    this.appendToTaskList = (element) => {
        container.append(element);
    }

    this.getListName = () => { return taskList.listName; }
}