import Card from "./Card.jsx";
import pokeballImg from "./assets/pokeball.png";

export default function LoadingCard(){


    return (
        <Card src={pokeballImg} name="loading..."/>
    )
}