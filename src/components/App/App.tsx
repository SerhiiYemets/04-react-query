import { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid"; 
import Loader from "../Loader/Loader";  
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovie } from "../../services/movieService"

interface AppState {
  movies: Movie[];
  isLoading: boolean;
  error: boolean;
  selectedMovie: Movie | null;
} 

export default function App () {
  const [state, setState] = useState<AppState>({
    movies: [],
    isLoading: false,
    error: false,
    selectedMovie: null,
  });

  const handleSearch = async (query: string) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: false,
      movies: [],
    }));

    try {
      const movies = await fetchMovie(query);

      if (movies.length === 0) {
        toast.error("No movies found for your request.");
      }

      setState((prev) => ({
        ...prev,
        movies,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Something went wrong. Try again.");
      setState((prev) => ({
        ...prev,
        error: true,
        isLoading: false,
      }));
    }
  };

  const { movies, isLoading, error, selectedMovie } = state;

  const handleMovieSelect = (movie: Movie) => {
    setState((prev) => ({
      ...prev,
      selectedMovie: movie,
    }));
  };

  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      selectedMovie: null,
    }));
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <main>

        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}
        
        {isLoading && <Loader />}
        
        {error && <ErrorMessage />}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleModalClose} />
        )}

      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
};