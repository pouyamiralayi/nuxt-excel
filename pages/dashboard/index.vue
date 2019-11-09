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
              <b-button type="submit" variant="danger" @click="removeRangeGlobal" v-if="!is_android">حذف</b-button>
            </div>
          </div>
        </client-only>
        <client-only v-if="!is_android">
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
        <b-modal id="modal-file" dir="ltr" title="مدیریت فایل ها" busy>
          <file-manager></file-manager>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-new" dir="ltr" title="تعریف اکسل" busy>
          <add-excel></add-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-new-customer" dir="ltr" title="تعریف مشتری">
          <add-customer></add-customer>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-edit-excel" dir="ltr" title="ویرایش فایل">
          <edit-excel :eid="eid"></edit-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-remove-excel" dir="ltr" title="حذف فایل" busy>
          <p class="my-4 subtitle-mini" style="text-align: center"><span>😔</span>آیا از حذف اطمینان دارید؟</p>
          <b-form @submit.stop.prevent="removeExcel" class="text-center">
            <b-button type="submit">تایید</b-button>
            <b-button @click="$bvModal.hide('modal-remove-excel')">لغو</b-button>
          </b-form>
          <div slot="modal-footer"></div>
        </b-modal>

        <b-row aling-h="start">
          <div class="col-md-3" v-if="!is_android">
            <div class="form-group mt-3">
              <input v-model="customer_no_query" type="text" class="form-control pt-4 pb-4"
                     placeholder="جستجوی کد مشتری...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerNo">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3" v-if="!is_android">
            <div class="form-group mt-3">
              <input v-model="customer_name_query" type="text" class="form-control pt-4 pb-4"
                     placeholder="جستجوی نام مشتری...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerName">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mt-3">
              <input v-model="customer_description_query" type="text" class="form-control pt-4 pb-4"
                     placeholder="جستجوی شرح...">
            </div>
            <div class="form-group">
              <b-button @click="searchCustomerDesc">جستجو</b-button>
            </div>
          </div>
          <b-col align-h="start" v-if="!is_android">
            <b-col class="">
              <b-button variant="success" class="mt-1" v-b-modal.modal-new dir="rtl">تعریف اکسل</b-button>
            </b-col>
            <b-col class="">
              &nbsp;&nbsp;&nbsp;<b-button variant="info" class="mt-1" @click="reload" dir="rtl">بارگذاری مجدد</b-button>
            </b-col>
            <b-col class="">
              <b-button variant="warning" class="mt-1" v-b-modal.modal-file dir="rtl">مدیریت فایل</b-button>
            </b-col>
          </b-col>
        </b-row>
        <hr>
        <br>
        <br>
        <b-row align-h="center" class="container-fluid">
          <b-button
            :disabled="currentPage === 1"
            @click="movePage(1)"
          >ابتدا
          </b-button>&nbsp;&nbsp;&nbsp;
          <b-button
            v-for="page in pages"
            :key="page.name"
            @click="movePage(page.name)"
            :disabled="page.isDisabled"
          >{{page.name}}
          </b-button>
          &nbsp;&nbsp;&nbsp;<b-button
          @click="movePage(totalPages)" :disabled="currentPage === totalPages">انتها
        </b-button>&nbsp;&nbsp;&nbsp;
        </b-row>
        <b-row align-h="start" class="container-fluid">
          <b-card
            v-if="filteredList && filteredList.length"
            v-for="customer in filteredList"
            :key="customer.id"
            class="card"
          >
            <div class="card-body">
              <h5 class="card-title subtitle-mini"><span class="ml-1">📝</span>{{ customer.customer_name || 'بدون نام'}}</h5>
              <div class="card-text subtitle-mini"><p class="label">کد مشتری:</p>&nbsp;{{ customer.customer_no || 'کدمشتری ثبت نشده است' }}
              </div>
              <div class="card-text subtitle-mini"><p class="label">کد صورتحساب:</p>&nbsp;{{ customer.record_no || 'ثبتنشده است' }}
              </div>
              <div class="card-text subtitle-mini"><p class="label">تاریخ:</p>&nbsp;{{customer.date | moment("jYYYY/jMM/jDD") || 'تاریخ ثبت نشده است' }}
              </div>
              <p class="card-text subtitle-mini" style="color: cornflowerblue">{{ customer.description || 'شرحیثبتنشدهاست' }}</p>
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
    import FileManager from '@/components/FileManager.vue'
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
    const apiUrl = process.env.apiUrl
    const strapi = new Strapi(apiUrl)

    export default {
        apollo: {
            customers: {
                manual: true,
                prefetch: false,
                query: CustomersQueryParam,
                fetchPolicy: 'no-cache',
                variables() {
                    return {
                        start: this.start,
                        limit: this.limit,
                        sort: 'id:asc',
                        where: this.where
                    }
                },
                watchLoading(isLoading) {
                    this.loading = !!isLoading;
                },
                result({data, loading, networkStatus}) {
                    if (!loading) {
                        this.customers = data.customers
                    }
                },
                error(error) {
                    // alert("خطا! لطفاً صفحه را مجدد بارگذاری نمایید.")
                    console.error('We\'ve got an error!', error)
                },
            },
        },
        async created() {
            //"Authenticated"
            //"android"
            const role = this.$store.getters['auth/role']
            if (role) {
                if (role === 'authenticated') {
                    this.is_android = false
                    console.log(role)
                } else if (role === 'android') {
                    this.is_android = true
                    this.customer_no = this.$store.getters['auth/username']
                    console.log(role)
                } else {
                    this.$router.push('/')
                    return
                }
            }
            // console.log(this.$store.getters['auth/token'])
            await this.$apolloHelpers.onLogin(`${this.$store.getters['auth/token']}`)
            // await this.app.apolloProvider.defaultClient.fetchQueryRejectFns
            // await this.app.apolloProvider.defaultClient.resetStore()
            this.reload()
        },
        async beforeDestroy() {
            const client = this.$apolloProvider.defaultClient
            await client.queryManager.fetchQueryRejectFns;
            await client.clearStore()
        },
        async mounted() {
        },
        data() {
            return {
                is_android: false,
                where_id: {},
                targets: [],
                customer_no_query: '',
                customer_name_query: '',
                customer_description_query: '',
                maxVisibleButtons: 3,
                currentPage: 1,
                totalPages: null,
                start: 0,
                limit: 100,
                where: {},
                loading: false,
                customer_no: '',
                dateFromG: '',
                dateFrom: '',
                dateTo: '',
                dateToG: '',
                customers: [],
                customersDelete: [],
                query: '',
                queryCustomer: '',
                eid: '',
            }
        },
        components: {
            datePicker: () => import('vue-persian-datetime-picker'),
            'file-manager': FileManager,
            Header,
            AppLogo,
            AddExcel,
            AddCustomer,
            EditExcel,
        },
        methods: {
            async reload() {
                this.loading = true
                const client = this.$apolloProvider.defaultClient
                await client.queryManager.fetchQueryRejectFns;
                await client.clearStore()
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
                let resp = null
                if (!this.is_android) {
                    resp = await axios.get(apiUrl + '/customers/count')
                } else {
                    resp = await axios.get(apiUrl + '/customers/count?customer_no='+this.customer_no)
                }
                if (resp && resp.data) {
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
                    // this.$router.push('/')
                    return
                }
                this.loading = false
                /*fetch :)*/
                await this.$apollo.queries.customers.refetch()
                // location.reload()
            },
            async searchCustomerNo() {
                if (!this.customer_no_query) {
                    alert("کد مشتری را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                const resp = await axios.get(apiUrl + '/customers/count?customer_no_contains=' + this.customer_no_query)
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
                console.log('where? ', this.where)
                await this.$apollo.queries.customers.refetch()
            },
            async searchCustomerName() {
                if (!this.customer_name_query) {
                    alert("نام مشتری را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                const resp = await axios.get(apiUrl + '/customers/count?customer_name_contains=' + this.customer_name_query)
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
                this.where['customer_name_contains'] = this.customer_name_query
                console.log('where? ', this.where)
                await this.$apollo.queries.customers.refetch()
            },
            async searchCustomerDesc() {
                if (!this.customer_description_query) {
                    alert("شرح را وارد نمایید!")
                    return
                }
                if (!this.isLoggedIn) {
                    this.$router.push('/')
                    return
                }
                this.loading = true
                let resp = null
                if(!this.is_android){
                  resp = await axios.get(apiUrl + '/customers/count?description_contains=' + this.customer_description_query)
                }
                else {
                  resp = await axios.get(apiUrl + '/customers/count?description_contains=' + this.customer_description_query+'&customer_no='+this.customer_no)
                }
                if (resp && resp.data) {
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
                this.where['description_contains'] = this.customer_description_query
                console.log('where? ', this.where)
                await this.$apollo.queries.customers.refetch()
            },
            async movePage(i) {
                if (i <= 0) {
                    return
                }
                this.currentPage = i
                this.start = (i - 1) * this.limit
                console.log('where? ', this.where)
                await this.$apollo.queries.customers.refetch()
            },
            async searchRange() {
                if (!this.customer_no) {
                    alert("شمارۀ مشتری را مشخص نمایید")
                    return
                }
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFrom, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateTo, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&customer_no=${this.customer_no}`)
                    if (response.data == null || !response.data) {
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
                    console.log('where? ', this.where)
                    await this.$apollo.queries.customers.refetch()
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async searchRangeGlobal() {
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    if (response.data == null || !response.data) {
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
                    console.log('where? ', this.where)
                    await this.$apollo.queries.customers.refetch()
                } catch (e) {
                    console.log(e)
                    this.loading = false
                }
            },
            async removeRangeGlobal() {
                try {
                    this.loading = true
                    const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                    const response = await axios.get(apiUrl + `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                    if (response.data == null || !response.data) {
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
                    console.log('where? ', this.where)
                    var targets = []
                    console.log("Total Pages: ", this.totalPages)
                    for (var i = 1; i <= this.totalPages; i++) {
                        try {
                            const resp = await axios.get(apiUrl + `/customers?_start=${this.start}&date_gte=${this.where['date_gte']}&date_lt=${this.where['date_lt']}`)
                            if (resp.data) {
                                resp.data.forEach(c => targets.push(c.id))
                                // targets = resp.data
                            } else {
                                targets = []
                                continue
                            }
                            // await strapi.deleteEntry('customers', targets)
                            // console.log("Targets: ",targets)
                        } catch (e) {
                            console.log("DELETE! ", e.message)
                            continue
                        }
                        try {
                            if (targets) {
                                const re = await axios({
                                    url: apiUrl + '/customers/destroy',
                                    method: 'post',
                                    data: {
                                        id: targets
                                    },
                                    // config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
                                })
                                console.log(re)
                                // const re = await strapi.deleteEntry(
                                // const re = await strapi.deleteEntry(
                                //     'sellers',targets)
                            }
                        } catch (err) {
                            console.log("DELETE! ", err)
                            continue
                        }
                        targets = []
                        // for(var id of targets){
                        //   // console.log("ID ?", id.id)
                        //     try{
                        //         if(id){
                        //           // const re = await strapi.deleteEntry('customers', id.id)
                        //           await strapi.deleteEntry('customers', id.id)
                        //           // console.log(re)
                        //         }
                        //     }
                        //     catch(err){
                        //         console.log("DELETE! ",err)
                        //     }
                        // }
                    }
                    alert("حذف با موفقیت انجام شد.")
                    this.reload()
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
                    const response = await axios.get(apiUrl +
                        `/customers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&customer_no=${this.customer_no}`)
                    if (response.data == null || !response.data) {
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
                    console.log('where? ', this.where)
                    var targets = []
                    console.log("Total Pages: ", this.totalPages)
                    for (var i = 0; i < this.totalPages; i++) {
                        try {
                            const resp = await axios.get(apiUrl + `/customers?_start=${this.start}&date_gte=${this.where['date_gte']}&date_lt=${this.where['date_lt']}&customer_no=${this.where['customer_no']}`)
                            if (resp.data) {
                                resp.data.forEach(c => targets.push(c.id))
                            } else {
                                targets = []
                                continue
                            }
                            // console.log("Targets: ",targets)
                        } catch (e) {
                            console.log("TARGETS! ", e.message)
                            continue
                        }
                        try {
                            if (targets) {
                                const res = await axios({
                                    url: apiUrl + '/customers/destroy',
                                    method: 'post',
                                    data: {
                                        id: targets
                                    },
                                    // config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
                                })
                                console.log(res)
                                // const re = await strapi.deleteEntry(
                                // await strapi.deleteEntry(
                                //     'customers', targets)
                                // console.log(re)
                            }
                        } catch (e) {
                            console.log("DELETE! ", e)
                            continue
                        }
                        targets = []
                    }
                    alert("حذف با موفقیت انجام شد.")
                    this.reload()
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
                if (!this.is_android) {
                    this.where = {}
                } else {
                    this.where = {'customer_no': this.customer_no}
                }
                this.start = 0
                this.currentPage = 1
            }
        },
        computed: {
            startPage() {
                console.log('currentPage: ', this.currentPage)
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
                     i <= this.endPage; i += 1) {
                    if (i <= 0) {
                        continue
                    }
                    range.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    });
                }

                return range;
            },
            isLoggedIn() {
                return this.$store.getters['auth/username']
            },
            // loading(){
            //   return this.$store.getters['customers/loading']
            // },
            filteredList() {
                if (this.query === "") {
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
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  .card:hover {
    box-shadow: 20px 20px 40px 0 rgba(0, 0, 0, 0.5);
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

