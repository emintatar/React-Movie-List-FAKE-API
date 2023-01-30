import React from "react";
import SearchBar from "./SearchBar";
import MovieList from "./MovieList";
import AddMovie from "./AddMovie";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends React.Component {
  state = {
    movies: [],
    searchQuery: "",
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:3002/movies");
    this.setState({ movies: response.data });
  }

  // DELETE MOVIE
  deleteMovie = async (movie) => {
    await axios.delete(`http://localhost:3002/movies/${movie.id}`);

    const newMovieList = this.state.movies.filter((m) => m.id !== movie.id);

    this.setState((state) => ({
      movies: newMovieList,
    }));
  };

  // SEARCH MOVIE
  searchMovie = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  // ADD MOVIE
  addMovie = async (movie) => {
    await axios.post(`http://localhost:3002/movies/`, movie);

    this.setState((state) => ({
      movies: state.movies.concat([movie]),
    }));
  };

  render() {
    let filteredMovies = this.state.movies
      .filter((movie) => {
        return movie.name.toLowerCase().indexOf(this.state.searchQuery) !== -1;
      })
      .sort((a, b) => {
        // Sort by rating in descending order
        return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
      });

    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <React.Fragment>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <SearchBar searchMovieProp={this.searchMovie} />
                    </div>
                  </div>
                  <MovieList
                    movies={filteredMovies}
                    deleteMovieProp={this.deleteMovie}
                  />
                </div>
              </React.Fragment>
            }
          ></Route>

          <Route
            path="add"
            element={<AddMovie addMovieProp={this.addMovie} />}
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
