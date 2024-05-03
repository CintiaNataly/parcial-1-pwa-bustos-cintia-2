// Función para hacer la solicitud a la API
async function getPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para crear una tarjeta para cada Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const img = document.createElement('img');
    img.classList.add('pokemon-img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    img.alt = pokemon.name;

    const name = document.createElement('h3');
    name.textContent = capitalizeFirstLetter(pokemon.name); // Capitalizamos la primera letra del nombre

    const button = document.createElement('button');
    button.textContent = 'Ver más info';
    button.classList.add('custom-button');
    button.addEventListener('click', () => {
        window.location.href = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(button);

    return card;
}


// Función principal para obtener los datos y crear las tarjetas
async function main() {
    const pokemonData = await getPokemonData();

    const pokemonContainer = document.getElementById('pokemon-container');

    pokemonData.forEach(async (pokemon, index) => {
        // Obtenemos el ID del Pokémon a partir de su URL
        const id = index + 1;

        // Creamos la tarjeta del Pokémon
        const pokemonCard = createPokemonCard({ id, name: pokemon.name });

        // Añadimos la tarjeta al contenedor
        pokemonContainer.appendChild(pokemonCard);
    });
}

// Llamamos a la función principal
main();
