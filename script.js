let offset = 20; // Initial offset starts after the first 20 Pokémon

function init() {
    renderPokeCards();
}

function showSpinner() {
    const spinnerRef = document.getElementById("spinner");
    spinnerRef.style.display = "block";
}

function hideSpinner() {
    const spinnerRef = document.getElementById("spinner");
    spinnerRef.style.display = "none";
}

function hideButton() {
    const buttonRef = document.getElementById("spinner-div"); // Use getElementById here
    buttonRef.style.display = "none";
}

function showButton() {
    const buttonRef = document.getElementById("spinner-div"); // Use getElementById here
    buttonRef.style.display = "block";
}

async function fetchData() {
    return await fetchPokemonData(offset, 20);
}

async function renderCards(pokeArray) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = ""; // Clear existing content

    for (let pokeCounter = 0; pokeCounter < pokeArray.length; pokeCounter++) {
        contentRef.innerHTML += getPokeCardTemplate(pokeArray, pokeCounter);
        renderTypes(pokeCounter);
    }
    offset += 20; // Update the offset
}
async function renderPokeCards() {
    showSpinner();
    hideButton();

    try {
        const delay = new Promise(resolve => setTimeout(resolve, 5000)); // Ensure 5-second delay
        const pokeArray = await Promise.all([fetchData(), delay]).then(([data]) => data);

        await renderCards(pokeArray); // Render cards after fetching
    } catch (error) {
        console.error("An error occurred while rendering:", error);
    } finally {
        hideSpinner(); // Ensure spinner is hidden, regardless of success or failure
        showButton();  // Re-show the button
    }
}




async function fetchPokemonData(limit, offset) {
    const pokeAPI = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`; //access basic API
    try {
        const response = await fetch(pokeAPI); //waits for all data to be loaded from API
        if (!response.ok) {
            //if something went wrong, error message
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); //turns data back into json for usability
        return data.results; //returns array
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

async function renderTypes(counter) {
    const pokeInfo = await fetchPokemonDetails(counter); // Fetch details of a single Pokémon
    const typeRef = document.getElementById(`types${counter + 1}`);
    typeRef.innerHTML = ""; // Clear existing types

    // Loop through the `types` array and render each type
    for (
        let typeCounter = 0;
        typeCounter < pokeInfo.types.length;
        typeCounter++
    ) {
        const typeObject = pokeInfo.types[typeCounter]; // Access the type object
        typeRef.innerHTML += getTypeTemplate(typeObject); // Pass it to the template function
        setCardBacground(typeObject, counter);
    }
}

async function fetchPokemonDetails(counter) {
    const infoAPI = `https://pokeapi.co/api/v2/pokemon/${counter + 1}`; //since link is identical for each API but just the numbe ris different, add 1 to counter of loop
    try {
        const response = await fetch(infoAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const typeInfo = await response.json();
        return typeInfo;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

function setCardBacground(type, cardCounter){
    const contentRef = document.getElementById(`pokemon${cardCounter + 1}`);
    contentRef.classList.add(`${type.type.name}`)
}


function searchPokemon(){
    const inputRef = document.getElementById('search-input'); 
    
    console.log(inputRef.value);
    
}





//Suchfunktion
// what I need: 
    // ability to extract user input (starting from 3 characteristics?)
    // access to the whole API
        //but I only render 20, so do I need to fetch all 1300 Pokes?
    // render accordinlgy, but also dynamically according to search
        //how?
        // work with 2 APIS - the big basic one and the specific PokeAPI
    // not found message
    // at least three characters required or search won't work


//Design für Overlay
    //allgemeine Daten
    //Statuswerte
    //Basisangriffe