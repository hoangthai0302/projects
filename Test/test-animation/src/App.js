import React from 'react';
import logo from './logo.svg';
import './App.css';
import animation from './animation';
import styled from 'styled-components';

function App() {
	return (
		<div className="App">
			<Heart className="scale">&#x2665;</Heart>
			<JsLogo src="images/logo_js.svg" />
		</div>
	);
}

export default App;

const Heart = styled.div`
	display: inline-block;
	font-size: 150px;
    color: #e00;
    &.scale {
        animation: ${animation.scale} .3s ease;
        /* transform-origin: center; */
    }
`

const breakpointSm = `@media screen and (max-width: 700px)`;
const JsLogo = styled.img`
	width: 2.25rem;
	top: 20px;
	animation: ${animation.scale} 0.3s ease;

	${breakpointSm} {
		width: 1.5rem;
		top: 10px;
	}
`;
