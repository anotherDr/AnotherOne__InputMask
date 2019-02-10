// JS only
import '../sass/main.scss'
import AMask from './a-mask'

/* Single use --------------------------------- */

const params1 = {
	selector: '#js__date',
	spaceholder: '-',
	pattern: '99.99.9999'   // FOR DATE
};

let amask1 = new AMask(params1);
amask1.init();

/* Multiple use --------------------------------- */

const params2 = {
	selector: '.js__amask',
	spaceholder: '-',
	pattern: '+9 (999) 999-99-99'   // FOR PHONE NUMBER
};
let amask2 = new AMask(params2);
amask2.init();


/* TEST -------------------------------------- */
// import AMask from "./a-mask";

const testVal = [
	{val: '0', res: '0_.__.____'},
	{val: '00', res: '00.__.____'},
	{val: '1.02.', res: '10.2_.____'},
	{val: '1.02.1965', res: '10.21.965_'},
	{val: '01.02.196589', res: '01.02.1965'},
	{val: 'a', res: '__.__.____'},
	{val: 'asdasdasd', res: '__.__.____'},
	{val: '', res: '__.__.____'},
];

function test(){
	let testMasc = new AMask();
	
	console.log(AMask.version());
	
	testVal.forEach((it, idx)=>{
		let res = testMasc.calcOutputValue(it.val);
		console.log( idx, it.res === res, it.val , it.res, res );
	});
}

if (window.location.hash === '#test') {
	test();
}
