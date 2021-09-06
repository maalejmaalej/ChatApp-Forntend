export const apiURL= process.env.NODE_ENV === 'development'
? "http://localhost:8000"
: process.env.REACT_APP_URI_CONVERTER;


