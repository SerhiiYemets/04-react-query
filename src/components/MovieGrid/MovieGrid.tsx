import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

interface MovieGridProps {
    onSelect: (movie: Movie) => void;
    movies: Movie[];
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
    const handleCardClick = (movie: Movie) => {
        onSelect(movie);
    };

    const handleKeyDown = (movie: Movie) => (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick(movie);
        }
    };

    const getImageUrl = (posterPath: string | null) => {
        if (!posterPath) {
            return "https://via.placeholder.com/500x750?text=No+Image";
        }
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    };

    return (
        <ul className={css.grid}>
            {movies.map((movie) => (
                <li key={movie.id}>
                    <div
                        className={css.card}
                        onClick={() => handleCardClick(movie)}
                        onKeyDown={handleKeyDown(movie)}
                        role="button"
                        tabIndex={0} 
                        aria-label={`Select ${movie.title}`}
                    >
                        <img
                            className={css.image}
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title || "Movie poster"}
                            loading="lazy"
                        />
                        <h2 className={css.title}>{movie.title}</h2>
                    </div>
                </li>
            ))}
        </ul>
    );
}