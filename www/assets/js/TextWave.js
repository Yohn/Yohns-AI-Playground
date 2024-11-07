
/**
 * Handle text wave effect
 * @param {string} elementId - The ID of the element to apply the effect to
 * @param {number} waveLength - The number of letters to capitalize at a time
 * @example
 * ```javascript
 * const wave = new TextWave('id', 3); // Replace 'id' with your element's ID, 3 is waveLength
 * wave.start(); // Start the effect
 * wave.stop(); // Stop the effect
 * ```
 */
class TextWave {
	constructor(elementId, waveLength = 1) {
		this.element = document.querySelector(`#${elementId}`);
		this.interval = null;
		this.currentIndex = 0;
		this.waveLength = waveLength; // Number of letters to capitalize at a time
	}

	alternateLetters(text) {
		return text.split('').map((char, i) => {
			const inWaveRange =
				i >= this.currentIndex && i < this.currentIndex + this.waveLength;
			return inWaveRange ? char.toUpperCase() : char.toLowerCase();
		}).join('');
	}

	start() {
		if (!this.element) return;
		let text = this.element.innerText || this.element.value || "";

		this.interval = setInterval(() => {
			this.element.innerText = this.element.value = this.alternateLetters(text);
			this.currentIndex = (this.currentIndex + 1) % text.length;
			if (this.currentIndex + this.waveLength > text.length) this.currentIndex = 0;
		}, 200); // Adjust interval time as needed
	}

	stop() {
		clearInterval(this.interval);
		this.currentIndex = 0; // Reset position when stopped
	}
}