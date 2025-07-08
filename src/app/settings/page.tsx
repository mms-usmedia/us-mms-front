"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersManager from "@/components/settings/UsersManager";
import RolesPermissions from "@/components/settings/RolesPermissions";
import UserVisibilityManager from "@/components/settings/UserVisibilityManager";
import ExchangeRatesManager from "@/components/settings/ExchangeRatesManager";
import InvoicingPeriodsManager from "@/components/settings/InvoicingPeriodsManager";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  const [showUserForm, setShowUserForm] = React.useState(false);
  const [showRoleForm, setShowRoleForm] = React.useState(false);
  const [showRateForm, setShowRateForm] = React.useState(false);
  const [showPeriodForm, setShowPeriodForm] = React.useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Manage system configuration, users, roles and financial settings
              </p>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="visibility">Visibility</TabsTrigger>
                <TabsTrigger value="exchange">Exchange Rates</TabsTrigger>
                <TabsTrigger value="invoicing">Invoicing Periods</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <div className="px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Users Management
                        </h2>
                        <p className="text-gray-600">
                          Manage system users, their credentials and status.
                        </p>
                      </div>
                      {!showUserForm && (
                        <Button
                          onClick={() => setShowUserForm(true)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          New User
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-0 pb-6">
                    <UsersManager
                      showForm={showUserForm}
                      setShowForm={setShowUserForm}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles">
                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <div className="px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Roles & Permissions
                        </h2>
                        <p className="text-gray-600">
                          Configure roles and permissions to control system
                          access.
                        </p>
                      </div>
                      {!showRoleForm && (
                        <Button
                          onClick={() => setShowRoleForm(true)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          New Role
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-0 pb-6">
                    <RolesPermissions
                      showForm={showRoleForm}
                      setShowForm={setShowRoleForm}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visibility">
                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="bg-white pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      User Visibility
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configure which users can view information from other
                      users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <UserVisibilityManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exchange">
                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <div className="px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Exchange Rates
                        </h2>
                        <p className="text-gray-600">
                          Manage exchange rates between different currencies.
                        </p>
                      </div>
                      {!showRateForm && (
                        <Button
                          onClick={() => setShowRateForm(true)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          New Rate
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-0 pb-6">
                    <ExchangeRatesManager
                      showForm={showRateForm}
                      setShowForm={setShowRateForm}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoicing">
                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <div className="px-6 pt-6 pb-0 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Invoicing Periods
                        </h2>
                        <p className="text-gray-600">
                          Configure periods for invoicing and financial reports.
                        </p>
                      </div>
                      {!showPeriodForm && (
                        <Button
                          onClick={() => setShowPeriodForm(true)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          New Period
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-0 pb-6">
                    <InvoicingPeriodsManager
                      showForm={showPeriodForm}
                      setShowForm={setShowPeriodForm}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
