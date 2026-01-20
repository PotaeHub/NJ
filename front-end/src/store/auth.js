import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
    }),

    actions: {
        setAuth(data) {
            this.user = data.user
            this.token = data.token

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
        },

        logout() {
            this.user = null
            this.token = null

            localStorage.removeItem("token")
            localStorage.removeItem("user")
        }
    }
})
