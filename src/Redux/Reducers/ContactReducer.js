const initialState = {
  contact: null,
  discussion: [],
};

function ContactReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CONTACT":
      return {
        ...state,
        contact: action.value.contact,
        discussion: action.value.discussion,
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        discussion: [action.value.message,...state.discussion],
      };
    case "CLOSE":
      return {
        ...state,
        contact: null,
        discussion: [],
      };
    default:
      return state;
  }
}

export default ContactReducer;
