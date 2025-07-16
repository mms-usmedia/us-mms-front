// /src/components/campaigns/AdUnitForm.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AdUnit, samplePublishers, Publisher } from "./types";
import {
  marketOptions,
  channelOptions as defaultChannelOptions,
  formatOptions as defaultFormatOptions,
  sizeOptions as defaultSizeOptions,
  modelOptions as defaultModelOptions,
} from "./types";
import { formatCurrency } from "./utils";
import {
  getChannelOptions,
  getFormatOptions,
  getSizeOptions,
  getCommModelOptions,
  getOpenRate,
} from "./publisherData";

// Función para formatear números con comas para miles y puntos para decimales
const formatNumber = (
  value: number | undefined,
  decimals: number = 2
): string => {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Función para formatear números mientras el usuario escribe
const formatNumberInput = (value: string): string => {
  // Eliminar cualquier carácter que no sea número o punto
  const cleanValue = value.replace(/[^\d.]/g, "");

  // Dividir en parte entera y decimal
  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : "";

  // Formatear parte entera con comas
  let formattedInteger = "";
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedInteger += ",";
    }
    formattedInteger += integerPart[i];
  }

  // Retornar el número formateado
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

interface AdUnitFormProps {
  adUnit?: AdUnit; // Si es null, estamos creando una nueva ad unit
  _campaignId: string; // Cambiado a _campaignId para indicar que no se usa
  existingLines: number; // Número de líneas existentes para asignar automáticamente
  onSave: (adUnit: AdUnit) => void;
  onCancel: () => void;
  campaignType?: "IO-based" | "Programmatic"; // Nuevo prop para identificar el tipo de campaña
}

const AdUnitForm: React.FC<AdUnitFormProps> = ({
  adUnit,
  _campaignId,
  existingLines,
  onSave,
  onCancel,
  campaignType = "IO-based", // Valor por defecto
}) => {
  const isEditing = !!adUnit;
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);

  // Estados para controlar la expansión/contracción de secciones
  const [expandedSections, setExpandedSections] = useState({
    publisherHiddenCosts: false,
    customerHiddenCosts: true, // Expandido por defecto
  });

  // Estados para controlar el desbloqueo secuencial de campos
  const [fieldsEnabled, setFieldsEnabled] = useState({
    market: false,
    channel: false,
    format: false,
    model: false,
    size: false,
  });

  // Estados para opciones dinámicas de dropdowns
  const [dynamicChannelOptions, setDynamicChannelOptions] = useState<string[]>(
    []
  );
  const [dynamicFormatOptions, setDynamicFormatOptions] = useState<string[]>(
    []
  );
  const [dynamicModelOptions, setDynamicModelOptions] = useState<string[]>([]);
  const [dynamicSizeOptions, setDynamicSizeOptions] = useState<string[]>([]);

  // Estado para guardar el precio unitario automático
  const [_autoUnitPrice, setAutoUnitPrice] = useState<number | null>(null);

  // Estado inicial para una nueva AdUnit o los valores existentes
  const [formData, setFormData] = useState<AdUnit>(
    adUnit || {
      id: "",
      line: (existingLines + 1).toString(), // Asignar automáticamente el número de línea
      publisher: "",
      market: "",
      channel: "",
      format: "",
      size: "",
      units: 0,
      model: "CPM",
      margin: "29.6%",
      unitCost: 0,
      customerInvestment: 0,
      customerNetRate: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      status: "Pending",
      agencyCommission: 0,
      localTaxes: 0,
      grossMargin: 0,
      publisherNetCost: 0,
      publisherOpenRate: 0,
      publisherCommission: 0,
    }
  );

  // Estados para los descuentos y costos ocultos
  const [publisherDiscounts, setPublisherDiscounts] = useState<
    Array<{ id: string; name: string; value: number }>
  >([]);
  const [publisherHiddenCosts, setPublisherHiddenCosts] = useState<
    Array<{ id: string; name: string; value: number }>
  >([]);
  const [customerDiscounts, setCustomerDiscounts] = useState<
    Array<{ id: string; name: string; value: number }>
  >([]);
  const [customerHiddenCosts, setCustomerHiddenCosts] = useState<
    Array<{ id: string; name: string; value: number }>
  >([
    { id: "1", name: "AVB (Agency Volume Bonus)", value: 0 },
    { id: "2", name: "Local taxes", value: formData.localTaxes || 0 },
  ]);

  // Función principal para calcular todos los valores financieros
  const calculateFinancials = useCallback(
    (data: AdUnit): AdUnit => {
      const updated = { ...data };

      // Si la campaña es programática, establecer customerNetRate en 0
      if (campaignType === "Programmatic") {
        updated.customerNetRate = 0;
      }

      // Calcular descuentos del Publisher
      let publisherDiscountTotal = 0;
      publisherDiscounts.forEach((discount) => {
        publisherDiscountTotal += discount.value / 100;
      });

      // Calcular costos ocultos del Publisher
      let publisherHiddenCostTotal = 0;
      publisherHiddenCosts.forEach((cost) => {
        publisherHiddenCostTotal += cost.value / 100;
      });

      // Calcular descuentos del Customer
      let customerDiscountTotal = 0;
      customerDiscounts.forEach((discount) => {
        customerDiscountTotal += discount.value / 100;
      });

      // Calcular costos ocultos del Customer
      let customerHiddenCostTotal = 0;
      customerHiddenCosts.forEach((cost) => {
        customerHiddenCostTotal += cost.value / 100;
      });

      // Calcular Publisher Final Rate (Publisher open rate - disccounts y hidden costs)
      if (updated.publisherOpenRate) {
        const discountAmount =
          updated.publisherOpenRate * publisherDiscountTotal;
        const hiddenCostAmount =
          updated.publisherOpenRate * publisherHiddenCostTotal;
        updated.unitCost =
          updated.publisherOpenRate - discountAmount + hiddenCostAmount;
      }

      // Calcular Customer Final Negotiated Rate (Customer net rate - customer discounts)
      // Solo si no es una campaña programática
      let finalNegotiatedRate = 0;
      if (updated.customerNetRate && campaignType !== "Programmatic") {
        const customerDiscountAmount =
          updated.customerNetRate * customerDiscountTotal;
        const customerHiddenCostAmount =
          updated.customerNetRate * customerHiddenCostTotal;
        finalNegotiatedRate =
          updated.customerNetRate -
          customerDiscountAmount +
          customerHiddenCostAmount;
      }

      // Calcular Customer Investment (Units * Customer Final Negotiated Price)
      if (updated.units && finalNegotiatedRate) {
        updated.customerInvestment = parseFloat(
          ((updated.units * finalNegotiatedRate) / 1000).toFixed(2)
        );
      }

      // Si tenemos unidades y una tarifa del publisher, calculamos el costo
      if (updated.units && updated.unitCost) {
        // Calcular el costo neto del publisher (lo que le pagamos al medio)
        updated.publisherNetCost = parseFloat(
          ((updated.unitCost * updated.units) / 1000).toFixed(2)
        );
      }

      // Si tenemos tarifa de publisher pero no tarifa de customer o margen bruto, establecemos valores predeterminados
      if (
        updated.unitCost &&
        !updated.customerNetRate &&
        !updated.grossMargin
      ) {
        // Establecer un margen bruto predeterminado del 30%
        updated.grossMargin = 30;

        // Calcular la tarifa del customer basada en el margen deseado
        const marginPercentage = updated.grossMargin / 100;
        updated.customerNetRate = parseFloat(
          (updated.unitCost / (1 - marginPercentage)).toFixed(2)
        );
      }

      // Si tenemos tarifa del customer y tarifa del publisher, calculamos el margen bruto
      if (updated.customerNetRate && updated.unitCost && !updated.grossMargin) {
        const marginValue = 1 - updated.unitCost / updated.customerNetRate;
        updated.grossMargin = parseFloat((marginValue * 100).toFixed(2));
      }

      // Si tenemos margen bruto y tarifa del publisher, calculamos la tarifa del customer
      if (updated.grossMargin && updated.unitCost && !updated.customerNetRate) {
        const marginPercentage = updated.grossMargin / 100;
        updated.customerNetRate = parseFloat(
          (updated.unitCost / (1 - marginPercentage)).toFixed(2)
        );
      }

      return updated;
    },
    [
      publisherDiscounts,
      publisherHiddenCosts,
      customerDiscounts,
      customerHiddenCosts,
      campaignType, // Añadir campaignType a las dependencias
    ]
  );

  // Buscar el publisher si estamos editando
  useEffect(() => {
    if (isEditing && adUnit && adUnit.publisher) {
      const foundPublisher = samplePublishers.find(
        (pub) => pub.name === adUnit.publisher
      );
      if (foundPublisher) {
        setSelectedPublisher(foundPublisher);
        setFieldsEnabled((prev) => ({ ...prev, market: true }));

        // Cargar opciones dinámicas para publisher
        const channels = getChannelOptions(adUnit.publisher);
        setDynamicChannelOptions(
          channels.length > 0 ? channels : defaultChannelOptions
        );

        if (adUnit.channel) {
          const formats = getFormatOptions(adUnit.publisher, adUnit.channel);
          setDynamicFormatOptions(
            formats.length > 0 ? formats : defaultFormatOptions
          );

          if (adUnit.format) {
            const models = getCommModelOptions(
              adUnit.publisher,
              adUnit.channel,
              adUnit.format
            );
            setDynamicModelOptions(
              models.length > 0 ? models : defaultModelOptions
            );

            if (adUnit.model) {
              const sizes = getSizeOptions(
                adUnit.publisher,
                adUnit.channel,
                adUnit.format,
                adUnit.model
              );
              setDynamicSizeOptions(
                sizes.length > 0 ? sizes : defaultSizeOptions
              );
            }
          }
        }
      }
    }
  }, [adUnit, isEditing]);

  // Efecto para actualizar valores cuando todas las selecciones están completas
  useEffect(() => {
    if (
      formData.publisher &&
      formData.market &&
      formData.channel &&
      formData.format &&
      formData.model &&
      formData.size
    ) {
      // Obtener la tarifa abierta de nuestros datos
      const openRate = getOpenRate(
        formData.publisher,
        formData.channel,
        formData.format,
        formData.size,
        formData.model
      );

      if (openRate !== null) {
        // Actualizamos los valores automáticos
        setAutoUnitPrice(openRate);

        // Actualizamos el formulario con los valores predeterminados
        setFormData((prev) => {
          const updated = {
            ...prev,
            publisherOpenRate: openRate,
            // Establecemos un margen bruto predeterminado del 30%
            grossMargin: 30,
          };

          // Si es una campaña programática, establecer customerNetRate en 0
          if (campaignType === "Programmatic") {
            updated.customerNetRate = 0;
          } else {
            // Calculamos la tarifa del customer basada en el margen
            const marginPercentage = updated.grossMargin / 100;
            updated.customerNetRate = parseFloat(
              (openRate / (1 - marginPercentage)).toFixed(2)
            );
          }

          return calculateFinancials(updated);
        });
      }
    }
  }, [
    formData.publisher,
    formData.market,
    formData.channel,
    formData.format,
    formData.model,
    formData.size,
    calculateFinancials,
    campaignType, // Añadir campaignType a las dependencias
  ]);

  // Efecto para actualizar los impuestos según el mercado seleccionado
  useEffect(() => {
    if (formData.market) {
      let taxRate = 0;

      // Asignar tasa de impuesto según el mercado
      if (formData.market === "Mexico" || formData.market === "México") {
        taxRate = 16;
      } else if (formData.market === "Colombia") {
        taxRate = 19;
      } else if (formData.market === "Argentina") {
        taxRate = 21;
      } else if (formData.market === "Chile") {
        taxRate = 19;
      }

      // Actualizar el estado con la tasa de impuesto correspondiente
      setFormData((prev) => {
        const updated = {
          ...prev,
          localTaxes: taxRate,
        };

        return calculateFinancials(updated);
      });
    }
  }, [formData.market, calculateFinancials]);

  // Filtrar publishers basado en el término de búsqueda
  const filteredPublishers = samplePublishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Seleccionar un publisher
  const selectPublisher = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setFormData((prev) => {
      const updated = {
        ...prev,
        publisher: publisher.name,
        agencyCommission: publisher.agencyCommission,
      };

      // Recalcular valores financieros con el nuevo publisher
      return calculateFinancials(updated);
    });

    // Cargar opciones dinámicas para publisher
    const channels = getChannelOptions(publisher.name);
    setDynamicChannelOptions(
      channels.length > 0 ? channels : defaultChannelOptions
    );

    // Desbloquear el campo de mercado después de seleccionar publisher
    setFieldsEnabled((prev) => ({ ...prev, market: true }));
    setShowPublisherDropdown(false);
    setSearchTerm("");
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (
    field: keyof AdUnit,
    value: string | number | boolean
  ) => {
    // Si es una campaña programática y se intenta cambiar customerNetRate, no hacer nada
    if (campaignType === "Programmatic" && field === "customerNetRate") {
      return;
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value === "" ? 0 : value,
      };

      // Desbloquear campos secuencialmente según la selección
      if (field === "market" && value) {
        setFieldsEnabled((prev) => ({ ...prev, channel: true }));
      } else if (field === "channel" && value) {
        // Actualizar opciones de formato basadas en el canal seleccionado
        const formats = getFormatOptions(updated.publisher, value as string);
        setDynamicFormatOptions(
          formats.length > 0 ? formats : defaultFormatOptions
        );
        setFieldsEnabled((prev) => ({ ...prev, format: true }));

        // Reiniciar los valores dependientes
        updated.format = "";
        updated.model = "";
        updated.size = "";
        setFieldsEnabled((prev) => ({ ...prev, model: false, size: false }));
      } else if (field === "format" && value) {
        // Actualizar opciones de modelo basadas en el formato seleccionado
        const models = getCommModelOptions(
          updated.publisher,
          updated.channel,
          value as string
        );
        setDynamicModelOptions(
          models.length > 0 ? models : defaultModelOptions
        );
        setFieldsEnabled((prev) => ({ ...prev, model: true }));

        // Reiniciar los valores dependientes
        updated.model = "";
        updated.size = "";
        setFieldsEnabled((prev) => ({ ...prev, size: false }));
      } else if (field === "model" && value) {
        // Actualizar opciones de tamaño basadas en el modelo seleccionado
        const sizes = getSizeOptions(
          updated.publisher,
          updated.channel,
          updated.format,
          value as string
        );
        setDynamicSizeOptions(sizes.length > 0 ? sizes : defaultSizeOptions);
        setFieldsEnabled((prev) => ({ ...prev, size: true }));

        // Reiniciar el tamaño
        updated.size = "";
      }

      // Cálculos relacionados con el margen bruto y tarifa del customer
      if (field === "grossMargin" && value !== undefined) {
        // Si es una campaña programática, no calcular customerNetRate
        if (campaignType === "Programmatic") {
          updated.customerNetRate = 0;
        } else {
          const marginPercentage = Number(value) / 100;

          // Solo calcular si tenemos una tarifa del publisher válida
          if (updated.publisherOpenRate && updated.publisherOpenRate > 0) {
            // Calcular la tarifa del customer basada en el margen deseado
            // Fórmula: customerRate = publisherRate / (1 - margin)
            const calculatedCustomerRate =
              updated.publisherOpenRate / (1 - marginPercentage);
            updated.customerNetRate = parseFloat(
              calculatedCustomerRate.toFixed(2)
            );
          }
        }
      } else if (field === "customerNetRate" && value !== undefined) {
        // Si es una campaña programática, no permitir cambios en customerNetRate
        if (campaignType === "Programmatic") {
          updated.customerNetRate = 0;
        } else {
          // Solo calcular si tenemos una tarifa del publisher válida
          if (
            updated.publisherOpenRate &&
            updated.publisherOpenRate > 0 &&
            Number(value) > 0
          ) {
            // Calcular el margen basado en la tarifa del customer
            // Fórmula: margin = 1 - (publisherRate / customerRate)
            const marginValue = 1 - updated.publisherOpenRate / Number(value);
            updated.grossMargin = parseFloat((marginValue * 100).toFixed(2));
          }
        }
      }

      // Recalcular valores dependientes
      if (
        field === "units" ||
        field === "customerInvestment" ||
        field === "localTaxes" ||
        field === "publisherOpenRate" ||
        field === "publisherCommission" ||
        field === "customerNetRate" ||
        field === "grossMargin"
      ) {
        return calculateFinancials(updated);
      }

      return updated;
    });
  };

  // Manejar la carga de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0]);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Asegurarse de que los cálculos financieros estén actualizados
    const finalData = calculateFinancials({
      ...formData,
      id: formData.id || `adunit-${Date.now()}`,
    });

    onSave(finalData);
  };

  // Función para añadir un descuento a Publisher
  const addPublisherDiscount = () => {
    const newId = `pd-${Date.now()}`;
    setPublisherDiscounts([
      ...publisherDiscounts,
      { id: newId, name: "", value: 0 },
    ]);
    // Recalcular cuando se añade
    setFormData((prevData) => calculateFinancials(prevData));
  };

  // Función para añadir un costo oculto a Publisher
  const addPublisherHiddenCost = () => {
    const newId = `phc-${Date.now()}`;
    setPublisherHiddenCosts([
      ...publisherHiddenCosts,
      { id: newId, name: "", value: 0 },
    ]);
    // Recalcular cuando se añade
    setFormData((prevData) => calculateFinancials(prevData));
  };

  // Función para añadir un descuento a Customer
  const addCustomerDiscount = () => {
    const newId = `cd-${Date.now()}`;
    setCustomerDiscounts([
      ...customerDiscounts,
      { id: newId, name: "", value: 0 },
    ]);
    // Recalcular cuando se añade
    setFormData((prevData) => calculateFinancials(prevData));
  };

  // Función para añadir un costo oculto a Customer
  const addCustomerHiddenCost = () => {
    const newId = `chc-${Date.now()}`;
    setCustomerHiddenCosts([
      ...customerHiddenCosts,
      { id: newId, name: "", value: 0 },
    ]);
    // Recalcular cuando se añade
    setFormData((prevData) => calculateFinancials(prevData));
  };

  // Función para actualizar un descuento o costo oculto
  const updateItem = (
    items: Array<{ id: string; name: string; value: number }>,
    setItems: React.Dispatch<
      React.SetStateAction<Array<{ id: string; name: string; value: number }>>
    >,
    id: string,
    field: "name" | "value",
    value: string | number
  ) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]:
              field === "value" ? (value === "" ? 0 : Number(value)) : value,
          }
        : item
    );
    setItems(updatedItems);

    // Recalcular los financieros cuando se actualiza un descuento o costo
    if (field === "value") {
      setFormData((prevData) => calculateFinancials(prevData));
    }
  };

  // Función para eliminar un descuento o costo oculto
  const removeItem = (
    items: Array<{ id: string; name: string; value: number }>,
    setItems: React.Dispatch<
      React.SetStateAction<Array<{ id: string; name: string; value: number }>>
    >,
    id: string
  ) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    // Recalcular cuando se elimina
    setFormData((prevData) => calculateFinancials(prevData));
  };

  // Funciones para expandir/contraer secciones específicas
  const togglePublisherHiddenCosts = () => {
    setExpandedSections((prev) => ({
      ...prev,
      publisherHiddenCosts: !prev.publisherHiddenCosts,
    }));
  };

  const toggleCustomerHiddenCosts = () => {
    setExpandedSections((prev) => ({
      ...prev,
      customerHiddenCosts: !prev.customerHiddenCosts,
    }));
  };

  // Efecto para recalcular cuando cambian los descuentos o costos ocultos
  useEffect(() => {
    setFormData((prevData) => calculateFinancials(prevData));
  }, [
    publisherDiscounts,
    publisherHiddenCosts,
    customerDiscounts,
    customerHiddenCosts,
    calculateFinancials,
  ]);

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
        <h2 className="text-xl font-semibold text-orange-600 flex items-center">
          <svg
            className="h-6 w-6 mr-2 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {isEditing ? "Edit Ad Unit" : "Create New Ad Unit"}
        </h2>

        {/* Botones de acción en la parte superior */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            className="px-3 py-1 border border-orange-500 bg-orange-500 rounded-md text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>

      {/* Guía de pasos a seguir */}
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-500 text-white font-medium flex items-center justify-center shadow-sm">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              General Information
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-400 text-white font-medium flex items-center justify-center shadow-sm">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Configure Product
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-300 text-white font-medium flex items-center justify-center shadow-sm">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Financial Data
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 font-medium flex items-center justify-center shadow-sm">
              4
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Additional Notes
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de información principal */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-1">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-orange-600">General Information</span>
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
                <h4 className="text-orange-700 font-semibold mb-3 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-orange-700 text-white font-medium flex items-center justify-center text-xs mr-2">
                    1
                  </div>
                  Campaign and Publisher Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Line
                    </label>
                    <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700">
                      {formData.line}{" "}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Publisher
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search publishers..."
                        onFocus={() => setShowPublisherDropdown(true)}
                      />
                      {selectedPublisher && (
                        <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-100 flex items-center">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {selectedPublisher.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {selectedPublisher.website}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md">
                            Selected
                          </span>
                        </div>
                      )}
                      {showPublisherDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredPublishers.length > 0 ? (
                            filteredPublishers.map((publisher) => (
                              <div
                                key={publisher.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectPublisher(publisher)}
                              >
                                <div className="font-medium">
                                  {publisher.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {publisher.website}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No publishers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Producto */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-2">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              <span className="text-orange-600">Product Information</span>
              <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                Important
              </span>
            </h3>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
              <h4 className="text-orange-700 font-medium mb-4 flex items-center">
                <div className="h-6 w-6 rounded-full bg-orange-400 text-white font-medium flex items-center justify-center text-xs mr-2 shadow-sm">
                  2
                </div>
                <span className="text-orange-700 font-semibold">
                  Configure Product
                </span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Market
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.market
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.market}
                    onChange={(e) => handleChange("market", e.target.value)}
                    disabled={!fieldsEnabled.market}
                  >
                    <option value="">Select Market</option>
                    {marketOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Channels
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.channel}
                    onChange={(e) => handleChange("channel", e.target.value)}
                    disabled={!fieldsEnabled.channel}
                  >
                    <option value="">Select Channel</option>
                    {dynamicChannelOptions.length > 0
                      ? dynamicChannelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      : defaultChannelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Format
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                    disabled={!fieldsEnabled.format}
                  >
                    <option value="">Select Format</option>
                    {dynamicFormatOptions.length > 0
                      ? dynamicFormatOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      : defaultFormatOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Model
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    disabled={!fieldsEnabled.model}
                  >
                    <option value="">Select Model</option>
                    {dynamicModelOptions.length > 0
                      ? dynamicModelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      : defaultModelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Size
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                    disabled={!fieldsEnabled.size}
                  >
                    <option value="">Select Size</option>
                    {dynamicSizeOptions.length > 0
                      ? dynamicSizeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      : defaultSizeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Creative
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      id="creative-file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="creative-file"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer text-sm font-medium transition-colors"
                    >
                      Choose File
                    </label>
                    <span className="ml-3 text-sm text-gray-600">
                      {fileUploaded ? fileUploaded.name : "No file selected"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center mt-2">
                    <input
                      id="v-ad"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="v-ad"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      V-Ad
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Financiera */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-orange-600">Financial Information</span>
              <div className="h-6 w-6 rounded-full bg-orange-300 text-white font-medium flex items-center justify-center text-xs ml-2 shadow-sm">
                3
              </div>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Nuevo diseño de la sección financiera */}
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                {/* Encabezado con explicación */}

                {/* Contenido en tres columnas */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* COLUMNA 1: Datos principales que el usuario debe ingresar */}
                  <div className="space-y-4 border-r border-gray-200 pr-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-white border-2 border-orange-500 rounded-full mr-2"></span>
                      Data to Complete
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Units
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-medium"
                        value={
                          formData.units
                            ? formatNumberInput(formData.units.toString())
                            : ""
                        }
                        onChange={(e) => {
                          const cleanValue = e.target.value.replace(
                            /[^\d]/g,
                            ""
                          );
                          handleChange(
                            "units",
                            cleanValue ? Number(cleanValue) : 0
                          );
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Publisher Open Rate
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <div className="flex-1 block border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                          {formData.publisherOpenRate
                            ? formatNumber(formData.publisherOpenRate, 2)
                            : "0.00"}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically calculated from the system
                      </p>
                    </div>

                    <div className="relative pt-5 pb-3">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-600 font-medium">
                          Enter value below
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Customer Investment
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="text"
                          className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
                          value={
                            formData.customerInvestment
                              ? formatNumberInput(
                                  formData.customerInvestment.toString()
                                )
                              : ""
                          }
                          onChange={(e) => {
                            // Permitir números y un punto decimal
                            const cleanValue = e.target.value.replace(
                              /[^\d.]/g,
                              ""
                            );
                            // Asegurar que solo haya un punto decimal
                            const parts = cleanValue.split(".");
                            const formattedValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : cleanValue;
                            handleChange(
                              "customerInvestment",
                              formattedValue ? Number(formattedValue) : 0
                            );
                          }}
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lo que le cobramos al cliente sin descuentos
                      </p>
                    </div>
                  </div>

                  {/* COLUMNA 2: Costos adicionales e impuestos */}
                  <div className="space-y-4 border-r border-gray-200 pr-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-gray-50 border-2 border-orange-500 rounded-full mr-2"></span>
                      {campaignType === "Programmatic"
                        ? "Calculator - Publisher | PROGRAMMATIC"
                        : "Calculator - Publisher"}
                    </h5>

                    {/* Descuentos Publisher - Botón para agregar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Discounts
                        </label>
                        <button
                          type="button"
                          className="p-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                          onClick={addPublisherDiscount}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {publisherDiscounts.length === 0 ? (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Click + to add publisher discounts
                        </p>
                      ) : (
                        <div className="space-y-2 mb-2">
                          {publisherDiscounts.map((discount) => (
                            <div
                              key={discount.id}
                              className="border border-gray-200 rounded-md p-2 flex items-center"
                            >
                              <div className="flex-1 pr-2">
                                <input
                                  type="text"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={discount.name}
                                  onChange={(e) =>
                                    updateItem(
                                      publisherDiscounts,
                                      setPublisherDiscounts,
                                      discount.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Discount name"
                                />
                              </div>
                              <div className="w-24 flex items-center">
                                <input
                                  type="number"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={
                                    discount.value === 0 ? "" : discount.value
                                  }
                                  onChange={(e) =>
                                    updateItem(
                                      publisherDiscounts,
                                      setPublisherDiscounts,
                                      discount.id,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                                <span className="ml-1 text-gray-600">%</span>
                              </div>
                              <button
                                type="button"
                                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                                onClick={() =>
                                  removeItem(
                                    publisherDiscounts,
                                    setPublisherDiscounts,
                                    discount.id
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>US Media Commission</span>
                        <span className="text-gray-500">
                          {formData.agencyCommission}%
                        </span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                        {formatCurrency(
                          (formData.customerInvestment *
                            (formData.agencyCommission || 0)) /
                            100
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Fixed value from backend
                      </p>
                    </div>

                    {/* Hidden Costs Publisher - Sección contraíble */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Hidden Costs
                        </label>
                        <button
                          type="button"
                          className="p-1 text-gray-600 rounded-full hover:bg-gray-100"
                          onClick={togglePublisherHiddenCosts}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${
                              expandedSections.publisherHiddenCosts
                                ? "rotate-180"
                                : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {!expandedSections.publisherHiddenCosts ? (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Click to expand hidden costs
                        </p>
                      ) : (
                        <div className="space-y-2 mb-2">
                          {publisherHiddenCosts.map((cost) => (
                            <div
                              key={cost.id}
                              className="border border-gray-200 rounded-md p-2 flex items-center"
                            >
                              <div className="flex-1 pr-2">
                                <input
                                  type="text"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={cost.name}
                                  onChange={(e) =>
                                    updateItem(
                                      publisherHiddenCosts,
                                      setPublisherHiddenCosts,
                                      cost.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Cost name"
                                />
                              </div>
                              <div className="w-24 flex items-center">
                                <input
                                  type="number"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={cost.value === 0 ? "" : cost.value}
                                  onChange={(e) =>
                                    updateItem(
                                      publisherHiddenCosts,
                                      setPublisherHiddenCosts,
                                      cost.id,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                                <span className="ml-1 text-gray-600">%</span>
                              </div>
                              <button
                                type="button"
                                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                                onClick={() =>
                                  removeItem(
                                    publisherHiddenCosts,
                                    setPublisherHiddenCosts,
                                    cost.id
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}

                          {/* Botón para agregar más costos ocultos */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="p-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                              onClick={addPublisherHiddenCost}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="py-3">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>

                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-gray-50 border-2 border-orange-500 rounded-full mr-2"></span>
                      {campaignType === "Programmatic"
                        ? "Calculator - Customer | PROGRAMMATIC"
                        : "Calculator - Customer"}
                    </h5>

                    {/* Descuentos Customer - Botón para agregar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Discounts
                        </label>
                        <button
                          type="button"
                          className="p-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                          onClick={addCustomerDiscount}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {customerDiscounts.length === 0 ? (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Click + to add customer discounts
                        </p>
                      ) : (
                        <div className="space-y-2 mb-2">
                          {customerDiscounts.map((discount) => (
                            <div
                              key={discount.id}
                              className="border border-gray-200 rounded-md p-2 flex items-center"
                            >
                              <div className="flex-1 pr-2">
                                <input
                                  type="text"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={discount.name}
                                  onChange={(e) =>
                                    updateItem(
                                      customerDiscounts,
                                      setCustomerDiscounts,
                                      discount.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Discount name"
                                />
                              </div>
                              <div className="w-24 flex items-center">
                                <input
                                  type="number"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={
                                    discount.value === 0 ? "" : discount.value
                                  }
                                  onChange={(e) =>
                                    updateItem(
                                      customerDiscounts,
                                      setCustomerDiscounts,
                                      discount.id,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                                <span className="ml-1 text-gray-600">%</span>
                              </div>
                              <button
                                type="button"
                                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                                onClick={() =>
                                  removeItem(
                                    customerDiscounts,
                                    setCustomerDiscounts,
                                    discount.id
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hidden Costs Customer - Sección expandida por defecto */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Hidden Costs
                        </label>
                        <button
                          type="button"
                          className="p-1 text-gray-600 rounded-full hover:bg-gray-100"
                          onClick={toggleCustomerHiddenCosts}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${
                              expandedSections.customerHiddenCosts
                                ? "rotate-180"
                                : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {!expandedSections.customerHiddenCosts ? (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Click to expand hidden costs
                        </p>
                      ) : (
                        <div className="space-y-2 mb-2">
                          {customerHiddenCosts.map((cost) => (
                            <div
                              key={cost.id}
                              className="border border-gray-200 rounded-md p-2 flex items-center"
                            >
                              <div className="flex-1 pr-2">
                                <input
                                  type="text"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={cost.name}
                                  onChange={(e) =>
                                    updateItem(
                                      customerHiddenCosts,
                                      setCustomerHiddenCosts,
                                      cost.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Cost name"
                                  readOnly={cost.id === "1" || cost.id === "2"} // AVB y Local taxes no se pueden editar
                                />
                              </div>
                              <div className="w-24 flex items-center">
                                <input
                                  type="number"
                                  className="w-full border-gray-200 rounded-md p-1 text-sm"
                                  value={cost.value === 0 ? "" : cost.value}
                                  onChange={(e) =>
                                    updateItem(
                                      customerHiddenCosts,
                                      setCustomerHiddenCosts,
                                      cost.id,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  readOnly={cost.id === "2"} // Solo Local taxes es readonly
                                />
                                <span className="ml-1 text-gray-600">%</span>
                              </div>
                              {cost.id !== "1" &&
                                cost.id !== "2" && ( // No mostrar botón de eliminar para AVB y Local taxes
                                  <button
                                    type="button"
                                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                                    onClick={() =>
                                      removeItem(
                                        customerHiddenCosts,
                                        setCustomerHiddenCosts,
                                        cost.id
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                            </div>
                          ))}

                          {/* Botón para agregar más costos ocultos */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="p-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200"
                              onClick={addCustomerHiddenCost}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* COLUMNA 3: Resultados finales */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-orange-100 border-2 border-orange-500 rounded-full mr-2"></span>
                      Calculated Rates
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {campaignType === "Programmatic"
                          ? "Publisher Final Rate | PROGRAMMATIC"
                          : "Publisher Final Rate"}
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                        {formData.unitCost
                          ? `$${formatNumber(formData.unitCost, 2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Publisher Open Rate - Discounts + Hidden Costs
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {campaignType === "Programmatic"
                          ? "Customer Final Negotiated Rate | PROGRAMMATIC"
                          : "Customer Final Negotiated Rate"}
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                        {campaignType === "Programmatic"
                          ? "$0.00"
                          : formData.customerNetRate
                          ? `$${formatNumber(
                              formData.customerNetRate * 0.85,
                              2
                            )}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Customer Net Rate - Discounts + Hidden Costs
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {campaignType === "Programmatic"
                          ? "Customer Net Rate | PROGRAMMATIC"
                          : "Customer Net Rate"}
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                        {campaignType === "Programmatic"
                          ? "$0.00"
                          : formData.customerNetRate
                          ? `$${formatNumber(formData.customerNetRate, 2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Base rate before discounts and hidden costs
                      </p>
                    </div>

                    <div className="py-3">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Gross Margin (%)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
                          value={
                            !formData.grossMargin || formData.grossMargin === 0
                              ? ""
                              : formatNumberInput(
                                  formData.grossMargin.toString()
                                )
                          }
                          onChange={(e) => {
                            // Permitir números y un punto decimal
                            const cleanValue = e.target.value.replace(
                              /[^\d.]/g,
                              ""
                            );
                            // Asegurar que solo haya un punto decimal
                            const parts = cleanValue.split(".");
                            const formattedValue =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : cleanValue;

                            const val =
                              formattedValue === ""
                                ? ""
                                : Number(formattedValue);
                            // Limitar a 100%
                            const limitedVal =
                              typeof val === "number" && val > 100 ? 100 : val;
                            handleChange("grossMargin", limitedVal);
                          }}
                          placeholder="Ex: 30"
                        />
                        <span className="ml-2 text-gray-600">%</span>
                        {formData.grossMargin !== undefined &&
                          formData.grossMargin > 0 && (
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                formData.grossMargin >= 25
                                  ? "bg-green-100 text-green-800"
                                  : formData.grossMargin >= 15
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formData.grossMargin >= 25
                                ? "Excellent"
                                : formData.grossMargin >= 15
                                ? "Acceptable"
                                : "Low"}
                            </span>
                          )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Gross Margin ($)
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-100 text-gray-700 font-medium">
                        {formData.grossMargin &&
                        formData.unitCost &&
                        formData.units &&
                        formData.customerInvestment &&
                        formData.publisherNetCost
                          ? formatCurrency(
                              formData.customerInvestment -
                                formData.publisherNetCost
                            )
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Calculated based on rates and units
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Notas */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Notes
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-orange-700 font-medium mb-3 flex items-center">
                <div className="h-6 w-6 rounded-full bg-orange-200 text-orange-700 font-medium flex items-center justify-center text-xs mr-2 shadow-sm">
                  4
                </div>
                Additional Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Note for Customer IO
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Information that will appear on the customer order"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Note for Publisher IO
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Information that will appear on the publisher order"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Edit Log Note
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Internal comments or notes about changes"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción en la parte inferior */}
        <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-orange-400 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {isEditing
                ? "Changes will be saved to the current campaign."
                : "The new unit will be added to the current campaign."}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {isEditing ? "Save Changes" : "Create Ad Unit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdUnitForm;
