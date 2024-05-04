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
    // Agregar un event listener al botón después de crearlo
    button.addEventListener("click", function () {
        // Guardar el nombre del Pokémon en el localStorage
        localStorage.setItem("selectedPokemon", pokemon.name);

        // Abre la modal aquí
        // ...
    });

    button.type = "button";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#exampleModal");
    button.setAttribute("data-capitulo", `${pokemon.id}`);

    // Agregar un event listener al botón después de crearlo
    button.addEventListener("click", function () {
        // Eliminar  clase 'deactivate' al div con id 'contenido'
        document.getElementById("loading").classList.remove("deactivate");

        const capitulo = this.getAttribute("data-capitulo");

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

                console.log("ver " + data.sprites.other.home.front_default)

                base_experienceElement.innerHTML = "<strong>Base experience:</strong> " + data.base_experience;

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



/*******************/
// Capturando el botón y el elemento ul
const btnMostrarHistorial = document.getElementById("mostrarHistorial");
const ulListado = document.getElementById("pokemones_vistos");

// Añadiendo un event listener al botón para capturar el click
btnMostrarHistorial.addEventListener("click", function () {
 
    ListarHistorial();

});

//Borrar el historial de la modal
document.getElementById('vaciarLocalStorage').addEventListener('click', function () {

    var resultado = confirm("¿Está seguro que quiere borrar los datos?");

    if (resultado === true) {
        // El usuario ha hecho clic en "Aceptar"
        // Aquí puedes realizar alguna acción
        console.log("El usuario ha confirmado.");
        // Vaciar localStorage
        localStorage.clear();
    } else {
        // El usuario ha hecho clic en "Cancelar" o ha cerrado el cuadro de diálogo
        // Aquí puedes realizar alguna otra acción o simplemente ignorar
        console.log("El usuario ha cancelado.");
    }
    ListarHistorial()
    
    
    //alert('Está seguro que quiere borrar los datos?');


});



// Funcion Listar Historial 

function ListarHistorial(){
       // Paso 1: Cargar el array del localStorage
       let dataArray = JSON.parse(localStorage.getItem("myDataArray"));

       // Paso 2: Verificar si el array se ha cargado correctamente
       if (dataArray) {
           document.getElementById("resultado").textContent = dataArray.length;
   
           // Paso 3: Ordenar el array en orden inverso (de último a primero)
           dataArray.reverse();
   
           // Paso 4: Limpiar el contenido previo del ul
           ulListado.innerHTML = "";
   
           // Paso 5: Recorrer el array y crear elementos li para cada elemento
           dataArray.forEach(function (element) {
               const li = document.createElement("li");
               //li.textContent = JSON.stringify(element); // Convertir el elemento a texto
               li.textContent = element.id + ") " + element.name;
               ulListado.appendChild(li); // Agregar el elemento li al ul
           });
       } else {
           document.getElementById("resultado").textContent = 0;
           ulListado.innerHTML = "<li>No hay datos en el historial</li>";
       }
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

    // Mostrar por defecto todos los pokemones
    displayPokemon(1, 100);
}

// Función para obtener la lista de pokémones de la API
async function getPokemonList() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
    const data = await response.json();
    return data.results.map((pokemon, index) => ({ id: index + 1, name: pokemon.name }));
}

// Función para mostrar los pokémones dentro de un rango específico
async function displayPokemon(start, end) {
    const pokemonList = await getPokemonList();
    const pokemonDiv = document.getElementById("pokemon-container");
    pokemonDiv.innerHTML = "";
    for (let i = start; i <= end; i++) {
        const pokemon = pokemonList.find(p => p.id === i);
        if (pokemon) {
            const pokemonCard = cardPokemon(pokemon);
            pokemonDiv.appendChild(pokemonCard);
        }
    }
}

// Event listener para el cambio en el rango de selección
document.getElementById("temporada_select").addEventListener("change", function () {
    const selectedOption = this.value;
    switch (selectedOption) {
        case "1":
            displayPokemon(1, 25);
            break;
        case "2":
            displayPokemon(26, 50);
            break;
        case "3":
            displayPokemon(51, 75);
            break;
        case "4":
            displayPokemon(76, 100);
            break;
        case "5":
            displayPokemon(1, 100);
            break;
    }
});

// Llamamos a la función principal
main();
