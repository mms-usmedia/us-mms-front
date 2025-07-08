"use client";

import React, { useState } from "react";
import { Role, Permission } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { mockRoles, mockPermissions } from "./mockData";
import { PlusIcon, Search, Edit, Trash, Check } from "lucide-react";

interface RolesPermissionsProps {
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

export default function RolesPermissions({
  showForm: externalShowForm,
  setShowForm: setExternalShowForm,
}: RolesPermissionsProps) {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [internalShowForm, setInternalShowForm] = useState(false);

  // Use either external or internal state for showing the form
  const showForm =
    externalShowForm !== undefined ? externalShowForm : internalShowForm;
  const setShowForm = setExternalShowForm || setInternalShowForm;

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowForm(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  // Function to get module badge color
  const getModuleBadgeColor = (moduleType: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      All: { bg: "bg-purple-100", text: "text-purple-800" },
      Online: { bg: "bg-indigo-100", text: "text-indigo-800" },
      Offline: { bg: "bg-emerald-100", text: "text-emerald-800" },
      OOH: { bg: "bg-amber-100", text: "text-amber-800" },
    };

    return (
      colors[moduleType] || { bg: "bg-orange-100", text: "text-orange-800" }
    );
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search roles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Role Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Module
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Permissions
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <TableRow
                      key={role.id}
                      className="hover:bg-orange-50 transition-colors"
                    >
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        {(() => {
                          const { bg, text } = getModuleBadgeColor(role.module);
                          return (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
                            >
                              {role.module}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {role.permissions.length} permissions
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRole(role)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <RoleForm
          role={selectedRole}
          onSave={(role) => {
            console.log("Save role:", role);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

interface RoleFormProps {
  role?: Role | null;
  onSave: (role: Partial<Role>) => void;
  onCancel: () => void;
}

function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: role?.name || "",
    description: role?.description || "",
    module: role?.module || "All",
    permissions: role?.permissions || [],
  });

  const [availablePermissions] = useState<Permission[]>(mockPermissions);
  const isEditing = !!role;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePermissionToggle = (permission: Permission) => {
    const isSelected = formData.permissions?.some(
      (p) => p.id === permission.id
    );

    if (isSelected) {
      setFormData({
        ...formData,
        permissions: formData.permissions?.filter(
          (p) => p.id !== permission.id
        ),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...(formData.permissions || []), permission],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  availablePermissions.forEach((permission) => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    permissionsByModule[permission.module].push(permission);
  });

  // Function to get module color for permission sections
  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      campaigns: "text-blue-600",
      finance: "text-green-600",
      reports: "text-purple-600",
      settings: "text-red-600",
    };

    return colors[module] || "text-orange-600";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm rounded-xl">
      <CardHeader className="bg-white pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Role" : "New Role"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isEditing
            ? "Update role information and permissions"
            : "Create a new role with specific permissions"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Role Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Role Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module" className="text-gray-700">
                  Module
                </Label>
                <select
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="All">All</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="OOH">OOH</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Permissions
            </h3>
            <div className="space-y-4">
              {Object.entries(permissionsByModule).map(
                ([module, permissions], moduleIndex, modulesArray) => (
                  <div
                    key={module}
                    className={`pb-4 ${
                      moduleIndex < modulesArray.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <h4
                      className={`font-medium ${getModuleColor(
                        module
                      )} mb-3 capitalize`}
                    >
                      {module}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission) => {
                        const isSelected = formData.permissions?.some(
                          (p) => p.id === permission.id
                        );
                        return (
                          <div
                            key={permission.id}
                            className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                            onClick={() => handlePermissionToggle(permission)}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center ${
                                isSelected
                                  ? "bg-orange-500 border-orange-500"
                                  : "border border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">
                              {permission.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 hover:bg-gray-100 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
