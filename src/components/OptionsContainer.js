
import "./OptionsContainer.css"

export default function OptionsContainer({ options, current, callback }) {

	return (
		<div>
			{Object.keys(options).map(key => 
				<div 
					key={key} 
					className={`options-option ${key === current ? 'selected' : ''}`}
					onClick={e => callback(key)}>
					<span>{options[key]}</span>
					<i 
						className="fa-solid fa-check" 
						style={{opacity: `${key === current ? 1 : 0}`}}>
					</i>
				</div>
			)}
		</div>
	)
}