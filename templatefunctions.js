function getPokeCardTemplate(pokeArray, pokeCounter) {
    return `<div id="pokemon${pokeCounter + 1}" class="poke-card">
                <div class="card-top">
                    <h2>${pokeArray[pokeCounter].name}</h2>
                    <span>#${pokeCounter + 1}</span>
                </div>
                <div class="card-bottom">
                    <div id="types${pokeCounter + 1}" class="types"></div> <!-- Container for types -->
                    <img
                        class="poke-img"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokeCounter + 1}.svg"
                        alt="${pokeArray[pokeCounter].name}"
                    />
                </div>
                <div class="card-bg"></div>
            </div>`;
}


function getTypeTemplate(typeObject) {
    return `<span>${typeObject.type.name}</span>`; 
}
