function init() {
    renderPokeCards();
}

async function renderPokeCards() {
    const pokeArray = await fetchPokemonData(20, 0); //access basic API with all Poke and their corresponding API

    //render according to basic array for name, use counter for images and ID, as well as pass it to the renderTypes function to acess correspoding API.
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    for (let pokeCounter = 0; pokeCounter < pokeArray.length; pokeCounter++) {
        contentRef.innerHTML += getPokeCardTemplate(pokeArray, pokeCounter);
        renderTypes(pokeCounter);
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