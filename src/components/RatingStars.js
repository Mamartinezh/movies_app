

const starStyle = {
	display: "inline",
	fontWeight: "900",
	WebkitTextStrokeWidth: "0.3px",
	WebkitTextStrokeColor: "#ffffff",
	fontSize: "1rem",
	marginLeft: "0px",
}

const divStyle = {
	color: "transparent",
	background: "gold",
	display: "inline-block",
	WebkitBackgroundClip: "text",
	backgroundClip: "text",
	whiteSpace: "nowrap",
	overflow: "visible",
	position: "relative",
}

const spanStyle = {
	color: "#ffffff",
	marginLeft: "20px"
}

export default function RatingStars({rate, showRate = true, votes}) {

	let width = rate || 0

	return (

		<div 
			style={{...divStyle, width: width * 110 / 10 + "px"}}>
			{Array(5).fill(1).map((item, idx) => 
				<i key={idx} style={starStyle} className="fa-regular fa-star"></i>)}
			{rate && showRate && <span style={spanStyle}>{rate} / 10</span>}
			{votes && <span style={spanStyle}>{votes} votes</span>}
		</div>

	)
}