import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_results: number;
    total_pages: number;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = import.meta.env.VITE_API_KEY;

const filterMovies = (movies: Movie[]): Movie[] => {
    return movies.filter(
        (movie) => movie.backdrop_path !== null && movie.poster_path !== null
    );
};

export const fetchMovie = async (
    query: string,
    page: number
): Promise<MovieResponse> => {
    const response = await axios.get<MovieResponse>(
        `${API_BASE_URL}/search/movie`,
        {
            params: {
                query,
                page
            },
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        }
    );

    const filteredResults = filterMovies(response.data.results);
    console.log(response.data);
    
    return {
        ...response.data,
        results: filteredResults,
    };
};