let pokeArray = [];
let offset = 20;
let currentId = 1;

async function init() {
    await fetchGlobalPokemonArray();
    renderPokeCards();
}

async function fetchGlobalPokemonArray() {
    try {
        pokeArray = await fetchPokemonData(offset, 0);
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

async function renderPokeCards() {
    showSpinner();
    hideButton();
    try {
        const delay = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.all([fetchGlobalPokemonArray(), delay]);
        await renderCards(pokeArray);
    } catch (error) {
        console.error("An error occurred while rendering cards:", error);
    } finally {
        hideSpinner();
        showButton();
    }
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
    const buttonRef = document.getElementById("spinner-div");
    buttonRef.style.display = "none";
}

function showButton() {
    const buttonRef = document.getElementById("spinner-div");
    buttonRef.style.display = "block";
}

async function fetchPokemonData(limit, offset) {
    const pokeAPI = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
        const response = await fetch(pokeAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

async function renderCards(pkeList) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    for (let pIndex = 0; pIndex < pkeList.length; pIndex++) {
        contentRef.innerHTML += getPokeCardTemplate(pkeList, pIndex);
        renderTypes(pIndex);
    }
    offset += 20;
}

async function renderTypes(counter) {
    const pokeInfo = await fetchPokemonDetails(counter);
    const typeRef = document.getElementById(`types${counter + 1}`);
    typeRef.innerHTML = "";

    pokeInfo.types.forEach((typeObject) => {
        typeRef.innerHTML += getTypeTemplate(typeObject);
        setCardBacground(typeObject, counter);
    });
}

async function fetchPokemonDetails(counter) {
    const infoAPI = `https://pokeapi.co/api/v2/pokemon/${counter + 1}`;
    try {
        const response = await fetch(infoAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const typeInfo = await response.json();
        return typeInfo;
    } catch (error) {
        console.error("Failed to fetch Pokémon details:", error);
    }
}

function setCardBacground(type, cardCounter) {
    const contentRef = document.getElementById(`pokemon${cardCounter + 1}`);
    if (contentRef) {
        contentRef.classList.add(`${type.type.name}`);
    }
}

function searchPokemon() {
    const usableInput = trimInputValue();
    if (usableInput.length === 0) {
        renderPokeCards();
        return;
    }
    if (usableInput.length < 3) {
        console.log("Input too short to trigger search.");
        return;
    }
    renderMatchedPokemon(usableInput);
}

function trimInputValue() {
    const inputRef = document.getElementById("search-input");
    const query = inputRef.value.trim().toLowerCase();
    return query;
}

function renderMatchedPokemon(characters) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    let found = false;
    for (let i = 0; i < pokeArray.length; i++) {
        if (pokeArray[i].name.toLowerCase().includes(characters)) {
            contentRef.innerHTML += getPokeCardTemplate(pokeArray, i);
            renderTypes(i);
            found = true;
        }
    }
    if (!found) {
        contentRef.innerHTML = getNotFoundTemplate();
    }
}

function showOverlay(pokeApiIndex) {
    const overlayRef = document.getElementById("overlay");
    overlayRef.classList.remove("d-none");
    overlayRef.classList.add("d-flex");
    overlayRef.addEventListener("click", handleOverlayClick);
    renderDynamicInfoBox(pokeApiIndex);
    document.body.style.overflow = "hidden";
}

function closeOverlay() {
    const overlayRef = document.getElementById("overlay");
    overlayRef.classList.remove("d-flex");
    overlayRef.classList.add("d-none");
    overlayRef.removeEventListener("click", handleOverlayClick);
    document.body.style.overflow = "auto";
}

function handleOverlayClick(event) {
    if (event.target.closest("#poke-info")) {
        return;
    }
    closeOverlay();
}

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
    if (!entry) return "No description available.";

    return entry.flavor_text.replace(/[\n\f]/g, " ");
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

function showNext() {
    if (currentId < pokeArray.length - 1) {
        currentId++;
        fetchOverlayPokemonData(currentId);
        changeOverlayName(currentId - 1);
        changeMainOverlayImg(currentId - 1);
        changeShinyIMG(currentId - 1);
    }
    handleLeftArrowVisibility()
}

function selectPokemon(pokedexId) {
    currentId = pokedexId;
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
    handleLeftArrowVisibility(); 
}


function handleLeftArrowVisibility() {
    if (currentId === 1) {
        hideLeftArrow();
    } else {
        showLeftArrow();
    }
}


function hideLeftArrow(){
    let leftArrowRef = document.getElementById('left-arrow');
    leftArrowRef.classList.add('d-none')
}

function showLeftArrow(){
    const leftArrowRef = document.getElementById('left-arrow');
    leftArrowRef.classList.remove('d-none')
}



