import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
import placeholderImg from './placeholder.png'
import { ReactComponent as ChevronLeft } from './chevron-left.svg'
import { ReactComponent as ChevronRight } from './chevron-right.svg'
import InputSearch from './components/input-search/InputSearch'

function App() {
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');
  const [numberPage, setNumberPage] = useState(1);
  const [finalNumberOfPages, setFinalNumberOfPages] = useState(1);
  const maxPagesAllowed = 100;
  const pageSize = 10;

  const saveQuery = (query) => {
    setQuery(query);
  };

  const getMovies = useCallback(async () => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=a461e386&page=${numberPage}&s=${query}`,
      );
      const data = await response.json();
      if(data.Search && data.Search.length) {
        setList([]);
        setList(data);
        setNumberOfTotalPages(data.totalResults);
      } else {
        setList([]);
        setNumberOfTotalPages(1);
      }
    }
    catch (ex){
      alert(ex)
    }
  },[query, numberPage]);

  const setNumberOfTotalPages = (totalItems) => {
    let pages = 0;
    if(totalItems > (maxPagesAllowed*pageSize)) {
      pages = 100
    } else {
      pages = Math.ceil(totalItems / pageSize)
    }
    setFinalNumberOfPages(pages);
  };

  const onChangePageClicked = (way) => {
    if(way === 'next' && numberPage < finalNumberOfPages) {
      setNumberPage(numberPage + 1);
    } else if(way === 'prev' && numberPage !== 1) {
      setNumberPage(numberPage - 1);
    }
  };

  useEffect(() =>{
    getMovies();
  },[getMovies]);

  return (
    <div className="App">
      <InputSearch searchAction={saveQuery}/>
      {list.length === 0? (
        <p>No results yet</p>
      ) : (
        <div className="search-results">
          <div className="chevron">
            {numberPage !== 1 && <ChevronLeft onClick={() => onChangePageClicked('prev')}/>}
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
            {numberPage !== finalNumberOfPages && <ChevronRight onClick={() => onChangePageClicked('next')}/>}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
