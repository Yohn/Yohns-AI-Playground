class AutoResizer {
	constructor(textArea, options = {}) {
		this.textArea = textArea;
		this.minHeight = textArea.offsetHeight;
		this.options = { resizeOnChange: true, maxHeight: 400, ...options };
		this.prevHeight = 0;

		this.shadowArea = document.createElement('div');
		Object.assign(this.shadowArea.style, {
			position: 'absolute',
			top: '-10000px',
			left: '-10000px',
			fontSize: window.getComputedStyle(this.textArea).fontSize || 'inherit',
			fontFamily: window.getComputedStyle(this.textArea).fontFamily || 'inherit',
			lineHeight: window.getComputedStyle(this.textArea).lineHeight || 'inherit',
			padding: window.getComputedStyle(this.textArea).padding || 'inherit',
			borderWidth: window.getComputedStyle(this.textArea).borderWidth || 'inherit',
			resize: 'none',
			width: `${this.textArea.offsetWidth}px`
		});
		document.body.appendChild(this.shadowArea);

		if (this.options.resizeOnChange) {
			const onChange = () => setTimeout(() => this.checkResize(), 0);
			this.textArea.addEventListener('input', onChange);
			this.textArea.addEventListener('change', onChange);
			this.textArea.addEventListener('focus', onChange);
			//this.textArea.addEventListener('paste', onChange);
		}

		// Event listener for paste to force resizing
		this.textArea.addEventListener('paste', () => {
			setTimeout(() => this.checkResize(), 500); // Delayed check after paste
		});
		this.checkResize();
	}

	checkResize() {
		if (this.textArea.offsetHeight === 0) return;

		if (this.minHeight === 0) this.minHeight = this.textArea.offsetHeight;
		if (Math.abs(this.shadowArea.offsetWidth - this.textArea.offsetWidth) > 20) {
			this.shadowArea.style.width = `${this.textArea.offsetWidth}px`;
		}

		let val = this.textArea.value.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/&/g, '&amp;')
			.replace(/\n/g, '<br/>&nbsp;');

		if (val.trim() === '') val = 'a';
		this.shadowArea.innerHTML = val;

		const nextHeight = Math.max(this.shadowArea.offsetHeight + 20, this.minHeight);
		if (!this.prevHeight || nextHeight !== this.prevHeight) {
			if (nextHeight < this.options.maxHeight) {
				this.textArea.style.height = `${nextHeight}px`;
				this.prevHeight = nextHeight;
			} else {
				this.textArea.style.height = `${this.options.maxHeight}px`;
			}
		}
	}
}