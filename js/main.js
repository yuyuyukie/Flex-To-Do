"use strict";

function createNewTodo() {
    let newTodo = document.createElement('div');
    newTodo.textContent = "test";
    document.body.querySelector("#todoContainer").appendChild(newTodo);
}

const addButton = document.querySelector("#ctdAdd");
addButton.addEventListener('click', createNewTodo);
