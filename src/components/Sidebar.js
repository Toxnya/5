import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext} from "./Movie context";

function Sidebar() {
    const { favoriteMovies, watchLaterMovies } = useContext(MovieContext);

    return (
        <div>
            <h3>Избранные фильмы</h3>
            <ul>
                {favoriteMovies.map((movie) => (
                    <li key={movie.id}>
                        <Link to={`/films/${movie.id}`}>
                            {movie.title}
                            {movie.isAdded && <span> (Фильм уже добавлен в избранное)</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            <h3>Фильмы к просмотру позже</h3>
            <ul>
                {watchLaterMovies.map((movie) => (
                    <li key={movie.id}>
                        <Link to={`/films/${movie.id}`}>
                            {movie.title}
                            {movie.isAdded && <span> (Фильм уже добавлен к просмотру позже)</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;