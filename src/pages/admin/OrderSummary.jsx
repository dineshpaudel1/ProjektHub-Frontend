import { useEffect, useState } from "react"
import axios from "axios"
import { ClipboardList, Package, Users, DollarSign, TrendingUp } from "lucide-react"

const OrderSummary = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrderSummary = async () => {
        try {
            const token = localStorage.getItem("token") // or from context
            const response = await axios.get("http://localhost:8080/api/admin/order/summary", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.data.statusCode === 200) {
                setOrders(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching order summary:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderSummary()
    }, [])

    const getStatusColor = (status) => {
        const statusColors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            processing: "bg-blue-100 text-blue-800 border-blue-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        }
        return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
    }

    const calculateStats = () => {
        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        const totalItems = orders.reduce((sum, order) => sum + order.numberOfItems, 0)
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        return { totalOrders, totalRevenue, totalItems, avgOrderValue }
    }

    const stats = calculateStats()
    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
                When customers place orders, they'll appear here for you to manage.
            </p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
                    </div>
                    <p className="text-gray-600">Monitor and manage all your orders in one place</p>
                </div>


                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">NPR {stats.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order, index) => (
                                        <tr
                                            key={order.orderId}
                                            className="hover:bg-gray-50 transition-colors"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                                        {order.userFullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{order.userFullName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.numberOfItems} items</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    NPR {order.totalPrice.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <div
                                    key={order.orderId}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm font-medium text-gray-900">Order #{order.orderId}</div>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                            {order.userFullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">{order.userFullName}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{order.numberOfItems} items</span>
                                        <span className="font-semibold text-gray-900">NPR {order.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>

            </div>
        </div>
    )
}

export default OrderSummary
