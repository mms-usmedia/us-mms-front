"use client";

import React, { useState, useEffect, useRef } from "react";
import { ExchangeRate } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { mockExchangeRates } from "./mockData";
import { PlusIcon, Edit, X, Search, Check } from "lucide-react";

interface ExchangeRatesManagerProps {
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

// Lista de monedas disponibles
const availableCurrencies = [
  { code: "MXN", name: "Mexican Peso" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "COP", name: "Colombian Peso" },
  { code: "EUR", name: "Euro" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
];

export default function ExchangeRatesManager({
  showForm: externalShowForm,
  setShowForm: setExternalShowForm,
}: ExchangeRatesManagerProps) {
  const [exchangeRates, setExchangeRates] =
    useState<ExchangeRate[]>(mockExchangeRates);
  const [internalShowForm, setInternalShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);

  // Use either external or internal state for showing the form
  const showForm =
    externalShowForm !== undefined ? externalShowForm : internalShowForm;
  const setShowForm = setExternalShowForm || setInternalShowForm;

  const handleAddRate = () => {
    setEditingRate(null);
    setShowForm(true);
  };

  const handleEditRate = (rate: ExchangeRate) => {
    setEditingRate(rate);
    setShowForm(true);
  };

  const handleSaveRate = (rate: Partial<ExchangeRate>) => {
    if (editingRate) {
      // Update existing rate
      setExchangeRates(
        exchangeRates.map((r) =>
          r.id === editingRate.id
            ? { ...r, ...rate, date: new Date().toISOString().split("T")[0] }
            : r
        )
      );
    } else {
      // Create new rate
      const newRate: ExchangeRate = {
        id: `e${exchangeRates.length + 1}`,
        fromCurrency: rate.fromCurrency || "USD",
        toCurrency: rate.toCurrency || "",
        rate: rate.rate || 0,
        date: new Date().toISOString().split("T")[0],
        updatedBy: "current_user", // In a real implementation, this would come from the auth context
      };
      setExchangeRates([...exchangeRates, newRate]);
    }
    setShowForm(false);
    setEditingRate(null);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Base currency: USD</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    From
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    To
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Rate
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Last Update
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Updated by
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRates.map((rate) => (
                  <TableRow
                    key={rate.id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <TableCell>{rate.fromCurrency}</TableCell>
                    <TableCell>{rate.toCurrency}</TableCell>
                    <TableCell>${rate.rate.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(rate.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{rate.updatedBy}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRate(rate)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <ExchangeRateForm
          rate={editingRate}
          onSave={handleSaveRate}
          onCancel={() => {
            setShowForm(false);
            setEditingRate(null);
          }}
        />
      )}
    </div>
  );
}

interface ExchangeRateFormProps {
  rate?: ExchangeRate | null;
  onSave: (rate: Partial<ExchangeRate>) => void;
  onCancel: () => void;
}

function ExchangeRateForm({ rate, onSave, onCancel }: ExchangeRateFormProps) {
  const [formData, setFormData] = useState<Partial<ExchangeRate>>({
    fromCurrency: rate?.fromCurrency || "USD", // Default base currency
    toCurrency: rate?.toCurrency || "",
    rate: rate?.rate || 0,
  });
  const [rateInput, setRateInput] = useState(
    rate ? rate.rate.toString().replace(".", ",") : "0"
  );
  const [showNewCurrencyForm, setShowNewCurrencyForm] = useState(false);
  const [newCurrency, setNewCurrency] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRateFocused, setIsRateFocused] = useState(false);

  // Refs para detectar clics fuera del dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    // Añadir event listener cuando el dropdown está abierto
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Filtered currencies based on search term
  const filteredCurrencies = availableCurrencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rate" ? parseFloat(value) : value,
    });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir solo dígitos, coma y punto
    if (!/^[0-9,.]*$/.test(value)) {
      return;
    }

    // Eliminar los puntos (separadores de miles) para procesar el valor
    let processedValue = value.replace(/\./g, "");

    // Si hay más de una coma, usar solo la primera
    const commaCount = (processedValue.match(/,/g) || []).length;
    if (commaCount > 1) {
      const parts = processedValue.split(",");
      processedValue = parts[0] + "," + parts.slice(1).join("");
    }

    // Actualizar el valor mostrado
    setRateInput(processedValue);

    // Actualizar el valor numérico para el formulario
    // Reemplazar coma por punto para el parsing de JavaScript
    const numericValue = parseFloat(processedValue.replace(",", ".")) || 0;
    setFormData({
      ...formData,
      rate: numericValue,
    });
  };

  const handleNewCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limitar a 3 caracteres y convertir a mayúsculas
    const value = e.target.value.slice(0, 3).toUpperCase();
    setNewCurrency(value);
  };

  const handleSaveNewCurrency = () => {
    if (newCurrency.length === 3) {
      setFormData({
        ...formData,
        toCurrency: newCurrency,
      });
      setShowNewCurrencyForm(false);
      setNewCurrency("");
    }
  };

  const handleCancelNewCurrency = () => {
    setShowNewCurrencyForm(false);
    setNewCurrency("");
  };

  // Formatear el valor para mostrar con separadores de miles
  const formatDisplayValue = (value: string): string => {
    if (!value || value === "0") return value;

    // Separar en parte entera y decimal
    const parts = value.split(",");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : "";

    // Formatear la parte entera con separadores de miles
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Combinar con la parte decimal si existe
    return decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSelectCurrency = (currencyCode: string) => {
    setFormData({
      ...formData,
      toCurrency: currencyCode,
    });
    setDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <Card className="border shadow-sm rounded-xl overflow-hidden">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="fromCurrency"
                className="block text-sm font-medium text-gray-700"
              >
                Source Currency
              </label>
              <select
                id="fromCurrency"
                name="fromCurrency"
                value={formData.fromCurrency}
                onChange={handleChange}
                disabled={true} // Fixed base currency as USD
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
              >
                <option value="USD">USD - US Dollar</option>
              </select>
              <p className="text-xs text-gray-500">
                The system base currency is USD
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toCurrency"
                className="block text-sm font-medium text-gray-700"
              >
                Target Currency
              </label>

              {showNewCurrencyForm ? (
                <div className="mt-1">
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex-1">
                      <Input
                        id="newCurrency"
                        name="newCurrency"
                        placeholder="e.g. CAD"
                        value={newCurrency}
                        onChange={handleNewCurrencyChange}
                        className="uppercase w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                        maxLength={3}
                        autoFocus
                        style={{ borderColor: "#f97316" }}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelNewCurrency}
                      className="h-10 px-4 border-gray-300 flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="h-10 px-4 bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center"
                      onClick={handleSaveNewCurrency}
                      disabled={newCurrency.length !== 3}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Enter a 3-letter currency code
                  </p>
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <div className="relative flex-1" ref={dropdownRef}>
                    <div
                      className={`relative w-full border border-gray-300 rounded-md ${
                        dropdownOpen ? "rounded-b-none" : ""
                      }`}
                    >
                      <div
                        className="flex items-center px-3 py-2 cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        {formData.toCurrency ? (
                          <span>
                            {formData.toCurrency} -{" "}
                            {availableCurrencies.find(
                              (c) => c.code === formData.toCurrency
                            )?.name || "Custom Currency"}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Select a currency
                          </span>
                        )}
                      </div>

                      {dropdownOpen && (
                        <div
                          className="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                          style={{
                            width: dropdownRef.current?.offsetWidth + "px",
                            top: `${
                              (dropdownRef.current?.getBoundingClientRect()
                                .bottom || 0) + window.scrollY
                            }px`,
                            left: `${
                              (dropdownRef.current?.getBoundingClientRect()
                                .left || 0) + window.scrollX
                            }px`,
                          }}
                        >
                          <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search currencies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                                autoFocus
                              />
                            </div>
                          </div>

                          <div className="py-1">
                            {filteredCurrencies.length > 0 ? (
                              filteredCurrencies.map((currency) => (
                                <div
                                  key={currency.code}
                                  className={`px-3 py-2 hover:bg-orange-50 cursor-pointer ${
                                    formData.toCurrency === currency.code
                                      ? "bg-orange-50"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSelectCurrency(currency.code)
                                  }
                                >
                                  {currency.code} - {currency.name}
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500">
                                No currencies found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="ml-2"
                    onClick={() => setShowNewCurrencyForm(true)}
                    title="Add new currency"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rate"
                className="block text-sm font-medium text-gray-700"
              >
                Exchange Rate
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <Input
                  id="rate"
                  name="rate"
                  type="text"
                  value={isRateFocused && rateInput === "0" ? "" : rateInput}
                  onChange={handleRateChange}
                  onFocus={(e) => {
                    setIsRateFocused(true);
                    if (rateInput === "0") {
                      setRateInput("");
                    } else {
                      // Seleccionar todo el texto cuando se hace foco en el campo
                      e.target.select();
                    }
                  }}
                  onBlur={(e) => {
                    setIsRateFocused(false);
                    if (e.target.value === "") {
                      setRateInput("0");
                    } else {
                      // Solo formatear al perder el foco
                      setRateInput(formatDisplayValue(rateInput));
                    }
                  }}
                  required
                  className="pl-7"
                  placeholder="0,00"
                />
              </div>
              <p className="text-xs text-gray-500">
                How many units of the target currency equal 1 USD
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.toCurrency || formData.rate === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {rate ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
