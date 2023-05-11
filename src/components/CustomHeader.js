
import { useEffect, useState } from "react"
import OptionsContainer from './OptionsContainer'
import ThemeSwitcher from './ThemeSwitcher'
import './CustomHeader.css'

export default function CustomHeader({ toggleOptions, currentToggle, sortOptions, 
	sortCallback, currentSortOption, searchCallback }) {

	const [ headerSticky, setHeaderSticky ] = useState(false)
	const [ searchValue, setSearchValue ] = useState("")
	const [ showSortMenu, setShowSortMenu ] = useState(false)
	const [ showFiltMenu, setShowFiltMenu ] = useState(false)
	const [ groupButtons, setGroupButtons ] = useState(false)

	useEffect(() => {
		function listenScroll() {
			if (window.scrollY > 100) setHeaderSticky(true)
			if (window.scrollY === 0) setHeaderSticky(false)
		}

		function listenResize() {
			if (window.innerWidth < 760) setGroupButtons(true)
			if (window.innerWidth >= 760) setGroupButtons(false)
		}

		addEventListener("scroll", listenScroll)

		addEventListener("resize", listenResize)

		listenResize()

		return (() => {
			removeEventListener("scroll", listenScroll)
			removeEventListener("resize", listenResize)
		})

	}, [])

	function handleSearchChange(e) {
		setSearchValue(e.target.value)
		if (e.target.value === "") searchCallback("")
	}

	function callSearchCallback() {
		searchCallback(searchValue)
	}

	function toggleCallback(key) {
		toggleOptions.find(opt => opt.key === key).callback(key)
	}

	return (

		<header 
			style={{
				position: `${headerSticky ? 'sticky' : 'static'}`,
				background: `${headerSticky ? '#151515' : 'transparent'}`,
				top: `${headerSticky ? '0px' : '-80px'}`,
				// gridTemplateColumns: `repeat(${toggleOptions.length}, max-content) 1fr`
			}}>
			{!groupButtons && toggleOptions.map(option => 
				<span 
					key={option.key}
					className={`format-type ${currentToggle === option.key ? 'selected' : ""}`} 
					onClick={e => option.callback(option.key)}>{option.label}
				</span>
			)}
			{groupButtons && 
				<i 
					className="fa-solid fa-filter filter-button" 
					onClick={e => setShowFiltMenu(!showFiltMenu)}>
					{showFiltMenu && 
						<div className="filter-div--options">
							<OptionsContainer 
								options={toggleOptions.reduce((opts, item) => 
									({...opts, [item.key]: item.label}), {})} 
								current={currentToggle} 
								callback={toggleCallback} />
						</div>	
					}
				</i>
			}
			<div className="search-container">
				<input 
					className="search" 
					type="search" 
					value={searchValue} 
					onChange={handleSearchChange} 
					onKeyPress={e=> e.key === "Enter" ? callSearchCallback() : ""}
					placeholder="Movie/TV Show name..."/>
				<i className="fa-solid fa-magnifying-glass" onClick={callSearchCallback}></i>
			</div>
			<div className="sort-div">
				<svg 
					className="sort-svg" 
					onClick={e => setShowSortMenu(!showSortMenu)} 
					viewBox="0 0 80 30"
					width="80px" 
					height="30px" 
					fill="none">
					<rect x="0" y="0" width="80px" height="30px" fill="none" />
					<text x="24" y="20" fontSize="15px" fill="none">SORT</text>
				</svg>
				{showSortMenu && 					
					<div className="sort-div--options">
						<OptionsContainer 
							options={sortOptions} 
							current={currentSortOption} 
							callback={sortCallback} />
					</div>
				}
			</div>
			<div className="themeswitcher"><ThemeSwitcher theme={true}/></div>
		</header>

	)
}