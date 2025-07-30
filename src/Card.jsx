import "./Card.css";

export default function Card({src, name, onClick}){

    return (
      <figure onClick={onClick} tabIndex="0" onKeyDown={(e)=> {
        if (e.key === "Enter") {
          onClick();
        }
      }}>
        <img src={src} width="150px" height="150px"></img>
        <figcaption>{name}</figcaption>
      </figure>
    )
  }