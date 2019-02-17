<template>
	<div>
		
		<div class="row">
			<div class="col-md-12">
				<h2>VUE</h2>
				<h3>Methods</h3>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-4">
				<div class="form-group">
					<input type="text"
					       class="form-control"
					       :placeholder="setPhonePlaceholder()"
					       @keydown="phoneKeydown($event)"
					       @input="phoneMaskinput($event)"
					/>
				</div>
			</div>
			<div class="col-md-4">
				{{phone}}
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-12">
				<h3>With Charliekassel's Vuejs-Datepicker</h3>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-4" :class="{'error': dateError}">
				<!--
				MASKED DATEPICKER COMPONENT
				-->
				<masked-datepicker
						:lang="lang"
						@chosen-date="printResult"
						@statuses="statusHandler"
						:state="state"
				/>
				<div class="msg" v-show="dateError" v-html="dateErrorMsg"/>
			</div>
			<div class="col-md-4">
				Masked Datepicker Result: {{maskedDatepickerResult}}
			</div>
		</div>
		
	</div>
</template>

<script>
	// mask core module for methods
	import AMask from './a-mask'
	
	const props = {
		selector: '#phone',
		spaceholder: '-',
		pattern: '+9 (999) 999-99-99'
	};
	const phoneMask = new AMask(props);
	
	// for component masked datepicker
	import MaskedDatepicker from './masked-datepicker.vue'
	import MESSAGES from './messages'
	
	
	export default {
		name: 'app-form',
		data: function(){
			return {
				/* ---------------------------------------------
				 * MASKED METHODS
				 * --------------------------------------------- */
				kde: null,
				phone: '',
				
				
				/* MASKED DATEPICKER COMPONENT*/
				maskedDatepickerResult: '',
				lang: 'ru',
				state: {
					disabledDates: {
						to: new Date(2019, 0, 25), // Disable all dates up to specific date
						from: new Date(2019, 1, 10), // Disable all dates after specific date
					}
				},
				dateError: false,
				dateErrorMsg: '',
			}
		},
		components: {
			'masked-datepicker': MaskedDatepicker,
		},
		methods: {
			/* ---------------------------------------------
			 * MASKED METHODS
			 * --------------------------------------------- */
			setPhonePlaceholder(){
				return phoneMask.setPlaceholder();
			},
			phoneKeydown(e){
				this.kde = e;
			},
			phoneMaskinput(e){
				let th = this;
				
				let elem = e.target,
					result = phoneMask.maskCore(e, th.kde);
				
				th.phone = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
				
			},
			
			/* ---------------------------------------------
			 * MASKED DATEPICKER COMPONENT
			 * --------------------------------------------- */
			printResult(result){
				this.maskedDatepickerResult = result;
			},
			statusHandler(status){
				this.dateError = !!status;
				this.dateErrorMsg = status ? MESSAGES.ru[status] : '';
			}
		}
	}
</script>

<style scoped>

</style>

<style lang="scss">
	
	.form-control:focus {
		color: #495057;
		background-color: #fff;
		border-color: #ccc;
		outline: 0;
		box-shadow: 0 0 0 0 transparent;
	}
	
	.error {
		input.form-control {
			border: 1px solid #c00;
		}
		.msg {
			color: #c00;
		}
	}
</style>