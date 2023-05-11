
import RatingStars from "./RatingStars"
import "./MovieDetailsCard.css"

export default function MovieDetailsCard({ data, trailerKey }) {

	return (

		<div 
			className="details-card" 
			style={data ? {backgroundImage: "url(" + `${data.img}` + ")",} : {}}>
			{trailerKey ? 
				<iframe 
					className="details-card--player"
					src={`https://www.youtube.com/embed/${trailerKey}`}
					title="YouTube video player" 
					frameBorder="0" 
					allowFullScreen>
				</iframe> :
				<div className="details-card--player"></div>
			}
			{data ?
				<div className="details-card--data">
					<h2 className="details-card--data_name">{data.name}</h2>
					<h3 className="details-card--data_tag">{data.tagline}</h3>
					<div className="details-card--data_props">
						<p>
							{`${data.lang} 
							| ${data.dur}
							| ${data.genres.join(", ")} 
							| ${data.date}`}
						</p>
					</div>
					<p className="details-card--data_boxoffice">
						{!data.seasons ? `Budget: ${data.budget} 
						| Revenue: ${data.revenue}` : `Seasons: ${data.seasons} 
						| Episodes: ${data.episodes}`}
					</p> 
					<p className="details-card--data_desc">
						{data.desc}
					</p>
					<RatingStars rate={data.rate} votes={data.votes} />
				</div>
				:
				<div className="details-card--data"></div>
			}
		</div>

	)	
}