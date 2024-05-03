async function getPokemonData() {
    try {
        const respuesta = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        const data = await respuesta.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

function lestraMayuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para crear una tarjeta para cada Pokémon
function cardPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const img = document.createElement("img");
    img.classList.add("pokemon-img");
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    img.alt = pokemon.name;

    const name = document.createElement("h3");
    name.textContent = lestraMayuscula(pokemon.name);

    const button = document.createElement("button");
    button.textContent = "Ver más info";
    button.classList.add("custom-button");
    /*button.addEventListener('click', () => {
          window.location.href = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
      });*/

    button.type = "button";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#exampleModal");
    button.setAttribute("data-capitulo", `${pokemon.id}`);

    // Agregar un event listener al botón después de crearlo
    button.addEventListener("click", function () {
        // Eliminar  clase 'deactivate' al div con id 'contenido'
        document.getElementById("loading").classList.remove("deactivate");

        // Obtén el valor del atributo data-capitulo
        const capitulo = this.getAttribute("data-capitulo");
        //console.log('Capítulo:', capitulo);

        // Almacena el valor de capitulo en localStorage

        //leer detalle en modal
        const URL_CAP = "https://pokeapi.co/api/v2/pokemon/" + capitulo;

        fetch(URL_CAP)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Obtener los elementos del modal
                const titleElement = document.getElementById("titulo");
                const imgElement = document.getElementById("img");
                const tempElement = document.getElementById("temporada");
                const speciesElement = document.getElementById("episodio");
                const base_experienceElement = document.getElementById("base_experience");
                const contentElement = document.getElementById("descripcion");

                // Asignar la información de la API a los elementos del modal
                titleElement.textContent = data.name;

                const image = data.sprites.other.home.front_default;
                // Verificar si la imagen existe en el origen
                checkImageExists(image, function (exists) {
                    if (exists) {
                        // Si la imagen existe, asignar la URL de la imagen al elemento de imagen
                        imgElement.src = image;
                        console.log("MOSTRAR ");
                    } else {
                        // Si la imagen no existe, asignar una imagen de placeholder
                        imgElement.src = "img/placeholder_image.jpg";
                        console.log("MOSTRAR 22");
                    }
                });

                // Accede al array de habilidades
                const abilities = data.abilities;
                let abilityNames = "";

                abilities.forEach((abilityObj) => {
                    const abilityName = abilityObj.ability.name;
                    abilityNames += "" + abilityName + ", ";
                });


                // Asigna los nombres de las habilidades al elemento HTML
                tempElement.innerHTML = "<strong>Ability:</strong> " + abilityNames;


                // Accede al array de Especies
                speciesElement.innerHTML = "<strong>Especie:</strong> " + data.species.name;

                console.log("ver "+data.sprites.other.home.front_default)

                base_experienceElement.innerHTML =  "<strong>Base experience:</strong> " + data.base_experience;

                contentElement.textContent = data.description;


                // Paso 1: Verificar si ya existe un array en el localStorage
                let dataArray = JSON.parse(localStorage.getItem("myDataArray"));

                // Paso 2: Si no existe, crear un nuevo array
                if (!dataArray) {
                    dataArray = [];
                }


                // Paso 3: Realizar operaciones en el array (por ejemplo, agregar un nuevo elemento)
                dataArray.push({ id: data.id, name: data.name });


                // Paso 4: Guardar el array actualizado en el localStorage
                localStorage.setItem("myDataArray", JSON.stringify(dataArray));


                // Agregar clase 'placeholder' después de cierto tiempo
                setTimeout(function () {
                    document.getElementById("loading").classList.add("deactivate");
                    //document.getElementById('loading').classList.remove('deactivate');
                }, 1000); // Change 3000 to the desired delay in milliseconds


            });
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(button);

    return card;
}

function checkImageExists(url, callback) {
    var img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}

// Función principal para obtener los datos y crear las tarjetas
async function main() {
    const pokemonData = await getPokemonData();

    const pokemonContainer = document.getElementById("pokemon-container");

    pokemonData.forEach(async (pokemon, index) => {
        const id = index + 1;

        const pokemonCard = cardPokemon({ id, name: pokemon.name });

        pokemonContainer.appendChild(pokemonCard);
    });
}

// Llamamos a la función principal
main();
