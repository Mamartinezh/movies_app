
import './ExpandableContainer.css'
import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import ReviewCard from "./ReviewCard"

export default function ExpandableContainer({ items, closeCallback }) {

	const container = useRef()
	const parentWidth = useRef()
	const [ containerWidth, setContainerWidth ] = useState('300px')
	const [ scrollPos, setScrollPos ] = useState(0)
	const [ expandedItem, setExpandedItem ] = useState(false)

	useEffect(() => {

		container.current.style.left = "0%"
		let item = [...container.current.children].at(0)
		let width = getComputedStyle(item).getPropertyValue("width")
		let parent = container.current.parentElement
		setContainerWidth(`${parseInt(width) + 150}px`)
		parentWidth.current = parseInt(getComputedStyle(parent).getPropertyValue("width"))
		
		const itemObserver = new ResizeObserver(entries => {
			setContainerWidth(`${entries[0].contentRect.width + 150}px`)
			setExpandedItemSize(entries[0])
		})

		const parentObserver = new ResizeObserver(entries => {
			centerExpandedItem(entries[0])
		})

		itemObserver.observe(item)
		parentObserver.observe(parent)

	}, [])

	function expandItem(e, itemId) {
		if (expandedItem) return
		setExpandedItem({
			id: itemId,
			rect: calcRect(e)
		})
	}

	function calcRect(item) {
		let refElem = container.current.parentElement
		let className = item.className
		while (className !== "expandable-container--item") {
			item = item.parentElement
			className = item.className
		}
		let itemWidth = parseInt(getComputedStyle(item).getPropertyValue('width'))
		let itemHeight = parseInt(getComputedStyle(item).getPropertyValue('height'))
		let refWidth = parseInt(getComputedStyle(refElem).getPropertyValue('width'))			

		return {
			width: itemWidth,
			height: itemHeight,
			x: (refWidth - itemWidth) / 2 - item.offsetLeft,
			y: scrollPos - item.offsetTop + 30
		}
	}

	function centerExpandedItem(item) {
		let newParentWidth = parseInt(item.contentRect.width)
		let dx = (parentWidth.current - newParentWidth)
		parentWidth.current = newParentWidth
		setExpandedItem(prevState => prevState ? {
			...prevState,
			rect: {
				...prevState.rect,
				x: prevState.rect.x - dx / 2
			}
		} : false) 		
	}

	function setExpandedItemSize(item) {
		let width = item.contentRect.width
		let height = item.contentRect.height
		setExpandedItem(prevState => prevState ? {
			...prevState,
			rect: {
				...prevState.rect,
				x: prevState.rect.x + (prevState.rect.width - width) / 2,
				width, height
			}
		} : false)
	}

	function nextItem(dx) {
		setExpandedItem(prevState => {
			if (prevState.id === 0 && dx === -1) return prevState
			if (prevState.id === items.length - 1 && dx === 1) return prevState
			let newItem = [...container.current.children].at(prevState.id + dx)
			return ({
				id: prevState.id + dx,
				rect: calcRect(newItem)
			})
		})	
	}

	function updScrollPosition(e) {
		setScrollPos(e.target.scrollTop)
	}

	return (
		<div 
			ref={container} 
			onScroll={updScrollPosition}
			style={{
				width: `${expandedItem ? '100%' : containerWidth}`,
				background: `${expandedItem ? '#000' : 
					`linear-gradient(to right, #000, #000 ${parseInt(containerWidth) - 100}px, #00000000 ${containerWidth})`}`
			}}
			className={`expandable-container ${expandedItem ? 'expanded' : ''}`}>
			{items.map((item, id) =>  
				<div 
					className="expandable-container--item"
					onClick={e => expandItem(e.target, id)} 
					key={id}
					style={{
						boxShadow: `${expandedItem ? '0 0 0 0 #000' : ''}`,
						opacity: `${expandedItem  && id !== expandedItem.id ? 0 : 1}`,
						visibility: `${expandedItem  && id !== expandedItem.id ? 'hidden' : ''}`,						
						transform: `${expandedItem && id === expandedItem.id ? 
							`translateX(${expandedItem.rect.x}px) translateY(${expandedItem.rect.y}px)` : ''}`						
					}}>
					{item}
				</div>)
			}
			{!expandedItem && 
				<i 
					className="fa-sharp fa-solid fa-xmark" 
					onClick={closeCallback}
					style={{top: `${scrollPos + 10}px`}}>
				</i>
			}
			{expandedItem && 
				<>
				<i 
					className="fa-solid fa-arrow-left" 
					onClick={e => setExpandedItem(false)}
					style={{top: `${scrollPos + 10}px`}}>	
				</i>
				<p 
					className="expandable-container--desc" 
					style={{
						bottom: -scrollPos + 70,
						height: `calc(100% - ${expandedItem.rect.height + 120}px)`
					}}>
					{expandedItem ? items.at(expandedItem.id).props.content : ''}
				</p>
				<div 
					className="expandable-container--controls" 
					style={{bottom: -scrollPos + 20}}>	
					<i className="fa-solid fa-arrow-left" onClick={e => nextItem(-1)}></i>		
					<i className="fa-solid fa-arrow-right" onClick={e => nextItem(1)}></i>
				</div>		
				</>
			}
		</div>
	)

}
