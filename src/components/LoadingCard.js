
import "./LoadingCard.css"

export default function LoadingCard() {

	return (
		<>
			<div className="loading">
				{/*<img className="loading-img" src={"../images/pokeball.png"} />*/}
				<svg  width="130" height="130" fill="none">
					<circle 
						className="loading-out" 
						cx="65" 
						cy="65" 
						r="60" 
						fill="none"
						strokeWidth="5" />
				</svg>
				<svg  width="90" height="90" fill="none">
					<circle 
						className="loading-in" 
						cx="45" 
						cy="45" 
						r="40" 
						fill="none"
						strokeWidth="5" />
				</svg>
			</div>
		</>
	)
}