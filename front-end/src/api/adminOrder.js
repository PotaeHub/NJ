// src/api/adminOrder.js
import api from "../services/api"
export const getAdminOrders = () =>
    api.get("/admin/orders")

export const getAdminOrderById = (id) =>
    api.get(`/admin/orders/${id}`)

export const updateOrderStatus = (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status })

export const completeOrder = (id) =>
    api.patch(`/admin/orders/${id}/complete`)

export const cancelOrder = (id) =>
    api.patch(`/admin/orders/${id}/cancel`)
