<template>
  <div v-if="isLoggedIn">
    <section v-if="loading" class="container-fluid"
             style="height: 60vh;display: flex; justify-content: center;align-items: center">
      <b-spinner variant="success" type="grow"></b-spinner>
    </section>
    <section v-else class="container-fluid" dir="rtl">
      <div>
        <!--        <p class="text-right w-100">-->
        <!--          {{this.$apollo.queries.customers.loading ? "Loading" : "Done"}}-->
        <!--        </p>-->
        <br>
<!--        <p class="text-right w-100">-->
<!--          <span>تعداد آیتم ها:</span>&nbsp;&nbsp;{{customers && customers.length || 0}}-->
<!--        </p>-->
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
        <!--search range global-->
        <!--remove & search range global-->
        <client-only>
          <div style="display: flex; justify-content: flex-start">
            <div class="form-group mt-3">
<!--              <input v-model="customer_no" type="text" class="form-control pt-2 pb-2 mt-2"-->
<!--                     placeholder="کد مشتری را وارد نمایید...">-->
            </div>
            <div class="text-right">
              <span>از تاریخ:</span><br>
              <date-picker v-model="dateFromG"></date-picker>
            </div>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>تا تاریخ:</span><br>
              <date-picker v-model="dateToG" class=""></date-picker>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="form-group mt-4">
              <b-button type="submit" variant="success" @click="searchRangeGlobal">جستجو</b-button>&nbsp;&nbsp;&nbsp;
              <b-button type="submit" variant="danger" @click="removeRangeGlobal">حذف</b-button>
            </div>
          </div>
        </client-only>
        <client-only>
          <div style="display: flex; justify-content: flex-start">
            <div class="form-group mt-3">
              <input v-model="customer_no" type="text" class="form-control pt-2 pb-2 mt-2"
                     placeholder="کد مشتری را وارد نمایید...">
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>از تاریخ:</span><br>
              <date-picker v-model="dateFrom"></date-picker>
            </div>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>تا تاریخ:</span><br>
              <date-picker v-model="dateTo" class=""></date-picker>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="form-group mt-4">
              <b-button type="submit" variant="success" @click="searchRange">جستجو</b-button>&nbsp;&nbsp;&nbsp;
              <b-button type="submit" variant="danger" @click="removeRange">حذف</b-button>
            </div>
          </div>
        </client-only>
<!--        <b-button v-b-modal.modal-admin>change pass</b-button>-->
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
            <b-button type="submit">تایید</b-button>
            <b-button @click="$bvModal.hide('modal-remove-excel')">لغو</b-button>
          </b-form>
          <div slot="modal-footer"></div>
        </b-modal>

        <b-row aling-h="start">
          <div class="col-md-3">
            <div class="form-group mt-3">
              <input v-model="customer_no_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی کد مشتری...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerNo">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mt-3">
              <input v-model="customer_name_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی نام مشتری...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerName">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mt-3">
              <input v-model="customer_description_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی شرح...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerDesc">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mt-3 text-center">
              <b-button variant="success" class="mt-1" v-b-modal.modal-new dir="rtl">تعریف اکسل</b-button>
              &nbsp;&nbsp;&nbsp;<b-button variant="info" class="mt-1" @click="reload" dir="rtl">بارگذاری مجدد</b-button>
            </div>
          </div>
        </b-row>
        <hr>
        <br>
        <br>
        <b-row align-h="center" class="container-fluid">
          <b-button
            :disabled="currentPage === 1"
            @click="movePage(1)"
          >ابتدا</b-button>&nbsp;&nbsp;&nbsp;
          <b-button
            v-for="page in pages"
            :key="page.name"
            @click="movePage(page.name)"
            :disabled="page.isDisabled"
          >{{page.name}}
          </b-button>
          &nbsp;&nbsp;&nbsp;<b-button
          @click="movePage(totalPages)" :disabled="currentPage === totalPages">انتها</b-button>&nbsp;&nbsp;&nbsp;
        </b-row>
        <b-row align-h="start" class="container-fluid">
          <b-card
            v-if="filteredList && filteredList.length"
            v-for="customer in filteredList"
            :key="customer.id"
            class="card"
          >
            <div class="card-body">
              <h5 class="card-title subtitle-mini"><span class="ml-1">📝</span>{{ customer.customer_name || 'بدون نام'}}
              </h5>
              <div class="card-text subtitle-mini"><p class="label">کد مشتری:</p>&nbsp;{{ customer.customer_no || 'کدمشتری ثبت نشده است' }}
              </div>
              <div class="card-text subtitle-mini"><p class="label">کد صورتحساب:</p>&nbsp;{{ customer.record_no || 'ثبتنشده است' }}
              </div>
              <div class="card-text subtitle-mini"><p class="label">تاریخ:</p>&nbsp;{{customer.date |
                moment("jYYYY/jMM/jDD") || 'تاریخ ثبت نشده است' }}
              </div>
              <p class="card-text subtitle-mini" style="color: cornflowerblue">{{ customer.description || 'شرحی ثبت نشدهاست' }}</p>
              <p class="card-text subtitle-mini" style="color: orangered"><span class="label">بدهکار:</span>&nbsp;{{ customer.owed || '0' }}</p>
              <p class="card-text subtitle-mini" style="color: #41b883"><span class="label">بستانکار:</span>&nbsp;{{ customer.owned || '0' }}</p>
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
          <p v-if="filteredList && !filteredList.length"><span>😔</span> <span>بدون نتیجه</span></p>
        </b-row>
      </div>
    </section>
  </div>
</template>

<script>
    import gql from 'graphql-tag'
    // import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
    // import CustomersQuery from '@/apollo/queries/CustomersQuery.gql'
    import CustomersQueryParam from '@/apollo/queries/CustomersQueryParam.gql'
    import CustomersQueryDelete from '@/apollo/queries/CustomersQueryDelete.gql'
    import CustomersQueryId from '@/apollo/queries/CustomersQueryId.gql'
    import AppLogo from '~/components/AppLogo.vue'
    import AddExcel from '~/components/AddExcel.vue'
    import EditExcel from '~/components/EditExcel.vue'
    import AddCustomer from '~/components/AddCustomer.vue'
    import Strapi from 'strapi-sdk-javascript/build/main'
    import {mapGetters} from 'vuex'
    import Header from "../../components/Header";
    import axios from "axios";
    import moment from 'moment-jalaali'
    // const apiUrl = process.env.API_URL || ''
    // const apiUrl = process.env.API_URL || 'http://localhost:1337'
    const apiUrl = process.env.API_URL || 'http://10.30.205.75:1339'
    const strapi = new Strapi(apiUrl)

    export default {
        apollo: {
            targets:{
              manual:true,
              prefetch:false,
              query:CustomersQueryId,
              fetchPolicy:'no-cache',
              variables(){
                  return {
                      start: this.start,
                      limit: this.limit,
                      sort: 'id:asc',
                      where:this.where
                  }
              },
              skip() {
                return !this.search
              },
                watchLoading(isLoading) {
                    // console.log('isLoading: ',isLoading)
                    // => it would be great if the isLoading variable could be synchronized with the nuxt state change behaviour
                    // following is not working:
                    // if (isLoading) {
                    //     this.loading = true
                    // } else {
                    //     this.loading = false
                    // }
                },
                update: data => data.customers,
                result({data, loading, networkStatus}) {
                    if (!loading) {
                        this.targets = data.customers
                        console.log(this.targets)
                        return
                    }
                },
                error (error) {
                    console.error('TARGETS! ', error)
                },
            },
            customers: {
                manual: true,
                prefetch: false,
                query: CustomersQueryParam,
                // fetchPolicy: 'no-cache',
                variables() {
                    return {
                        start: this.start,
                        limit: this.limit,
                        sort: 'id:asc',
                        where: this.where
                    }
                },
                watchLoading(isLoading) {
                    // console.log('isLoading: ',isLoading)
                    // => it would be great if the isLoading variable could be synchronized with the nuxt state change behaviour
                    // following is not working:
                    if (isLoading) {
                        this.loading = true
                    } else {
                        this.loading = false
                    }
                },
                result({data, loading, networkStatus}) {
                    if (!loading) {
                        this.customers = data.customers
                    }
                },
                error (error) {
                    alert("خطا! لطفاً صفحه را مجدد بارگذاری نمایید.")
                    // console.error('We\'ve got an error!', error)
                },
            },
            // customersDelete: {
            //     manual: true,
            //     prefetch: false,
            //     query: CustomersQueryDelete,
            //     fetchPolicy: 'no-cache',
            //     variables() {
            //         return {
            //             start: this.start,
            //             limit: this.limit,
            //             sort: 'id:asc',
            //             where: this.where
            //         }
            //     },
            //     skip(){
            //       return !this.search
            //     },
            //     watchLoading(isLoading) {
            //         // console.log('isLoading: ',isLoading)
            //         // => it would be great if the isLoading variable could be synchronized with the nuxt state change behaviour
            //         // following is not working:
            //         if (isLoading) {
            //             this.loading = true
            //         } else {
            //             this.loading = false
            //         }
            //     },
            //     async result({data, loading, networkStatus}) {
            //         if (!loading) {
            //             this.loading = true
            //             for (const res of data.customers) {
            //                 if (res.id) {
            //                     try {
            //                         const re = await strapi.deleteEntry('customers', res.id)
            //                         console.log(res)
            //                     } catch (e) {
            //                         console.log(e)
            //                     }
            //                 }
            //             }
            //             this.search = false
            //             this.reload()
            //             // this.customers = data.customers
            //         }
            //     },
            //     error (error) {
            //         console.error('We\'ve got an error!', error)
            //     },
            // },

        },
        async created() {
           this.reload()
        },
        async mounted() {
            // await this.$apolloHelpers.onLogin(this.$store.getters['auth/token'])
            // console.log(this.$apolloHelpers.getToken())
            // await this.$apollo.queries.customers.start()
        },
        data() {
            return {
                where_id:{},
                targets:[],
                search:false,
                customer_no_query:'',
                customer_name_query:'',
                customer_description_query:'',
                maxVisibleButtons: 3,
                currentPage: 1,
                totalPages: null,
                start: 0,
                limit: 100,
                where:{},
                loading: false,
                customer_no: '',
                dateFromGS: '',
                dateFromG: '',
                dateFrom: '',
                dateTo: '',
                dateToG: '',
                dateToGS: '',
                customers: [],
                customersDelete: [],
                query: '',
                queryCustomer: '',
                eid: '',
            }
        },
        components: {
            datePicker: () => import('vue-persian-datetime-picker'),
            // datePicker: VuePersianDatetimePicker,
            Header,
            AppLogo,
            AddExcel,
            AddCustomer,
            EditExcel,
        },
        methods: {
            deleteCustomer(){
                return this.$apollo.mutate({
                  mutation: gql`
                      mutation deleteCustomer($where:InputID) {
                        deleteCustomer(input: {
                          where:$where
                        }) {
                          customer {
                            customer_name
                          }
                        }
                    }

                  `,
                  variables:{
                      id:this.id
                  },
                  update: (store, { data: { customerId } }) => {
                      console.log(customerId)
                      // Read the data from our cache for this query.
                      const customers = store.readQuery({ query: CustomersQueryParam })
                      // console.log(customers)
                      // data.customers
                      // Add our tag from the mutation to the end
                      // data.tags.push(addTag)
                      // Write our data back to the cache.
                      // store.writeQuery({ query: TAGS_QUERY, data })
                  },
                  // optimisticResponse: {
                  //     __typename: 'Mutation',
                  //     addTag: {
                  //         __typename: 'Tag',
                  //         id: -1,
                  //         label: newTag,
                  //     },
                  // },
              })
            },
            async reload(){
                /*reset data*/
                this.resetCursor()
                /*check login*/
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                /*set auth headers*/
                axios.defaults.headers.common.Authorization = 'Bearer ' + this.$store.getters['auth/token'];
                /*calculates totalPages*/
                const resp = await axios.get(apiUrl + '/customers/count')
                if (resp.data) {
                    // console.log(resp.data)
                    this.totalPages = Math.ceil(resp.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                } else {
                    alert("داده ای یافت نشد.")
                    // this.$router.push('/')
                    return
                }
                /*fetch :)*/
                await this.$apollo.queries.customers.refetch()
              // location.reload()
            },
            async searchCustomerNo(){
                if(!this.customer_no_query){
                    alert("کد مشتری را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                const resp = await axios.get(apiUrl + '/customers/count?customer_no_contains='+this.customer_no_query)
                if (resp.data) {
                    // console.log(resp.data)
                    this.totalPages = Math.ceil(resp.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                } else {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                this.resetCursor()
                this.where['customer_no_contains'] = this.customer_no_query
                console.log('where? ',this.where)
                await this.$apollo.queries.customers.refetch()
                // const res = await axios.get(apiUrl+`/customers?customer_no_contains=${this.customer_no_query}`)
                // if(res.data){
                //     // console.log(res.data)
                //     this.customers = res.data
                // }
                // else{
                //     alert("داده ای یافت نشد.")
                // }
                // this.loading = false
            },
            async searchCustomerName(){
                if(!this.customer_name_query){
                    alert("نام مشتری را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                const resp = await axios.get(apiUrl + '/customers/count?customer_name_contains='+this.customer_name_query)
                if (resp.data) {
                    // console.log(resp.data)
                    this.totalPages = Math.ceil(resp.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                } else {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                // this.where = {}
                this.resetCursor()
                this.where['customer_name_contains'] = this.customer_name_query
                console.log('where? ',this.where)
                await this.$apollo.queries.customers.refetch()
                // const res = await axios.get(apiUrl+`/customers?customer_name_contains=${this.customer_name_query}`)
                // if(res.data){
                //     // console.log(res.data)
                //     this.customers = res.data
                // }
                // else{
                //     alert("داده ای یافت نشد.")
                // }
                // this.loading  = false
            },
            async searchCustomerDesc(){
                if(!this.customer_description_query){
                    alert("شرح را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                const resp = await axios.get(apiUrl + '/customers/count?description_contains='+this.customer_description_query)
                if (resp.data) {
                    // console.log(resp.data)
                    this.totalPages = Math.ceil(resp.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                } else {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                // this.where = {}
                this.resetCursor()
                this.where['description_contains'] = this.customer_description_query
                console.log('where? ',this.where)
                await this.$apollo.queries.customers.refetch()
                // const res = await axios.get(apiUrl+'/customers?description_contains='+this.customer_description_query)
                // if(res.data){
                //     // console.log(res.data)
                //     this.customers = res.data
                // }
                // else{
                //     alert("داده ای یافت نشد.")
                // }
                // this.loading = false
            },
            async movePage(i) {
                if(i<=0){
                    return
                }
                this.currentPage = i
                this.start = (i - 1) * this.limit
                console.log('where? ',this.where)
                await this.$apollo.queries.customers.refetch()
            },
            movePageDelete(i) {
                if(i<=0){
                    return
                }
                // this.currentPage = i
                this.start = (i - 1) * this.limit
                // await this.$apollo.queries.customers.start()
            },
            async searchRange(){
                if (!this.customer_no) {
                    alert("شمارۀ مشتری را مشخص نمایید")
                    return
                }
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFrom, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateTo, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&customer_no=${this.customer_no}`)
                    if (response.data == null || response.data === undefined || !response.data) {
                        alert("داده ای یافت نشد")
                        this.loading = false
                        return
                    }
                    this.totalPages = Math.ceil(response.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                    this.resetCursor()
                    this.where['date_gte'] = fdateFrom
                    this.where['date_lt'] = fdateTo
                    this.where['customer_no'] = this.customer_no
                    console.log('where? ',this.where)
                    await this.$apollo.queries.customers.refetch()
                    // const res = await axios.get(apiUrl+`/customers?_sort=id:asc,date:desc&date_gte=${fdateFrom}&date_lt=${fdateTo}&customer_no=${this.customer_no}`)
                    // if(res.data){
                    //     // console.log(res.data)
                    //     this.customers = res.data
                    // }
                    // else{
                    //     alert("داده ای یافت نشد.")
                    // }
                    // this.loading = false
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async searchRangeGlobal(){
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    if (response.data == null || response.data === undefined || !response.data) {
                        alert("داده ای یافت نشد")
                        this.loading = false
                        return
                    }
                    this.totalPages = Math.ceil(response.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                    // this.where = {}
                    this.resetCursor()
                    this.where['date_gte'] = fdateFrom
                    this.where['date_lt'] = fdateTo
                    console.log('where? ',this.where)
                    await this.$apollo.queries.customers.refetch()
                    // const res = await axios.get(apiUrl+`/customers?_sort=id:asc,date:desc&date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    // if(res.data){
                    //     // console.log(res.data)
                    //     this.customers = res.data
                    // }
                    // else{
                    //     alert("داده ای یافت نشد.")
                    // }
                    // this.loading = false
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async removeRangeGlobal() {
                // if (!this.customer_no) {
                //     alert("شمارۀ مشتری را مشخص نمایید")
                //     return
                // }
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    if (response.data == null || response.data === undefined || !response.data) {
                        alert("داده ای یافت نشد")
                        this.loading = false
                        return
                    }
                    this.totalPages = Math.ceil(response.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                    // this.where = {}
                    this.resetCursor()
                    this.where['date_gte'] = fdateFrom
                    this.where['date_lt'] = fdateTo
                    console.log('where? ',this.where)
                    // await this.deleteCustomer()
                    this.search = true
                    for(var i = 0; i< this.totalPages; i++){
                      this.movePageDelete(i)
                      await this.$apollo.queries.targets.refetch()
                      // await this.$apollo.queries.customersDelete.refetch()
                      for(var id of this.targets){
                        // console.log("ID ?", id)
                        // this.id = id
                          this.where_id = {'id':id}
                        // this.where['id'] = id
                          try{
                            const data = await this.deleteCustomer()
                            console.log(data)
                          }
                          catch(err){
                              console.log("DELETE! ",err)
                          }
                          // .then(data => {
                          //   // this.loading = false
                          //   // this.search = false
                          //   // this.reload()
                          // })
                          // .catch(error => {
                          //     // this.loading = false
                          //     // this.search = false
                          //     // this.reload()
                          // })
                      }
                    }
                    this.search = false
                    alert("ذف با موفقیت انجام شد.")
                    this.reload()
                    // const response = await axios.get(apiUrl + `/customers?_limit=0&_sort=id:asc,date:desc&date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    // if (response.data == null || response.data === undefined) {
                    //     alert("داده ای یافت نشد")
                    //     this.loading = false
                    //     return
                    // }
                    // for (const res of response.data) {
                    //     if (res.id) {
                    //         try {
                    //             const re = await strapi.deleteEntry('customers', res.id)
                    //             console.log(res)
                    //         } catch (e) {
                    //             console.log(e)
                    //         }
                    //     }
                    // }
                    // alert("حذف با موفقیت انجام شد")
                    // this.loading = false
                    // location.reload()
                    // this.reload()
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },

            async removeRange() {
                if (!this.customer_no) {
                    alert("شمارۀ مشتری را مشخص نمایید")
                    return
                }
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFrom, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateTo, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&customer_no=${this.customer_no}`)
                    if (response.data == null || response.data === undefined || !response.data) {
                        alert("داده ای یافت نشد")
                        this.loading = false
                        return
                    }
                    this.totalPages = Math.ceil(response.data / 100)
                    if (!this.totalPages) {
                        alert("داده ای یافت نشد.")
                        this.loading = false
                        return
                    }
                    console.log('total pages: ', this.totalPages)
                    // this.where = {}
                    this.resetCursor()
                    this.where['date_gte'] = fdateFrom
                    this.where['date_lt'] = fdateTo
                    this.where['customer_no'] = this.customer_no
                    console.log('where? ',this.where)
                    this.search = true
                    for(var i = 0; i< this.totalPages; i++){
                        this.movePageDelete(i)
                        await this.$apollo.queries.customersDelete.refetch()
                    }
                    // this.search = false
                    // for (const res of response.data) {
                    //     if (res.id) {
                    //         try {
                    //             const re = await strapi.deleteEntry('customers', res.id)
                    //             console.log(res)
                    //         } catch (e) {
                    //             console.log(e)
                    //         }
                    //     }
                    // }
                    // alert("حذف با موفقیت انجام شد")
                    // this.loading = false
                    // location.reload()
                    // this.reload()
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },
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

            resetCursor() {
                this.where = {}
                this.start = 0
                this.currentPage = 1
            }
        },
        computed: {
            startPage() {
                console.log('currentPage: ',this.currentPage)
                // When on the first page
                if (this.currentPage === 1) {
                    return 1;
                }
                // When on the last page
                if (this.currentPage === this.totalPages) {
                    return this.totalPages - this.maxVisibleButtons;
                }
                // When in between
                return this.currentPage - 1;
            },
            endPage() {
                return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
            },
            pages() {
                const range = [];
                // console.log('endPage: ', this.endPage)
                // console.log('totalPage: ', this.totalPages)
                for (let i = this.startPage;
                     i <= this.endPage; i+=1) {
                    if(i<=0){
                        continue
                    }
                    range.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    });
                }

                return range;
            },
            isInFirstPage() {
                return this.currentPage === 1;
            },
            isInLastPage() {
                return this.currentPage === this.totalPages;
            },
            isLoggedIn() {
                return this.$store.getters['auth/username']
            },
            // loading(){
            //   return this.$store.getters['customers/loading']
            // },
            filteredList() {
                if (this.query == "") {
                    return this.customers
                }
                return this.customers && this.customers.filter(excel => {
                    return (excel.customer_name && excel.customer_name.includes(this.query)) ||
                        (excel.customer_no && excel.customer_no.toLowerCase().includes(this.query.toLowerCase())) ||
                        (excel.record_no && excel.record_no.toLowerCase().includes(this.query.toLowerCase())) ||
                        (excel.date && excel.date.toLowerCase().includes(this.query.toLowerCase())) ||
                        (excel.description && excel.description.includes(this.query))
                })
            },
            // excels(){
            //   return this.$store.getters['customers/list']
            // }
        },
    }
</script>

<style>
  .label {
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

