import "../index.css";

function FlightResults({ flights, onSortChange }) {

    // Function to format duration from X minutes to Y hours and Z minutes
    const formatDuration = (durationInMinutes) => {
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        // Results
        <div>
            {flights.length > 0 && (
                <h2 className="text-xl font-bold mt-6">Flight Results</h2>
            )}            {flights.length === 0 ? (
                <div></div>
            ) : (
                flights.map((flight, index) => (

                    <div key={index} className="flight-container p-4 mb-4 bg-white rounded-xl shadow-md">
                        <div className="flight-column mb-2">
                            <p><strong>Departure:</strong> {new Intl.DateTimeFormat("en-US", {
                                dateStyle: "short",
                                timeStyle: "short"
                            }).format(new Date(flight.departureTime))}</p>
                        </div>
                        <div className="flight-column mb-2">
                            <p><strong>Arrival:</strong> {new Intl.DateTimeFormat("en-US", {
                                dateStyle: "short",
                                timeStyle: "short"
                            }).format(new Date(flight.arrivalTime))}</p>
                        </div>
                        <div className="flight-column mb-2">
                            <div className="flight-column mb-2">
                                <p><strong>Trip Duration:</strong> {formatDuration(flight.duration)}</p>
                            </div>
                        </div>
                        <div className="flight-column mb-2">
                            <p><strong>Airline:</strong> {flight.airline}</p>
                            <img
                                src={flight.logoUrl}
                                alt={`${flight.airline} Logo`}
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    objectFit: "contain",
                                    marginLeft: "8px",
                                }}
                            />
                        </div>
                        <div className="flight-column mb-2">
                            <p><strong>Airport:</strong> {flight.airportFrom} → {flight.airportTo}</p>
                        </div>
                        <div className="flight-column mb-2">
                            <p><strong>Layovers:</strong> {flight.layovers}</p>
                        </div>
                        <div className="flight-column mb-2">
                            <p><strong>Price:</strong> {flight.price} per passenger</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}



export default FlightResults;