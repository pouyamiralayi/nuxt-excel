<template>
  <b-row>
    <div class="col-md-12">
      <b-form dir="rtl" @submit.stop.prevent="sendFile">
        <b-form-group
          label="نام مشتری"
          label-cols="12"
          label-align="right">
          <b-form-input
            v-model="customerName"
            type="text"
            :autofocus="true"
            placeholder="نام مشتری را وارد نمایید"
          />
        </b-form-group>
        <b-form-group
          label="شماره همراه مشتری"
          label-cols="12"
          label-align="right"
        >
          <b-form-input
            v-model="customerPhone"
            type="tel"
            @keypress="e => isNumber(e)"
            :autofocus="true"
            placeholder="شماره همراه مشتری را وارد نمایید"
            required
          />
        </b-form-group>
        <div class="w-100 text-right">
          <b-button :disabled="!customerPhone || loading" :variant="(customerPhone) ? 'success' : ''"
                    type="submit">تایید
          </b-button>
        </div>
      </b-form>
    </div>
  </b-row>
</template>

<script>
  import Strapi from 'strapi-sdk-javascript/build/main'

  const apiUrl = process.env.API_URL || 'http://localhost:1337'
  const strapi = new Strapi(apiUrl)

  export default {
    name: "AddExcel",
    props:{
      cid:{
        type:String,
        required:true,
      }
    },
    created(){
      const customer = this.$store.getters['customers/byId'](this.cid)
      if(customer){
        this.customerName = customer ? customer.customer_name : ""
        this.customerPhone = customer ? customer.customer_phone_number : ""
      }
    },
    data() {
      return {
        customerName: '',
        customerPhone: '',
        loading: false,
      }
    },
    methods: {
      isNumber: function(evt) {
        console.log(evt)
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
          evt.preventDefault();;
        } else {
          return true;
        }
      },
      async sendFile() {
        this.loading = true
        try {

          const entity = await strapi.updateEntry('customers',this.cid ,{
            customer_name: this.customerName,
            customer_phone_number: this.customerPhone,
          })
          console.log(entity)

          this.loading = false
          alert('مشتری با موفقیت ویرایش شد.')
          this.$store.commit('customers/update', {
            id: entity.id,
            ...entity
          })
        } catch (e) {
          this.loading = false
          alert(e)
        }
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>
