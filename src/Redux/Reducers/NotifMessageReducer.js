const initialState = {
    notifMessage: {},
  };
  
  function NotifMessageReducer(state = initialState, action) {
    switch (action.type) {
      case "MESSAGE_NON_LU":
        state.notifMessage[action.value.message.from]=action.value.message
        return {
          ...state,
        };
        case "CLEAR_NOTIF":
        delete state.notifMessage[action.value.id]
        return {
          ...state,
        };
      default:
        return state;
    }
  }
  
  export default NotifMessageReducer;
  