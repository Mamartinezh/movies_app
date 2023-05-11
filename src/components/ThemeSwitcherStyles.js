

export const ThemeSwitcherStyle = {
	fontWeight: "600",
	display: "flex",
	alignItems: "center"
}

export const SwitcherStyle = {
	padding: "12px 25px",
	borderRadius: "15px",
	background: "#ddd",
	margin: "0 10px",
	cursor: "pointer",
	position: "relative"	
}

export const SwitcherStyleDark = {
	...SwitcherStyle,
	background: "#000000"	
}

export const DotStyle = {
	padding: "10px",
	borderRadius: "50%",
	position: "absolute",
	background: "black",
	left: "2px",
	bottom: "2px",
	transition: "left 0.5s, background 0.5s",
}

export const DotStyleDark = {
	...DotStyle,
	left: `${50-(20+2)}px`,
	background: "#ffffff"
}

export const LightStyle = {
	color: "#000000"
}

export const LightStyleDark = {
	color: "#aaaaaa99"
}

export const DarkStyle = {
	color: "#aaaaaa99"
}

export const DarkStyleDark = {
	color: "#ffffff"
}