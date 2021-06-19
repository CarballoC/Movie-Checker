class Movie {
  constructor(title, cast, director, genre, id) {
    this.title = title;
    this.cast = cast;
    this.director = director;
    this.genre = genre;
    this.id = id;
  }
}

class UI {
  addMovieToList(movie) {
    const movieList = document.getElementById("movie-list");
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${movie.title}</td>
  <td>${movie.cast}</td>
  <td>${movie.director}</td>
  <td>${movie.genre}</td>
  <td>${movie.id}</td>
  <td><a href ="#" class="delete">Delete</a></td> `;
    movieList.appendChild(row);
  }
  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const wrapper = document.querySelector(".wrapper");
    const form = document.querySelector("#movie-form");
    wrapper.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("cast").value = "";
    document.getElementById("director").value = "";
    document.getElementById("genre").value = "";
  }
  deleteMovie(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
}
class Store {
  static getMovies() {
    let movies;
    if (localStorage.getItem("movies") === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem("movies"));
    }
    return movies;
  }
  static displayMovies() {
    const movies = Store.getMovies();
    movies.forEach(function (movie) {
      const ui = new UI();
      ui.addMovieToList(movie);
    });
  }

  static addMovie(movie) {
    const movies = Store.getMovies();
    movies.push(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  static removeMovie(id) {
    const movies = Store.getMovies();
    movies.forEach(function (movie, index) {
      if (movie.id === id) {
        movies.splice(index, 1);
      }
    });
    localStorage.setItem("movies", JSON.stringify(movies));
  }
}
document.addEventListener("DOMContentLoaded", Store.displayMovies);
// Event Listener
document.getElementById("movie-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value;
  const cast = document.getElementById("cast").value;
  const director = document.getElementById("director").value;
  const genre = document.getElementById("genre").value;
  const id = Math.round(Date.now() / 10000) + genre;

  // Instatiate a Movie
  const movie = new Movie(title, cast, director, genre, id);
  console.log(movie);

  // Instatiate UI
  const ui = new UI();
  if (title === "" || cast === "" || director === "" || genre === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    ui.addMovieToList(movie);
    ui.showAlert("Great, Movie Added!", "success");
    ui.clearFields();
    Store.addMovie(movie);
  }

  e.preventDefault();
});
document.getElementById("movie-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteMovie(e.target);
  //remove from local store
  Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert("Movie Deleted", "success");
  e.preventDefault();
});
