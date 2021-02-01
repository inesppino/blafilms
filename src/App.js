import React, { useState, useEffect } from 'react'
import './App.css'
import placeholderImg from './placeholder.png'
import { ReactComponent as ChevronLeft } from './chevron-left.svg'
import { ReactComponent as ChevronRight } from './chevron-right.svg'
import InputSearch from './components/input-search/InputSearch'

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const search = async () => {
      const response = await fetch(
        'http://www.omdbapi.com/?apikey=a461e386&s=king',
      )
      const data = await response.json()
      setList(data);
    };

    search();
  },[]);

  const getMovies = async (query) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=a461e386&s=${query}`,
      );
      const data = await response.json();
      console.log({data})
      if(data.Search && data.Search.length) {
        setList([]);
        setList(data);
      } else {
        setList([]);
      }
    }
    catch (ex){
      alert(ex)
    }
  };

  return (
    <div className="App">
      <InputSearch searchAction={getMovies}/>
      {list.length === 0? (
        <p>No results yet</p>
      ) : (
        <div className="search-results">
          <div className="chevron">
            <ChevronLeft />
          </div>
          <div className="search-results-list">
            {list.Search.map(result => (
              <div key={result.imdbID} className="search-item">
                <img
                  src={result.Poster === 'N/A' ? placeholderImg : result.Poster}
                  alt="poster"
                />
                <div className="search-item-data">
                  <div className="title">{result.Title}</div>
                  <div className="meta">{`${result.Type} | ${result.Year}`}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chevron">
            <ChevronRight />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
