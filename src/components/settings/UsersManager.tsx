"use client";

import React, { useState } from "react";
import { User } from "@/types/users";
import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import { mockUsers } from "./mockData";

interface UsersManagerProps {
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
}

export default function UsersManager({
  showForm: externalShowForm,
  setShowForm: setExternalShowForm,
}: UsersManagerProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [internalShowForm, setInternalShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Use either external or internal state for showing the form
  const showForm =
    externalShowForm !== undefined ? externalShowForm : internalShowForm;
  const setShowForm = setExternalShowForm || setInternalShowForm;

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSaveUser = (userData: Partial<User & { roles: string[] }>) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...userData,
                role: userData.roles?.join(", ") || userData.role || "",
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: `u${users.length + 1}`,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        country: userData.country || "",
        username: userData.username || "",
        isAdmin: userData.isAdmin || false,
        noLimitAccess: userData.noLimitAccess || false,
        active: userData.active !== undefined ? userData.active : true,
        role: userData.roles?.join(", ") || userData.role || "",
        roles: userData.roles || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div>
      {showForm ? (
        <UserForm
          user={editingUser || undefined}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
        />
      ) : (
        <UsersTable onEditUser={handleEditUser} />
      )}
    </div>
  );
}
