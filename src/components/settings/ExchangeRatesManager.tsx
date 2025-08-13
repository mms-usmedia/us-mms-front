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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<
    | "fromCurrency"
    | "toCurrency"
    | "rate"
    | "status"
    | "createdAt"
    | "createdBy"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      // Create a new historical entry when updating, mark previous active as inactive if same pair
      const today = new Date().toISOString().split("T")[0];
      const updatedBy = "current_user";
      const from = rate.fromCurrency || editingRate.fromCurrency;
      const to = rate.toCurrency || editingRate.toCurrency;

      // Deactivate previous active for same pair
      const deactivated: ExchangeRate[] = exchangeRates.map(
        (r): ExchangeRate =>
          r.fromCurrency === from &&
          r.toCurrency === to &&
          r.status === "active"
            ? { ...r, status: "inactive" as const }
            : r
      );

      // Push new version as active
      const newVersion: ExchangeRate = {
        id: `e${exchangeRates.length + 1}`,
        fromCurrency: from,
        toCurrency: to,
        rate: rate.rate ?? editingRate.rate,
        date: today,
        updatedBy,
        status: "active",
        createdAt: new Date().toISOString(),
        createdBy: updatedBy,
      };
      setExchangeRates([...deactivated, newVersion]);
    } else {
      // Create new rate
      const newRate: ExchangeRate = {
        id: `e${exchangeRates.length + 1}`,
        fromCurrency: rate.fromCurrency || "USD",
        toCurrency: rate.toCurrency || "",
        rate: rate.rate || 0,
        date: new Date().toISOString().split("T")[0],
        updatedBy: "current_user", // In a real implementation, this would come from the auth context
        status: "active",
        createdAt: new Date().toISOString(),
        createdBy: "current_user",
      };
      // Deactivate previous active for same pair
      const deactivated: ExchangeRate[] = exchangeRates.map(
        (r): ExchangeRate =>
          r.fromCurrency === newRate.fromCurrency &&
          r.toCurrency === newRate.toCurrency &&
          r.status === "active"
            ? { ...r, status: "inactive" as const }
            : r
      );
      setExchangeRates([...deactivated, newRate]);
    }
    setShowForm(false);
    setEditingRate(null);
  };

  // Derived list with filtering and sorting
  const visibleRates = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = exchangeRates.filter((r) => {
      if (!term) return true;
      const createdAt = r.createdAt || r.date;
      return (
        r.fromCurrency.toLowerCase().includes(term) ||
        r.toCurrency.toLowerCase().includes(term) ||
        String(r.rate).toLowerCase().includes(term) ||
        (r.status || "").toLowerCase().includes(term) ||
        (r.createdBy || r.updatedBy || "").toLowerCase().includes(term) ||
        (createdAt || "").toLowerCase().includes(term)
      );
    });

    const compare = (a: ExchangeRate, b: ExchangeRate) => {
      let aVal: string | number | Date;
      let bVal: string | number | Date;
      switch (sortField) {
        case "rate":
          aVal = a.rate;
          bVal = b.rate;
          break;
        case "fromCurrency":
          aVal = a.fromCurrency;
          bVal = b.fromCurrency;
          break;
        case "toCurrency":
          aVal = a.toCurrency;
          bVal = b.toCurrency;
          break;
        case "status":
          aVal = a.status || "inactive";
          bVal = b.status || "inactive";
          break;
        case "createdBy":
          aVal = a.createdBy || a.updatedBy || "";
          bVal = b.createdBy || b.updatedBy || "";
          break;
        case "createdAt":
        default:
          aVal = a.createdAt || a.date;
          bVal = b.createdAt || b.date;
          break;
      }

      if (sortField === "rate") {
        return Number(aVal) - Number(bVal);
      }

      // date comparison
      if (sortField === "createdAt") {
        return new Date(aVal).getTime() - new Date(bVal).getTime();
      }

      // string comparison
      return String(aVal).localeCompare(String(bVal));
    };

    filtered.sort((a, b) => {
      const res = compare(a, b);
      return sortDirection === "asc" ? res : -res;
    });

    return filtered;
  }, [exchangeRates, searchTerm, sortField, sortDirection]);

  const handleSort = (
    field:
      | "fromCurrency"
      | "toCurrency"
      | "rate"
      | "status"
      | "createdAt"
      | "createdBy"
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Base currency: USD</p>
          </div>

          {/* Search bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search exchange rates..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("fromCurrency")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    From{" "}
                    {sortField === "fromCurrency" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("toCurrency")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    To{" "}
                    {sortField === "toCurrency" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("rate")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    Rate{" "}
                    {sortField === "rate" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("status")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    Status{" "}
                    {sortField === "status" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    Created At{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdBy")}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer"
                  >
                    Created by{" "}
                    {sortField === "createdBy" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRates.map((rate) => (
                  <TableRow
                    key={rate.id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <TableCell>{rate.fromCurrency}</TableCell>
                    <TableCell>{rate.toCurrency}</TableCell>
                    <TableCell>${rate.rate.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          rate.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {rate.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {rate.createdAt
                        ? new Date(rate.createdAt).toLocaleString()
                        : new Date(rate.date).toLocaleString()}
                    </TableCell>
                    <TableCell>{rate.createdBy || rate.updatedBy}</TableCell>
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
