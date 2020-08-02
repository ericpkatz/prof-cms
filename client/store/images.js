import axios from 'axios'
//TODO - when creating make sure parent is aware
//when deleting make sure parents are aware

/**
 * ACTION TYPES
 */
const UPDATE_IMAGE = 'UPDATE_IMAGE'
const SET_IMAGES = 'SET_IMAGES'
const DESTROY_IMAGE = 'DESTROY_IMAGE'
const CREATE_IMAGE = 'CREATE_IMAGE'

/**
 * ACTION CREATORS
 */
const _createImage = image => ({type: CREATE_IMAGE, image})
const _updateImage = image => ({type: UPDATE_IMAGE, image})
const _setImages= images => ({type: SET_IMAGES, images})
const _destroyImage = image => ({type: DESTROY_IMAGE, image})


export const fetchImages = () => async dispatch => {
  return axios.get('/api/images', headers())
    .then( response => {
      dispatch(_setImages(response.data))
    })
}

const headers = ()=> {
  return {
    headers: {
      authorization: localStorage.getItem('token')
    }
  };
};

export const createImage = ({ image, history }) => dispatch => {
  return axios.post('/api/images', image, headers())
    .then( async(response) => {
      await dispatch(_createImage(response.data))
      history.push(`/${response.data.id}`);
    })
}

export const updateImage = ({ image, history }) => dispatch => {
  return axios.put(`/api/images/${image.id}`, image, headers())
    .then( async(response) => {
      await dispatch(_updateImage(response.data))
      history.push(`/${response.data.id}`);
    })
}

export const destroyImage = ({ image, history }) => dispatch => {
  return axios.delete(`/api/images/${image.id}`, headers())
    .then( async(response) => {
      await dispatch(_destroyImage(image))
      history.push(`/${image.parent.isHomeImage ? '' : image.parentId}`);
    })
}


/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case SET_IMAGES: {
      state = action.images;
      break;
    }
    case UPDATE_IMAGE:
      state = state.map(image => image.id === action.image.id ? action.image : image);
      break;
    case CREATE_IMAGE:
      state = [action.image, ...state] 
      break;
    case DESTROY_IMAGE:
      state = state.filter(image => image.id !== action.image.id);
      break;
    default:
      return state
  }
  return state;
}
