// getData4.jsx

const useDataApi = (initialData) => {
  const { useState, useEffect } = React;
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(
        'https://api.artic.edu/api/v1/artworks?page=1&limit=100'
      );
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setSelectedArtwork(getRandomArtwork(result.data));
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [data, isLoading, isError, fetchData, selectedArtwork];
};

function getRandomArtwork(data) {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

function App() {
  const { Fragment, useState } = React;
  const [data, isLoading, isError, fetchData, selectedArtwork] = useDataApi([]);

  const handleGetRandomArtwork = () => {
    fetchData();
  };

  return (
    <Fragment>
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        selectedArtwork && (
          <div className="image-container">
            <h2>{selectedArtwork.artist_title}</h2>
            <h4>{selectedArtwork.title}</h4>
           
            <p>Origin: {selectedArtwork.place_of_origin}</p>
            
            <img
              src={`https://www.artic.edu/iiif/2/${selectedArtwork.image_id}/full/843,1000/0/default.jpg`}
              alt={selectedArtwork.title}
              className="flexible-image"
            />
          </div>
        )
      )}

      <div className="button-container">
        <button className="custom-button" onClick={handleGetRandomArtwork} disabled={isLoading}>
          Random Art Generator
        </button>
      </div>

      {isError && <div>Something went wrong...</div>}
    </Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
