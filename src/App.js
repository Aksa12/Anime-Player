import "./App.css";
import Header from "./Components/Header";
import Popular from "./Components/Popular";
import RecentAnime from "./Components/RecentAnime";
import SearchJSX from "./Components/SearchJSX";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Details from "./Components/Details";
import Stream from "./Components/Stream";

function App() {
  const childRef = useRef();
  const scrollRef = useRef();
  const [recent, setRecent] = useState([]);
  const [propular, setPropular] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  useEffect(() => {
    const getAnime = async () => {
      try {
        const Data = await axios.get(
          `https://gogoanime.herokuapp.com/recent-release`
        );
        setRecent(Data.data);
      } catch (err) {
        console.log("err");
      }
    };
    getAnime();
  }, []);

  useEffect(() => {
    const getPropular = async () => {
      try {
        const propu = await axios.get(
          `https://gogoanime.herokuapp.com/popular`
        );
        setPropular(propu.data);
      } catch (err) {
        console.log("err");
      }
    };
    getPropular();
  }, []);

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
  const handelClick = () => {
    setSearchResult(null);
    childRef.current.emptySearch();
  };

  const handelScroll = (val) => {
    scrollRef.current.handelScroll(val);
  };
  return (
    <Router className="App">
      <Header
        handelChanges={handelChanges}
        ref={childRef}
        handelScroll={handelScroll}
      />
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
              propular={propular}
              ref={scrollRef}
            />
          }
        />
        <Route exact path="/popular" element={<Popular />} />
        <Route exact path="/anime-detail/:animeId" element={<Details />} />
        <Route exact path="/vidcdn/watch/:episodeId" element={<Stream />} />
      </Routes>
    </Router>
  );
}

export default App;
