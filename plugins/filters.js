import Vue from 'vue'
import formatCurrency from 'format-currency'

Vue.filter('currency', function (val) {
  return formatCurrency(val)
})
