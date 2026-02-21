"use client";

import { useState } from "react";

export default function Button({ children, disabled }) {
  const [count, setCount] = useState(0);

  if (count >= 1) {
    return (
      <div className="flex justify-between space-x-5 items-center border py-2 px-3 rounded-2xl cursor-pointer">
        <button className="text-xl font-bold pr-4 border-r border-gray-500 cursor-pointer" onClick={() => setCount(count + 1)}>+</button>
        <p>{count}</p>
        <button className="text-xl font-bold pl-4 border-l border-gray-500 cursor-pointer" onClick={() => setCount(count - 1)}>-</button>
      </div>
    );
  }

  if (count == 0) {
    return (
      <button
        onClick={() => setCount(1)}
        disabled={disabled}
        className={`text-white py-2 px-6 rounded-2xl overflow-hidden ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-black"}`}
      >
        {children}
      </button>
    );
  }
}
