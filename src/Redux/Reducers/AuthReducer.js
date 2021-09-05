const initialState = {
  token: null,
  user: null,
};

function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        token: action.value.token,
        user: action.value.user,
      };
    case "LOGOUT":
      return {
        token: null,
        user: null,
      };
    case "UPDATE_PHOTO":
      state.user.image=action.value.image
      return {
        ...state,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.value.user,
      };
    default:
      return state;
  }
}

export default AuthReducer;
