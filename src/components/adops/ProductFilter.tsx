import React from "react";

interface ProductFilterProps {
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
}

const ProductFilter = ({
  selectedProduct,
  setSelectedProduct,
}: ProductFilterProps) => {
  // Product list with color mapping
  const products = [
    { name: "All Products", color: "gray" },
    { name: "PAS", color: "blue" },
    { name: "Fandom", color: "purple" },
    { name: "Sojern", color: "pink" },
    { name: "WeTransfer", color: "amber" },
    { name: "Tinder", color: "red" },
    { name: "Vevo", color: "emerald" },
    { name: "Magnite", color: "indigo" },
    { name: "OneFootball", color: "cyan" },
  ];

  // Get style classes for product badges
  const getProductStyles = (product: string) => {
    switch (product) {
      case "PAS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Fandom":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Sojern":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "WeTransfer":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Tinder":
        return "bg-red-50 text-red-700 border-red-100";
      case "Vevo":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Magnite":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "OneFootball":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.name}
          onClick={() => setSelectedProduct(product.name)}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
            selectedProduct === product.name
              ? getProductStyles(product.name)
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {product.name}
          {selectedProduct === product.name && (
            <span className="ml-1.5 inline-block">✓</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductFilter;
