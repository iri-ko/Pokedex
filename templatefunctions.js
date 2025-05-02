function getPokeCardTemplate(pkeList, pIndex) {
    return `<div onclick="selectPokemon(${pIndex + 1}); showOverlay(${pIndex})" id="pokemon${pIndex + 1}" class="poke-card">
                <div class="card-top">
                    <h2>${pkeList[pIndex].name}</h2>
                    <span>#${pIndex + 1}</span>
                </div>
                <div class="card-bottom">
                    <div id="types${pIndex + 1}" class="types"></div>
                    <img class="poke-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pIndex + 1}.svg"/>
                </div>
                <div class="card-bg"></div>
            </div>`;
}

function getTypeTemplate(typeObject) {
    return `<span class="${typeObject.type.name}">${typeObject.type.name}</span>`;
}

function getNotFoundTemplate() {
    return `<p class="not-found">Pokémon not found</p>`;
}

function getOverlayAboutTemplate(pokemonData, speciesData) {
    return `<div class="flavor-text">
            ${getFlavorText(speciesData)}
            </div>
            <div class="info-points">
                <span>Pokédex-ID:</span>
                <span>#${pokemonData.id}</span>
            </div>
            <div class="info-points">
                <span>Height</span>
                <span>${getHeight(pokemonData)}m</span>
            </div>
            <div class="info-points">
                <span>Weight:</span>
                <span>${getweight(pokemonData)}kg</span>
            </div>`;
}

function getOverlayStatsTemplate(pokemonData) {
    return `<div id="overlay-stats-content" class="stats-container">
                <div class="stats-row">
                    <div class="stat-label">HP:</div>
                    <div>${pokemonData.stats[0].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[0].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
                <div class="stats-row">
                    <div class="stat-label">Attack:</div>
                    <div>${pokemonData.stats[1].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[1].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
                <div class="stats-row">
                    <div class="stat-label">Defense:</div>
                    <div>${pokemonData.stats[2].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[2].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
                <div class="stats-row">
                    <div class="stat-label">Special Attack:</div>
                    <div>${pokemonData.stats[3].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[3].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
                <div class="stats-row">
                    <div class="stat-label">Special Defense:</div>
                    <div>${pokemonData.stats[4].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[4].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
                <div class="stats-row">
                    <div class="stat-label">Speed:</div>
                    <div>${pokemonData.stats[5].base_stat}</div>
                    <svg class="svg-bar">
                        <rect width="100" height="10" class="bar-bg"></rect>
                        <rect width="${pokemonData.stats[5].base_stat}" height="10" class="bar-fill"></rect>
                    </svg>
                </div>
            </div>

`
}
