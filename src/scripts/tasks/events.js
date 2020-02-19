import API from "../data.js"
import {renderForm} from "./dom.js"
import {newTaskObj, taskListFactory, checkedTaskObj} from "./factory.js"

// STRETCH GOALS: 1) When save task btn clicked, remove text from the input fields 

const taskBtn = document.querySelector("#tasks")
const hiddenVal = document.querySelector("#hidden-input")
const taskListContainer = document.querySelector("#tasks-list")

// This function runs when 'Tasks' btn is clicked, and then opens up all other functions to run afterwards
const openTasksForm = () => {
    taskBtn.addEventListener("click", () => {
        hiddenVal.value = 1;
        renderForm();
        addSaveFunctionality();
        addViewTasksFunctionality();
        addCheckboxFunctionality();
        addDeleteFunctionality();
        addEditFunctionality();
    })
}

const addSaveFunctionality = () => {
    // Line 22 makes sure 'Tasks' button has been clicked to open form and access save btn
    if (parseInt(hiddenVal.value) !== "") {
        const saveBtn = document.querySelector("#submitTask")

        saveBtn.addEventListener("click", event => {
            let taskVal = document.querySelector("#createTask").value
            let dateVal = document.querySelector("#completionDate").value
        
            const newObj = newTaskObj(taskVal, dateVal)
        
            API.save(newObj, "tasks")
        })
    }
}

// GET all 'tasks' objs in DB, finds only those whose 'isComplete' property value is false,
// then converts them to HTML and adds to DOM.
const addViewTasksFunctionality = () => {
    const viewTasksBtn = document.querySelector("#viewTasks")

    viewTasksBtn.addEventListener("click", () => {
        taskListContainer.innerHTML = ""
        
        API.get("tasks").then(entries => entries.forEach(entry => {
            if (entry.isComplete === false) {
                taskListContainer.innerHTML += taskListFactory(entry)
            }
        }))
    })
}

// Changes 'isComplete' property value in the 'tasks' DB from 'false' to 'true' for whichever item/DB obj's checkbox is clicked
const addCheckboxFunctionality = () => {
    taskListContainer.addEventListener("click", event => {
        if (event.target.id.startsWith("checkbox--")) {
            // Will be used to get the matching obj in the DB
            const objToEditId = event.target.id.split("--")[1]

            // Now get the matching obj from DB via objToEdit, and then call updateObj API method
            // and pass in the checkedTaskObj factory fn that creates new obj w/ updated 'isComplete'
            API.edit(objToEditId, "tasks").then(resp => {
                resp.isComplete = true;
                API.update(resp, "tasks")
            })
        }
    })
}

// TODO: Add a confirm message on delete btn click
// Deletes task from DB and task container in DOM on 'Delete' btn click
const addDeleteFunctionality = () => {
    taskListContainer.addEventListener("click", event => {
        if (event.target.id.startsWith("deleteBtn--")) {
            const objToDelete = event.target.id.split("--")[1]
            
            API.delete(objToDelete, "tasks").then(() => {
                taskListContainer.innerHTML = ""
                API.get("tasks").then(entries => entries.forEach(entry => {
                    if (entry.isComplete === false) {
                        taskListContainer.innerHTML += taskListFactory(entry)
                    }
                }))
            })
        }
    })
}
// Andy was saying that each time I click on the task name to edit, the keypress event listeners are getting
// saved to each previous name after the first one runs. Which is why it logs 2 on the 2nd task and then 3 on
// the 3rd task.
const addEditFunctionality = () => {
    taskListContainer.addEventListener("click", event => {
        if (event.target.id.startsWith("editName--")) {
            const nameInputField = document.getElementById("createTask")
            const dateInputField = document.getElementById("completionDate")
            const objIdToEdit = event.target.id.split("--")[1]
            
            API.edit(objIdToEdit, "tasks").then(resp => {
                nameInputField.value = resp.name
                dateInputField.value = resp.deadline
                nameInputField.addEventListener("keypress", event => {
                    if (event.charCode === 13) {
                        event.preventDefault()
                        const updatedName = nameInputField.value
                        const updatedDate = dateInputField.value

                        const updatedObj = newTaskObj(updatedName, updatedDate, resp.id)

                        // For some reason it's logging this 
                        console.log(updatedObj)
                        API.update(updatedObj, "tasks")
                        
                        // Thinking I need to also repopulate the date inp, this way I can invoke the factory
                        // function that creates an updated obj using 2 arguments... Then I can use PUT with 
                        // that new obj...
                        // const updatedObj = newTaskObj(updatedName, updatedDate)

                        // Having trouble PUT(ing) the updated obj b/c the API method is trying to get an ID to 
                        // find the DB obj to update... But my obj factory func doesn't have an ID property...
                        // TODO: Can I somehow use the obj that comes back from API.edit()?
                        // TODO: try a patch API to just update the name w/o whole new object..
                        // API.update(updatedObj, "tasks")
                    }
                })
            })
        }
    })
}

export {openTasksForm}