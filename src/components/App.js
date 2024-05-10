import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Sidebar from "./Sidebar";
import Homepage from "./Homepage";
import SearchPage from "./SearchPage";
import MovieDetailsPage from "./MovieDetailsPage";

function App () {
    return (
        <Router>
            <div className="App">
                <Sidebar />
                <Routes>
                    <Route path = "/" element={<Homepage />} />
                    <Route path = "/search" element={<SearchPage />}/>
                    <Route path = "/films/:id" element={<MovieDetailsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;