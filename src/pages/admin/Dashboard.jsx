import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_products: 0,
    total_users: 0,
    total_low_products_in_stock: 0,
    latest_products: [],
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("v1/admin/dashboard");
        setStatistics({
          total_products: data.data.total_products || 0,
          total_users: data.data.total_users || 0,
          total_low_products_in_stock:
            data.data.total_low_products_in_stock || 0,
          latest_products: data.data.latest_products || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MAD",
    }).format(amount);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  // Create chart data directly from latest products
  const chartData = statistics.latest_products.map((product) => ({
    name:
      product.name.length > 10
        ? product.name.substring(0, 10) + "..."
        : product.name,
    price: product.price,
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.user?.user?.name || "Admin"}! Here's what's
            happening with your store.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {statistics.total_products}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {statistics.total_users}
                </h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Low Stock Items
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {statistics.total_low_products_in_stock}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Latest Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - Only if there are latest products */}
          {statistics.latest_products.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Latest Products Price Comparison
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#4b5563" />
                    <YAxis stroke="#4b5563" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Latest Products */}
          <div
            className={`${
              statistics.latest_products.length > 0
                ? "lg:col-span-1"
                : "lg:col-span-3"
            } bg-white rounded-xl shadow-sm p-6 border border-gray-100`}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Latest Products
            </h2>
            <div className="space-y-4">
              {statistics.latest_products.length > 0 ? (
                statistics.latest_products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-blue-600 font-medium">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        ID: {product.id || index + 1}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No products to display
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Store Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">
                Products / User Ratio
              </span>
              <span className="text-xl font-bold mt-1">
                {statistics.total_users
                  ? (
                      statistics.total_products / statistics.total_users
                    ).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">
                Low Stock Percentage
              </span>
              <span className="text-xl font-bold mt-1">
                {statistics.total_products
                  ? (
                      (statistics.total_low_products_in_stock /
                        statistics.total_products) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Average Price</span>
              <span className="text-xl font-bold mt-1">
                {statistics.latest_products.length
                  ? formatCurrency(
                      statistics.latest_products.reduce(
                        (sum, product) => sum + product.price,
                        0
                      ) / statistics.latest_products.length
                    )
                  : formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition rounded-lg p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Add Product
              </span>
            </button>
            <button className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 transition rounded-lg p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                View Orders
              </span>
            </button>
            <button className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition rounded-lg p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Manage Users
              </span>
            </button>
            <button className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition rounded-lg p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Low Stock
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
