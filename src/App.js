
import MovieCard from './components/MovieCard'
import LoadingCard from './components/LoadingCard'
import Pagination from './components/Pagination'
import MovieDetails from './components/MovieDetails'
import CustomHeader from './components/CustomHeader'
import { useRef, useState, useEffect, useReducer, createContext } from "react"

const API_KEY = "d4505cbbef38198e9675bb67a70e5447"

export const ApiContext = createContext()

const sortOptions = {
	popularity: "popularity", 
	release_date: "release date",
	revenue: "revenue",
	original_title: "title",
	vote_average: "rating score",
	vote_count: "vote count"
}

const dataReducer = (state, action) => {
	switch (action.type) {
		case "ADD_MOVIES":
			let movArr = action.data.results.map(movie => ({
				id: movie.id,
				name: movie.title || movie.name,
				desc: movie.overview,
				rate: movie.vote_average,
				votes: movie.vote_count,
				date: new Date(movie.release_date || movie.first_air_date)
						.toLocaleString('default', 
						{ month: 'short', year: 'numeric' }),
				popularity: movie.popularity,
				img: movie.poster_path,
				lang: movie.original_language,
				genres: movie.genre_ids.map(id => 
					Object.keys(state.genres).includes(id.toString()) 
					? state.genres[id] 
					: ""),
				format: movie.format
			}))
			return ({
				...state,
				totalPages: action.data.total_pages,
				movies: {...state.movies, [state.apiPage]: movArr}
			})
		case "SET_GENRES":
			return ({
				...state,
				genres: action.data
			})			
		case "SET_PAGINATION":
			return ({
				...state,
				apiPage: 1,
				queryCount: state.queryCount + 1,
				isPagination: !state.isPagination
			})		
		case "UPD_PAGE":
			return ({
				...state,
				queryCount: state.queryCount + 1,
				apiPage: action.page || state.apiPage + 1
			})
		case "LOADING":
			return ({
				...state,
				isLoading: !state.isLoading
			})
		case "SHOW_DETAIL":
			return ({
				...state,
				detailFormat: action.format,
				detailId: action.id
			})
		case "UPD_FORMAT":
			return ({
				...state,
				format: action.format,
				apiPage: 1,
				movies: {}
			})	
		case "UPD_SEARCH_STATE":
			return ({
				...state,
				searchQuery: action.query ? action.query.replace(" ", "+") : null,
				queryCount: state.queryCount + 1,
				apiPage: 1,
				movies: {}
			})
		case "UPD_SORT_CRITERIA":
			return ({
				...state,
				sortCriteria: action.newCriteria,
				queryCount: state.queryCount + 1,
				apiPage: 1,
				movies: {}
			})		
		default: return state
	}
}

export default function App() {

	const [ data, dispatch ] = useReducer(dataReducer, {
		movies: {},
		isLoading: false,
		isPagination: true,
		apiPage: 1,
		format: "movie",
		genres: {},
		totalPages: 1,
		detailId: null,
		detailFormat: null,
		searchQuery: null,
		queryCount: 1,
		sortCriteria: "popularity",
	})

	const toggleOptions = [
		{
			key: "movie",
			label: "MOVIES",
			callback: changeFormat
		},
		{
			key: "tv",
			label: "TV SHOWS",
			callback: changeFormat
		},
		{
			key: "liked",
			label: "LIKED",
			callback: showLiked
		}]

	const [ likedMovies, setLikedMovies ] = useState([])
	const [ likedTv, setLikedTv ] = useState([])
	const [ isPhone, setIsPhone ] = useState(false)
	const listener = useRef(listenScroll)
	let moviesArr = []

	useEffect(() => {

		if (Object.keys(data.movies).includes(data.apiPage.toString())) return
		dispatch({type:"LOADING"})

		if (data.format === "liked") getLikedShows()
		else if (data.searchQuery) newSearch()
		else getMovies()

	}, [data.queryCount, data.format])

	useEffect(() => {

		function listenResize() {
			if (window.innerWidth <= 800) setIsPhone(true)
			else setIsPhone(false)
		}

		listenResize()
		addEventListener("resize", listenResize)
		setLikedMovies(JSON.parse(localStorage.getItem("likedmovies")) || [])
		setLikedTv(JSON.parse(localStorage.getItem("likedtv")) || [])
		if (!data.isPagination) addEventListener("scroll", listener.current)
		getGenres()	

		return(() => removeEventListener("resize", listenResize))	

	}, [])

	function listenScroll() {
		if (Math.ceil(window.scrollY + document.documentElement.clientHeight) 
			=== document.documentElement.scrollHeight) {
			dispatch({type:"UPD_PAGE", page: null})
		}		
	}

	async function getMovies(page = null) {
		let allData = await fetch(`https://api.themoviedb.org/3/discover/${data.format}?
			api_key=${API_KEY}&language=en-US&sort_by=${data.sortCriteria}.desc&
			include_adult=false&include_video=false&page=${data.apiPage}&
			with_watch_monetization_types=flatrate&vote_count.gte=300`)
	    allData = await allData.json()	
	    allData.results = allData.results.map(item => ({...item, format: data.format}))
	    dispatch({type:"LOADING"})
	    dispatch({type:"ADD_MOVIES", data: allData})
	}

	async function getGenres() {
		fetch(`https://api.themoviedb.org/3/genre/movie/
			list?api_key=${API_KEY}&language=en-US`)
			.then(res => res.json())
			.then(data => {
				let genreDic = {}
				data.genres.forEach(genre=>genreDic[genre.id] = genre.name)
				dispatch({type:"SET_GENRES", data: genreDic})
			})	
	}

	async function changePagination() {
		if (!data.isPagination) removeEventListener("scroll", listener.current)
		else addEventListener("scroll", listener.current)
		dispatch({type:"SET_PAGINATION"})
	}

	function showLiked() {
		dispatch({type:"UPD_FORMAT", format: "liked"})
	}

	async function getLikedShows() {
		let liked  = []
		let allData = {results: [], total_pages: 1}
		likedTv.forEach(item => liked.push({item, format: "tv"}))
		likedMovies.forEach(item => liked.push({item, format: "movie"}))
		allData.total_pages = Math.ceil(liked.length / 20)
		liked = liked.slice((data.apiPage - 1) * 20, data.apiPage * 20)
		for (let item of liked) {
			await fetch(`https://api.themoviedb.org/3/${item.format}/${item.item}?
				api_key=${API_KEY}&language=en-US`)
				.then(res => res.json())
				.then(data => allData.results.push({
					...data, 
					genre_ids: data.genres.map(item=>item.id), 
					format: item.format
				}))
			}		
		dispatch({type:"ADD_MOVIES", data: allData})
		dispatch({type:"LOADING"})
	}

	function updPage(pageId) {
		dispatch({type:"UPD_PAGE", page: pageId})
	}

	function changeFormat(format) {
		if (format === data.format) return
		dispatch({type:"UPD_FORMAT", format})
	}

	function updSearchState(searchValue) {
		if (searchValue === "" && !data.searchQuery) return
		if (searchValue === "" && data.searchQuery) dispatch({type: "UPD_SEARCH_STATE"})
		else dispatch({type: "UPD_SEARCH_STATE", query: searchValue})		
	}

	async function newSearch() {
		let allData = await fetch(`https://api.themoviedb.org/3/search/${data.format}?
			api_key=${API_KEY}&page=${data.apiPage}&query=${data.searchQuery}`)
	    allData = await allData.json()	
	    allData.results = allData.results.map(item => ({...item, format: data.format}))
	    dispatch({type:"LOADING"})
	    dispatch({type:"ADD_MOVIES", data: allData})
	}

	function updSortCriteria(newCriteria) {
		if (newCriteria === data.sortCriteria) return
		dispatch({type:'UPD_SORT_CRITERIA', newCriteria})
	}

	function updLikedMovies(id) {
		let newLikedMovies
		if (!likedMovies) newLikedMovies = [id]
		else {
			if (likedMovies.includes(id)) newLikedMovies = likedMovies.filter(idx => idx !== id)
			else newLikedMovies = [...likedMovies, id]
		}
		setLikedMovies(newLikedMovies)
		localStorage.setItem("likedmovies", JSON.stringify(newLikedMovies))
	}

	function updLikedTv(id) {
		let newLikedTv
		if (!likedTv) newLikedTv = [id]
		else {
			if (likedTv.includes(id)) newLikedTv = likedTv.filter(idx => idx !== id)
			else newLikedTv = [...likedTv, id]
		}
		setLikedTv(newLikedTv)
		localStorage.setItem("likedtv", JSON.stringify(newLikedTv))
	}

	if (!data.isPagination) for (let key in data.movies) {
		key <= data.apiPage.toString() ? moviesArr.push(...data.movies[key]) : null
	}
	else moviesArr = data.movies[data.apiPage]

	return (
		<ApiContext.Provider value={{
			API_KEY: API_KEY,
			genres: data.genres
		}}>
			<div className="app">
				<CustomHeader 
					searchCallback={updSearchState} 
					toggleOptions={toggleOptions}
					currentToggle={data.format} 
					sortOptions={sortOptions}
					currentSortOption={data.sortCriteria}
					sortCallback={updSortCriteria} />
				<div className="movies">
					{moviesArr && moviesArr.map((movie) => 
						<MovieCard 
							clickCallback={
								e => dispatch({type:"SHOW_DETAIL", id: movie.id, format: movie.format})
							} 
							liked={
								movie.format === "movie" && likedMovies 
								&& likedMovies.includes(movie.id) || movie.format === "tv" 
								&& likedTv && likedTv.includes(movie.id) ? true : false}
							onLike={movie.format === "movie" ? updLikedMovies : updLikedTv}
							horBox={isPhone}
							key={movie.id} {...movie} />)
					}
				</div>
				{data.isLoading && <LoadingCard />}
				{data.isPagination && 
					<Pagination 
						startPage={data.apiPage}
						nDisp={isPhone ? 5 : 11}
						lastPage={data.totalPages > 500 ? 500 : data.totalPages} 
						callback={updPage}
					/>
				}
				{data.detailId && 
					<MovieDetails 
						id={data.detailId} 
						format={data.detailFormat}
						closeCallback={e => dispatch({type:"SHOW_DETAIL", id: null, format: null})} 
					/>
				}
			</div>
		</ApiContext.Provider>
	)

}
