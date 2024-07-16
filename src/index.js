import { ItemList } from './task-handler';
import { FormHandler } from './form-handler';
import './style.css';

(() => {
    const body = document.querySelector('body');
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
    side.append(addListBtn);

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

    function createSideBar() {
        const grid = document.createElement('div');
        grid.classList.add('side-grid');

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('side-button');
        closeBtn.textContent = "-";

        grid.append(closeBtn);
        closeBtn.addEventListener('click', () => {
            closeSideBar();
            side.style.display = "none";
        });

        return grid;
    };

    function closeSideBar() {
        const openBtn = document.createElement('button');
        openBtn.textContent = "+";
        main.insertBefore(openBtn, main.firstChild);

        openBtn.addEventListener('click', () => {
            side.style.display = "block";
            openBtn.remove()
        }, { once: true });
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
    function createCard(obj) {
        const newItem = document.createElement('div');
        /// const itemObj = taskList.createItem(`${name}${index}`, `random ${name}${index++} on the side of the road`);
        const itemObj = taskList.createItem(obj);

        newItem.classList.add('task-card');
        newItem.id = itemObj.priority;

        const top = document.createElement('p');
        top.textContent = itemObj.title;
        newItem.append(top);

        const bot = document.createElement('p');
        bot.textContent = itemObj.desc;
        newItem.append(bot);

        const detailBtn = document.createElement('button');
        detailBtn.classList.add('task-detail-btn');
        detailBtn.textContent = '+';
        newItem.append(detailBtn);
        const detailNode = generateDetails(Object.values(itemObj));
        newItem.append(detailNode);
        detailBtn.addEventListener('click', () => {
            detailNode.style.display = "block";
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('task-remove');
        removeBtn.textContent = "Remove Task";
        newItem.appendChild(removeBtn);
        removeBtn.addEventListener('click', () => {
            deleteCard(itemObj, newItem);
            detailBtn.remove();
            removeBtn.remove();
        }, { once: true });

        return newItem;
    }

    // simply remove the element in DOM and the item in the task list
    function deleteCard(taskItem, DomElement) {
        DomElement.remove();
        taskList.deleteItem(taskItem);
        taskList.printToConsole();
    }

    const generateDetails = (obj) => {
        const detail = document.createElement('div');
        detail.classList.add('task-detail');
        detail.style.display = "none";

        const list = document.createElement('ul');
        for (let i = 0; i < obj.length - 1; i++) {
            list.append(document.createElement('li'));
            list.children[i].textContent = obj[i];
        }
        detail.append(list);

        const remove = document.createElement('button');
        remove.textContent = "-";
        detail.append(remove);

        remove.addEventListener('click', () => {
            detail.style.display = "none";
        });
        return detail;
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

    // handle the form data to create a new task card
    const createCardHelper = (e) => {
        container.parentElement.append(form.ItemForm);
        let target = e.target.id;
        // show form and retrieve form data
        if (target === "add-button") {
            form.showItemForm();
            form.ItemForm.querySelector('.form-close').addEventListener('click',
                (e) => {
                    form.ItemForm.querySelector('.form-submit').addEventListener(
                        'click', generateItemFormHelper
                    );
                    e.preventDefault();
                    form.hideItemForm();
                    form.clearItemFormData();
                }, { once: true })
            form.ItemForm.querySelector('.form-submit').addEventListener('click',
                generateItemFormHelper, { once: true });
        }
    }

    function generateItemFormHelper(e) {
        const grid = container.querySelector('.main-grid');
        e.preventDefault();
        grid.append(createCard(form.getItemFormData()));
        [...grid.children]
            .sort((a, b) => { return +a.id - +b.id })
            .forEach((node) => grid.append(node));
        form.clearItemFormData();
        form.hideItemForm();
    }

    // append List Form, grab title from user submitted data
    this.generateListForm = () => {
        form.showListForm();
        form.ListForm.querySelector('.form-submit').addEventListener(
            'click', generateListFormHelper, { once: true });
        form.ListForm.querySelector('.form-close').addEventListener(
            'click', (e) => {
                form.ListForm.querySelector('.form-submit').removeEventListener(
                    'click', generateListFormHelper);
                e.preventDefault();
                form.hideListForm();
                form.clearListFormData();
            }, { once: true }
        );
        return form.ListForm;
    }

    function generateListFormHelper(e) {
        e.preventDefault();
        form.hideListForm();
        taskList.listName = form.getListFormData()['title'];
        form.clearListFormData();

        // attach the tasks shelf title to the shelf itself
        const taskShelfLabel = document.createElement('div');
        taskShelfLabel.textContent = taskList.listName;
        taskShelfLabel.classList.add('task-label');
        container.append(taskShelfLabel);
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