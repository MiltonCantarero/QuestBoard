let xp = 0;
let level = 1;

//Loads saved data from localStorage
window.onload = function(){
    loadData();
    updateDisplay();
}

//Adds a task to the list.
function addTask(){
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    if (taskText === "") 
        return;

    const li = document.createElement("li");

    li.innerHTML = `<input type="checkbox" onclick="completeTask(this)"> 
    ${taskText}`;

    document.getElementById("taskList").appendChild(li);

    input.value = "";

    saveData();

}

//Saves the current state of each task into the LocalStorage
function completeTask(checkbox){
    checkbox.parentElement.remove();

    xp = xp + 10;

    if(xp >= 100) {
        xp = 0;
        level++;
        alert(`Congratulations! You've reached level ${level}!`);
    }

    updateDisplay();
    saveData();
}    
 
//Updates the display of XP and level on the page
function updateDisplay()
{
    document.getElementById("xp").textContent = xp;
    document.getElementById("level").textContent = level;
    document.getElementById("xpBar").value = xp;

}

//Saves the tasks, Xp, and level by storing them in the LocalStorage
function saveData(){
    localStorage.setItem("tasks", document.getElementById("taskList").innerHTML);
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
}

//load the saved data
function loadData(){
    const savedTasks = localStorage.getItem("tasks");

    if(savedTasks){
        document.getElementById("taskList").innerHTML = savedTasks;

    }
    xp = Number(localStorage.getItem("xp")) || 0;
    level = Number(localStorage.getItem("level")) || 1;

    updateDisplay();
}
