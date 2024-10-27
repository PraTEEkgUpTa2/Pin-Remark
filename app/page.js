"use client";

import { useEffect, useState } from "react";
import Map from "./component/Map";
import Sidebar from "./component/Sidebar";

export default function Home() {
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    const savedPins = JSON.parse(localStorage.getItem("pins")) || [];
    setPins(savedPins);
  }, []);

  useEffect(() => {
    localStorage.setItem("pins", JSON.stringify(pins));
  }, [pins]);

  const handlePinDrop = (pin) => {
    setPins((prevPins) => [...prevPins, pin]);
  };

  const handleSelectPin = (pin) => {
    setSelectedPin(pin);
  };

  const handleDeletePin = (index) => {
    setPins((prevPins) => prevPins.filter((_, i) => i !== index));
  };

  const handleEditPin = (index, updatedPin) => {
    setPins((prevPins) => {
      const updatedPins = [...prevPins];
      updatedPins[index] = updatedPin;
      return updatedPins;
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 h-screen bg-gray-100 overflow-y-auto">
        <Sidebar
          pins={pins}
          onSelectPin={handleSelectPin}
          onDeletePin={handleDeletePin}
          onEditPin={handleEditPin}
        />
      </div>
      <div className="w-3/4 h-screen">
        <Map onPinDrop={handlePinDrop} selectedPin={selectedPin} pins={pins} />
      </div>
    </div>
  );
}
