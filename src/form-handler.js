function FormHandler() {
    const ItemForm = createItemForm();
    const ListForm = createListForm();

    const showListForm = () => {
        if (ListForm.classList.contains('form-hidden')) {
            ListForm.classList.remove('form-hidden');
        }
        ListForm.classList.add('form-shown');
    };

    const hideListForm = () => {
        if (ListForm.classList.contains('form-shown')) {
            ListForm.classList.remove('form-shown');
        }
        ListForm.classList.add('form-hidden');
    };

    const showItemForm = () => {
        if (ItemForm.classList.contains('form-hidden')) {
            ItemForm.classList.remove('form-hidden');
        }
        ItemForm.classList.add('form-shown');
    };

    const hideItemForm = () => {
        if (ItemForm.classList.contains('form-shown')) {
            ItemForm.classList.remove('form-shown');
        }
        ItemForm.classList.add('form-hidden');
    };

    const getItemFormData = () => {
        const formData = {};
        for (let child of ItemForm.children) {
            if (child.nodeName !== "LABEL" && child.nodeName !== "BUTTON") {
                formData[child.name] = child.value;
            }
        }
        return formData;
    }

    const clearItemFormData = () => {
        for (let child of ItemForm.children) {
            if (child.nodeName !== "LABEL" && child.nodeName !== "BUTTON") {
                child.value = "";
            }
        }
    };

    const getListFormData = () => {
        const formData = {};
        for (let child of ListForm.children) {
            if (child.nodeName !== "LABEL" &&
                child.nodeName !== "BUTTON") {
                formData[child.name] = child.value;
            }
        }
        return formData;
    };

    const clearListFormData = () => {
        for (let child of ListForm.children) {
            if (child.nodeName !== "LABEL" && child.nodeName !== "BUTTON") {
                child.value = "";
            }
        }
    };

    function createItemForm() {
        const form = document.createElement('form');
        form.classList.add('form-item', 'form-hidden');

        // attach a close button
        const closeBtn = document.createElement('button');
        closeBtn.classList.add("form-close");
        closeBtn.setAttribute('type', 'button');
        closeBtn.textContent = "X";
        form.append(closeBtn);

        // create inputs based on 
        // {element type, input type, input id + label name, label text}
        form.append(...createInput('input', 'text', 'title', 'Title: '));
        form.append(...createInput('textarea', 'text', 'description', 'Description: '));
        form.append(...createInput('input', 'date', 'date', 'Date: '));
        form.append(...createInput('input', 'number', 'priority', 'Priority: '));

        // attach a form submit button
        const submit = document.createElement('button');
        submit.classList.add('form-submit');
        submit.setAttribute('type', 'submit');
        submit.textContent = "Submit";
        form.append(submit);

        return form;
    };

    function createListForm() {
        const form = document.createElement('form');
        form.classList.add('form-list', 'form-hidden');

        // attach a close button
        const closeBtn = document.createElement('button');
        closeBtn.classList.add("form-close");
        closeBtn.setAttribute('type', 'button');
        closeBtn.textContent = "X";
        form.append(closeBtn);

        // create inputs based on 
        // {element type, input type, input id + label name, label text}
        form.append(...createInput('input', 'text', 'title', 'Task List Title: '));

        // attach a form submit button
        const submit = document.createElement('button');
        submit.classList.add('form-submit');
        submit.setAttribute('type', 'submit');
        submit.textContent = "Submit";
        form.append(submit);

        return form;
    };

    function createInput(element, type = "text", label, text) {
        const input = document.createElement(element);
        input.setAttribute('id', label);
        input.setAttribute('type', type);
        input.setAttribute('name', label);
        input.setAttribute('required', '');

        const inputLabel = document.createElement('label');
        inputLabel.setAttribute('for', label);
        inputLabel.textContent = text;

        return [inputLabel, input] // use spread operator when appending
    };

    const formListValidation = () => {
        if (getListFormData()['title'] === '')
            return false;
        return true;
    };

    const formItemValidation = () => {
        let flag = true;
        for (let item of ItemForm) {

            if (item.nodeName !== 'BUTTON') {
                if (item.validity.valueMissing) {
                    if (!item.classList.contains('form-error'))
                        item.classList.add('form-error');
                    item.setAttribute('placeholder', 'Please fill in this field');
                    item.addEventListener('input', () => {
                        item.setAttribute('placeholder', '');
                        if (item.classList.contains('form-error'))
                            item.classList.remove('form-error');
                    }, { once: true })
                    flag = false;
                }
            }
        }
        return flag;
    };

    return {
        ItemForm, ListForm,
        showItemForm, hideItemForm,
        showListForm, hideListForm,
        getItemFormData, getListFormData,
        clearItemFormData, clearListFormData,
        formItemValidation, formListValidation,
    };
}

export { FormHandler };