import Card from "./Card.jsx";
import {useState, useEffect, useRef} from "react";

export default function App(){
  const [clickedIds, setClickedIds] = useState([]);
  const [fetchedUrlObjs, setFetchedUrlObjs] = useState([]);
  const [displayedIds, setDisplayedIds] = useState([]);
  const remainingIds = useRef(Array.from({length: 1025}, (_, i) => i + 1));

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const apiStart = "https://pokeapi.co/api/v2/pokemon/";

  useEffect(() => {
    setLoading(false);
  }, [])

  async function fetchImage(){
    setLoading(true);
    setError(null);

    function getRandomRemainingId(){
      if (remainingIds.current.length === 0 ){
        throw new Error("No more IDs available to fetch");
      }
      const newIdIndex = Math.random()*remainingIds.current.length;
      const newId = remainingIds.current.splice(newIdIndex, newIdIndex + 1)[0];
      return newId;
    }


    const newId = getRandomRemainingId();
    console.log(`New ID fetched: ${newId}`);
    fetch(`${apiStart}${newId}`, { mode: "cors" })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => {
        const updatedFetchUrlObjs = [...fetchedUrlObjs, {id: newId, src: response.sprites.front_default, name: response.name}]
        console.log(updatedFetchUrlObjs);
        setFetchedUrlObjs(updatedFetchUrlObjs);
        })
      .catch((error) => setError(error))
      .finally(() => 
        {
          setLoading(false);
        });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error){
    return <p>A network error was encountered.</p>
  }

  return (
    <div>
      <h1>Memory Game</h1>
      <p>This is a simple React application.</p>
      <button onClick={fetchImage}>Fetch Image</button>
      <Card/>
      <Card/>
    </div>
  )
}