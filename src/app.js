"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(inputToValidate) {
    let isValid = true;
    if (inputToValidate.required) {
        isValid = isValid && inputToValidate.value.toString().trim().length !== 0;
    }
    if (inputToValidate.minLength != null && typeof inputToValidate.value === 'string') {
        isValid = isValid && inputToValidate.value.length >= inputToValidate.minLength;
    }
    if (inputToValidate.maxLength != null && typeof inputToValidate.value === 'string') {
        isValid = isValid && inputToValidate.value.length <= inputToValidate.maxLength;
    }
    if (inputToValidate.min != null && typeof inputToValidate.value === 'number') {
        isValid = isValid && inputToValidate.value >= inputToValidate.min;
    }
    if (inputToValidate.max != null && typeof inputToValidate.value === 'number') {
        isValid = isValid && inputToValidate.value <= inputToValidate.max;
    }
    return isValid;
}
function autoBind(_1, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjustedDescriptor;
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        this.formElement = document.importNode(this.templateElement.content, true).firstElementChild;
        this.formElement.id = 'user-input';
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
        this.titleInputElement = this.formElement.querySelector('#title');
        this.descriptionInputElement = this.formElement.querySelector('#description');
        this.peopleInputElement = this.formElement.querySelector('#people');
        this.configure();
    }
    gatherUserInput() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = +this.peopleInputElement.value;
        const titleValidator = {
            value: title,
            required: true,
            minLength: 3
        };
        const descriptionValidator = {
            value: description,
            required: true,
            minLength: 10
        };
        const peopleValidator = {
            value: people,
            required: true,
            min: 1,
            max: 5
        };
        if (validate(titleValidator) &&
            validate(descriptionValidator) &&
            validate(peopleValidator)) {
            return [title, description, people];
        }
        else {
            alert('Invalid input, please try again!');
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
    }
    configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    autoBind
], ProjectInput.prototype, "submitHandler", null);
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        this.htmlElement = document.importNode(this.templateElement.content, true).firstElementChild;
        this.htmlElement.id = `${type}-projects`;
        this.hostElement.insertAdjacentElement('beforeend', this.htmlElement);
        this.renderProjectList();
    }
    renderProjectList() {
        this.htmlElement.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        const listId = `${this.type}-projects-list`;
        this.htmlElement.querySelector('ul').id = listId;
    }
}
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
