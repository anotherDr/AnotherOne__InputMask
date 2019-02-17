/*!
 * Another One JS Input Mask
 * Copyright © 2019 anotherDr (Dave R.S.) | MIT license | https://github.com/anotherDr/AnotherOne__InputMask
 */
// @ts-check
'use strict';
const version = '0.1.0';
const defaultOptions = {
	pattern: '99.99.9999',
	placeholder: '_',
	selector: '.amask'
};

export default class AMask {    // A Mask
	
	constructor( opt = defaultOptions ) {
		/** @type {string} */
		this.selector = opt.selector || defaultOptions.selector;
		/** @type {NodeList} */
		this.elems = opt.elem || document.querySelectorAll(this.selector);
		/** @type {string} */
		this.pattern = opt.pattern || defaultOptions.pattern;
		/** @type {string} */
		this.placeholder = opt.placeholder || defaultOptions.placeholder;
		/** @type {string[]} */
		this.patternArr = this.pattern.split('');
		/** @type {number} */
		this.patternLen = this.patternArr.length;
	}
	
	/* -----------------------------------------------------
	 *  METHODS
	 *  ----------------------------------------------------- */
	
	/**
	 * method returns version
	 * @returns {string}
	 */
	 static version() {
		return `version ${version}`;
	}
	
	/**
	 * method calculates OUTPUT VALUE which will show in the input field
	 * @param {string} value
	 * @returns {string}
	 */
	calcOutputValue(value)  {
		let bufferArr = [],
			/** @type {number} */
			bufferLen = bufferArr.length,               // length of new (output) array
			/** @type {string} */
			placeholder = '_',
			/** @type {string} */
			valueArr = value.replace(/[^0-9.]+/g, ''),  // remove which aren't like those
			/** @type {string} */
			char = '',                                  // slice from value
			/** @type {(number|string)} */
			pat,                                        // slice from pattern
			/** @type {string} */
			inference;                                  // result
		
		for (let i = 0; i < this.patternLen; i++) {
			char = valueArr[i];
			bufferLen = bufferArr.length;
			pat = this.patternArr[bufferLen];
			
			if (/\d/.test(pat)) {
				if (/\d/.test(char)) {
					bufferArr.push(char);
				}
				else if ( !char ) {
					bufferArr.push(placeholder);
				}
				else {
					/* do nothing */
				}
			}
			else if (/[\s.\/()+\-]/.test(pat) ) {
				bufferArr.push(pat);
				i--;
			}
		}
		inference = bufferArr.slice(0, this.patternLen).join('');
		
		return inference;
	}
	
	/**
	 * method calculates CURSOR POSITION
	 * @param {number} position
	 * @param {string} value
	 * @returns {number}
	 */
	calcCursorPosition(position, value){
		/** @type {string} */
		let char = (value.length > 1) ? value.split('')[position-1] : value;
		
		if ( /[\s.\/()+\-]/.test(this.patternArr[position-1]) ) {
			position++;
			return this.calcCursorPosition(position, char);
		}
		else if ( !/[0-9]/.test(char) ) {
			position--;
			if (position < 0) {
				position = 0;
			}
		}
		return position;
	}
	
	/**
	 * method for input event : receives and emits {} : value and position
	 * @param {Object} e
	 * @returns {Object}
	 * */
	maskCore(e,kde) {
			/** @type {AMask} */
		let th = this,
			/** @type {Object} */
			elem = e.currentTarget,
			/** @type {string} */
			value = elem.value,
			/** @type {number} */
			position = elem.selectionEnd,
			/** @type {number} */
			positionStart = elem.selectionStart,
			/** @type {string} */
			output,
			/** @type {number} */
			cursorPosition;
		
			console.log(kde);
		
		/* for Chrome */
		// if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
		// 	return {output: value, cursorPosition: positionStart};
		// }
		
		if (kde.key === 'Backspace'  ||
			kde.key === 'ArrowLeft'  ||
			kde.key === 'ArrowUp'    ||
			kde.key === 'ArrowRight' ||
			kde.key === 'ArrowDown' ) {
			return {output: value, cursorPosition: position};
		}
		
		output = th.calcOutputValue(value);
		cursorPosition = th.calcCursorPosition(position, value);
		return {output, cursorPosition};
		
	}
	
	/**
	 * method sets Attribute placeholder
	 */
	setPlaceholder(){
		// this.elem.setAttribute('placeholder', this.calcOutputValue(this.placeholder));
		return this.calcOutputValue(this.placeholder);
	}
	
	/* -----------------------------------------------------
	 *  METHODS for vanilla js
	 *  ----------------------------------------------------- */
	
	/**
	 * handler used by init
	 * @param {Object} e
	 */
	inputHandler(e) {
			/** @type {AMask} */
		let th = this,
			/** @type {Object} */
			elem,
			/** @type {Object} */
			inputParams;
		
		inputParams = th.maskCore(e);
		elem = e.target;
		elem.value = inputParams.output;
		elem.focus();
		elem.setSelectionRange(inputParams.cursorPosition, inputParams.cursorPosition);
	}
	
	/**
	 * method adds event 'input' for vanilla js uses inputHandler
	 */
	init(){
		/** @type {NodeList} */
		let inputElements = this.elems;
		
		inputElements.forEach((elem)=> {
			elem.setAttribute('placeholder', this.calcOutputValue(this.placeholder));
			elem.addEventListener('input', (e) => this.inputHandler(e) );
		});
	}
}

