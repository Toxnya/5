import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "./Movie context";
import axios from "axios";
import "./Homepage.css"


function Homepage() {
    const {addFavoriteMovie, addWatchLaterMovie} = useContext(MovieContext);
    const [popularMovies, setPopularMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [filterBy, setFilterBy] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f',
                        sort_by: sortBy,
                        with_genres: filterBy
                    }
                });
                setPopularMovies(response.data.results);
                setIsLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке популярных фильмов: ', error)
                setIsLoading(false);
            }
        };

        fetchPopularMovies();
    }, [filterBy, sortBy]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterBy(e.target.value);
    };

    const goToSearchPage = () => {
        navigate("/search");
    };

    return (
        <div className="site-container">
            <h1>Главная страница</h1>
            <button onClick={goToSearchPage}>Перейти к поиску</button>
            <div>
                <label>Сортировать по:</label>
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="popularity.desc">Популярности</option>
                    <option value="release_date.desc">Дата релиза</option>
                    <option value="vote_average.desc">Рейтингу</option>
                </select>
            </div>
            <div>
                <label>Фильтровать по типу:</label>
                <input
                    type="text"
                    value={filterBy}
                    onChange={handleFilterChange}
                    placeholder="Введите тип фильма"
                />
            </div>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="card-container">
                    {popularMovies.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to={`/films/${movie.id}`} className="card-link">
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="card-img" />
                            </Link>
                            <div className="card-details">
                                <Link to={`/films/${movie.id}`} className="card-title">{movie.title}</Link>
                                <div className="button-group">
                                    <button onClick={() => addFavoriteMovie(movie.id)} className="favorite-button">
                                        <i className="fas fa-star"></i>
                                    </button>
                                    <button onClick={() => addWatchLaterMovie(movie.id)} className="watch-later-button">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Homepage;
