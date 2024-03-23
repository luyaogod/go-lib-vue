import axios from 'axios'

const axio = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default axio
