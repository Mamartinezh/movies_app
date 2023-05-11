
import { useState } from "react"
import RatingStars from "./RatingStars"
import "./MovieCard.css"

export default function MovieCard(props) {

	const [ liked, setLiked ] = useState(props.liked)

	function handleLiked(e) {
		e.stopPropagation()
		setLiked(!liked)
		props.onLike(props.id)
	}

	return (

		<div 
			className="movie" 
			onClick={props.clickCallback}
			style={
				{backgroundImage: "url(" + 
				`https://image.tmdb.org/t/p/original/${props.img}` + ")"
			}}>
			<div className="movie-data">
				<h2 className="movie-data--name" title={props.name}>{props.name}</h2>
				<div className="movie-data--props">
					<p>
						{`${props.lang.toUpperCase()} 
						| ${props.genres.join(", ")} 
						| ${props.date}`}
					</p>
				</div>
				{!props.horBox && <p className="movie-data--desc">{props.desc}</p>}
				<RatingStars rate={props.rate} showRate={!props.horBox} votes={!props.horBox ? props.votes : null} />
			</div>
			{!liked && <i 
				className="fa-regular fa-heart movie-liked"
				onClick={handleLiked}></i>}
			{liked && <i 
				className="fa-solid fa-heart movie-liked"
				onClick={handleLiked}></i>}
		</div>

	)

}
