
import { useEffect, useContext, useReducer, useRef } from "react"
import { ApiContext } from "../App"
import LoadingCard from './LoadingCard'
import RatingStars from "./RatingStars"
import ReviewsButton from "./ReviewsButton"
import MovieDetailsCard from "./MovieDetailsCard"
import ReviewCard from "./ReviewCard"
import ExpandableContainer from "./ExpandableContainer"
import "../images/default_user.png"

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DetailsReducer = (state, action) => {
	switch (action.type) {
		case "LOADING":
			return ({
				...state,
				isLoading: !state.isLoading
			})
		case "SET_TRAILER":
			return ({
				...state,
				trailerKey: action.key
			})
		case "SHOW_REVIEWS":
			return ({
				...state,
				showReviews: !state.showReviews
			})		
		case "SET_DETAILS":
			return ({
				...state,
				data: {
					name: action.title || action.name,
					genres: action.genres.map(genre => genre.name),
					img: `https://image.tmdb.org/t/p/original/${action.poster_path}`,
					date: action.release_date || action.first_air_date,
					revenue: formatter.format(action.revenue),
					budget: formatter.format(action.budget),
					lang: action.original_language.toUpperCase(),
					desc: action.overview,
					tagline: action.tagline,
					rate: Math.round(action.vote_average * 100) / 100,
					votes: action.vote_count,
					dur: action.runtime + " min.",
					popularity: action.popularity,
					episodes: action.number_of_episodes,
					seasons: action.number_of_seasons
				}
			})
		case "SET_REVIEWS":
			let reviews = action.data.results.map(review => ({
				author: review.author,
				date: new Date(review.created_at).toDateString(),
				rate: review.author_details.rating,
				content: review.content,
				img: review.author_details.avatar_path ? 
				`https://image.tmdb.org/t/p/original/${review.author_details.avatar_path}` :
				'../images/default_user.png'
			}))
			return ({
				...state,
				reviews
			})
		default: return state
	}
}

export default function MovieDetails({ id, format, closeCallback=null }) {

	const mainDiv = useRef()
	const apiContext = useContext(ApiContext)
	const [ details, dispatch ] = useReducer(DetailsReducer, {
		id,
		trailerKey: null,
		isLoading: true,
		data: null,
		showReviews: false,
		reviews: [],
		expandReview: null
	})

	useEffect(() => {
		
		fetch(`https://api.themoviedb.org/3/${format}/
			${id}?api_key=${apiContext.API_KEY}&language=en-US`)
		.then(res => res.json())
		.then(data => dispatch({...data, type:"SET_DETAILS"}))

		fetch(`https://api.themoviedb.org/3/${format}/
			${id}/videos?api_key=${apiContext.API_KEY}`)
		.then(res => res.json())
		.then(data => {
			dispatch({type: "LOADING"})
			getTrailerKey(data.results)
		})

		fetch(`https://api.themoviedb.org/3/${format}/${id}/
			reviews?api_key=${apiContext.API_KEY}&language=en-US&page=1`)
		.then(res => res.json())
		.then(data => dispatch({type: "SET_REVIEWS", data}))

		// function listenClickOutside(e) {
		// 	if (!getChildren(mainDiv.current).includes(e.target)) {
		// 		e.stopPropagation()
		// 		closeCallback()
		// 	} 
		// }

		 function listenClickOutside(e) {
			if (e.target.className === 'details-blur') closeCallback()
		}

		// function getChildren(item, children = []) {
		// 	[...item.children].forEach(child => getChildren(child, children))
		// 	children.push(item)
		// 	return children
		// }

		addEventListener("click", listenClickOutside, true)

		return (() => removeEventListener("click", listenClickOutside, true))

	}, [])

	function getTrailerKey(data) {
		let keys = data.filter(item => item.type === "Trailer")
					.map(item => item.key)
		if (keys.length > 0) dispatch({type:"SET_TRAILER", key: keys[0]})
	}

	function showReviews() {
		dispatch({type:"SHOW_REVIEWS"})
	}

	return (

		<div className="details" ref={mainDiv}>
			{details.isLoading && <LoadingCard />}
			{details.data && <MovieDetailsCard data={details.data} trailerKey={details.trailerKey} />}
			{details.data && <ReviewsButton bottom="20px" right="30px" callback={showReviews}/>}
			{details.showReviews && 
				<ExpandableContainer 
					items={details.reviews.map(review => <ReviewCard {...review}/>)} 
					closeCallback={showReviews}/>
			}
			<div className="details-blur">
				<i 
					className="fa-sharp fa-solid fa-circle-xmark"
					onClick={closeCallback}>
				</i>
			</div>
		</div>

	)

}