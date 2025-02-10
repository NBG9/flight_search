import { useState } from "react";
import FlightSearch from './components/searchbar';
import FlightResults from './components/results';

function App() {
  const [flights, setFlights] = useState([]);

  const [sortBy, setSortBy] = useState("best"); // Store sorting selection
  const [latestSearch, setLatestSearch] = useState(null); // Store last search parameters


  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (latestSearch) {
      handleSearch({ ...latestSearch, sortBy: sortBy });
    }
  };

  const handleSearch = async (searchData) => {
    setLatestSearch(searchData); // Store latest search for sorting

    const { from, to, departureDate, passengers, sortBy } = searchData;

    // First, get the origin's skyId and entityId from the airport search API
    const originUrl = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${from}&locale=en-US`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "8284fbbc34msh7719613a1e02bbep18e047jsnbb28dece7ab5",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    try {
      // Fetch origin airport data
      const originResponse = await fetch(originUrl, options);
      const originData = await originResponse.json();
      const origin = originData.data[0];
      const originSkyId = origin.skyId;
      const originEntityId = origin.entityId;

      console.log("Origin Sky ID:", originSkyId);
      console.log("Origin Entity ID:", originEntityId);

      // Fetch destination airport data
      const destinationUrl = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${to}&locale=en-US`;
      const destinationResponse = await fetch(destinationUrl, options);
      const destinationData = await destinationResponse.json();
      const destination = destinationData.data[0]; // Assuming the first result is correct
      const destinationSkyId = destination.skyId;
      const destinationEntityId = destination.entityId;

      // Construct the flight search URL with dynamic skyIds and entityIds
      const flightSearchUrl = `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&originEntityId=${originEntityId}&destinationEntityId=${destinationEntityId}&date=${departureDate}&cabinClass=economy&adults=${passengers}&sortBy=${sortBy}&currency=USD&market=en-US&countryCode=US`;

      // Fetch flight data using the constructed URL
      const flightResponse = await fetch(flightSearchUrl, options);
      const flightData = await flightResponse.json();

      console.log(flightData);

      // Process and set flight results
      if (flightData && flightData.data && flightData.data.itineraries) {
        const flightResults = [];
        flightData.data.itineraries.forEach((itinerary) => {
          itinerary.legs.forEach((leg) => {
            flightResults.push({
              from: leg.origin.name,
              to: leg.destination.name,
              date: searchData.date,
              price: itinerary.price.formatted,
              airline: leg.carriers?.marketing?.[0]?.name || "Unknown",
              departureTime: leg.departure,
              arrivalTime: leg.arrival,
              duration: leg.durationInMinutes,
              airportFrom: leg.origin.name,
              airportTo: leg.destination.name,
              layovers: leg.stopCount,
              logoUrl: leg.carriers?.marketing?.[0]?.logoUrl || "Unknown",
            });
          });
        });
        setFlights(flightResults);
      } else {
        console.error("Unexpected data structure:", flightData);
        setFlights([]); // Clear results for a clean restart
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setFlights([]); // Clear results in case of an error
    }
  };

  return (
    <div className="Screen">
      {flights.length === 0 && ( // Only show the banner if flights is empty
        <div className="justify-center">
          <img src="/flight_header.png" alt="Flight Background" />
        </div>
      )}

      <FlightSearch onSearch={handleSearch} />

      <div className="flight-results-container">
        <FlightResults flights={flights} onSortChange={handleSortChange} />
      </div>
    </div>
  );

}



export default App;
