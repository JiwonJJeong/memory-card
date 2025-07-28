
export default function Card({src, name, onClick}){



    return (
      <figure onClick={onClick}>
        <img src={src}></img>
        <figcaption>{name}</figcaption>
      </figure>
    )
  }