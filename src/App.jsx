// src/App.jsx
import { useState } from "react";
import AlertModal from "./AlertModal";

function App() {
  const [activeTab, setActiveTab] = useState("company");
  const [dimensions, setDimensions] = useState({
    width: "",
    length: "",
    height: "",
  });
  const [weight, setWeight] = useState("");
  const [customerLevel, setCustomerLevel] = useState("Silver Rabbit");
  const [productType, setProductType] = useState("สินค้าทั่วไป");
  const [shippingMethod, setShippingMethod] = useState("ทางเรือ");
  const [customRates, setCustomRates] = useState({
    perKg: "",
    perCbm: "",
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // สถานะสำหรับ modal
  const [modalMessage, setModalMessage] = useState(""); // ข้อความสำหรับ modal

  // แสดง modal error แทนการใช้ alert
  const showErrorModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };


  const clearForm = () => {
    // Reset all form state
    setDimensions({
      width: "",
      length: "",
      height: "",
    });
    setWeight("");

    // Reset custom rates if in "other" tab
    setCustomRates({
      perKg: "",
      perCbm: "",
    });

    // Reset calculation result
    setCalculationResult(null);
  };

  // Pricing data for different customer levels, product types, and shipping methods
  const pricingRates = {
    "Silver Rabbit": {
      ทางเรือ: {
        สินค้าทั่วไป: { perKg: 45, perCbm: 5400 },
        "สินค้าประเภทที่ 1,2": { perKg: 50, perCbm: 6900 },
        สินค้าพิเศษ: { perKg: 120, perCbm: 12000 },
      },
      ทางรถ: {
        สินค้าทั่วไป: { perKg: 50, perCbm: 7500 },
        "สินค้าประเภทที่ 1,2": { perKg: 60, perCbm: 8500 },
        สินค้าพิเศษ: { perKg: 120, perCbm: 12000 },
      },
    },
    "Diamond Rabbit": {
      ทางเรือ: {
        สินค้าทั่วไป: { perKg: 40, perCbm: 4900 },
        "สินค้าประเภทที่ 1,2": { perKg: 50, perCbm: 6500 },
        สินค้าพิเศษ: { perKg: 110, perCbm: 11000 },
      },
      ทางรถ: {
        สินค้าทั่วไป: { perKg: 45, perCbm: 7300 },
        "สินค้าประเภทที่ 1,2": { perKg: 55, perCbm: 8300 },
        สินค้าพิเศษ: { perKg: 110, perCbm: 11000 },
      },
    },
    "Star Rabbit": {
      ทางเรือ: {
        สินค้าทั่วไป: { perKg: 35, perCbm: 4500 },
        "สินค้าประเภทที่ 1,2": { perKg: 45, perCbm: 6300 },
        สินค้าพิเศษ: { perKg: 100, perCbm: 10000 },
      },
      ทางรถ: {
        สินค้าทั่วไป: { perKg: 40, perCbm: 6800 },
        "สินค้าประเภทที่ 1,2": { perKg: 50, perCbm: 7800 },
        สินค้าพิเศษ: { perKg: 100, perCbm: 10000 },
      },
    },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCalculationResult(null); // Reset calculation result when changing tabs
  };

  const handleDimensionChange = (dimension, value) => {
    setDimensions({ ...dimensions, [dimension]: value });
  };

  const handleCustomRateChange = (type, value) => {
    setCustomRates({ ...customRates, [type]: value });
  };

  const handleCalculate = () => {
    // Convert dimensions to numbers
    const width = parseFloat(dimensions.width);
    const length = parseFloat(dimensions.length);
    const height = parseFloat(dimensions.height);
    const weightValue = parseFloat(weight);

    // Validation - เปลี่ยนจาก alert เป็นใช้ modal
    if (isNaN(width) || isNaN(length) || isNaN(height) || isNaN(weightValue)) {
      showErrorModal("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let rates;

    if (activeTab === "company") {
      // Get rates from company pricing table
      rates = pricingRates[customerLevel][shippingMethod][productType];
    } else {
      // Custom rates from user input
      const perKgRate = parseFloat(customRates.perKg);
      const perCbmRate = parseFloat(customRates.perCbm);

      if (isNaN(perKgRate) || isNaN(perCbmRate)) {
        showErrorModal("กรุณากรอกอัตราค่าขนส่งให้ครบถ้วน");
        return;
      }

      rates = {
        perKg: perKgRate,
        perCbm: perCbmRate,
      };
    }

    // Formula 1: Calculate volume weight
    const volumeWeight = (width * length * height) / 5000;

    let shippingCost = 0;
    let calculationType = "";

    // Determine which calculation to use
    if (volumeWeight < weightValue) {
      // Use actual weight calculation
      shippingCost = weightValue * rates.perKg;
      calculationType = "weight";
    } else {
      // Use volume calculation
      const cubicMeters = (width * length * height) / 1000000;
      shippingCost = cubicMeters * rates.perCbm;
      calculationType = "volume";
    }

    setCalculationResult({
      volumeWeight,
      actualWeight: weightValue,
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      calculationType,
      dimensions: { width, length, height },
      customerLevel: activeTab === "company" ? customerLevel : "N/A",
      productType: activeTab === "company" ? productType : "N/A",
      shippingMethod: activeTab === "company" ? shippingMethod : "N/A",
      rates,
      isCustomRate: activeTab === "other",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-2 sm:p-4 md:p-6 font-sans">

      {/* ต้องใส่ AlertModal component ตรงนี้ */}
      <AlertModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          คำนวณค่าขนส่งจีน-ไทย
        </h1>

        {/* Tabs - improved with better touch targets */}
        <div className="flex mb-6 md:mb-8 border-b overflow-x-auto">
          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer text-base sm:text-lg font-medium transition-colors ${activeTab === "company"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-500"
              }`}
            onClick={() => handleTabChange("company")}
          >
            ค่าขนส่งจีน-ไทยของบริษัท
          </div>
          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer text-base sm:text-lg font-medium transition-colors ${activeTab === "other"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-500"
              }`}
            onClick={() => handleTabChange("other")}
          >
            อื่นๆ
          </div>
        </div>

        {/* Dimension inputs - revised layout for better responsiveness */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            <span className="inline-block mr-2">📦</span>ข้อมูลสินค้า
          </h2>

          <div className="mb-4">
            <label className="text-base sm:text-lg font-medium text-gray-700 block mb-3">
              ขนาด : กว้าง*ยาว*สูง (ซม.)
            </label>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <input
                type="number"
                className="flex-1 min-w-[80px] p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                placeholder="กว้าง"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
              />
              <span className="text-gray-600">*</span>
              <input
                type="number"
                className="flex-1 min-w-[80px] p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                placeholder="ยาว"
                value={dimensions.length}
                onChange={(e) =>
                  handleDimensionChange("length", e.target.value)
                }
              />
              <span className="text-gray-600">*</span>
              <input
                type="number"
                className="flex-1 min-w-[80px] p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                placeholder="สูง"
                value={dimensions.height}
                onChange={(e) =>
                  handleDimensionChange("height", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="text-base sm:text-lg font-medium text-gray-700 block mb-3">
              น้ำหนัก : กก.
            </label>
            <input
              type="number"
              className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
              placeholder="น้ำหนัก"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {/* Different content based on active tab */}
        {activeTab === "company" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Customer level */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                <span className="inline-block mr-2">👤</span>ระดับของลูกค้า
              </h3>
              <select
                className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none bg-white cursor-pointer"
                value={customerLevel}
                onChange={(e) => setCustomerLevel(e.target.value)}
              >
                <option value="Silver Rabbit">Silver Rabbit</option>
                <option value="Diamond Rabbit">Diamond Rabbit</option>
                <option value="Star Rabbit">Star Rabbit</option>
              </select>

              {/* Pricing info */}
              <div className="mt-4 text-sm text-gray-600 bg-white p-2 rounded-md">
                <p className="font-medium">อัตราค่าบริการ:</p>
                {customerLevel === "Silver Rabbit" && (
                  <p className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                    Silver Rabbit (มาตรฐาน)
                  </p>
                )}
                {customerLevel === "Diamond Rabbit" && (
                  <p className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                    Diamond Rabbit (ลูกค้าประจำ)
                  </p>
                )}
                {customerLevel === "Star Rabbit" && (
                  <p className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                    Star Rabbit (ลูกค้า VIP)
                  </p>
                )}
              </div>
            </div>

            {/* Product type */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                <span className="inline-block mr-2">🏷️</span>ประเภทสินค้า
              </h3>
              <select
                className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none bg-white cursor-pointer"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
              >
                <option value="สินค้าทั่วไป">สินค้าทั่วไป</option>
                <option value="สินค้าประเภทที่ 1,2">สินค้าประเภทที่ 1,2</option>
                <option value="สินค้าพิเศษ">สินค้าพิเศษ</option>
              </select>

              {/* Pricing info */}
              <div className="mt-4 text-sm text-gray-600 bg-white p-2 rounded-md">
                <p className="font-medium">
                  อัตราค่าบริการ{" "}
                  {shippingMethod === "ทางเรือ" ? "ทางเรือ" : "ทางรถ"}:
                </p>
                <p>
                  {
                    pricingRates[customerLevel][shippingMethod][productType]
                      .perKg
                  }{" "}
                  บาท/กก.,{" "}
                  {
                    pricingRates[customerLevel][shippingMethod][productType]
                      .perCbm
                  }{" "}
                  บาท/คิว
                </p>
              </div>
            </div>

            {/* Shipping method */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                <span className="inline-block mr-2">🚢</span>การขนส่ง
              </h3>
              <select
                className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none bg-white cursor-pointer"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="ทางเรือ">ทางเรือ</option>
                <option value="ทางรถ">ทางรถ</option>
              </select>
              {/* Shipping info */}
              <div className="mt-4 text-sm text-gray-600 bg-white p-2 rounded-md">
                <p className="font-medium">รายละเอียดการขนส่ง:</p>
                {shippingMethod === "ทางเรือ" && (
                  <p className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                    ทางเรือ (ใช้เวลา 10-15 วัน)
                  </p>
                )}
                {shippingMethod === "ทางรถ" && (
                  <p className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                    ทางรถ (ใช้เวลา 5-7 วัน, ค่าบริการสูงกว่า)
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Custom rates section for "อื่นๆ" tab
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Per kg rate */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                <span className="inline-block mr-2">⚖️</span>เรทค่าขนส่ง : กก.
              </h3>
              <input
                type="number"
                className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                placeholder="บาท/กก."
                value={customRates.perKg}
                onChange={(e) =>
                  handleCustomRateChange("perKg", e.target.value)
                }
              />
            </div>

            {/* Per cubic meter rate */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                <span className="inline-block mr-2">📊</span>เรทค่าขนส่ง : คิว
              </h3>
              <input
                type="number"
                className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
                placeholder="บาท/คิว"
                value={customRates.perCbm}
                onChange={(e) =>
                  handleCustomRateChange("perCbm", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {/* Calculate and Clear buttons */}
        <div className="flex justify-center gap-4 mb-6 sm:mb-8">
          <button
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 sm:py-4 px-8 sm:px-16 rounded-lg text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-purple-300 group"
            onClick={handleCalculate}
          >
            <span className="absolute w-full h-full top-0 left-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="hidden sm:inline">คำนวณค่าขนส่ง</span>
              <span className="sm:hidden flex flex-col items-center text-center">
                <span>คำนวณ</span>
                <span>ค่าขนส่ง</span>
              </span>
            </span>
          </button>

          <button
            className="relative overflow-hidden bg-gray-200 text-gray-700 py-3 sm:py-4 px-8 sm:px-16 rounded-lg text-base sm:text-lg font-medium shadow-lg hover:shadow-xl hover:bg-gray-300 transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 group"
            onClick={clearForm}
          >
            <span className="absolute w-full h-full top-0 left-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              <span>ล้างข้อมูล</span>
            </span>
          </button>
        </div>

        {/* Shipping rates display - improved visuals and mobile responsive */}
        {calculationResult && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg shadow-md border border-purple-100">
            <h3 className="text-xl font-bold mb-4 text-center text-purple-800 flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              ผลการคำนวณค่าขนส่ง
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      ></path>
                    </svg>
                    ขนาด:
                  </span>{" "}
                  <span className="text-gray-800">
                    {calculationResult.dimensions.width} ×{" "}
                    {calculationResult.dimensions.length} ×{" "}
                    {calculationResult.dimensions.height} ซม.
                  </span>
                </div>

                <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      ></path>
                    </svg>
                    น้ำหนัก:
                  </span>{" "}
                  <span className="text-gray-800 font-medium">
                    {calculationResult.actualWeight} กก.
                  </span>
                </div>

                <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      ></path>
                    </svg>
                    น้ำหนักตามปริมาตร:
                  </span>{" "}
                  <span className="text-gray-800">
                    {calculationResult.volumeWeight.toFixed(2)} กก.
                  </span>
                </div>

                <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                    วิธีการคิดราคา:
                  </span>{" "}
                  <span className="text-gray-800">
                    {calculationResult.calculationType === "weight"
                      ? "คำนวณจากน้ำหนัก"
                      : "คำนวณจากปริมาตร"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {!calculationResult.isCustomRate ? (
                  <>
                    <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <span className="font-medium text-gray-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        ระดับลูกค้า:
                      </span>{" "}
                      <span className="text-gray-800">
                        {calculationResult.customerLevel}
                      </span>
                    </div>

                    <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <span className="font-medium text-gray-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          ></path>
                        </svg>
                        ประเภทสินค้า:
                      </span>{" "}
                      <span className="text-gray-800">
                        {calculationResult.productType}
                      </span>
                    </div>

                    <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <span className="font-medium text-gray-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          ></path>
                        </svg>
                        วิธีการขนส่ง:
                      </span>{" "}
                      <span className="text-gray-800">
                        {calculationResult.shippingMethod}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-medium text-gray-700 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      ประเภทการคำนวณ:
                    </span>{" "}
                    <span className="text-gray-800">
                      คำนวณด้วยอัตราที่กำหนดเอง
                    </span>
                  </div>
                )}

                <div className="mb-2 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-medium text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    อัตราค่าขนส่ง:
                  </span>{" "}
                  <span className="text-gray-800">
                    {calculationResult.rates.perKg} บาท/กก. หรือ{" "}
                    {calculationResult.rates.perCbm} บาท/คิว
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg text-center shadow-inner">
              <div className="text-xl sm:text-2xl font-bold text-purple-800">
                ค่าขนส่งทั้งหมด:{" "}
                <span className="text-pink-600 bg-white px-2 py-1 rounded-md inline-block mt-2 sm:mt-0">
                  {calculationResult.shippingCost.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <span className="bg-yellow-50 px-2 py-1 rounded-full inline-block">
                  ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่ม 7%
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center bg-blue-50 p-2 rounded-md">
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                หมายเหตุ: ราคาอาจมีการเปลี่ยนแปลงตามสถานการณ์
                กรุณาติดต่อเจ้าหน้าที่เพื่อยืนยันราคาอีกครั้ง
              </span>
            </div>
          </div>
        )}

        {/* Information/explanation section - improved design and readability */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            ข้อมูลการคำนวณ
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span>น้ำหนักตามปริมาตร คำนวณจาก (กว้าง × ยาว × สูง) ÷ 5000</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span>
                การคิดค่าขนส่งจะใช้ค่าที่มากกว่าระหว่างน้ำหนักจริงและน้ำหนักตามปริมาตร
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span>
                ราคาต่อกิโลกรัมใช้ในกรณีที่น้ำหนักจริงมากกว่าน้ำหนักตามปริมาตร
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span>
                ราคาต่อคิวใช้ในกรณีที่น้ำหนักตามปริมาตรมากกว่าน้ำหนักจริง (1 คิว
                = 1 ลูกบาศก์เมตร)
              </span>
            </li>
          </ul>
        </div>

        {/* Footer - redesigned with contact buttons */}
        <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <a
              href="tel:0800038383"
              className="flex items-center justify-center bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-gray-700"
            >
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span className="font-medium">080-003-8383</span>
            </a>
            <a
              href="https://line.me/ti/p/@ariyayapreorder"
              className="flex items-center justify-center bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-gray-700"
            >
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.365 9.89c.50 0 .866.37.866.87 0 .5-.368.87-.866.87h-2.488v1.618h2.488c.5 0 .866.37.866.87 0 .5-.368.87-.866.87h-3.354a.87.87 0 01-.87-.87V7.89c0-.5.37-.87.87-.87h3.354c.5 0 .866.37.866.87 0 .5-.368.87-.866.87h-2.488v1.13h2.488zm-7.928-2.74v6.48a.87.87 0 01-.87.87h-.12a.87.87 0 01-.705-.366l-3.3-4.47v3.966a.87.87 0 01-.87.87.87.87 0 01-.87-.87V7.89c0-.5.37-.87.87-.87h.12c.29 0 .553.137.704.366l3.3 4.47V7.89c0-.5.37-.87.87-.87.5 0 .87.37.87.87v-.74z"></path>
              </svg>
              <span className="font-medium">Line: @ariyayapreorder</span>
            </a>
            <a
              href="https://www.facebook.com/ariyayapreorder/"
              className="flex items-center justify-center bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-gray-700"
            >
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="font-medium">Facebook</span>
            </a>
          </div>
          <div className="text-center text-gray-500 text-sm mt-2">
            © 2025 AriyayaPreorder | ติดต่อสอบถามเพิ่มเติม
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
