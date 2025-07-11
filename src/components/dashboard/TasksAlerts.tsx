import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  type: "document" | "event" | "alert";
  completed?: boolean;
}

interface TasksAlertsProps {
  className?: string;
}

export const TasksAlerts: React.FC<TasksAlertsProps> = ({ className = "" }) => {
  // Datos simulados de tareas
  const tasks: Task[] = [
    {
      id: "1",
      title: "Upload CIO for Carl's Jr campaign",
      dueDate: "2025-04-02",
      priority: "High",
      type: "document",
    },
    {
      id: "2",
      title: "Mercado Libre campaign starts in 2 days",
      dueDate: "2025-04-05",
      priority: "Medium",
      type: "event",
    },
    {
      id: "3",
      title: "Follow up with Samsung for creative assets",
      dueDate: "2025-04-04",
      priority: "Medium",
      type: "document",
    },
    {
      id: "4",
      title: "Quarterly sales target is 72% complete",
      dueDate: "Q2 2025",
      priority: "Low",
      type: "alert",
    },
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "document":
        return (
          <div className="p-2 rounded-full bg-orange-100">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
      case "event":
        return (
          <div className="p-2 rounded-full bg-teal-100">
            <svg
              className="w-4 h-4 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "alert":
        return (
          <div className="p-2 rounded-full bg-rose-100">
            <svg
              className="w-4 h-4 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "Medium":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "Low":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <Card className={`p-5 overflow-hidden shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tasks & Alerts</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getTaskIcon(task.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {task.dueDate}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-1 h-auto text-gray-400 hover:text-orange-600 hover:bg-orange-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
