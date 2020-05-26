import axios from 'axios'
//TODO - when creating make sure parent is aware
//when deleting make sure parents are aware

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
      history.push(`/${response.data.id}`);
    })
}

export const updatePage = ({ page, history }) => dispatch => {
  return axios.put(`/api/pages/${page.id}`, page)
    .then( async(response) => {
      await dispatch(setPage(response.data))
      history.push(`/${response.data.id}`);
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
  let parentPage;
  switch (action.type) {
    case SET_PAGE:
      state =  {...state, [action.page.id]: action.page } 
      parentPage = state[action.page.parentId];
      //created
      if(parentPage && !parentPage.children.find(child => child.id === action.page.id)){
        parentPage = {...parentPage, children: [ ...parentPage.children, { id: action.page.id, title: action.page.title }] };
        state = {...state, [parentPage.id]: parentPage };
      }
      //update
      if(parentPage && parentPage.children.find(child => child.id === action.page.id)){
        parentPage = {...parentPage, children: [ ...parentPage.children.filter(child => child.id !== action.page.id), { id: action.page.id, title: action.page.title }] };
        state = {...state, [parentPage.id]: parentPage };
      }
      const childPages = Object.values(state).filter( page => page.parentId === action.page.id)
        .map( child => {
          return {...child, parent : { id: action.page.id, title: action.page.title }};
        });
      childPages.forEach( child => {
        state = {...state, [child.id] : child };
      });
      return state;
    case REMOVE_PAGE:
      let copy = {...state };
      delete copy[action.page.id];
      //remove the child from parent if loaded
      parentPage = copy[action.page.parentId];
      if(parentPage){
        parentPage = { ...parentPage, children: parentPage.children.filter( child => child.id !== action.page.id )};
        copy = {...copy, [parentPage.id]: parentPage };
      }
      return copy;
    default:
      return state
  }
}
