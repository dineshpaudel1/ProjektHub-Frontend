/* ─────────────────────────  src/pages/MyOrder.jsx  ────────────────────────── */
"use client"

import { useEffect, useState, memo } from "react"
import { useNavigate } from "react-router-dom"
import { protectedApi } from "../../services/axiosInstance"

/** My-Orders page — production-ready, theme-aware (light / dark)  */
const MyOrder = () => {
  /* ─── state ────────────────────────────────────────────── */
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  /* ─── data-fetch ────────────────────────────────────────── */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await protectedApi.get("/user/order")
        setOrders(Array.isArray(data?.data) ? data.data : [])
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  /* ─── helpers ───────────────────────────────────────────── */
  /** Returns Tailwind classes that work in both light + dark */
  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-800/20 dark:text-amber-300 dark:border-amber-600/40"
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-800/20 dark:text-emerald-300 dark:border-emerald-600/40"
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200   dark:bg-blue-800/20    dark:text-blue-300   dark:border-blue-600/40"
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200       dark:bg-red-800/20     dark:text-red-300    dark:border-red-600/40"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200    dark:bg-slate-700/30   dark:text-gray-300   dark:border-gray-600/40"
    }
  }

  /* ─── skeleton / empty-state (memoised) ─────────────────── */
  const LoadingSkeleton = memo(() => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-[var(--menu-bg)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-200 rounded w-32 dark:bg-gray-700/40" />
            <div className="h-6 bg-gray-200 rounded-full w-20 dark:bg-gray-700/40" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-48 dark:bg-gray-700/40" />
            <div className="h-4 bg-gray-200 rounded w-36 dark:bg-gray-700/40" />
            <div className="h-4 bg-gray-200 rounded w-40 dark:bg-gray-700/40" />
          </div>
        </div>
      ))}
    </div>
  ))

  const EmptyState = memo(() => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700/40 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>No orders yet</h3>
      <p className="max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
        When you place your first order, it will appear here. Start shopping to see your order history.
      </p>
    </div>
  ))

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <header className="border-b" style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>My Orders</h1>
              <p className="mt-2" style={{ color: "var(--text-secondary)" }}>Track and manage your order history</p>
            </div>
            {!loading && orders.length > 0 && (
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {orders.length} {orders.length === 1 ? "order" : "orders"} found
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const shortId = String(order.orderId || "").slice(-8)   // ← safe slice
              return (
                <article
                  key={order.orderId}
                  onClick={() => navigate(`/my-order/${order.orderId}`)}
                  className="bg-white dark:bg-[var(--menu-bg)] rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg group"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="p-6">
                    {/* ─ order header ─ */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                          Order #{shortId || "N/A"}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ color: "var(--text-secondary)" }}>
                        <span className="text-sm mr-2 group-hover:text-[var(--text-color)] transition-colors">View Details</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* ─ details grid ─ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* date */}
                      <div>
                        <span className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)" }}>
                          Order Date
                        </span>
                        <span className="block text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* items */}
                      <div>
                        <span className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)" }}>
                          Items
                        </span>
                        <span className="text-sm font-medium">
                          {order.numberOfItems} {order.numberOfItems === 1 ? "item" : "items"}
                        </span>
                      </div>

                      {/* type */}
                      <div>
                        <span className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)" }}>
                          Order Type
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {order.orderType?.toLowerCase() || "standard"}
                        </span>
                      </div>

                      {/* total */}
                      <div>
                        <span className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)" }}>
                          Total Amount
                        </span>
                        {order.totalPrice > 0 ? (
                          <span className="text-lg font-bold">Rs.&nbsp;{order.totalPrice.toLocaleString()}</span>
                        ) : (
                          <span className="text-sm font-medium text-amber-600">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* ─ footer / progress ─ */}
                    <footer className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span>Click to view order details</span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                          Order {order.status?.toLowerCase()}
                        </span>
                      </div>
                    </footer>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyOrder
