class Movie {
  constructor(title, cast, director, genre, code) {
    this.title = title;
    this.cast = cast;
    this.director = director;
    this.genre = genre;
    this.code = code;
  }
}

class UI {
  addMovieToList(movie) {
    const list = document.getElementById("movie-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${movie.title}</td>
      <td>${movie.cast}</td>
      <td>${movie.director}</td>
      <td>${movie.genre}</td>
      <td>${movie.code}</td>
      <td><a href="#" class="delete">X<a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const before = document.querySelector(".before");
    const form = document.querySelector("#movie-form");

    before.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteMovie(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("cast").value = "";
    document.getElementById("director").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("code").value = "";
  }
}

//add local storage
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
  static removeMovie(code) {
    const movies = Store.getMovies();
    movies.forEach(function (movie, index) {
      if (movie.code === code) {
        movies.splice(index, 1);
      }
    });
    localStorage.setItem("movies", JSON.stringify(movies));
  }
}
// DOM load event
document.addEventListener("DOMContentLoaded", Store.displayMovies);
document.getElementById("movie-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value,
    cast = document.getElementById("cast").value,
    director = document.getElementById("director").value;
  genre = document.getElementById("genre").value;
  code = title + director;

  const movie = new Movie(title, cast, director, genre, code);
  const ui = new UI();

  if (title === "" || cast === "" || director === "" || genre === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    ui.addMovieToList(movie);
    Store.addMovie(movie);

    ui.showAlert("Movie Added!", "success");
    ui.clearFields();
  }
  e.preventDefault();
});

document.getElementById("movie-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteMovie(e.target);
  Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert("Movie Removed!", "success");
  e.preventDefault();
});
