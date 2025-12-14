import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid"; 
import Loader from "../Loader/Loader";  
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";
import useMovieSearch from "../MovieSearch/useMovieSearch";

import css from "./App.module.css";

interface AppState {
  query: string;
  page: number;
  selectedMovie: Movie | null;
} 

export default function App() {
  const [state, setState] = useState<AppState>({
    query: "",
    page: 1,
    selectedMovie: null,
  });

  const { movies, totalPages, error, isLoading, isSuccess } = useMovieSearch(
    state.query,
    state.page,
  );

  useEffect(() => {
    if (isSuccess && movies.length === 0 && state.query) {
      toast.error("No movies found for your request!!!");
    }
  }, [movies, isSuccess, state.query]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong. Please try again!");
    }
  }, [error]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please, enter your search query!");
      return;
    }

    setState((prev) => ({
      ...prev,
      query: query.trim(),
      page: 1,
    }));
  };

  const setPage = (newPage: number) => {
    setState((prev) => ({
      ...prev,
      page: newPage,
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const { page, selectedMovie } = state;
  
  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage />}
        {movies.length > 0 && (
          <>
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={movies} onSelect={handleMovieSelect} />
          </>
        )}

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
}