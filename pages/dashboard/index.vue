<template>
  <div>
<!--    <section v-if="loading" class="container-fluid" style="height: 100vh;display: flex; justify-content: center;align-items: center">-->
<!--      <b-spinner variant="success" type="grow"></b-spinner>-->
<!--    </section>-->
    <section class="container-fluid" dir="rtl" v-if="isLoggedIn">
      <div>
        <!--<b-row>-->
          <!--<b-col cols="12" class="text-center">-->
            <!--<app-logo/>-->
            <!--<h1 class="title" style="font-weight: bold">-->
              <!--داشبورد اکسل-->
            <!--</h1>-->
            <!--<h2 class="subtitle mt-3" style="">-->
              <!--پنل مدیریت-->
            <!--</h2>-->
          <!--</b-col>-->
        <!--</b-row>-->
        <b-modal id="modal-new" dir="ltr" title="تعریف اکسل" busy>
          <add-excel></add-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-new-customer" dir="rtl" title="تعریف مشتری">
          <add-customer></add-customer>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-edit-excel" dir="rtl" title="ویرایش فایل">
          <edit-excel :eid="eid"></edit-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-remove-excel" dir="rtl" title="حذف فایل" busy>
          <p class="my-4 subtitle-mini" style="text-align: center"><span>😔</span>آیا از حذف اطمینان دارید؟</p>
          <b-form @submit.stop.prevent="removeExcel" class="text-center">
            <b-button  type="submit">تایید</b-button>
            <b-button @click="$bvModal.hide('modal-remove-excel')">لغو</b-button>
          </b-form>
          <div slot="modal-footer"></div>
        </b-modal>

        <b-row aling-h="start">
          <div class="col-md-6">
            <div class="form-group mt-3">
              <input v-model="query" type="text" class="form-control pt-4 pb-4" placeholder="جستجو...">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mt-3 float-right">
              <b-button class="mt-1" v-b-modal.modal-new dir="rtl">تعریف اکسل</b-button>
<!--              <b-button class="mt-1" v-b-modal.modal-new-customer dir="rtl">تعریف مشتری</b-button>-->
            </div>
          </div>
        </b-row>
        <b-row align-h="start" class="container-fluid">
          <b-card
            v-for="excel in filteredList"
            :key="excel.id"
            class="card"
          >
            <div class="card-body">
              <h5 class="card-title subtitle-mini"><span class="ml-1">📝</span>{{ excel.customer_name || 'بدون نام'}}</h5>
              <p class="card-text subtitle-mini"><span class="label">کد:</span>&nbsp;{{ excel.customer_no || 'کد مشتری ثبت نشده است' }}</p>
              <p class="card-text subtitle-mini" style="color: cornflowerblue">{{ excel.description || 'شرحی ثبت نشده است' }}</p>
              <p  class="card-text subtitle-mini" style="color: orangered"><span class="label">بدهکار:</span>&nbsp;{{ excel.owed || '0' }}</p>
              <p class="card-text subtitle-mini" style="color: #41b883"><span class="label">بستانکار:</span>&nbsp;{{ excel.owned || '0' }}</p>
<!--              <p class="subtitle-mini">مشتری ثبت نشده است</p>-->
<!--              <b-badge class="subtitle-icon" style="padding:8px;background-color:white;cursor: pointer;"-->
<!--                       @click="editFile(excel.id)" pill>🖊️-->
<!--              </b-badge>-->
<!--              <b-badge class="subtitle-icon" style="padding:8px;background-color:white;cursor: pointer;" pill-->
<!--                       @click="showRemoveModal(excel.id)">🗑️-->
<!--              </b-badge>-->
<!--              <router-link v-if="excel.customer" :to="{ name: 'customers-id', params: { id: excel.customer.id }}"-->
<!--                           tag="a"-->
<!--                           class="btn btn-primary">-->
<!--                مشاهدۀ مشتری-->
<!--              </router-link>-->
            </div>
          </b-card>
          <p v-if="!filteredList.length"><span>😔</span> <span>بدون نتیجه</span></p>
        </b-row>
      </div>
    </section>
  </div>
</template>

<script>
  // import CustomersQuery from '../../apollo/queries'
  import CustomersQuery from '@/apollo/queries/CustomersQuery.gql'
  import AppLogo from '~/components/AppLogo.vue'
  import AddExcel from '~/components/AddExcel.vue'
  import EditExcel from '~/components/EditExcel.vue'
  import AddCustomer from '~/components/AddCustomer.vue'
  import Strapi from 'strapi-sdk-javascript/build/main'
  import {mapGetters} from 'vuex'
  import Header from "../../components/Header";

  const apiUrl = process.env.API_URL || 'http://localhost:1337'
  const strapi = new Strapi(apiUrl)

  export default {
    data() {
      return {
          customers:[],
        query: '',
        queryCustomer: '',
        eid: '',
      }
    },
    components: {
        Header,
      AppLogo,
      AddExcel,
      AddCustomer,
      EditExcel,
    },
    methods: {
      showRemoveModal(id) {
        this.eid = id
        this.$bvModal.show('modal-remove-excel')
      },
      async removeExcel() {
        const entry = await strapi.deleteEntry('excels', this.eid)
        if (entry) {
          this.$store.commit('excels/remove', this.eid)
          alert('فایل با موفقیت حذف گردید.')
        }
        this.$bvModal.hide('modal-remove-excel')
      },
      editFile(id) {
        this.eid = id
        this.$bvModal.show('modal-edit-excel')
      },

    },
    computed: {
        isLoggedIn(){
          return this.$store.getters['auth/username']
        },
        loading(){
          return this.$store.getters['customers/loading']
        },
      filteredList(){
          if(this.query == ""){
            return this.customers
          }
        return this.customers.filter(excel => {
          return (excel.customer_name && excel.customer_name.includes(this.query)) ||
            (excel.customer_no && excel.customer_no.toLowerCase().includes(this.query.toLowerCase())) ||
            (excel.date && excel.date.toLowerCase().includes(this.query.toLowerCase())) ||
            (excel.description && excel.description.includes(this.query))
        })
      },
      // excels(){
      //   return this.$store.getters['customers/list']
      // }
    },
      apollo: {
          customers: {
              prefetch: true,
              query: CustomersQuery
          }
      },
    // async fetch({store}) {
      // store.commit('customers/emptyList')
     //      const response = await strapi.request('post', '/graphql', {
     //        data: {
     //          query: `query {
     //            customers{
     //              id
     //              fin_year
     //              date
     //              customer_no
     //              customer_name
     //              description
     //              owed
     //              owned
     //            }
     //          }
     //          `
     //        }
     //      })
     // response.data.customers.forEach(customer => {
     //    // restaurant.image.url = `${apiUrl}${restaurant.image.url}`
     //    store.commit('customers/add', {
     //      id: customer.id,
     //      ...customer
     //    })
     //  })
        // store.commit('customers/loading',false)
        // store.commit('customers/emptyList')
      // const responseCustomers = await strapi.request('post', '/graphql', {
      //   data: {
      //     query: `query {
      //               customers{
      //                 id
      //                 customer_name
      //                 customer_phone_number
      //                 excels{
      //                   id
      //                   file_name
      //                 }
      //               }
      //           }
      //     `
      //   }
      // })
      // responseCustomers.data.customers.forEach(customer => {
      //   store.commit('customers/add', {
      //     id: customer.id,
      //     ...customer
      //   })
      // })
    // }
  }
</script>

<style>
  .label{
    font-weight: bold;
  }
  .card {
    margin: 15px;
    max-width: 20rem;
    text-align: center;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  }

  .card:hover {
    box-shadow: 20px 20px 40px 0px rgba(0, 0, 0, 0.5);
  }

  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .subtitle-mini {
    font-weight: 400;
    font-size: 22px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 5px;
  }

  .subtitle-icon {
    font-weight: 400;
    font-size: 22px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 5px;
  }

  .links {
    padding-top: 15px;
  }
</style>

