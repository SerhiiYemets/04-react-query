import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query"; 

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";
import { fetchMovie } from "../../services/movieService";
import type { MovieResponse } from "../../services/movieService";

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

  const { query, page } = state;

  const {
    data,
    error,
    isLoading,
    isSuccess,
  } = useQuery<MovieResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: !!query.trim() && query.length >= 2, 
    placeholderData: keepPreviousData, 
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0 && query) {
      toast.error("No movies found for your request!!!");
    }
  }, [movies, isSuccess, query]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong. Please try again!");
    }
  }, [error]);

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please, enter your search query!");
      return;
    }

    setState(prev => ({
      ...prev,
      query: newQuery.trim(),
      page: 1,
    }));
  };

  const setPage = (newPage: number) => {
    setState(prev => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieSelect = (movie: Movie) => {
    setState(prev => ({
      ...prev,
      selectedMovie: movie,
    }));
  };

  const handleModalClose = () => {
    setState(prev => ({ ...prev, selectedMovie: null }));
  };

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

        {state.selectedMovie && (
          <MovieModal
            movie={state.selectedMovie}
            onClose={handleModalClose}
          />
        )}
      </main>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}