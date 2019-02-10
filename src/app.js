
import Vue from 'vue'
import formComponent from './app-form.vue'

var vm = new Vue({
	el: '#app',
	render: h => h(formComponent)
});
