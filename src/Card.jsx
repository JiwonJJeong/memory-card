
export default function Card({src, name}){



    return (
      <figure>
        <img src={src}></img>
        <figcaption>{name}</figcaption>
      </figure>
    )
  }