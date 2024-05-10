import React, { useState } from "react";

function MovieForm({ onSubmit }) {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        onSubmit(comment);
        setComment("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Введите ваш комментарий..."
                required
            />
            <button type="submit">Добавить комментарий</button>
        </form>
    );
}

export default MovieForm;