import { ItemList } from './task-handler';
import { FormHandler } from './form-handler';
import './style.css';

(() => {
    // localStorage.clear();
    const form = FormHandler();
    const body = document.querySelector('body');
    const main = document.getElementById("main");
    const side = document.getElementById("sidebar");

    const sideGrid = document.createElement('div');
    sideGrid.className = "side-grid";

    const mainContent = document.createElement("div");
    mainContent.className = "main-content";
    main.append(mainContent);

    const TaskShelfList = {};
    TaskShelfList['default'] = new TaskShelf("default", form);

    const taskShelfLabel = document.createElement('div');
    taskShelfLabel.textContent = "Default";
    taskShelfLabel.classList.add('task-label');
    TaskShelfList['default'].appendToTaskList(taskShelfLabel);

    mainContent.append(TaskShelfList['default'].createDOMList());

    if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            const name = localStorage.key(i);
            TaskShelfList[name] = new TaskShelf(name, form);

            const taskShelfLabel = document.createElement('div');
            taskShelfLabel.textContent = name;
            taskShelfLabel.classList.add('task-label');
            TaskShelfList[name].appendToTaskList(taskShelfLabel);

            const dom = TaskShelfList[name].createDOMList()
            mainContent.append(dom);
            addListRemoveBtn(name, dom);

            console.log(localStorage.getItem(name));
            TaskShelfList[name].reCreateList(JSON.parse(localStorage.getItem(name)))

        }
    }
    else {

    }

    /////////////////////////// sidebar handling ///////////////////////////////

    function createSideBar() {
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('side-button');
        closeBtn.textContent = "-";

        closeBtn.addEventListener('click', () => {
            closeSideBar();
            side.style.display = "none";
        });

        return closeBtn;
    };

    function closeSideBar() {
        const openBtn = document.createElement('button');
        openBtn.textContent = "+";
        main.insertBefore(openBtn, main.firstChild);

        openBtn.addEventListener('click', () => {
            side.style.display = "block";
            openBtn.remove();
        }, { once: true });
    };

    function handleSubmit() {
        const tempName = TaskShelfList['temp'].getListName();

        if (tempName === '') {
            return;
        }

        const tempDOM = TaskShelfList['temp'].createDOMList();
        // rearrange reference in the list
        Object.defineProperty(TaskShelfList, tempName,
            Object.getOwnPropertyDescriptor(TaskShelfList, 'temp')
        );
        delete TaskShelfList['temp'];
        mainContent.append(tempDOM);

        console.log(tempDOM);
        addListRemoveBtn(tempName, tempDOM);

        localStorage.setItem(tempName, '');

        form.ListForm.querySelector('.form-submit')
            .removeEventListener('click', handleSubmit);
    }

    // attach remove button to individual task shelf
    function addListRemoveBtn(name, dom) {
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove List';
        TaskShelfList[name].appendToTaskList(removeBtn);

        removeBtn.addEventListener('click', () => {
            dom.remove();
            delete TaskShelfList[name];
            removeBtn.remove();
        }, { once: true });
    }

    sideGrid.append(createSideBar());
    side.append(sideGrid);

    const addListBtn = document.createElement('button');
    addListBtn.textContent = "NEW PROJECT";
    addListBtn.classList.add('new-project-btn');
    sideGrid.append(addListBtn);

    // essentially handle adding a new task shelf by first
    // appending a temporary shelf before replacing its name
    // with user input.
    addListBtn.addEventListener('click', () => {
        TaskShelfList[`temp`] = new TaskShelf(`temp`, form);

        const tempListForm = TaskShelfList['temp'].generateListForm(handleSubmit);
        mainContent.append(tempListForm);

        tempListForm.querySelector(".form-submit")
            .addEventListener('click', handleSubmit);
    });
})();

// Function to deal with the underlying task shelf data and DOM nodes
function TaskShelf(name, f) {
    const taskList = ItemList(name);
    const container = document.createElement('div');
    const form = f;

    // re-create tasks in shelf based on local storage
    this.reCreateList = (list) => {
        const grid = container.querySelector('.main-grid');
        for (let value of Object.values(list)) {
            grid.append(createCard(value));
        }
        sortTasks();
    };

    // two parts: create DOM + add new item to task list
    // refactor consideration: separate the responsibility into 2 functions
    function createCard(obj) {
        const newItem = document.createElement('div');
        /// const itemObj = taskList.createItem(`${name}${index}`, `random ${name}${index++} on the side of the road`);
        const itemObj = taskList.createItem(obj);

        console.log(obj)

        newItem.classList.add('task-card');
        newItem.id = itemObj.priority;

        const top = document.createElement('p');
        top.textContent = itemObj.title;
        newItem.append(top);

        const bot = document.createElement('p');
        bot.textContent = itemObj.desc;
        newItem.append(bot);

        // attach detail button
        const detailBtn = document.createElement('button');
        detailBtn.classList.add('task-detail-btn');
        detailBtn.textContent = 'More details';
        newItem.append(detailBtn);
        const detailNode = generateDetails(Object.values(itemObj));
        newItem.append(detailNode);
        detailBtn.addEventListener('click', () => {
            detailNode.style.display = "flex";
            detailBtn.style.display = "none";
        });

        //  attach remove button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('task-remove');
        removeBtn.textContent = "Remove Task";
        newItem.appendChild(removeBtn);
        removeBtn.addEventListener('click', () => {
            deleteCard(itemObj, newItem);
            detailBtn.remove();
            removeBtn.remove();
        }, { once: true });

        // append new item to local storage
        // need to use unique id
        if (!obj.id) {
            if (localStorage.getItem(taskList.listName) === '')
                localStorage.setItem(
                    taskList.listName,
                    JSON.stringify({ [itemObj.id]: { ...obj, id: itemObj.id } }))
            else {
                localStorage.setItem(
                    taskList.listName,
                    JSON.stringify({
                        ...JSON.parse(localStorage.getItem(taskList.listName)),
                        [itemObj.id]: { ...obj, id: itemObj.id }
                    })
                );
            }
        }
        
        return newItem;
    }

    // simply remove the element in DOM and the item in the task list
    function deleteCard(taskItem, DomElement) {
        DomElement.remove();
        taskList.deleteItem(taskItem);
        taskList.printToConsole();

        const list = JSON.parse(localStorage.getItem(taskList.listName));
        delete list[taskItem.id];
        localStorage.setItem(
            taskList.listName,
            JSON.stringify(list)
        );
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
            detail.parentElement
                .querySelector('.task-detail-btn')
                .style.display = "inline";
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
        if (container.parentElement !== null)
            container.parentElement.append(form.ItemForm);
        let target = e.target.id;
        // show form and retrieve form data
        if (target === "add-button") {
            form.showItemForm();
            form.clearListFormData();
            form.hideListForm();
            form.ListForm.querySelector('.form-submit')
                .removeEventListener('click', generateListFormHelper);
            form.ItemForm.querySelector('.form-close').addEventListener('click',
                (e) => {
                    form.ItemForm.querySelector('.form-submit').removeEventListener(
                        'click', generateItemFormHelper
                    );
                    e.preventDefault();
                    form.hideItemForm();
                    form.clearItemFormData();
                }, { once: true })
            form.ItemForm.querySelector('.form-submit').addEventListener('click',
                generateItemFormHelper);
        }
    }

    function sortTasks() {
        const grid = container.querySelector('.main-grid');
        [...grid.children]
                .sort((a, b) => { return +a.id - +b.id })
                .forEach((node) => grid.append(node));
    }

    // handle validation and task card DOM attachment + sorting
    function generateItemFormHelper(e) {
        if (form.formItemValidation()) {
            const grid = container.querySelector('.main-grid');
            e.preventDefault();
            grid.append(createCard(form.getItemFormData()));
            sortTasks();
            form.clearItemFormData();
            form.hideItemForm();

            // need to manually remove else multiple listeners will appear
            form.ItemForm.querySelector('.form-submit').removeEventListener(
                'click', generateItemFormHelper
            );
        }
    }

    // append List Form, grab title from user submitted data
    this.generateListForm = (handleSubmit) => {
        form.hideItemForm();
        form.clearItemFormData();
        form.showListForm();
        form.ListForm.querySelector('.form-submit').addEventListener(
            'click', generateListFormHelper);
        form.ListForm.querySelector('.form-close').addEventListener(
            'click', (e) => {
                form.ListForm.querySelector('.form-submit').removeEventListener(
                    'click', generateListFormHelper);

                // need to do this as listener in the IIFE at top
                // is still active despite closing the form
                form.ListForm.querySelector('.form-submit')
                    .removeEventListener('click', handleSubmit);
                e.preventDefault();
                form.hideListForm();
                form.clearListFormData();
            }, { once: true }
        );
        taskList.listName = '';
        return form.ListForm;
    }

    // handle the attachment of the new shelf DOM
    function generateListFormHelper(e) {
        e.preventDefault();
        // check valid form, styling error if not
        if (!form.formListValidation()) {
            // simply prevent redoing error styling multiple times
            if (form.ListForm.children[2].classList.contains('form-error')) {
                taskList.listName = '';
                return;
            }

            form.ListForm.children[2].classList.add('form-error');
            taskList.listName = '';
            form.ListForm.querySelector('#title').
                setAttribute('placeholder', "Type in a shelf name");

            form.ListForm.children[2]
                .addEventListener('input', () => {
                    form.ListForm.querySelector('#title').
                        setAttribute('placeholder', "");
                    form.ListForm.children[2].classList.remove('form-error');
                }, { once: true })

            return;
        }
        form.hideListForm();
        taskList.listName = form.getListFormData()['title'];
        form.clearListFormData();

        // attach the tasks shelf title to the shelf itself
        const taskShelfLabel = document.createElement('div');
        taskShelfLabel.textContent = taskList.listName;
        taskShelfLabel.classList.add('task-label');
        container.append(taskShelfLabel);

        form.ListForm.querySelector('.form-submit')
            .removeEventListener('click', generateListFormHelper);
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