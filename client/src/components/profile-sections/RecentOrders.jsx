import { FiClock, FiFileText, FiPackage, FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RecentOrders = ({ recentSuccessfulPayments }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (order) => {
    if (order.is_delivered) {
      return { text: "Delivered", color: "green", icon: FiPackage };
    } else if (order.storekeeper_delivery) {
      return { text: "Shipped", color: "blue", icon: FiTruck };
    } else {
      return { text: "Processing", color: "amber", icon: FiClock };
    }
  };
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-5 lg:p-6 2xl:p-8 border border-blue-400 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 flex items-center">
          <FiFileText
            className="mr-2 sm:mr-3 text-green-600 mb-0.5"
            size={22}
          />
          Recent Orders
        </h2>
      </div>

      <div className="lg:hidden space-y-3">
        {recentSuccessfulPayments.slice(0, 4).map((order) => {
          const statusInfo = getStatusInfo(order);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={order.id}
              className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 group group"
              onClick={() => navigate("/account/orders")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-200">
                    <FiPackage size={14} className="text-blue-600 " />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-blue-800 text-sm block truncate">
                      {order.product_name}
                    </span>
                    <span className="text-xs text-blue-600">
                      Qty: {order.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-blue-900 text-base flex-shrink-0 ml-2">
                  ${order.total_price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      statusInfo.color === "green"
                        ? "bg-green-100 text-green-900 border border-green-200"
                        : statusInfo.color === "blue"
                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                        : "bg-amber-100 text-amber-900 border border-amber-200"
                    }`}
                  >
                    <StatusIcon size={10} />
                    <span>{statusInfo.text}</span>
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-blue-700 text-xs font-medium">
                    {formatDate(order.paid_at)}
                  </p>
                  <p className="text-blue-500 text-xs">
                    {formatTime(order.paid_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {recentSuccessfulPayments.length === 0 && (
          <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
            <FiFileText className="text-blue-400 mx-auto mb-4 " size={30} />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              No orders yet
            </h3>
            <p className="text-blue-600">
              Your orders will appear here once you make a purchase.
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {recentSuccessfulPayments.length > 0 && (
              <tr className="text-left border-b border-blue-300 bg-gradient-to-t from-blue-50 to-blue-50/10">
                {["Product", "Date & Time", "Amount", "Status"].map(
                  (head, i) => (
                    <th
                      key={i}
                      className="pb-3 px-4 lg:px-6 text-blue-900 font-semibold text-sm whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {recentSuccessfulPayments.slice(0, 4).map((order) => {
              const statusInfo = getStatusInfo(order);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={order.id}
                  onClick={() => navigate("/account/orders")}
                  className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors duration-200 group"
                >
                  <td className="py-4 px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-200">
                        <FiPackage size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-blue-800 block truncate max-w-[180px] 2xl:max-w-[220px]">
                          {order.product_name}
                        </span>
                        <span className="text-xs text-blue-600 mt-0.5">
                          Quantity: {order.quantity}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 lg:px-6">
                    <div className="flex flex-col">
                      <span className="text-blue-700 font-medium text-sm whitespace-nowrap">
                        {formatDate(order.paid_at)}
                      </span>
                      <span className="text-blue-500 text-xs">
                        {formatTime(order.paid_at)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 lg:px-6">
                    <span className="font-bold text-blue-900 text-base whitespace-nowrap">
                      ${order.total_price.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-4 px-4 lg:px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit whitespace-nowrap border ${
                        statusInfo.color === "green"
                          ? "bg-green-100 text-green-900 border-green-200"
                          : statusInfo.color === "blue"
                          ? "bg-blue-100 text-blue-900 border-blue-200"
                          : "bg-amber-100 text-amber-900 border-amber-200"
                      }`}
                    >
                      <StatusIcon size={12} />
                      <span>{statusInfo.text}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {recentSuccessfulPayments.length === 0 && (
          <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-200">
            <FiFileText className="text-blue-400 mx-auto mb-4" size={30} />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              No orders yet
            </h3>
            <p className="text-blue-600">
              Your orders will appear here once you make a purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
