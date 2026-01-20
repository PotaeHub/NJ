import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    // console.log(auth.token)
    if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
})

export default api
