"use client";

import React, { useState } from "react";
import { User } from "@/types/users";
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
import { mockUsers } from "./mockData";
import { Check, PlusIcon, Search } from "lucide-react";

interface UsersTableProps {
  onEditUser: (user: User) => void;
}

export default function UsersTable({ onEditUser }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // Filter users based on search term and active status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActiveFilter = showInactive ? true : user.active;

    return matchesSearch && matchesActiveFilter;
  });

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Admin: { bg: "bg-orange-100", text: "text-orange-800" },
      "Sales Manager": { bg: "bg-blue-100", text: "text-blue-800" },
      "Account Manager": { bg: "bg-indigo-100", text: "text-indigo-800" },
      Salesman: { bg: "bg-sky-100", text: "text-sky-800" },
      Executive: { bg: "bg-purple-100", text: "text-purple-800" },
      Traffic: { bg: "bg-green-100", text: "text-green-800" },
      Accounting: { bg: "bg-yellow-100", text: "text-yellow-800" },
      Finance: { bg: "bg-amber-100", text: "text-amber-800" },
      Marketing: { bg: "bg-pink-100", text: "text-pink-800" },
      Creative: { bg: "bg-rose-100", text: "text-rose-800" },
      Operations: { bg: "bg-teal-100", text: "text-teal-800" },
      HR: { bg: "bg-emerald-100", text: "text-emerald-800" },
    };

    return colors[role] || { bg: "bg-gray-100", text: "text-gray-800" };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowInactive(!showInactive)}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center ${
                showInactive
                  ? "bg-orange-500 border-orange-500"
                  : "border border-gray-300"
              }`}
            >
              {showInactive && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="ml-2 text-sm text-gray-700">Show inactive</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Username
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Country
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Roles
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.country || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles &&
                        user.roles.map((role, index) => {
                          const { bg, text } = getRoleBadgeColor(role);
                          return (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
                            >
                              {role}
                            </span>
                          );
                        })}
                      {user.isAdmin && !user.roles?.includes("Admin") && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditUser(user)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
