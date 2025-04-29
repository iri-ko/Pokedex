// Global Variables
let pokeArray = []; // Global Pokémon array
let offset = 20; // Offset for pagination or fetching Pokémon

// Initialize the Application
async function init() {
    await fetchGlobalPokemonArray(); // Populate the global Pokémon array
    renderPokeCards(); // Render the initial batch of Pokémon cards
}

// Fetch and Store the Global Pokémon Array
async function fetchGlobalPokemonArray() {
    try {
        pokeArray = await fetchPokemonData(offset, 0); // Fetch Pokémon data and assign to global array
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

// Render All Pokémon Cards
async function renderPokeCards() {
    showSpinner();
    hideButton();

    try {
        const delay = new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for loading spinner
        await Promise.all([fetchGlobalPokemonArray(), delay]); // Fetch Pokémon and wait
        await renderCards(pokeArray); // Render all cards
    } catch (error) {
        console.error("An error occurred while rendering cards:", error);
    } finally {
        hideSpinner();
        showButton();
    }
}

// Utility Functions for UI Feedback
function showSpinner() {
    const spinnerRef = document.getElementById("spinner");
    spinnerRef.style.display = "block";
}

function hideSpinner() {
    const spinnerRef = document.getElementById("spinner");
    spinnerRef.style.display = "none";
}

function hideButton() {
    const buttonRef = document.getElementById("spinner-div");
    buttonRef.style.display = "none";
}

function showButton() {
    const buttonRef = document.getElementById("spinner-div");
    buttonRef.style.display = "block";
}

// Fetch Pokémon Data from API
async function fetchPokemonData(limit, offset) {
    const pokeAPI = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
        const response = await fetch(pokeAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.results; // Array of basic Pokémon data
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

// Render Pokémon Cards
async function renderCards(pkeList) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = ""; // Clear previous content

    for (let pIndex = 0; pIndex < pkeList.length; pIndex++) {
        contentRef.innerHTML += getPokeCardTemplate(pkeList, pIndex); // Generate cards with template
        renderTypes(pIndex); // Render Pokémon types
    }
    offset += 20; // Update offset for pagination
}

// Render Types for Each Pokémon
async function renderTypes(counter) {
    const pokeInfo = await fetchPokemonDetails(counter);
    const typeRef = document.getElementById(`types${counter + 1}`);
    typeRef.innerHTML = ""; // Clear existing types

    pokeInfo.types.forEach(typeObject => {
        typeRef.innerHTML += getTypeTemplate(typeObject); // Render type spans
        setCardBacground(typeObject, counter); // Set card background based on type
    });
}

// Fetch Detailed Pokémon Information
async function fetchPokemonDetails(counter) {
    const infoAPI = `https://pokeapi.co/api/v2/pokemon/${counter + 1}`;
    try {
        const response = await fetch(infoAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const typeInfo = await response.json();
        return typeInfo; // Return detailed Pokémon data
    } catch (error) {
        console.error("Failed to fetch Pokémon details:", error);
    }
}

// Search Pokémon Functionality
function searchPokemon() {
    const usableInput = trimInputValue();

    // If the input is empty, load the original first 20 Pokémon
    if (usableInput.length === 0) {
        renderPokeCards(); // Re-render the original first 20 cards
        return;
    }

    // If fewer than three characters are entered, retain the current cards
    if (usableInput.length < 3) {
        console.log("Input too short to trigger search."); // Debugging message
        return;
    }

    // Render matched Pokémon for valid input
    renderMatchedPokemon(usableInput);
}



// Trim and Format User Input
function trimInputValue() {
    const inputRef = document.getElementById("search-input");
    const query = inputRef.value.trim().toLowerCase();
    return query;
}

// Render Matching Pokémon Dynamically
function renderMatchedPokemon(characters) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = ""; // Clear previous content

    for (let i = 0; i < pokeArray.length; i++) {
        if (pokeArray[i].name.toLowerCase().includes(characters)) {
            contentRef.innerHTML += getPokeCardTemplate(pokeArray, i); // Render matching cards
            renderTypes(i); // Render types for the matched Pokémon
        }
    }
}

// Set Background Color of Cards Based on Type
function setCardBacground(type, cardCounter) {
    const contentRef = document.getElementById(`pokemon${cardCounter + 1}`);
    if (contentRef) {
        contentRef.classList.add(`${type.type.name}`); // Add class for type-based styling
    }
}