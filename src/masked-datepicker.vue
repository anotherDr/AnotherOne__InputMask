<template>
	<div>
		<div class="input-group">
			<input type="text"
			       class="form-control"
			       v-model="typedDate"
			       placeholder="__.__.____"
			       @input="dateMaskinput($event)"
			/>
			<div class="input-group-append">
				<div class="btn btn-outline-secondary btn-datepicker">
					<i class="far fa-calendar"></i>
					<datepicker
							@selected="dateSelected"
							:language="curLang"
							:monday-first="true  "
							format="MM.dd.yyyy"
							:value="computedDate"
							:disabledDates="state.disabledDates"
					/>
				</div>
			</div>
		</div>
		<!-- for test -->
		<!--<div v-if="test" class="clearfix">
			<div>
				{{computedDate}}
			</div>
			<div>
				{{typedDate}}
			</div>
		</div>-->
	</div>
</template>

<script>
	import AMask from './a-mask'                 // mask core module
	
	/* VUEJS-DATEPICKER */
	/* https://github.com/charliekassel/vuejs-datepicker */
	import Datepicker from 'vuejs-datepicker';
	import {en, ru} from 'vuejs-datepicker/dist/locale'
	import moment from 'moment'
	
	const dateProps = {
		spaceholder: '_',
		pattern: '99.99.9999'
	};
	const dateMask = new AMask(dateProps);
	
	export default {
		name: 'masked-input',
		props: {
			lang: String,
			state: Object,
		},
		data() {
			return {
				typedDate: '',
				curLang: this.lang === 'ru' ? ru : en,
				
				/* STATUS */
				test: false, // TODO: remove
			}
		},
		watch: {
			typedDate(){
				let status = '';
				
				/* VALIDATOR */
				if (this.typedDate === '' || this.typedDate === '__.__.____') {
					status = 'isEmpty';
				}
				else if (!/\d\d\.\d\d\.\d\d\d\d/.test(this.typedDate)) {
					status = 'isntFormat';
				}
				else if (!moment(this.typedDate, 'DD.MM.YYYY').isValid()) {
					status = 'isntDate';
				}
				else if (this.state.disabledDates.from && this.state.disabledDates.to) {
					if (!moment(this.typedDate, 'DD.MM.YYYY').isBetween(this.state.disabledDates.to, this.state.disabledDates.from, null, [])) {
						status = 'isOutOfRange';
					}
				}
				else if (this.state.disabledDates.to) {
					if ( moment(this.typedDate, 'DD.MM.YYYY').isBefore(this.state.disabledDates.to) ) {
						status = 'isBeforeRange';
					}
				}
				else if (this.state.disabledDates.from) {
					if ( moment(this.typedDate, 'DD.MM.YYYY').isAfter(this.state.disabledDates.from) ) {
						status = 'isAfterRange';
					}
				}
				
				this.$emit('chosen-date', this.typedDate);
				this.$emit('statuses', status);
			}
		},
		computed: {
			computedDate() {
				let th = this;
				return moment(th.typedDate, 'DD.MM.YYYY').format('MM.DD.YYYY');
			}
		},
		components: {
			Datepicker
		},
		methods: {
			/* Date */
			dateMaskinput(e) {
				let th = this;
				
				let elem = e.target,
					result = dateMask.maskCore(e);
				
				th.typedDate = result.output;
				elem.value = result.output;
				elem.focus();
				elem.setSelectionRange(result.cursorPosition, result.cursorPosition);
			},
			dateSelected(e) {
				this.typedDate = moment(e).format('DD.MM.YYYY');
			},
		}
	}
</script>

<style scoped>
	
	.btn-datepicker {
		position: relative;
		background: #ddd;
		white-space: normal;
		color: #555555;
	}
	
	.btn-datepicker:focus {
		outline: none;
	}
	
</style>

<style lang="scss">
	/* calendar icon from Font Awesome - License CC BY 4.0 License
	 * https://github.com/FortAwesome/Font-Awesome
	 * https://fontawesome.com/icons/calendar?style=regular
	 */
	.far.fa-calendar {
		display: inline-block;
		width: 24px;
		height: 24px;
		vertical-align: top;
		background: url('/img/calendar-regular.svg') 50% 50% no-repeat;
	}
	.vdp-datepicker {
		position: absolute !important;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0;
		padding: 0;
		border-width: 0;
		cursor: pointer;
	}
	
	.vdp-datepicker input {
		@extend .vdp-datepicker;
		background: transparent;
		color: transparent;
	}
	
	.vdp-datepicker__calendar {
		position: absolute;
		z-index: 100;
		background: #fff;
		width: 220px;
		border: 1px solid #ccc;
		right: -1px;
		top: -1px;
		font-size: 14px;
		padding: 0 5px 15px;
		min-height: 172px;
	}
	
	.vdp-datepicker:focus {
		outline: none;
	}
	
	.vdp-datepicker__calendar .cell {
		padding: 0 5px;
		height: 20px;
		line-height: 20px;
		
		&.weekend {
			color: red;
		}
		
		&.selected {
			background: #6be6ff;
		}
	}
</style>