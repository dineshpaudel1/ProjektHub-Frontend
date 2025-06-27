// src/pages/order/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { protectedApi } from "../../services/axiosInstance";

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* -------------------------------------------------- */
    /* Helpers                                            */
    /* -------------------------------------------------- */
    const fetchOrder = async () => {
        try {
            setError(null);
            const res = await protectedApi.get(`/user/order/${id}`);
            setOrder(res.data.data);
        } catch (err) {
            console.error("Failed to fetch order details", err);
            setError("Unable to load order details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const Badge = ({ status }) => {
        const base =
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border";
        if (status === "PLACED") {
            return (
                <span
                    className={`${base} bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-200/20 dark:text-amber-300 dark:border-amber-300/30`}
                >
                    ⏳ {status}
                </span>
            );
        }
        return (
            <span
                className={`${base} bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-200/20 dark:text-emerald-300 dark:border-emerald-300/30`}
            >
                ✓ {status}
            </span>
        );
    };

    /* -------------------------------------------------- */
    /* Effects                                            */
    /* -------------------------------------------------- */
    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    /* -------------------------------------------------- */
    /* Skeleton / Error                                   */
    /* -------------------------------------------------- */
    if (loading) {
        return (
            <div className="p-8 space-y-4">
                <div className="h-8 w-32 rounded animate-pulse bg-[var(--hover-bg)]" />
                <div className="h-96 rounded-lg animate-pulse bg-[var(--hover-bg)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]">
                {error}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-[var(--button-primary)] hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]">
                Order not found
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-[var(--button-primary)] hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    /* -------------------------------------------------- */
    /* Render                                             */
    /* -------------------------------------------------- */
    const { orderType, data } = order;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center mb-6 text-[var(--text-secondary)] hover:text-[var(--text-color)]"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back
                </button>

                {/* Card */}
                <div className="bg-[var(--menu-bg)] border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-[var(--border-color)]">
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold">Order Details</h1>
                            <Badge status={data.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <Detail label="Order ID" value={id} />
                            <Detail
                                label="Date"
                                value={new Date(data.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            />
                            <Detail
                                label="Order Type"
                                value={
                                    orderType === "PREMADE" ? (
                                        <Tag colour="blue">Premade Project</Tag>
                                    ) : (
                                        <Tag colour="purple">Custom&nbsp;Order</Tag>
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <Section title="Order Summary">
                        <div className="flex justify-between items-center">
                            <p className="text-[var(--text-secondary)]">Total Amount</p>
                            <p className="text-xl font-bold text-[var(--button-primary)]">
                                Rs. {data.totalPrice}
                            </p>
                        </div>
                    </Section>

                    {/* Items */}
                    <Section title="Order Items">
                        {orderType === "PREMADE" && (
                            <div className="space-y-4">
                                {data.items.map((item, i) => (
                                    <PremadeItem key={i} {...item} />
                                ))}
                            </div>
                        )}

                        {orderType === "CUSTOM" && (
                            <div className="space-y-6">
                                {data.items.map((item, i) => (
                                    <CustomItem key={i} {...item} />
                                ))}
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Reusable sub-components                            */
/* -------------------------------------------------- */

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            {label}
        </p>
        <p className="font-medium">{value}</p>
    </div>
);

const Section = ({ title, children }) => (
    <div className="p-6 border-b last:border-b-0 border-[var(--border-color)]">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
    </div>
);

const Tag = ({ colour = "blue", children }) => (
    <span
        className={`
      px-2 py-1 text-xs rounded
      bg-${colour}-100 text-${colour}-800
      dark:bg-${colour}-200/20 dark:text-${colour}-300
    `}
    >
        {children}
    </span>
);

const PremadeItem = ({
    projectThumbnail,
    projectTitle,
    sellerName,
    price,
}) => (
    <div className="flex flex-col sm:flex-row border border-[var(--border-color)] rounded-lg p-4">
        <img
            src={`http://localhost:8080/api/media/photo?file=${projectThumbnail}`}
            alt={projectTitle}
            className="w-full sm:w-24 h-24 object-cover rounded mb-4 sm:mb-0 sm:mr-4"
        />
        <div className="flex-1">
            <h3 className="font-medium">{projectTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
                Seller: {sellerName}
            </p>
            <p className="text-[var(--button-primary)] font-medium mt-2">
                Rs.&nbsp;{price}
            </p>
        </div>
    </div>
);

const CustomItem = ({
    customTitle,
    customDescription,
    selectedOptions,
    price,
}) => (
    <div className="border border-[var(--border-color)] rounded-lg p-4">
        <h3 className="font-medium">{customTitle}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
            {customDescription}
        </p>

        {/* options */}
        <div className="mt-4 pl-4 border-l-2 border-[var(--border-color)]">
            <ul className="space-y-2">
                {selectedOptions.map((o, i) => (
                    <li key={i} className="text-sm">
                        {o.optionName} –{" "}
                        <span
                            className={`font-medium ${o.status === "COMPLETED"
                                ? "text-green-600"
                                : "text-amber-600"
                                }`}
                        >
                            {o.status}
                        </span>
                        <span className="ml-2 font-bold text-[var(--button-primary)]">
                            Amount: Rs.&nbsp;{o.price}
                        </span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            <p className="font-semibold text-[var(--button-primary)]">
                Total Amount: Rs.&nbsp;{price}
            </p>
        </div>
    </div>
);

export default OrderDetail;
