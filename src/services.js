// mi endpoint es: http://localhost:3000/peliculas
// aqui estara las peticiones http 
// y crearemos una funcion por cada letra de CRUD 
// CRUD C-CREATE , R-READ , U-UPDATE ,  D-Delete
// get es un metodo del protocolo http , post , put , patch , delete, head 
//READ - metodo get
 // URL base donde json-server está ejecutándose
 const baseUrl = 'http://localhost:3000/peliculas'; // URL de la fake db

// Función para obtener las películas
async function getMovies() {
    try {
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la lista de películas:', error);
    }
}

// Función para mostrar las películas en la tabla
async function printMovies() {
    const data = await getMovies();
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';  // Limpiar la tabla antes de agregar nuevos elementos

    data.map(movie => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.genre}</td>
            <td>
            <button type="button" class="delete-btn"><i class="fas fa-trash"></i> Eliminar</button>
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
            </td>
        `;

        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            deleteMovie(movie.id, row);
        });

        const editButton = row.querySelector('.edit-btn');
        editButton.addEventListener('click', () => showEditForm(movie));

        moviesList.appendChild(row);
    });
}

// Función para eliminar una película
async function deleteMovie(movieId, row) {
    try {
        const response = await fetch(`${baseUrl}/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            row.remove();  // Remover la fila de la tabla sin recargar la lista completa
        } else {
            console.error(`No se pudo eliminar la película con ID ${movieId}`);
        }
    } catch (error) {
        console.error('Error al eliminar la película:', error);
    }
}

// Función para añadir una nueva película
async function createMovie(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    
    const newMovie = {
        title: title,
        year: year,
        genre: genre
    };

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMovie)
        });

        if (response.ok) {
            const data = await response.json();
            addMovieToList(data);
            resetForm(); // Limpiar el formulario después de añadir
        } else {
            console.error('Error al añadir la película');
        }
    } catch (error) {
        console.log('Error al hacer la petición para añadir películas:', error);
    }
}

// Función para añadir una película directamente al DOM
function addMovieToList(movie) {
    const moviesList = document.getElementById('movies-list');

    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.year}</td>
        <td>${movie.genre}</td>
        <td>
        <button type="button" class="delete-btn"><i class="fas fa-trash"></i> Eliminar</button>
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
        </td>
    `;

    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', async() => {
        await deleteMovie(movie.id, row);
    });

    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', async() => {
        await showEditForm(movie);
    });

    moviesList.appendChild(row);
}

// Función para actualizar una película existente
async function updateMovie(movieId, updateMovie) {
    try {
        const response = await fetch(`${baseUrl}/${movieId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateMovie)
        });
        if (response.ok) {
            console.log(`Película con ID ${movieId} actualizada`);
            await printMovies();
        } else {
            console.error(`No se pudo actualizar la película con ID ${movieId}`);
        }

    } catch (error) {
        console.error("Error al actualizar la película:", error);
    }    
}

// Función para mostrar el formulario de edición con los datos actuales de la película
async function showEditForm(movie) {
    const title = document.getElementById('title');
    const year = document.getElementById('year');
    const genre = document.getElementById('genre');

    // Rellenar los campos del formulario con los datos de la película a editar
    title.value = movie.title;
    year.value = movie.year;
    genre.value = movie.genre;

    // Cambiar el texto del botón de añadir para indicar que estamos editando
    const submitButton = document.querySelector('#add-movie-form button[type="submit"]');
    submitButton.textContent = 'Actualizar Película';

    // Actualizar el evento submit para realizar la actualización en lugar de añadir
    addMovieForm.removeEventListener('submit', createMovie);
    addMovieForm.addEventListener('submit', function updateHandler(event) {
        event.preventDefault();

        const updateMovieData = {
            title: title.value,
            year: parseInt(year.value),
            genre: genre.value
        };

        updateMovie(movie.id, updateMovieData).then(() => {
            resetForm();
            submitButton.textContent = 'Añadir Película';
            addMovieForm.removeEventListener('submit', updateHandler);
            addMovieForm.addEventListener('submit', createMovie);
        });
    });
}

// Función para restablecer el formulario
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('year').value = '';
    document.getElementById('genre').value = '';
}

// Cargar automáticamente las películas cuando se carga la página
window.addEventListener('DOMContentLoaded', printMovies);

const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', createMovie);
