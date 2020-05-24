import axios from 'axios'

/**
 * ACTION TYPES
 */
const SET_PAGE = 'SET_PAGE'

/**
 * ACTION CREATORS
 */
const setPage = page => ({type: SET_PAGE, page})

/**
 * THUNK CREATORS
 */
export const fetchPage = (id) => async dispatch => {
  return axios.get(`/api/pages/${id || ''}`)
    .then( response => dispatch(setPage(response.data)))
}


/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_PAGE:
      return {...state, [action.page.id]: action.page } 
    default:
      return state
  }
}
