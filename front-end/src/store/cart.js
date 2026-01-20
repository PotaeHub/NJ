import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cart')) || []
    }),

    actions: {
        addToCart(game) {
            const exist = this.items.find(i => i.id === game.id)
            if (!exist) {
                this.items.push(game)
                this.save()
            }
        },

        remove(id) {
            this.items = this.items.filter(i => i.id !== id)
            this.save()
        },

        clear() {
            this.items = []
            this.save()
        },

        save() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        }
    },

    getters: {
        totalPrice: (state) =>
            state.items.reduce((sum, i) => sum + i.price, 0)
    }
})
