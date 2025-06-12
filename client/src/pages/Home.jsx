// Importing React and necessary hooks
import React, { useState, useEffect } from 'react'
// Importing the MovieCard component for displaying individual movie info
import MovieCard from '../components/MovieCard'
import { getPopularMovies, searchMovies } from '../services/api'
import "../css/Home.css"

const Home = () => {

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // State to store the user's search query
    const [searchQuery, setSearchQuery] = useState("");

    // Function to handle the form submission event
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevents page reload when form is submitted
        
        if (!searchQuery.trim()) return; // prevents loading results with white space input
        if (loading) return; // prevents search function when it's already loading results

        setLoading(true); // gives an indicator that the page is loading results

        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        }

        loadPopularMovies();
    }, [])

    return (
        <div className='home'>

            {/* Search form */}
            <form onSubmit={handleSearch} className='search-form'>
                <input 
                    type="text" 
                    placeholder='Search for movies...' 
                    className='search-input' 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Updates state as user types
                />
                <button type='submit' className='search-button'>Search</button>
            </form>

            {/* Movie cards displayed in a grid */}
            <div className="movies-grid">
                {movies.map((movie) => (
                    // Render MovieCard only if movie title starts with search query (case-insensitive)
                    movie.title.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        </div>
    )
}

// Exporting Home component as default
export default Home