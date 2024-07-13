function createItemForm(hidden = false) {
    const container = document.createElement('fieldset');
    const form = document.createElement('form');
    form.classList.add('form-item');

    // easier to make hidden or not from the start (likely remove later)
    if (hidden) { form.classList.add('form-shown'); }
    else { form.classList.add('form-shown'); }

    // need title, desc, dueDate, priority
    form.append(...createInput('input', 'text', 'title', 'Title: '));
    form.append(...createInput('textarea', 'text', 'description', 'Description: '));
    form.append(...createInput('input', 'date', 'date', 'Date: '));
    form.append(...createInput('input', 'number', 'priority', 'Priority: '));

    container.appendChild(form);
    return container;
};

function createListForm() {

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

export { createItemForm, createListForm };