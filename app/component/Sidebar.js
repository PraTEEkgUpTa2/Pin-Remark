import React from "react";
import { Trash2, Edit2 } from "lucide-react"; // Ensure you have lucide-react installed

export default function Sidebar({ pins, onSelectPin, onDeletePin, onEditPin }) {
  return (
    <div className="w-64 h-full bg-gray-100 p-4 overflow-y-auto shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Saved Pins</h2>
      <ul className="space-y-3">
        {pins.map((pin, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm cursor-pointer text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            <div className="flex-1" onClick={() => onSelectPin(pin)}>
              <div className="font-medium text-gray-800">
                {pin.remark || "No Remark"}
              </div>
              {pin.address && (
                <div className="text-sm text-gray-600">{pin.address}</div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the onClick of the li from firing
                  const newRemark = prompt("Edit remark:", pin.remark);
                  if (newRemark !== null) {
                    onEditPin(index, { ...pin, remark: newRemark }); // Call edit function
                  }
                }}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the onClick of the li from firing
                  onDeletePin(index); // Call delete function
                }}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
