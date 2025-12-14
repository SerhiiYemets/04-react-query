import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "../../services/movieService";
import type { MovieResponse } from "../../types/movie";

export default function useMovieSearch(query: string, page: number) {
    const { data, error, isLoading, isSuccess, isFetching } = useQuery<
        MovieResponse,
        Error
        >({
            queryKey: ["movies", query, page],
            queryFn: () => fetchMovie(query, page),
            enabled: !!query.trim() && query.length >= 2,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: false,
            refetchOnWindowFocus: false,
        });

    return {
        movies: data?.results || [],
        totalPages: data?.total_pages || 0,
        totalResults: data?.total_results || 0,
        currentPage: page,
        error: error as Error | null,
        isLoading,
        isSuccess,
        isFetching,
        haserror: !!error,
    };
}