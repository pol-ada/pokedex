'use strict'
// Please don't delete the 'use strict' line above

//DOM OBJECTS
const screenInside = document.querySelector('.screen-inside');
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeID = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
let pokeWeight = document.querySelector('.poke-weight');
let pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const nextButton = document.querySelector('.rectangle-button-two');
const previousButton = document.querySelector('.rectangle-button-one');
const crossButtonNext = document.querySelector('.x-pad.right');
const crossButtonPrevious = document.querySelector('.x-pad.left');
const searchIdScreen = document.querySelector('.yellow-screen');
const numberButtons = document.querySelectorAll('.number-button');
const enterButton =document.querySelector('.enter');
const deleteButton =document.querySelector('.delete');
const crossButtonUp = document.querySelector('.x-pad.top');
const crossButtonDown = document.querySelector('.x-pad.bottom')
const ability = document.querySelector('.ability');
const experience = document.querySelector('.experience');
const screenOne = document.querySelector('.screen-one');
const screenTwo = document.querySelector('.screen-two');


//CONSTANTS AND VARIABLES
const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];
// console.log(TYPES)

let preUrl = null;
let nextUrl = null;
let id = 0;

//FUNCTION

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hidden');
    for(const type of TYPES){
        // console.log(type)
        screenInside.classList.remove(type);
    }
};

  // GET DATA FOR RIGHT SIDE OF THE SCREEN

const fetchPokeList = (url) => {
    fetch (url)
    .then(res=> res.json())
    .then(data=> {
       
        const {results, previous, next } = data;
        preUrl = previous;
        nextUrl = next;
        

    for (let i = 0; i< pokeListItems.length; i++){
        const pokeListItem = pokeListItems[i];
        const resultData = results[i]
        

        if (resultData) {
           const {name, url} = resultData; 
           const urlArray = url.split('/');
           const id = urlArray[urlArray.length - 2];
           pokeListItem.textContent = id + '. ' + capitalize(name);
        } else {
            pokeListItem.textContent = '';
        }
    }

    });  
};

const fetchPokeData = id => {

    fetch (`https://pokeapi.co/api/v2/pokemon/${id}`)

    .then(res => res.json())
    .then(data => {

    resetScreen();

    const dataTypes = data['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];

    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);

    if (dataSecondType) {
        pokeTypeTwo.classList.remove('hidden');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
    } else {
        pokeTypeTwo.classList.add('hidden');
        pokeTypeTwo.textContent = '';
    }

    screenInside.classList.add(dataFirstType['type']['name']);


    pokeName.textContent = capitalize(data['name']);
    pokeID.textContent = "#" + data['id'].toString().padStart(3, '0');
    pokeWeight.innerText = data['weight'];
   
    pokeHeight.innerText = data['height'];

  

    pokeFrontImage.src = data['sprites']['front_default'] || '';
    pokeBackImage.src = data['sprites']['back_default'] || '';

//SECOND PAGE
    const baseExperience = data['base_experience'];
    experience.innerHTML = baseExperience;

    const dataAbilities = data['abilities'];
    // console.log(dataAbilities)

    const ArrayWithAbilities = [];

    for(let i=0; i<dataAbilities.length; i++){
        let newListItem = `<li>${dataAbilities[i].ability.name}</li>`;
        ArrayWithAbilities.push(newListItem)
    }

    ability.innerHTML = ArrayWithAbilities.join('');
});
}

const handlePreviousButtonClick = () => {
    if(preUrl) {
        fetchPokeList(preUrl)
    }
};

const handleNextButtonClick = () => {
    if (nextUrl){
        fetchPokeList(nextUrl)
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;
    
    id = parseInt(listItem.textContent.split('.')[0]); 
    fetchPokeData(id);
}
  

//EVENT LISTENERS

nextButton.addEventListener('click', handleNextButtonClick);
previousButton.addEventListener('click', handlePreviousButtonClick);
    
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}
    //1:01:33

//NUMBERS

numberButtons.forEach(element => {
    element.addEventListener('click', () => {
        if (searchIdScreen.textContent === "ERROR"){
            searchIdScreen.textContent = "";
            searchIdScreen.textContent += element.textContent;
        } else if (searchIdScreen.textContent.length >= 4){
            searchIdScreen.textContent = "ERROR"
        } else {
            searchIdScreen.textContent += element.textContent
        }
    })
});

enterButton.addEventListener('click', () => {
    id = parseInt(searchIdScreen.textContent);
    if (id > 898 || id === 0) {
        searchIdScreen.textContent = "ERROR"
    } else {
        fetchPokeData(id)
    }
});

deleteButton.addEventListener('click', () => {
    searchIdScreen.textContent = ""
})

crossButtonNext.addEventListener('click', () => {
    id += 1
    if(id > 898) {
        searchIdScreen.textContent = "ERROR" 
    } else {
        fetchPokeData(id)
    }  
})

crossButtonPrevious.addEventListener('click', () => {
    id -= 1
    if (id <= 0) {
        searchIdScreen.textContent = "ERROR"; 
        id = 1;
    } else {
       fetchPokeData(id) 
    }
    
})

//CROSS BUTTON NEXT

const arrayWithButtons =[crossButtonUp, crossButtonDown];

arrayWithButtons.forEach(element => {
    element.addEventListener('click', () => {
        if(!mainScreen.classList.contains('hidden')){
            screenOne.classList.toggle("hidden")
            screenTwo.classList.toggle("hidden") 
        }
       
    })
})

// INITIALIZE APP
fetchPokeList('https://pokeapi.co/api/v2/pokemon?limit=12&offset=0')   









