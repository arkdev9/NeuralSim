var testLayer;
var testNetwork;
var hiddenLayers = [2];
// provide optional config object (or undefined). Defaults shown.
const config = {
	binaryThresh: 0.5,
	hiddenLayers: hiddenLayers, // array of ints for the sizes of the hidden layers in the network
	callback: (info) => {
		console.log(info.error);
		testNetwork.updateSynapticWeights(info.weights);
	},
	iterations: 10000,
	activation: "sigmoid", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
	leakyReluAlpha: 0.01 // supported for activation type 'leaky-relu'
};
// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config)
	.trainAsync(
		[
			{ input: [0, 0], output: [0] },
			{ input: [0, 1], output: [1] },
			{ input: [1, 0], output: [1] },
			{ input: [1, 1], output: [0] }
		],
		config
	)
	.then(res => {
		console.log(res);
	});

function setup() {
	createCanvas(windowWidth - 25, windowHeight - 25);
	testNetwork = new Network(5);
}

function draw() {
	background(155);
	testNetwork.render();
}

class Neuron {
	constructor(x, y) {
		// Neuron's position on the screen is handled by the layer it is in
		this.x = x;
		this.y = y;
	}

	render() {
		stroke(0);
		strokeWeight(2);
		circle(this.x, this.y, 20, 20);
	}
}

class Layer {
	constructor(x, numNeurons) {
		// Layer's x position is defined by the layer depth defined by network
		this.x = x;
		this.numNeurons = numNeurons;
		this.neurons = [];
		this.splitHeight = 60;
		this.startY = (height - this.splitHeight * numNeurons) / 2;
		for (let i = 0; i < numNeurons; i++) {
			// Get height, create numNeurons + 1 splits.
			// Starting from 0, each neuron get's a y = lastNeuron + splitHeight
			let newY = this.startY + i * this.splitHeight + this.splitHeight;
			this.neurons.push(new Neuron(this.x, newY));
		}
	}

	render() {
		for (let i = 0; i < this.numNeurons; i++) {
			this.neurons[i].render();
		}
	}
}

class Network {
	constructor(layers) {
		this.layers = [];
		this.synapses = [];
		this.numLayers = layers;
		this.splitWidth = width / (layers + 1);
		// Create the layers
		this.layers.push(new Layer(this.splitWidth, 2));
		for (let i = 0; i < hiddenLayers.length; i++) {
			let layX = (i + 1) * this.splitWidth + this.splitWidth;
			let numNeurons = hiddenLayers[i];
			this.layers.push(new Layer(layX, numNeurons));
		}
		this.layers.push(new Layer((hiddenLayers.length + 2) * this.splitWidth, 1));
		// Create synapses
		for (let i = 0; i < this.layers.length - 1; i++) {
			// For each neuron in this layer
			let synapLayer = [];
			for (let j = 0; j < this.layers[i].neurons.length; j++) {
				// For each neuron in the next layer
				for (let k = 0; k < this.layers[i + 1].neurons.length; k++) {
					let srcX, dstX, srcY, dstY;
					srcX = this.layers[i].neurons[j].x;
					dstX = this.layers[i + 1].neurons[k].x;
					srcY = this.layers[i].neurons[j].y;
					dstY = this.layers[i + 1].neurons[k].y;
					synapLayer.push(new Synapse(srcX, dstX, srcY, dstY));
				}
			}
			this.synapses.push(synapLayer);
		}
	}

	updateSynapticWeights(newWeights) {
		// For each synapLayer
		for (let i = 1; i < newWeights.length; i++) {
			// For each synap Layer
			let synapLayer = newWeights[i];
			let synapLayerNeuronsDims = synapLayer.length;
			for (let j = 0; j < synapLayer.length; j++) {
				for (let k = 0; k < synapLayer[j].length; k++) {
					let x = j + (k * synapLayerNeuronsDims);
					this.synapses[i - 1][x].updateWeight(synapLayer[j][k]);
				}
			}
		}
	}

	render() {
		for (let i = 0; i < this.synapses.length; i++) {
			for (let j = 0; j < this.synapses[i].length; j++) {
				this.synapses[i][j].render();
			}
		}
		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].render();
		}
	}
}

class Synapse {
	constructor(x1, x2, y1, y2) {
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.weight = random();
	}

	updateWeight(weight) {
		this.weight = weight;
	}

	render() {
		strokeWeight(this.weight * 3)
		line(this.x1, this.y1, this.x2, this.y2);
	}
}
