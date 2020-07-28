import axios from 'axios'
//TODO - when creating make sure parent is aware
//when deleting make sure parents are aware

/**
 * ACTION TYPES
 */
const UPDATE_PAGE = 'UPDATE_PAGE'
const SET_PAGES = 'SET_PAGES'
const DESTROY_PAGE = 'DESTROY_PAGE'
const CREATE_PAGE = 'CREATE_PAGE'

/**
 * ACTION CREATORS
 */
const _createPage = page => ({type: CREATE_PAGE, page})
const _updatePage = page => ({type: UPDATE_PAGE, page})
const _setPages= pages => ({type: SET_PAGES, pages})
const _destroyPage = page => ({type: DESTROY_PAGE, page})


export const fetchPages = () => async dispatch => {
  return axios.get('/api/pages')
    .then( response => {
      dispatch(_setPages(response.data))
    })
}

const headers = ()=> {
  return {
    headers: {
      authorization: localStorage.getItem('token')
    }
  };
};

export const createPage = ({ page, history }) => dispatch => {
  return axios.post('/api/pages', page, headers())
    .then( async(response) => {
      await dispatch(_createPage(response.data))
      history.push(`/${response.data.id}`);
    })
}

export const updatePage = ({ page, history }) => dispatch => {
  return axios.put(`/api/pages/${page.id}`, page, headers())
    .then( async(response) => {
      await dispatch(_updatePage(response.data))
      history.push(`/${response.data.id}`);
    })
}

export const destroyPage = ({ page, history }) => dispatch => {
  return axios.delete(`/api/pages/${page.id}`, headers())
    .then( async(response) => {
      await dispatch(_destroyPage(page))
      history.push(`/${page.parent.isHomePage ? '' : page.parentId}`);
    })
}


/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_PAGES: {
      state = action.pages.reduce((acc, page) => {
        acc[page.id] = page;
        return acc;
      }, {});
      break;
    }
    case UPDATE_PAGE:
      state = {...state };
      state[action.page.id] = action.page;
    case CREATE_PAGE:
      state =  {...state, [action.page.id]: action.page } 
      break;
    case DESTROY_PAGE:
      state = {...state };
      delete state[action.page.id];
      break;
    default:
      return state
  }
  return state;
}
