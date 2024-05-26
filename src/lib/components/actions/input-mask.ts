type WildCardMask = '9' | 'a' | '*';

export function inputMask(node: HTMLInputElement, mask: string | undefined) {
	let currentMask = mask;
	let lastInputValue = node.value;

	const update = (updatedMask: string) => {
		if (mask === undefined) return;

		currentMask = updatedMask;
		node.value = cleanAndFormat(node.value, mask);
	};
	const destroy = () => node.removeEventListener('input', inputHandler);

	function inputHandler() {
		if (currentMask === undefined) return;

		const pressedBackspace = lastInputValue.length - node.value.length === 1;
		if (!pressedBackspace) {
			const input = node.value;
			node.value = cleanAndFormat(input, currentMask);
		}
		lastInputValue = node.value;
	}

	node.addEventListener('input', inputHandler);

	return { update, destroy };
}

function cleanAndFormat(input: string, mask: string) {
	const cleanInput = clean(input, mask);
	return format(cleanInput, mask);
}

function format(input: string, mask: string) {
	const clean = Array.from(input);
	let output = '';

	for (let i = 0; i < mask.length; i++) {
		if (!['9', 'a', '*'].includes(mask[i])) {
			output += mask[i];
			continue;
		}

		if (clean.length === 0) break;

		output += clean.shift();
	}
	return output;
}

const re: Record<WildCardMask, RegExp> = {
	'9': /[0-9]/,
	a: /[a-zA-Z]/,
	'*': /[a-zA-Z0-9]/
};

function clean(input: string, mask: string) {
	let inputToBeStripped = input;
	let output = '';
	let wildCardMask = '';

	// Strip away non wildcard mask characters.
	for (let i = 0; i < mask.length; i++) {
		if (['9', 'a', '*'].includes(mask[i])) {
			wildCardMask += mask[i];
			continue;
		}

		for (let j = 0; j < inputToBeStripped.length; j++) {
			if (inputToBeStripped[j] === mask[i]) {
				inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);
				break;
			}
		}
	}

	for (let i = 0; i < wildCardMask.length; i++) {
		let found = false;

		for (let j = 0; j < inputToBeStripped.length; j++) {
			const currentWildCardMask = wildCardMask[i] as WildCardMask;
			if (re[currentWildCardMask].test(inputToBeStripped[j])) {
				output += inputToBeStripped[j];
				inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);

				found = true;
				break;
			}
		}

		if (!found) break;
	}

	return output;
}
