"use client";

import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { PendingRequest } from "@/src/interfaces";

export function NotificationItem({
  notification,
  onClick,
}: {
  notification: PendingRequest;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className="px-3 py-2 flex items-center justify-between hover:bg-premium-backgroundDark dark:hover:bg-premium-secondaryLight transition-all cursor-pointer"
    >
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "px-2 py-1 text-xs font-semibold text-white rounded-full",
              notification.operation === "agregar"
                ? "bg-green-600"
                : "bg-blue-600"
            )}
          >
            {notification.operation}
          </span>
          <p className="text-sm text-premium-primary dark:text-premium-primaryLight font-semibold">
            {notification.projectName}
          </p>
        </div>

        <p className="text-xs text-premium-textSecondary">
          {notification.userEmail}
        </p>
        <p className="text-xs text-premium-textSecondary">
          {new Date(notification.date).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-premium-primary dark:text-premium-primaryLight ml-2" />
    </li>
  );
}
