function createItemForm(hidden = false) {
    const container = document.createElement('fieldset');
    const form = document.createElement('form');
    form.classList.add('form-item');

    // easier to make hidden or not from the start (likely remove later)
    if (hidden) { container.classList.add('form-shown'); }
    else { container.classList.add('form-shown'); }

    // create inputs based on 
    // {element type, input type, input id + label name, label text}
    form.append(...createInput('input', 'text', 'title', 'Title: '));
    form.append(...createInput('textarea', 'text', 'description', 'Description: '));
    form.append(...createInput('input', 'date', 'date', 'Date: '));
    form.append(...createInput('input', 'number', 'priority', 'Priority: '));

    // attach a form submit button
    const submit = document.createElement('button');
    submit.setAttribute('type', submit);
    submit.textContent = "Submit";
    form.append(submit);

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