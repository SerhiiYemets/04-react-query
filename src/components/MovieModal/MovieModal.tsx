import type { Movie } from "../../types/movie"
import css from "./MovieModal.module.css"
import { createPortal } from "react-dom";
import { useEffect } from "react"

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        
        document.body.style.overflow = "hidden";

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const getImageUrl = (backdropPath: string | null) => {
        if (!backdropPath) {
            return "https://via.placeholder.com/1920x1080?text=No+Image";
        }
        return `https://image.tmdb.org/t/p/original${backdropPath}`;
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const formatRating = (rating: number) => {
        return `${rating.toFixed(1)}/10`;
    };

    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                <button
                    className={css.closeButton}
                    aria-label="Close modal"
                    onClick={onClose}>
                    &times;
                </button>
                <img
                    src={getImageUrl(movie.backdrop_path)}
                    alt={movie.title}
                    className={css.image}
                />
                <div className={css.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {formatDate(movie.release_date)}
                    </p>
                    <p>
                        <strong>Rating:</strong> {formatRating(movie.vote_average)}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
} 