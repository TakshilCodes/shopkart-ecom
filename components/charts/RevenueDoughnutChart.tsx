"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type RevenueDoughnutChartProps = {
  paid: number;
  pending: number;
  failed: number;
  cancelled: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueDoughnutChart({
  paid,
  pending,
  failed,
  cancelled,
}: RevenueDoughnutChartProps) {
  const chartData = {
    labels: ["Paid", "Pending", "Failed", "Cancelled"],
    datasets: [
      {
        data: [paid, pending, failed, cancelled],
        backgroundColor: [
          "#10b981", // emerald
          "#f59e0b", // amber
          "#ef4444", // red
          "#71717a", // zinc
        ],
        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const total = paid + pending + failed + cancelled;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = Number(context.raw || 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-64">
        <Doughnut data={chartData} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total
          </span>
          <span className="mt-1 text-2xl font-bold text-zinc-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-700">Paid</p>
          <p className="mt-1 text-sm font-semibold text-emerald-900">
            {formatCurrency(paid)}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-700">Pending</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">
            {formatCurrency(pending)}
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-3">
          <p className="text-xs font-medium text-red-700">Failed</p>
          <p className="mt-1 text-sm font-semibold text-red-900">
            {formatCurrency(failed)}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-100 p-3">
          <p className="text-xs font-medium text-zinc-700">Cancelled</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {formatCurrency(cancelled)}
          </p>
        </div>
      </div>
    </div>
  );
}