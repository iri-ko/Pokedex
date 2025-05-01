let pokeArray = []; // Global Pokémon array
let offset = 20; // Offset for pagination or fetching Pokémon
let currentId = 1; // needed for cycling through overlays

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
        const delay = new Promise((resolve) => setTimeout(resolve, 2000)); // Artificial delay for loading spinner
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

    pokeInfo.types.forEach((typeObject) => {
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

// Set Background Color of Cards Based on Type
function setCardBacground(type, cardCounter) {
    const contentRef = document.getElementById(`pokemon${cardCounter + 1}`);
    if (contentRef) {
        contentRef.classList.add(`${type.type.name}`); // Add class for type-based styling
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

// Render Matching PoTémon Dynamically
function renderMatchedPokemon(characters) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = ""; // Clear previous content

    let found = false; // created to check if Poke was found, boolean used later to display message (or not)

    for (let i = 0; i < pokeArray.length; i++) {
        if (pokeArray[i].name.toLowerCase().includes(characters)) {
            contentRef.innerHTML += getPokeCardTemplate(pokeArray, i); // Render matching cards
            renderTypes(i); // Render types for the matched Pokémon
            found = true; // Set flag to true
        }
    }

    // If no Pokémon match the search, display a "not found" message
    if (!found) {
        contentRef.innerHTML = getNotFoundTemplate();
    }
}

// #region overlay

function showOverlay(pokeApiIndex) {
    const overlayRef = document.getElementById("overlay");
    overlayRef.classList.remove("d-none");
    overlayRef.classList.add("d-flex");
    overlayRef.addEventListener("click", handleOverlayClick); //Needed for event bubbling for closing func
    renderDynamicInfoBox(pokeApiIndex);
    document.body.style.overflow = "hidden"; // Disable scrolling
}

function closeOverlay() {
    const overlayRef = document.getElementById("overlay");
    overlayRef.classList.remove("d-flex");
    overlayRef.classList.add("d-none");
    overlayRef.removeEventListener("click", handleOverlayClick); //remove cause not neccesary when invisible
    document.body.style.overflow = "auto"; // Enable scrolling again
}

function handleOverlayClick(event) {
    if (event.target.closest("#poke-info")) {
        return; // Do nothing if the user clicked inside box
    }

    // Step 3: Close the overlay if the click was outside
    closeOverlay();
}

// #region dynamic overlay info

function renderDynamicInfoBox(pokeApiIndex) {
    changeOverlayName(pokeApiIndex);
    changeMainOverlayImg(pokeApiIndex);
    fetchOverlayPokemonData(pokeApiIndex + 1);
    changeShinyIMG(pokeApiIndex);
}

function changeOverlayName(nameIndex) {
    const nameRef = document.getElementById("overlay-name");
    nameRef.innerHTML = `${pokeArray[nameIndex].name}`;
}

function changeMainOverlayImg(mainImgIndex) {
    const mainImgRef = document.getElementById("overlay-img-main");
    mainImgRef.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        mainImgIndex + 1
    }.png`;
}

async function fetchOverlayPokemonData(pokedexId) {
    try {
        const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokedexId}`
        );
        const pokemonData = await pokemonResponse.json(); //for number infos

        const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokedexId}`
        );
        const speciesData = await speciesResponse.json(); //for flavor text

        renderAbout(pokemonData, speciesData);
        renderStats(pokemonData);
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

function renderAbout(pokemonData, speciesData) {
    const overlayAboutRef = document.getElementById("overlay-info-div");
    overlayAboutRef.innerHTML = getOverlayAboutTemplate(
        pokemonData,
        speciesData
    );
}

function getFlavorText(speciesData) {
    const entry = speciesData.flavor_text_entries.find(
        (e) => e.language.name === "en"
    );
    //seraches English language flavor text
    if (!entry) return "No description available."; // if not found, display this

    return entry.flavor_text.replace(/[\n\f]/g, " "); // if found, replace flavor text but remove weird formatting thingies
}

function getHeight(pokemonData) {
    const pokeHeight = pokemonData.height / 10;
    return pokeHeight;
}

function getweight(pokemonData) {
    const pokeWeight = pokemonData.weight / 10;
    return pokeWeight;
}

function renderStats(pokemonData) {
    const overlayAboutRef = document.getElementById("overlay-stats-content");
    overlayAboutRef.innerHTML = getOverlayStatsTemplate(pokemonData);
}

function changeShinyIMG(shinyIndex) {
    const mainImgRef = document.getElementById("shinyIMG");
    mainImgRef.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${
        shinyIndex + 1
    }.png`;
}

// #endregion

// #region category visibility

function showAbout() {
    const infoRef = document.getElementById("pokeinfo-content");
    const statsRef = document.getElementById("pokeinfo-stats");
    const shinyRef = document.getElementById("pokeinfo-shiny");
    infoRef.classList.remove("d-none");
    statsRef.classList.add("d-none");
    shinyRef.classList.add("d-none");
}

function showStats() {
    const infoRef = document.getElementById("pokeinfo-content");
    const statsRef = document.getElementById("pokeinfo-stats");
    const shinyRef = document.getElementById("pokeinfo-shiny");
    infoRef.classList.add("d-none");
    statsRef.classList.remove("d-none");
    shinyRef.classList.add("d-none");
}

function showShiny() {
    const infoRef = document.getElementById("pokeinfo-content");
    const statsRef = document.getElementById("pokeinfo-stats");
    const shinyRef = document.getElementById("pokeinfo-shiny");
    infoRef.classList.add("d-none");
    statsRef.classList.add("d-none");
    shinyRef.classList.remove("d-none");
}

// #endregion

function showNext() {
    if (currentId < pokeArray.length - 1) {
        currentId++; // Now correctly starts from the selected Pokémon
        fetchOverlayPokemonData(currentId);
        changeOverlayName(currentId - 1);
        changeMainOverlayImg(currentId - 1);
        changeShinyIMG(currentId - 1);
    }
}

function selectPokemon(pokedexId) {
    currentId = pokedexId; // Set the correct ID
    fetchOverlayPokemonData(currentId);
}

function showPrevious() {
    if (currentId > 1) {
        currentId--;
        changeOverlayName(currentId - 1);
        changeMainOverlayImg(currentId - 1);
        fetchOverlayPokemonData(currentId);
        changeShinyIMG(currentId - 1);
    }
}

// #endregion
