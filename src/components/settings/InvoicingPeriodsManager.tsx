"use client";

import React, { useState } from "react";
import { InvoicingPeriod } from "@/types/users";
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
import { mockInvoicingPeriods } from "./mockData";
import { PlusIcon, Edit, Lock, Calendar } from "lucide-react";

interface InvoicingPeriodsManagerProps {
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

export default function InvoicingPeriodsManager({
  showForm: externalShowForm,
  setShowForm: setExternalShowForm,
}: InvoicingPeriodsManagerProps) {
  const [periods, setPeriods] =
    useState<InvoicingPeriod[]>(mockInvoicingPeriods);
  const [internalShowForm, setInternalShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<InvoicingPeriod | null>(
    null
  );

  // Use either external or internal state for showing the form
  const showForm =
    externalShowForm !== undefined ? externalShowForm : internalShowForm;
  const setShowForm = setExternalShowForm || setInternalShowForm;

  const handleAddPeriod = () => {
    setEditingPeriod(null);
    setShowForm(true);
  };

  const handleEditPeriod = (period: InvoicingPeriod) => {
    setEditingPeriod(period);
    setShowForm(true);
  };

  const handleSavePeriod = (period: Partial<InvoicingPeriod>) => {
    if (editingPeriod) {
      // Update existing period
      setPeriods(
        periods.map((p) =>
          p.id === editingPeriod.id
            ? { ...p, ...period, updatedAt: new Date().toISOString() }
            : p
        )
      );
    } else {
      // Create new period
      const newPeriod: InvoicingPeriod = {
        id: `i${periods.length + 1}`,
        name: period.name || "",
        startDate: period.startDate || "",
        endDate: period.endDate || "",
        status: "open",
        module: period.module || "Online",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPeriods([...periods, newPeriod]);
    }
    setShowForm(false);
    setEditingPeriod(null);
  };

  const handleChangePeriodStatus = (
    periodId: string,
    newStatus: "open" | "closed" | "processing"
  ) => {
    setPeriods(
      periods.map((p) =>
        p.id === periodId
          ? { ...p, status: newStatus, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  // Get module badge color
  const getModuleBadgeColor = (module: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Online: { bg: "bg-blue-100", text: "text-blue-800" },
      OOH: { bg: "bg-green-100", text: "text-green-800" },
      Broadcast: { bg: "bg-purple-100", text: "text-purple-800" },
      Print: { bg: "bg-amber-100", text: "text-amber-800" },
    };

    return colors[module] || { bg: "bg-gray-100", text: "text-gray-800" };
  };

  // Sort periods by start date (most recent first)
  const sortedPeriods = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Start Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  End Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Module
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Last Update
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPeriods.map((period) => (
                <TableRow
                  key={period.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <TableCell className="font-medium">{period.name}</TableCell>
                  <TableCell>
                    {new Date(period.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(period.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {period.module && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getModuleBadgeColor(period.module).bg
                        } ${getModuleBadgeColor(period.module).text}`}
                      >
                        {period.module}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        period.status === "open"
                          ? "bg-green-100 text-green-800"
                          : period.status === "processing"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {period.status === "open"
                        ? "Open"
                        : period.status === "processing"
                        ? "Processing"
                        : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(period.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {period.status !== "closed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPeriod(period)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <InvoicingPeriodForm
          period={editingPeriod}
          onSave={handleSavePeriod}
          onCancel={() => {
            setShowForm(false);
            setEditingPeriod(null);
          }}
        />
      )}
    </div>
  );
}

interface InvoicingPeriodFormProps {
  period?: InvoicingPeriod | null;
  onSave: (period: Partial<InvoicingPeriod>) => void;
  onCancel: () => void;
}

function InvoicingPeriodForm({
  period,
  onSave,
  onCancel,
}: InvoicingPeriodFormProps) {
  const [formData, setFormData] = useState<Partial<InvoicingPeriod>>({
    name: period?.name || "",
    startDate: period?.startDate || "",
    endDate: period?.endDate || "",
    status: period?.status || "open",
    module: period?.module || "Online",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border shadow-sm rounded-xl overflow-hidden">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Period Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="e.g. Q1 2025, January 2025"
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="module"
                  className="block text-sm font-medium text-gray-700"
                >
                  Module
                </label>
                <select
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="Online">Online</option>
                  <option value="OOH">OOH</option>
                  <option value="Broadcast">Broadcast</option>
                  <option value="Print">Print</option>
                </select>
              </div>

              {period && (
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="open">Open</option>
                    <option value="processing">Processing</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {period ? "Save Changes" : "Create Period"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
