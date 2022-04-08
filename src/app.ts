enum ProjectStatus {
	Active,
	Finished
}

type Listener = (items: Project[]) => void;

interface Validator {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(inputToValidate: Validator) {
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

function autoBind(_1: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const adjustedDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFunction = originalMethod.bind(this);
			return boundFunction;
		}
	}
	return adjustedDescriptor;
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) { }
}

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() { }

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numOfPeople,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	formElement: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;
		this.formElement = document.importNode(this.templateElement.content, true).firstElementChild as HTMLFormElement;
		this.formElement.id = 'user-input';
		this.hostElement.insertAdjacentElement('afterbegin', this.formElement);

		this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;
		
		this.configure();
	}

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const people = +this.peopleInputElement.value;
		const titleValidator: Validator = {
			value: title,
			required: true,
			minLength: 3
		};
		const descriptionValidator: Validator = {
			value: description,
			required: true,
			minLength: 10
		};
		const peopleValidator: Validator = {	
			value: people,
			required: true,
			min: 1,
			max: 5
		};
		if (validate(titleValidator) && 
				validate(descriptionValidator) && 
				validate(peopleValidator)) {
			return [title, description, people];
		} else {
			alert('Invalid input, please try again!');
		}
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	@autoBind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
			this.clearInputs();
		}
	}

	private configure() {
		this.formElement.addEventListener('submit', this.submitHandler);
	}
}


class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	htmlElement: HTMLElement;
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished') {
		this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;
		this.assignedProjects = [];
		this.htmlElement = document.importNode(this.templateElement.content, true).firstElementChild as HTMLElement;
		this.htmlElement.id = `${type}-projects`;	
		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter(project => {
				if (this.type === 'active') {
					return project.status === ProjectStatus.Active;
				}
				return project.status === ProjectStatus.Finished;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjectList();
		})	
		this.hostElement.insertAdjacentElement('beforeend', this.htmlElement);
		this.renderProjectListContainer();
	}

	private renderProjectListContainer() {
		this.htmlElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
		const listId = `${this.type}-projects-list`;
		this.htmlElement.querySelector('ul')!.id = listId;
	}

	private renderProjectList() {
		const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
		listElement.innerHTML = '';
		for (const projectItem of this.assignedProjects) {
			const listItem = document.createElement('li');
			listItem.textContent = projectItem.title;
			listElement.appendChild(listItem);
		}
	}
}


const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');