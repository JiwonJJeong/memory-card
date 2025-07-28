import Card from "./Card.jsx";
import {useState, useEffect, useRef} from "react";

export default function App(){
  const fetchedUrlObjs = useRef([]);
  const clickedIds = useRef([]);

  const remainingIds = useRef(Array.from({length: 1025}, (_, i) => i + 1));

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const apiStart = "https://pokeapi.co/api/v2/pokemon/";

  const [displayedIds, setDisplayedIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function fetchImage(newId){
      setLoading(true);
      setError(null);
  
      console.log(`New ID fetched: ${newId}`);
      fetch(`${apiStart}${newId}`, { mode: "cors" })
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("server error");
          }
          return response.json();
        })
        .then((response) => {
          const updatedFetchUrlObjs = [...fetchedUrlObjs.current, {id: newId, src: response.sprites.front_default, name: response.name}]
          fetchedUrlObjs.current = updatedFetchUrlObjs;
          })
        .catch((error) => {
          setError(error)
          console.error("Error fetching image:", error);
    })
        .finally(() => 
          {
            setLoading(false);
          });
    };

    displayedIds.map((id) => {
      if (!fetchedUrlObjs.current.some((obj) => obj.id === id)) {
        fetchImage(id);
      }
    })

  }, [displayedIds])

  function generateDisplayedIds(){

    function getRandomRemainingId(){
      if (remainingIds.current.length === 0 ){
        throw new Error("No more IDs available to fetch");
      }
      const newIdIndex = Math.random()*remainingIds.current.length;
      const newId = remainingIds.current.splice(newIdIndex, 1)[0];;
      return newId;
    }

    const newIds = new Set();
    const numIdsToDisplay = 10;
    const numClickedIdsToDisplay = Math.min(8, clickedIds.current.length);
    while (newIds.size < numClickedIdsToDisplay) {
      const randomIdClicked = Math.floor(Math.random() * clickedIds.length);
      newIds.add(fetchedUrlObjs[randomIdClicked].id);
    }
    while (newIds.size < numIdsToDisplay) {
      const randomIdNotClicked = getRandomRemainingId();
      newIds.add(randomIdNotClicked);
    }
    setDisplayedIds(Array.from(newIds));
  }

  useEffect(() => {
    generateDisplayedIds();
    return resetGame();
  }, []);

  function resetGame(){
    clickedIds.current = [];
  }

  function handleClick(id){
    if (clickedIds.current.includes(id)) {
      alert("You already clicked this card!");
      return;
    } else{
      alert("Awesome job! This is a new card");
    }
    clickedIds.current.push(id);
    generateDisplayedIds();
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error){
    return <p>A network error was encountered.</p>
  }

  let displayedUrlObjs;
  if (!loading && !error){
    displayedUrlObjs = fetchedUrlObjs.current.filter((obj) => displayedIds.includes(obj.id));
    displayedUrlObjs.sort(() => Math.random() - 0.5);
    console.log(displayedUrlObjs);
  }


  return (
    <div>
      <h1>Memory Game</h1>
      <p>This is a simple React application.</p>
      <button onClick={resetGame}>Reset Game</button>
      {displayedUrlObjs.map((obj) => (<Card key={obj.id} src={obj.src} name={obj.name} onClick={()=>handleClick(obj.id)} />))}
    </div>
  )
}