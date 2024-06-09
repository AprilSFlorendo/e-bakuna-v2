export function randomColor() {
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += Math.floor(Math.random() * 10);
	}
	return color;
}

export function suppressDefault(handler) {
	return function (event) {
		event.preventDefault();
		handler(event);
	};
}
