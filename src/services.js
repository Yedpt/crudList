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
            deleteButton.textContent = 'Eliminar';
            deleteButton.type = 'button';
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                deleteMovie(movie.id, listItem);
            });
    
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.type = 'button';
            editButton.addEventListener('click', () => showEditForm(movie));
    
            listItem.appendChild(deleteButton);
            // listItem.appendChild(editButton);
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
        } else {
            console.error(`No se pudo eliminar la película con ID ${movieId}`);
        }
    } catch (error) {
        console.error('Error al eliminar la película:', error);
    }
}

 
 // Cargar automáticamente las películas cuando se carga la página
 window.addEventListener('DOMContentLoaded', printMovies);