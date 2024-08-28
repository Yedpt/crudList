// mi endpoint es: http://localhost:3000/peliculas
// aqui estara las peticiones http 
// y crearemos una funcion por cada letra de CRUD 
// CRUD C-CREATE , R-READ , U-UPDATE ,  D-Delete
// get es un metodo del protocolo http , post , put , patch , delete, head 
//READ - metodo get
 // URL base donde json-server está ejecutándose
 const baseUrl = 'http://localhost:3000/peliculas'; // URL de la fake db

 // READ - metodo GET
 // Función para obtener las películas
 async function getMovies() {
     try {
         const response = await fetch(baseUrl, {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json'
             }
         });
         const data = await response.json()
         return data;
     } catch (error) {
         console.error('Error en la lista de películas:', error);
     }
 }
 
 // Función para mostrar las películas en la lista
 async function printMovies() {
     const data = await getMovies();
        const moviesList = document.getElementById('movies-list');
        moviesList.innerHTML = '';  // Limpiar la lista antes de agregar nuevos elementos
    
        data.map(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = `${movie.title} (${movie.year}) género: ${movie.genre}`;
    
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<i class="fas fa-trash"></i> eliminar`;
            deleteButton.type = 'button';
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                deleteMovie(movie.id, listItem);
            });
    
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
            editButton.type = 'button';
            editButton.addEventListener('click', () => showEditForm(movie));
    
            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);
            moviesList.appendChild(listItem);
        });
 }

  // DELETE - método delete
 // Función para eliminar una película
 async function deleteMovie(movieId, listItem) {
    try {
        const response = await fetch(`${baseUrl}/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            listItem.remove();  // Remover el <li> del DOM sin recargar la lista completa
            // getMovies() // este es de prueba .
        } else {
            console.error(`No se pudo eliminar la película con ID ${movieId}`);
        }
    } catch (error) {
        console.error('Error al eliminar la película:', error);
    }
}

// POST - metodo post 
// Funcion para crear(añadir) una nueva pelicula

async function createMovie() {
    // event.preventDefault()

    const tittle = document.getElementById('title').value
    const year = document.getElementById('year').value
    const genre = document.getElementById('genre').value
    
    const newMovie = {
        title : tittle,
        year: year,
        genre: genre
    }

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newMovie)
        })

        if (response.ok) {
            const data = await response.json()
            addMovieTolist(data)
            resetForm() // para limpiar el formulario despues de añadir
        }else{
            console.error('error al añadir la pelicula')
        }
    } catch (error) {
        console.log('error al hacer la peticion para añadir peliculas',error)
    }
}

// POST 

// funcion para añadir una pelicula directamente al DOM

async function addMovieToList(movie) {

    const movieList = document.getElementById('movie-list')

    const listItem = document.createElement('li')
    listItem.textContent = `${movie.title} (${movie.year}) género: ${movie.genre}`
    
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = `<i class="fas fa-trash"></i> Eliminar`
    deleteButton.type = 'button'
    deleteButton.addEventListener('click', async() =>{

        await deleteMovie(movie.id, listItem)
    })

    const editButton = document.createElement('button')
    editButton.innerHTML = '<i class="fas fa-edit"></i> Editar'
    editButton.type = 'button'
    editButton.addEventListener('click', async() => {
        await showEditForm(movie)
    })

    listItem.appendChild(deleteButton)
    listItem.appendChild(editButton)
    movieList.appendChild(listItem)
}

// UPDATE- metodo put 
// funcion para actualizar una pelicula existente

async function updateMovie(movieId, updateMovie) {
    try {
        const response = await fetch(`${baseUrl}/${movieId}`,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updateMovie)
        })
        if (response.ok) {
            console.log(`Pelicula con ID ${movieId} actualizada`)
            await printMovies()
        }else{
            console.error(`No se pudo actualizar la pelicula con ID ${movieId}`)
        }

    } catch (error) {
        console.error("error al actualizar la pelicula",error)
    }    
}

// creo esta funcion despues editar los inputs queden en blanco 
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('year').value = '';
    document.getElementById('genre').value = '';
}

// funcion para mostrar el formulario de edicion con los datos actuales de la peli 
// UPDATE- metodo put 
async function showEditForm(movie) {
    const title = document.getElementById('title')
    const year = document.getElementById('year')
    const genre = document.getElementById('genre')

 // Relleno los campos del formulario con los datos de la película a editar
 title.value = movie.title
 year.value = movie.year
 genre.value = movie.genre

 //cambio el texto del boton de añadir para indicar que estamos editando

 const submitButton = document.querySelector('#add-movie-form button[type="submit"]');
 submitButton.textContent = 'Actualizar Película'

// actualizo el vento submit para realizar la actualizacion en lugar de añadir
addMovieForm.removeEventListener('submit', createMovie)
addMovieForm.addEventListener('submit', function updateHandler(event){
    event.preventDefault()

    const updateMoviee = {
        title : title.value,
        year: parseInt(year.value),
        genre: genre.value
    }

        updateMovie(movie.id, updateMoviee).then(() => {
            // aqui restauro el formulario a su estado original
            resetForm()
            submitButton.textContent = 'añadir pelicula'
            addMovieForm.removeEventListener('submit',updateHandler)
            addMovieForm.addEventListener('submit', createMovie)
        })
    
    // restauro el formulario a su estado original
    
    submitButton.textContent = 'añadir pelicula'
    addMovieForm.removeEventListener('submit', updateHandler)
    addMovieForm.addEventListener('submit', createMovie)
})


}



 // Cargar automáticamente las películas cuando se carga la página
 window.addEventListener('DOMContentLoaded', printMovies);

 const addMovieForm = document.getElementById('add-movie-form')
 addMovieForm.addEventListener('submit', createMovie)


