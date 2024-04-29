import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MovieContext = createContext();

const MovieContextProvider = (props) => {
    const [movies, setMovies] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [watchLaterMovies, setWatchLaterMovies] = useState([]);
    const apiKey = "e27524563eb17b0bc5944aefd284796f";

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
                );
                const moviesWithAddedFlag = response.data.results.map((movie) => ({
                    ...movie,
                    isAdded: false,
                }));
                setMovies(moviesWithAddedFlag);
            } catch (error) {
                console.error("Ошибка при загрузке популярных фильмов", error);
            }
        };

        fetchMovies();
    }, [apiKey]);

    const addFavoriteMovie = async (movieId) => {
        try {
            const isAlreadyAdded = favoriteMovies.some((movie) => movie.id === movieId);
            if (!isAlreadyAdded) {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
                );
                const movie = { ...response.data, isAdded: true };
                setFavoriteMovies([...favoriteMovies, movie]);
                updateMoviesWithAddedFlag(movieId, true);
            }
        } catch (error) {
            console.error("Ошибка при добавлении фильма в избранные", error);
        }
    };

    const addWatchLaterMovie = async (movieId) => {
        try {
            const isAlreadyAdded = watchLaterMovies.some((movie) => movie.id === movieId);
            if (!isAlreadyAdded) {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
                );
                const movie = { ...response.data, isAdded: true };
                setWatchLaterMovies([...watchLaterMovies, movie]);
                updateMoviesWithAddedFlag(movieId, true);
            }
        } catch (error) {
            console.error("Ошибка при добавлении фильма к просмотру позже", error);
        }
    };

    const updateMoviesWithAddedFlag = (movieId, isAdded) => {
        setMovies((prevMovies) =>
            prevMovies.map((movie) =>
                movie.id === movieId ? { ...movie, isAdded } : movie
            )
        );
    };

    return (
        <MovieContext.Provider
            value={{
                movies,
                favoriteMovies,
                watchLaterMovies,
                addFavoriteMovie,
                addWatchLaterMovie,
            }}
        >
            {props.children}
        </MovieContext.Provider>
    );
};

export default MovieContextProvider;
