import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';


function FlightSearch({ onSearch }) {
    // Origin
    const [from, setFrom] = useState("");
    // Destination
    const [to, setTo] = useState("");
    // Departure Date
    const [departureDate, setDepartureDate] = useState("");
    // Number of Passengers
    const [passengers, setPassengers] = useState("");
    // Constant Error Message
    const [errorMessage, setErrorMessage] = useState("");
    // State for Managing the Retrieval Process
    const [loading, setLoading] = useState(false); // Loading state
    // State for managing the type (best, shortest, cheapest, etc)
    const [sortBy, setSortBy] = useState("best");

    // Function to manage the search
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if any field is empty
        if (!from || !to || !departureDate || !passengers) {
            setErrorMessage("Please fill in all the fields!");
            return;
        }

        // Proceed with search
        setErrorMessage("");
        setLoading(true); // Show the loading spinner

        // Call the onSearch function (which triggers the flight search)
        onSearch({ from, to, departureDate, passengers, sortBy })
            .finally(() => {
                setLoading(false); // Hide the loading spinner once the request completes
            });
    };

    // Sort the results
    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortBy(newSort);
        onSearch({ from, to, departureDate, passengers, sortBy: newSort }); // Trigger search with new sorting
    };

    // Automatically fills in the destination field when image is pressed
    const handleDestinationClick = async (destination) => {
        try {
            // Fetch the IP-based location data
            const response = await axios.get('http://ip-api.com/json');
            const { city } = response.data;

            // Check if city is returned
            if (city) {
                console.log("City from IP: ", city);
                setFrom(city);  // Set the city retrieved from the IP
            } else {
                console.log("City not found from IP.");
                setFrom("Unknown City"); // Fallback in case city is not found
            }

            setTo(destination);
            // handleSubmit();
        } catch (error) {
            console.error("Error fetching location:", error);
            setFrom("Unknown City"); // Fallback
            setTo(destination);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Flights</h2>
            <div className="input-container">
                <div>
                    <p>Origin</p>
                    <input
                        type="text"
                        placeholder="From"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <p>Destination</p>
                    <input
                        type="text"
                        placeholder="To"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="input-field"
                        required
                    /></div>
                <div>
                    <p>Departure</p>
                    <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div>
                    <p>Passengers</p>
                    <input
                        type="number"
                        placeholder='1'
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="input-field"
                        required
                    /></div>

                {/* Sorting Dropdown */}
                <div className="mb-4">
                    <p>Sort by:</p>
                    <select value={sortBy} onChange={handleSortChange} className="input-field-sort">
                        <option value="best">Best</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="fastest">Fastest</option>
                        <option value="outbound_take_off_time">Earliest Takeoff</option>
                        <option value="outbound_landing_time">Earliest Landing</option>
                    </select>
                </div>
                <div>
                    <p style={{ alignment: "center" }}>Search</p>
                    <button
                        type="submit"
                        className="search-button"
                    >
                        Let's Fly
                    </button>
                </div>
            </div>
            {/* Popular Destinations (clickable) */}
            <div className="flight-column mb-2">
                <p><strong>Popular Destinations</strong></p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>

                    <figure onClick={() => handleDestinationClick("Bangkok")} style={{ textAlign: "center", margin: "10px" }}>
                        <img
                            src="https://www.wanderlustmagazine.com/wp-content/uploads/2023/11/5-wat-saket-shutterstock_1099129721jpg-web.jpg"
                            alt="Bangkok"
                            style={{
                                width: "160px",
                                height: "auto",
                                borderRadius: "8px",
                                marginBottom: "5px",
                            }}
                        />
                        <figcaption style={{ fontSize: "14px", color: "#555" }}>
                            Bangkok
                        </figcaption>
                    </figure>

                    <figure onClick={() => handleDestinationClick("London")} style={{ textAlign: "center", margin: "10px" }}>
                        <img
                            src="https://babylontours.com/wp-content/uploads/2016/09/london-441853_960_720.jpg"
                            alt="London"
                            style={{
                                width: "160px",
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                        <figcaption style={{ fontSize: "14px", color: "#555" }}>London</figcaption>
                    </figure>

                    <figure onClick={() => handleDestinationClick("Paris")} style={{ textAlign: "center", margin: "10px" }}>
                        <img
                            src="https://a.storyblok.com/f/239725/4096x2731/c3337fde3a/01_fr_par_hero_eiffeltower.png/m/3840x2560"
                            alt="Paris"
                            style={{
                                width: "160px",
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                        <figcaption style={{ fontSize: "14px", color: "#555" }}>Paris</figcaption>
                    </figure>

                    <figure onClick={() => handleDestinationClick("Kuala Lumpur")} style={{ textAlign: "center", margin: "10px" }}>
                        <img
                            src="https://www.new7wonders.com/app/uploads/sites/5/2016/09/Malaysia-Kuala-Lumpur.jpg"
                            alt="Kuala Lumpur"
                            style={{
                                width: "160px",
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                        <figcaption style={{ fontSize: "14px", color: "#555" }}>Kuala Lumpur</figcaption>
                    </figure>

                    <figure onClick={() => handleDestinationClick("Dubai")} style={{ textAlign: "center", margin: "10px" }}>
                        <img
                            src="https://lp-cms-production.imgix.net/2024-09/dubai-burj-al-arab-669989c46a03.jpg?w=920&h=950&dpr=2&auto=format&q=85"
                            alt="Dubai"
                            style={{
                                width: "160px",
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                        <figcaption style={{ fontSize: "14px", color: "#555" }}>Dubai</figcaption>
                    </figure>
                </div>


            </div>
            {errorMessage && (
                <div className="error-message text-red-500 mt-2">{errorMessage}</div>
            )}
            {loading && (
                <div className="spinner-container">
                    <ClipLoader size={30} color="grey" />
                    <p>Hold on, we're finding the best deals out there...</p>
                </div>
            )}
        </form>

    );
}

export default FlightSearch;