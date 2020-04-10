import React from 'react';
import { Row, Col } from 'reactstrap';
import Sketch from './Sketch';

class App extends React.Component {

	render() {
		return (
			<div className="text-center">
				<h1 className="m-5">Hello World</h1>
				<Row>
					<Col>
						<p>Animation of Neural Network</p>
						<Sketch></Sketch>
					</Col>
				</Row>
			</div>
		);
	}
}

export default App;
