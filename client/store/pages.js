import axios from 'axios'

/**
 * ACTION TYPES
 */
const SET_PAGE = 'SET_PAGE'
const REMOVE_PAGE = 'REMOVE_PAGE'

/**
 * ACTION CREATORS
 */
const setPage = page => ({type: SET_PAGE, page})
const removePage = page => ({type: REMOVE_PAGE, page})

/**
 * THUNK CREATORS
 */
export const fetchPage = (id, history) => async dispatch => {
  return axios.get(`/api/pages/${id || ''}`)
    .then( response => {
      if(response.data){
        dispatch(setPage(response.data))
      }
      else {
        history.push('/');
      }
    })
}

export const createPage = ({ page, history }) => dispatch => {
  return axios.post('/api/pages', page)
    .then( async(response) => {
      await dispatch(setPage(response.data))
      history.push(`${response.data.id}`);
    })
}

export const destroyPage = ({ page, history }) => dispatch => {
  return axios.delete(`/api/pages/${page.id}`)
    .then( async(response) => {
      await dispatch(removePage(page))
      history.push(`/${page.parent.isHomePage ? '' : page.parentId}`);
    })
}


/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_PAGE:
      return {...state, [action.page.id]: action.page } 
    case REMOVE_PAGE:
      const copy = {...state };
      //get rid of the page if it can be found as a child of any pages
      delete copy[action.page.id];
      return copy;
    default:
      return state
  }
}
