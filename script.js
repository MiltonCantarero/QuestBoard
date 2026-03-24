// Players data
let xp = 0;
let level = 1;
let coins = 0;
let streak = 0;
let amountNeededForNextLevel = 100;

//Starting clothing for the character
let equipment = {
    head: "DefaultHeadBoy",
    torso: "DefaultTorso",
    legs: "DefaultLegs",
    skin: "DefaultSkin",
};

//Owned items
let ownedItems = [
    "DefaultHeadBoy", "DefaultHeadGirl", "DefaultTorso", "DefaultLegs", 
    "DefaultSkin", "Skintone1", "Skintone2", "Skintone3"
];

//SHOP
let shopItems = {
    KnightHelmet: ["KnightHelmet"],
    ProfessorHead: ["ProfessorHead", "ProfessorTorso", "ProfessorLegs"],
    BirdieMale: ["BirdieMale", "BirdieFemale"],
    MageTorso: ["MageTorso", "MageLegs"]

};

//Elements from HTML
const taskInput = document.getElementById("taskInput");
const xpValueInput = document.getElementById("xpValue");
const addQuestButton = document.getElementById("addQuestButton");
const questList = document.getElementById("questlist");

taskInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addQuest();
    }
});
xpValueInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addQuest();
    }
});

//Display fpr stats
const xpStatus = document.querySelector(".XpStatus");
const xpSection = document.querySelector(".XpSection");
const levelDisplay = document.querySelector(".level");
const coinDisplay = document.querySelector(".coins");
const xpFill = document.querySelector(".XPFill");
const xpText = document.querySelector(".xpText");



//Adding quest Function you type in the input and will create a new card on the board
addQuestButton.addEventListener("click", addQuest);
function addQuest(){
    const questName = taskInput.value.trim();
    const questXP = Number(xpValueInput.value);
    

    if(questName === "" || isNaN(questXP) || questXP <= 0){  //If invalid input give error message
        alert("Please enter a valid quest name and XP value.");
        return;
    }
    const emptyMessage = questList.querySelector(".emptyMessage"); //removes empty message
    if(emptyMessage){
        emptyMessage.remove();
    }

    //Creates new quest
    const questCard = document.createElement("div");
    questCard.classList.add("questCard");
    questCard.innerHTML = `
        <span class="questTitle">${questName}</span>
        <span class="questReward">+${questXP} XP</span>
        <button class="completeQuest">✔</button>`;
    
    const completeButton = questCard.querySelector(".completeQuest");

    completeButton.addEventListener("click", () => {
        completeQuest(questCard, questXP);
    });

    ///adds quest to list
    questList.appendChild(questCard);
    
    //clears input
    taskInput.value = "";
    saveData();
} 

function completeQuest(questCard, questXP){
    setTimeout(() => {
        questCard.remove();
        saveData();
    }, 400); // Delay to allow animation to play

    let gainedXP = 0;
    const xpInterval = setInterval(() => {
        xp++;
        gainedXP++;

        if (xp >= amountNeededForNextLevel){
        xp = xp - amountNeededForNextLevel;
        level++;
        amountNeededForNextLevel = Math.floor(amountNeededForNextLevel * 1.25);
        alert(`Congratulations! You've reached level ${level}!`);
    }

        updateUI();
        
        if(gainedXP >= questXP){
            clearInterval(xpInterval);
            saveData();
        }
    }, 20); // Adjust the speed of XP gain here (lower is faster)

    coins = coins + Math.floor(questXP / 2);

  
    

    updateUI();
    saveData();
}

//Updates UI display
function updateUI(){
    xpStatus.textContent = `XP: ${xp} / ${amountNeededForNextLevel}`;
    xpText.textContent = `XP: ${xp} / ${amountNeededForNextLevel}`;
    levelDisplay.textContent = "Lv " + level;
    coinDisplay.textContent = "Gold: " + coins;
    const percent = (xp / amountNeededForNextLevel) * 100;
    xpFill.style.width = percent + "%";
}

//Saves data to local storage
function saveData(){
    localStorage.setItem("quests", questList.innerHTML);
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("coins", coins);
    localStorage.setItem("amountNeededForNextLevel", amountNeededForNextLevel);
}

//Loads data from local storage
function loadData(){
    const savedQuests = localStorage.getItem("quests");

    if(savedQuests){
        questList.innerHTML = savedQuests;
        const completeButtons = document.querySelectorAll(".completeQuest");

        completeButtons.forEach(button => {
            button.addEventListener("click", function(){
                const questCard = this.parentElement;
                const xpText = questCard.querySelector(".questReward").textContent;
                const questXP = Number(xpText.replace(" XP",""));

        completeQuest(questCard, questXP);
    });
});
    }
    xp = Number(localStorage.getItem("xp")) || 0;
    level = Number(localStorage.getItem("level")) || 1;
    coins = Number(localStorage.getItem("coins")) || 0;
    amountNeededForNextLevel = Number(localStorage.getItem("amountNeededForNextLevel")) || 100;
    updateUI();
}

document.addEventListener("keydown", function(event){

    if(event.key.toLowerCase() === "r"){

        const confirmReset = confirm("Reset all progress?")

        if(confirmReset){

            localStorage.clear()
            location.reload()

        }
    }

})

function showPage(pageId){
    const pages = ["questContainer", "shopPage", "characterPage"];

    pages.forEach(page =>{
        const element = document.getElementById(page);
        if(element){
            element.style.display = "none";
        }
    });
    document.getElementById(pageId).style.display = "block";
}

//Buying Buttons for the SHOP
const buyButtons = document.querySelectorAll(".buyButton");

buyButtons.forEach(button => {

    button.addEventListener("click", function(){

        const card = this.parentElement;
        const title = card.querySelector(".shopTitle").textContent;
        const costText = card.querySelector(".shopPrice").textContent;
        const cost = Number(costText.replace(" Gold",""));

        const item = this.dataset.item;
        if(ownedItems.includes(item)){
            alert("You already own this item!");
            return;
        }

        const confirmPurchase = confirm(`Buy ${title} for ${cost} gold?`);

        if(!confirmPurchase) return;

        if(coins < cost){
            alert("Not enough gold!");
            return;
        }

        coins -= cost;

        const rewards = shopItems[item];
        rewards.forEach(reward => {
            if(!ownedItems.includes(reward)){
                ownedItems.push(reward);
            }
        });
        saveOwnedItems();

        alert(`${title} added to your inventory!`);

        updateUI();
        saveData();
        updateCustomization();

    });

});


//Saves data to equip clothing for character
function equipItem(type, item){
    
    equipment[type] = item;

    const layers = document.querySelectorAll(`#${type}Layer`);
    layers.forEach(layer => {
        layer.style.backgroundImage = `url("sprites/${item}.png")`;
    });

    saveEquipment();

}

function saveEquipment(){
    localStorage.setItem("equipment", JSON.stringify(equipment));
}

function loadEquipment(){
    const savedEquipment = localStorage.getItem("equipment");
    if(savedEquipment){
        equipment = JSON.parse(savedEquipment);
    }

    for(const type in equipment){
        const layers = document.querySelectorAll(`#${type}Layer`);

        layers.forEach(layer => {
            layer.style.backgroundImage = `url("sprites/${equipment[type]}.png")`;
        });
    }
}

function updateCustomization(){
    const buttons = document.querySelectorAll(".customButtons button");

    buttons.forEach(button => {
        const onclick = button.getAttribute("onclick");
        if(!onclick) return;

        const match = onclick.match(/'([^']+)'/g);
        if(!match) return;

        const item = match[1].replace(/'/g, "");

        if(!ownedItems.includes(item)){
            button.style.display = "none";
        } else {
            button.style.display = "block";
        }
    });
}

function saveOwnedItems(){
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
}
function loadOwnedItems(){
    const saved = localStorage.getItem("ownedItems");
    if(saved){
        ownedItems = JSON.parse(saved);
    }
}


window.onload = function(){
    loadData();
    loadEquipment();
    loadOwnedItems();
    updateCustomization();
}