
import { useState, useEffect, useRef } from "react"
import "./Pagination.css"


export default function Pagination({ callback, startPage = 1, lastPage = 30, nDisp = 11}) {

	const [ sets, setSets ] = useState(null)
	const nPages = lastPage === 0 ? 1 : lastPage
	const shownPages= nPages < nDisp ? nPages : nDisp
	const current = useRef(startPage)

	useEffect(() => {
		setSets({
			page: startPage - 1,
			pages: [...Array(shownPages-1).keys(), lastPage - 1]
		})
	}, [lastPage, shownPages])

	function changePage(id) {
		let half = Math.round((shownPages - 1) / 2) 
		if (id < 0 || id > sets.pages.at(-1) || id === sets.page) return
		let pages = sets.pages
		if (id <= half) {
			pages = [...Array(shownPages-1).keys(), sets.pages.at(-1)]
		}
		else if (id >= sets.pages.at(-1) - (half - 1)) {
			pages = [0, ...[...Array(shownPages-1).keys()]
				.map(idx => sets.pages.at(-1) - idx).reverse()]
		}
		else if (sets.pages.at(-1) - id >= half && id > half) {
			pages = [0, ...[...Array(shownPages-2).keys()]
				.map(idx => idx + id - (half - 1)), sets.pages.at(-1)]
		}
		setSets({ pages, page: id})
		current.current = id + 1
		callback(id + 1)
	}


	return (

		<div className="pagination">	
			<i 
				className={`fa-solid fa-chevron-left 
					${current.current === 1 && 'disabled'}`}
				onClick={e=>changePage(sets.page - 1)}></i>
			{sets && sets.pages.map((page, id) => (
				<div 
					key={id} 
					className={`page ${sets.page === page 
						? "current-page" 
						: ""}`}
					style={{display: "inline-block"}}
					onClick={e => changePage(page)}>
					{page + 1}
				</div>
				)
			)}
			<i 
				className={`fa-solid fa-chevron-right 
					${current.current === lastPage && 'disabled'}`} 
				onClick={e=>changePage(sets.page + 1)}></i>
		</div>

	)

}

