import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { MovieContext } from "./Movie context";
import MovieForm from "./MovieForm";

function MovieDetailsPage() {
    const { id } = useParams();
    const { addFavoriteMovie, addWatchLaterMovie } = useContext(MovieContext);
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f',
                        append_to_response: 'credits'
                    }
                });
                setMovie(movieResponse.data);
                setIsLoading(false);
                const commentsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f',
                    }
                });
                setComments(commentsResponse.data.results);
            } catch (error) {
                console.error('Ошибка при загрузке деталей фильма', error);
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const handleAddComment = (comment) => {
        const updatedComments = [...comments, { id: Date.now(), content: comment }];
        setComments(updatedComments);
    };

    const renderRatingStars = (rating) => {
        const filledStars = Math.round(rating / 2);
        const emptyStars = 5 - filledStars;
        const stars = [];

        for (let i = 0; i < filledStars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={filledStars + i} className="far fa-star"></i>);
        }

        return stars;
    };

    return (
        <div className="container">
            <h1 className="mt-5 mb-3">Детали фильма</h1>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : movie ? (
                <div>
                    <h2>{movie.title}</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="img-fluid" />
                        </div>
                        <div className="col-md-8">
                            <p>{movie.overview}</p>
                            <p>Рейтинг: {renderRatingStars(movie.vote_average)}</p>
                            <p>Актеры: {movie.credits && movie.credits.cast.map(actor => actor.name).join(', ')}</p>
                            <button onClick={() => addFavoriteMovie(movie.id)} className="btn btn-primary mr-2">Добавить в избранное</button>
                            <button onClick={() => addWatchLaterMovie(movie.id)} className="btn btn-primary">Посмотреть позже</button>
                        </div>
                    </div>
                    <MovieForm onSubmit={handleAddComment} />

                    <div>
                        <h3>Комментарии:</h3>
                        <ul className="list-group">
                            {comments.map((comment) => (
                                <li key={comment.id} className="list-group-item">{comment.content}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Фильм не найден</p>
            )}
        </div>
    );
}

export default MovieDetailsPage;
