import axios from "axios"
import type { Movie } from "../types/movie"

interface MovieResponse {
    results: Movie[];
    total_results: number;
    total_pages: number;
    page: number;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = import.meta.env.VITE_API_KEY;

export const fetchMovie = async (query: string): Promise<Movie[]> => {
    const response = await axios.get<MovieResponse>(
        `${API_BASE_URL}/search/movie`,
        {
            params: {
                query,
            },
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        }
    );
    console.log(response.data.results);
    
    return response.data.results;
};