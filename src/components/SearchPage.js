import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [genreMap, setGenreMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f'
                    }
                });
                const genres = response.data.genres.reduce((acc, genre) => {
                    acc[genre.id] = genre.name;
                    return acc;
                }, {});
                setGenreMap(genres);
            } catch (error) {
                console.error('Ошибка при загрузке жанров:', error);
            }
        };

        fetchGenres();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (searchTerm.trim() === '') {
                response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f',
                        with_genres: selectedGenres.join(',')
                    }
                });
            } else {
                response = await axios.get('https://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: 'e27524563eb17b0bc5944aefd284796f',
                        query: searchTerm,
                        with_genres: selectedGenres.join(',')
                    }
                });
            }
            setSearchResults(response.data.results);
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при выполнении поиска фильмов:', error);
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (genreId) => {
        if (selectedGenres.includes(genreId)) {
            setSelectedGenres(selectedGenres.filter(id => id !== genreId));
        } else {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/films/${movieId}`);
    };

    return (
        <div className="container">
            <h1 className="mt-5 mb-3">Страница поиска фильмов</h1>
            <form onSubmit={handleSearch} className="mb-3">
                <div className="form-row align-items-center">
                    <div className="col">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control mb-2"
                            placeholder="Введите название фильма"
                        />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-2">Найти</button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Выберите жанры:</label>
                    <div className="form-check">
                        {Object.keys(genreMap).map(genreId => (
                            <div key={genreId} className="form-check-inline">
                                <input
                                    type="checkbox"
                                    value={genreId}
                                    checked={selectedGenres.includes(genreId)}
                                    onChange={() => handleCheckboxChange(genreId)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">{genreMap[genreId]}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
            {isLoading ? (
                <p className="loading-message">Идёт поиск...</p>
            ) : (
                <div className="row">
                    {searchResults.map(movie => (
                        <div key={movie.id} className="col-md-4 mb-3">
                            <div className="card" onClick={() => handleMovieClick(movie.id)} style={{ cursor: 'pointer' }}>
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                     className="card-img-top" alt={movie.title}/>
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text">{movie.overview}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;