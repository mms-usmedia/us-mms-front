"use client";

import React, { useState } from "react";
import { User, UserVisibility } from "@/types/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockUserVisibility } from "./mockData";
import {
  PlusIcon,
  X,
  UserPlus,
  Search,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Componente para el modal de confirmación de eliminación
interface DeleteVisibilityModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteVisibilityModal: React.FC<DeleteVisibilityModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <svg
            className="mx-auto mb-4 w-14 h-14 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mb-5 text-lg font-medium text-gray-900">
            Are you sure you want to remove this visibility?
          </h3>
          <p className="mb-5 text-sm text-gray-500">
            This action cannot be undone. This will permanently delete the
            visibility for this user.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserVisibilityManager() {
  const [users] = useState<User[]>(mockUsers);
  const [visibilityRelations, setVisibilityRelations] =
    useState<UserVisibility[]>(mockUserVisibility);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Function to select or deselect a user
  const handleSelectUser = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      // If the user is already selected, deselect it
      setSelectedUser(null);
    } else {
      // If not selected or it's another user, select it
      setSelectedUser(user);
    }
    setShowAddForm(false);
    setSelectedUsers([]);
    setSearchTerm(""); // Reset search term when changing user
  };

  // Function to open delete confirmation modal
  const handleOpenDeleteModal = (visibleUserId: string) => {
    setUserToDelete(visibleUserId);
    setDeleteModalOpen(true);
  };

  // Function to remove a visibility relation after confirmation
  const handleConfirmRemoveVisibility = () => {
    if (!selectedUser || !userToDelete) return;

    setVisibilityRelations(
      visibilityRelations.filter(
        (relation) =>
          !(
            relation.userId === selectedUser.id &&
            relation.visibleUserId === userToDelete
          )
      )
    );

    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Function to cancel delete operation
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Function to toggle user selection
  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prevSelectedUsers) => {
      const isSelected = prevSelectedUsers.some((u) => u.id === user.id);

      if (isSelected) {
        return prevSelectedUsers.filter((u) => u.id !== user.id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  // Function to save selected users
  const handleSaveVisibility = () => {
    if (!selectedUser || selectedUsers.length === 0) return;

    const newRelations: UserVisibility[] = selectedUsers.map((user) => ({
      userId: selectedUser.id,
      visibleUserId: user.id,
      visibleUser: user,
    }));

    // Filter out relations that already exist
    const newUniqueRelations = newRelations.filter(
      (newRelation) =>
        !visibilityRelations.some(
          (relation) =>
            relation.userId === newRelation.userId &&
            relation.visibleUserId === newRelation.visibleUserId
        )
    );

    setVisibilityRelations([...visibilityRelations, ...newUniqueRelations]);
    setSelectedUsers([]);
    setShowAddForm(false);
  };

  // Filter visible users for the selected user
  const visibleUsers = selectedUser
    ? visibilityRelations
        .filter((relation) => relation.userId === selectedUser.id)
        .map((relation) => relation.visibleUser)
    : [];

  // Filter users that are not currently visible to the selected user
  const availableUsers = selectedUser
    ? users.filter(
        (user) =>
          user.id !== selectedUser.id &&
          !visibilityRelations.some(
            (relation) =>
              relation.userId === selectedUser.id &&
              relation.visibleUserId === user.id
          )
      )
    : [];

  // Filter available users by search term
  const filteredAvailableUsers = searchTerm
    ? availableUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableUsers;

  // Filter main users list by search term
  const filteredUsers = userSearchTerm
    ? users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* User list */}
      <Card className="md:col-span-1 border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-white pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 mb-4">
              <Search className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-transparent border-none outline-none text-sm"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>

            {filteredUsers.length > 0 ? (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant={
                      selectedUser?.id === user.id ? "default" : "outline"
                    }
                    className={`w-full justify-start ${
                      selectedUser?.id === user.id
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:text-orange-600"
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.firstName} {user.lastName}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No users found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visibility details */}
      <Card className="md:col-span-2 border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-white pb-4 flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {selectedUser
              ? `Visibility for ${selectedUser.firstName} ${selectedUser.lastName}`
              : "Select a user"}
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className={selectedUser ? "" : "invisible"}
          >
            {showAddForm ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Close
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Visibility
              </>
            )}
          </Button>
        </CardHeader>

        {/* Expanded form for adding visibility */}
        {showAddForm && selectedUser && (
          <div className="px-6 pb-4 border-b border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center border border-gray-200 rounded-md px-3 py-2">
                <Search className="h-4 w-4 mr-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-transparent border-none outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-[200px] overflow-y-auto border border-gray-200 rounded-md p-2">
                {filteredAvailableUsers.length > 0 ? (
                  <div className="space-y-1">
                    {filteredAvailableUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center p-2 rounded-md cursor-pointer ${
                          selectedUsers.some((u) => u.id === user.id)
                            ? "bg-orange-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <div
                          className={`w-5 h-5 rounded border border-gray-300 mr-3 flex items-center justify-center ${
                            selectedUsers.some((u) => u.id === user.id)
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedUsers.some((u) => u.id === user.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-2 text-center">
                    No users available
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSaveVisibility}
                  disabled={selectedUsers.length === 0}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save {selectedUsers.length > 0 && `(${selectedUsers.length})`}
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="pt-4">
          {selectedUser ? (
            <div className="space-y-4">
              <div className="flex justify-start items-center">
                <p className="text-sm text-gray-500">
                  {visibleUsers.length === 0
                    ? "This user has no visibility over other users."
                    : ""}
                </p>
              </div>

              {visibleUsers.length > 0 && (
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
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-orange-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
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
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleOpenDeleteModal(user.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              Select a user to manage their visibility.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      <DeleteVisibilityModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmRemoveVisibility}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
