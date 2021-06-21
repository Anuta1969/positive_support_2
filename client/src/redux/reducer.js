import { INIT_CIRCLES, SET_USER, UNAUTHORIZED_USER } from './actiontypes';

const initialState = {
  circles: [],
  currentUser: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_CIRCLES:
      // console.log('init', action.payload.data.data);
      return {
        ...state,
        circles: action.payload.data.data,
      };
    case SET_USER:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        currentUser: action.payload.user,
      };
    case UNAUTHORIZED_USER:
      return {
        ...state,
        currentUser: {
          status: "unauthorized",
        }
      }

    default:
      return state;
  }
}

export default reducer;
