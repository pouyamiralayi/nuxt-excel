export const state = () => ({
  list: [],
  selected: {},
  loading:true,

})

export const mutations = {
  add(state, customer) {
    if (!state.list.find(item => item.id === customer.id)) {
      state.list.push(customer)
    }
  },
  update(state, customer) {
    const idx = state.list.findIndex(item => item.id === customer.id)
    if (idx) state.list.splice(idx, 1, customer)
    if (state.selected.id === customer.id) state.selected = customer
  },
  remove(state, customer) {
    const idx = state.list.findIndex(item => item.id === customer.id)
    const prev = state.list[idx]
    if (prev && prev === state.selected) {
      state.selected = null
    }
    state.list.splice(idx, 1)
  },
  setSelected(state, customer) {
    state.selected = customer
  },
  emptyList(state) {
    state.list = []
  },
  loading(state, loading){
    state.loading = loading
  }
}

export const getters = {
  list: state => state.list,
  byId: state => id => {
    return state.list.find(item => item.id === id)
  },
  selected: state => state.selected,
  loading: state => state.loading

}
