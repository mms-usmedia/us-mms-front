"use client";

import React, { useState, useEffect, useRef } from "react";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, ChevronDown, X } from "lucide-react";

interface UserFormProps {
  user?: User;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User & { roles: string[] }>>(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      username: "",
      isAdmin: false,
      noLimitAccess: false,
      active: true,
      roles: [],
    }
  );

  const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        roles: user.role ? [user.role] : [],
      });
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRolesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role];

      return {
        ...prev,
        roles: newRoles,
        // Keep the role field for backward compatibility
        role: newRoles.join(", "),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Available roles in the system
  const availableRoles = [
    "Sales Manager",
    "Salesman",
    "Executive",
    "Traffic",
    "Accounting",
    "Admin",
    "Account Manager",
    "Marketing",
    "Creative",
    "Operations",
    "Finance",
    "HR",
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm rounded-xl">
      <CardHeader className="bg-white pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit User" : "New User"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isEditing
            ? "Update user information and permissions"
            : "Create a new user with specific permissions"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roles" className="text-gray-700">
                  Roles
                </Label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRolesDropdownOpen(!isRolesDropdownOpen)}
                    className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <span>
                      {formData.roles && formData.roles.length > 0
                        ? formData.roles.join(", ")
                        : "Select roles"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {isRolesDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                      {availableRoles.map((role) => (
                        <div
                          key={role}
                          className="flex items-center px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                          onClick={() => handleRoleToggle(role)}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                              formData.roles?.includes(role)
                                ? "bg-orange-500 border-orange-500"
                                : "border border-gray-300"
                            }`}
                          >
                            {formData.roles?.includes(role) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required={!isEditing}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Permissions
            </h3>
            <div className="space-y-3">
              <div
                className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
                }
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center ${
                    formData.isAdmin
                      ? "bg-orange-500 border-orange-500"
                      : "border border-gray-300"
                  }`}
                >
                  {formData.isAdmin && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-800">
                    Administrator
                  </span>
                  <p className="text-xs text-gray-500">
                    Full access to all system features and settings
                  </p>
                </div>
              </div>

              <div
                className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    noLimitAccess: !prev.noLimitAccess,
                  }))
                }
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center ${
                    formData.noLimitAccess
                      ? "bg-orange-500 border-orange-500"
                      : "border border-gray-300"
                  }`}
                >
                  {formData.noLimitAccess && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-800">
                    No access limits
                  </span>
                  <p className="text-xs text-gray-500">
                    User can access all data without restrictions
                  </p>
                </div>
              </div>

              <div
                className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, active: !prev.active }))
                }
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center ${
                    formData.active
                      ? "bg-orange-500 border-orange-500"
                      : "border border-gray-300"
                  }`}
                >
                  {formData.active && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-800">Active user</span>
                  <p className="text-xs text-gray-500">
                    User can log in and access the system
                  </p>
                </div>
              </div>
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
            {isEditing ? "Save Changes" : "Create User"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
