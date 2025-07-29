import Card from "./Card.jsx";
import LoadingCard from "./LoadingCard.jsx";
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
    async function fetchAllImages() {
      setLoading(true);
      setError(null);
  
      try {
        // Create an array of promises for IDs that need to be fetched
        const fetchPromises = displayedIds
          .filter((id) => !fetchedUrlObjs.current.some((obj) => obj.id === id))
          .map((id) => fetchImage(id));
  
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
      } catch (error) {
        setError(error);
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchAllImages();
  }, [displayedIds]);
  
  async function fetchImage(newId) {
    try {
      console.log(`New ID fetched: ${newId}`);
      const response = await fetch(`${apiStart}${newId}`, { mode: "cors" });
  
      if (response.status >= 400) {
        throw new Error("server error");
      }
  
      const data = await response.json();
      const updatedFetchUrlObjs = [
        ...fetchedUrlObjs.current,
        { id: newId, src: data.sprites.front_default, name: data.name },
      ];
      fetchedUrlObjs.current = updatedFetchUrlObjs;
    } catch (error) {
      setError(error);
      console.error("Error fetching image:", error);
    }
  }

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
    const numIdsRepeats = 9;
    // pull 9 random ids from fetchedUrlObjs and 1 new random ids
    while (newIds.size < numIdsRepeats && fetchedUrlObjs.current.length > 0) {  
      const randomId = fetchedUrlObjs.current[Math.floor(Math.random() * fetchedUrlObjs.current.length)].id;
      newIds.add(randomId);
    }
    while (newIds.size < numIdsToDisplay) {
      const randomIdNotFetched = getRandomRemainingId();
      newIds.add(randomIdNotFetched);
    }
    setDisplayedIds(Array.from(newIds));
  }

  useEffect(() => {
    generateDisplayedIds();
    return resetGame();
  }, []);

  function resetGame(){
    clickedIds.current = [];
    fetchedUrlObjs.current = [];
    remainingIds.current = Array.from({length: 1025}, (_, i) => i + 1);
    generateDisplayedIds();
  }

  function handleClick(id){
    if (clickedIds.current.includes(id)) {
      alert("You already clicked this card! You lose D:");
      resetGame();
      return;
    }
    clickedIds.current.push(id);
    generateDisplayedIds();
  }

  if (error){
    return <p>A network error was encountered.</p>
  }

  let displayedUrlObjs;
  if (!loading ){
    displayedUrlObjs = fetchedUrlObjs.current.filter((obj) => displayedIds.includes(obj.id));
    displayedUrlObjs.sort(() => Math.random() - 0.5);
    console.log(displayedUrlObjs);
  }


  return (
    <div>
      <h1>Memory Game</h1>
      <p>This is a simple React application.</p>
      <p>Score: {clickedIds.current.length}</p>
      <button onClick={resetGame}>Reset Game</button>
      {loading && Array.from({length:10}, (_,i) => (<LoadingCard key={i}/>))}
      {!loading && displayedUrlObjs.map((obj) => (<Card key={obj.id} src={obj.src} name={obj.name} onClick={()=>handleClick(obj.id)} />))}
    </div>
  )
}