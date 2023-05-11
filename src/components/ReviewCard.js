
import RatingStars from "./RatingStars"
import "./ReviewCard.css"
import { useState } from 'react'

export default function ReviewCard({ img, rate, date, author }) {

	const [ imgSrc, setImgSrc ] = useState(img)

	function setDefaultImg() {
		if (imgSrc === '../images/default_user.png') return
		setImgSrc('../images/default_user.png')
	}

	return (
		<div className="review-card">
			<div className="review-card--imgdiv">
				<img className="review-card--img" src={imgSrc} onError={setDefaultImg}/>
			</div>
			<p className="review-card--author">{author}</p>
			<p className="review-card--date">{date}</p>
			<div className="review-card--rating">
				<RatingStars rate={rate} showRate={false} />
			</div>
		</div>
	)

}