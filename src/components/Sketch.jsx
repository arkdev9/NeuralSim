import React from "react";
import p5 from "p5";
import { Button } from "reactstrap";

class Sketch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 500,
			height: 500
		};
		this.myRef = React.createRef();
	}

	Sketch = (p) => {
		p.setup = () => {
			p.createCanvas(this.state.width, this.state.height);
		}

		p.draw = () => {
			p.background(50);
		}
	}

	componentDidMount() {
		this.myP5 = new p5(this.Sketch, this.myRef.current);
	}

	render() {
		return (<div ref={this.myRef}></div>);
	}
}

export default Sketch;