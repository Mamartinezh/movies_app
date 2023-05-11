
import { useState, useRef, useEffect } from "react"
import { ThemeSwitcherStyle, LightStyleDark,
				LightStyle, SwitcherStyleDark, 
				SwitcherStyle, DotStyleDark, DotStyle,
				DarkStyleDark, DarkStyle} 
				from "./ThemeSwitcherStyles"

export default function ThemeSwitcher(props) {

	let [ theme, setTheme ] = useState(props.theme)
	const root = useRef(document.querySelector(":root"))

	useEffect(() => {
		if (theme) root.current.classList.add("darkmode")
		else root.current.classList.remove("darkmode")
	}, [theme])
	
	return (
		<div style={ThemeSwitcherStyle}>
			<span
				style={theme ? SwitcherStyleDark : SwitcherStyle} 
				onClick={e => setTheme(!theme)}>
				<span style={theme ? DotStyleDark : DotStyle}></span>
			</span>
			<span style={theme ? DarkStyleDark : DarkStyle}>Dark</span>
		</div>
	)
}