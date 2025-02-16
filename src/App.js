import "./App.css";
import Header from "./Components/Header";
import DubAnime from "./Pages/DubAnime";
import RecentAnime from "./Pages/RecentAnime";
import SearchJSX from "./Components/SearchJSX";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Details from "./Pages/Details";
import Stream from "./Pages/Stream";
import Popular from "./Pages/Popular";

function App() {
  const childRef = useRef();
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [dub, setDub] = useState([]);
  const [idx, setIdx] = useState(1);
  const [idxPropular, setidxPropular] = useState(1);
  const [idxdub, setIdxdub] = useState(1);
  const renderAfterCalled = useRef(false);
  const [searchResult, setSearchResult] = useState(null);

  // Fetch Functions
  const getAnime = async (id = 1) => {
    try {
      const Data = await axios.get(
        `https://gogoanime.herokuapp.com/recent-release?page=${id}`
      );
      setRecent((recent) => [...recent, ...Data.data]);
    } catch (err) {
      console.log("err");
    }
  };
  const getPropular = async (id = 1) => {
    try {
      const propu = await axios.get(
        `https://gogoanime.herokuapp.com/popular?page=${id}`
      );
      setPopular((popular) => [...popular, ...propu.data]);
    } catch (err) {
      console.log("err");
    }
  };
  const getDub = async (id = 1) => {
    try {
      const Data = await axios.get(
        `https://gogoanime.herokuapp.com/recent-release?type=2&page=${id}`
      );
      setDub((dub) => [...dub, ...Data.data]);
    } catch (err) {
      console.log("err");
    }
  };

  // Fetch function call
  useEffect(() => {
    if (!renderAfterCalled.current) {
      getAnime(1);
      getPropular();
      getDub();
    }
    renderAfterCalled.current = true;
  }, []);

  // Search Bar function
  const handelChanges = async (val) => {
    const searchRes = await axios
      .get(`https://gogoanime.herokuapp.com/search?keyw=${val}`)
      .catch((err) => "search Error");
    if (val === "") {
      setSearchResult(null);
    } else {
      setSearchResult(searchRes.data);
    }
  };

  // Handle click
  const handelClick = () => {
    setSearchResult(null);
    childRef.current.emptySearch();
  };

  const loadMoreRecent = () => {
    getAnime(idx + 1);
    setIdx(idx + 1);
  };
  const loadMorePopular = () => {
    getPropular(idxPropular + 1);
    setidxPropular(idxPropular + 1);
  };

  const loadMoreDub = () => {
    getDub(idxdub + 1);
    setIdxdub(idxdub + 1);
  };

  // const handelScroll = (val) => {
  //   scrollRef.current.handelScroll(val);
  // };
  return (
    <Router className="App">
      <Header handelChanges={handelChanges} ref={childRef} />
      {searchResult ? (
        <SearchJSX searchResult={searchResult} handelClick={handelClick} />
      ) : null}
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RecentAnime
              recent={recent}
              searchResult={searchResult}
              handelClick={handelClick}
              loadMoreRecent={loadMoreRecent}
            />
          }
        />
        <Route
          exact
          path="/popular"
          element={
            <Popular
              popular={popular}
              handelClick={handelClick}
              loadMorePopular={loadMorePopular}
            />
          }
        />
        <Route
          exact
          path="/dub-anime"
          element={
            <DubAnime
              recent={dub}
              searchResult={searchResult}
              handelClick={handelClick}
              loadMoreDub={loadMoreDub}
            />
          }
        />
        <Route
          exact
          path="/anime-detail/:animeId"
          element={<Details handelClick={handelClick} />}
        />
        <Route
          exact
          path="/vidcdn/watch/:episodeId"
          element={<Stream />}
        />
      </Routes>
    </Router>
  );
}

export default App;
