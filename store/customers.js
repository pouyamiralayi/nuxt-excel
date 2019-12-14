export const state = () => ({
  list: [],
  selected: {},
  loading:true,
  owed:null,
  owned:null,
  rem:null,
  plus:null,
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
  },
  setOwed(state, payload){
    state.owed = payload.owed
    state.owned = payload.owned
    state.rem = payload.rem
    state.plus = payload.plus
  }
}

export const getters = {
  list: state => state.list,
  byId: state => id => {
    return state.list.find(item => item.id === id)
  },
  selected: state => state.selected,
  loading: state => state.loading,
  owed: state => state.owed,
  owned: state => state.owned,
  rem: state => state.rem,
  plus: state => state.plus

}
