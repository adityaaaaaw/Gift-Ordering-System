"use client";

import React from "react";
import { OrderStatus, TrackingHistoryItem } from "@/types";
import { Check, ClipboardList, PenTool, Box, Truck, CheckCircle2, ShieldAlert } from "lucide-react";

interface StatusTrackerProps {
  currentStatus: OrderStatus;
  trackingHistory: TrackingHistoryItem[];
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentStatus,
  trackingHistory,
}) => {
  const progressiveSteps = [
    {
      key: "Pending",
      label: "Placed",
      icon: ClipboardList,
      description: "Order registered",
    },
    {
      key: "Designing",
      label: "Design",
      icon: PenTool,
      description: "Keepsake templates",
    },
    {
      key: "Packing",
      label: "Boxing",
      icon: Box,
      description: "Giftwrapping hamper",
    },
    {
      key: "Shipped",
      label: "Dispatched",
      icon: Truck,
      description: "On transit to address",
    },
    {
      key: "Delivered",
      label: "Delivered",
      icon: CheckCircle2,
      description: "Hand-delivered safely",
    },
  ];

  const getStepIndex = (status: string) => {
    const list = ["Pending", "Designing", "Packing", "Shipped", "Delivered"];
    return list.indexOf(status);
  };

  const isCancelled = currentStatus === "Cancelled";
  const currentIndex = isCancelled ? 0 : getStepIndex(currentStatus);

  return (
    <div className="w-full space-y-8">
      {/* Cancelled Alert Banner */}
      {isCancelled && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 flex items-start gap-3 animate-pulse">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold block">Keepsake Order Cancelled</span>
            <span className="font-normal opacity-90 leading-relaxed block mt-0.5">
              This order has been officially cancelled by the system operators. Re-checkout or contact customer care.
            </span>
          </div>
        </div>
      )}

      {/* 1. Desktop Horizontal Stepper */}
      <div className={`hidden md:flex items-center justify-between w-full relative px-4 ${isCancelled ? "opacity-60" : ""}`}>
        {/* Connection Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0 mx-10" />
        {!isCancelled && (
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 mx-10 transition-all duration-500"
            style={{ width: `${(currentIndex / (progressiveSteps.length - 1)) * 82}%` }}
          />
        )}

        {progressiveSteps.map((step) => {
          const Icon = step.icon;
          const stepIndex = getStepIndex(step.key);
          const isCompleted = !isCancelled && stepIndex < currentIndex;
          const isActive = !isCancelled && step.key === currentStatus;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 w-1/5">
              {/* Node bubble */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition duration-300 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                    : isActive
                    ? "bg-background border-primary text-primary scale-110 shadow-lg shadow-primary/10"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check size={16} className="stroke-[3]" /> : <Icon size={16} />}
              </div>

              {/* Labels */}
              <div className="mt-3 text-center">
                <p
                  className={`text-xs font-bold transition duration-300 ${
                    isActive ? "text-primary text-sm" : "text-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5 max-w-[100px] mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Mobile Stepper */}
      <div className={`md:hidden flex flex-col space-y-6 pl-4 border-l-2 border-border/80 relative ${isCancelled ? "opacity-60" : ""}`}>
        {!isCancelled && (
          <div
            className="absolute top-0 left-0 w-0.5 bg-primary origin-top transition-all duration-500"
            style={{
              height: `${(currentIndex / (progressiveSteps.length - 1)) * 100}%`,
              marginLeft: "-1px",
            }}
          />
        )}

        {progressiveSteps.map((step) => {
          const Icon = step.icon;
          const stepIndex = getStepIndex(step.key);
          const isCompleted = !isCancelled && stepIndex < currentIndex;
          const isActive = !isCancelled && step.key === currentStatus;

          return (
            <div key={step.key} className="flex items-start gap-4 relative">
              <div
                className={`absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full border transition duration-300 z-10 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                    ? "bg-background border-primary text-primary scale-110"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
                style={{ marginLeft: "-2px" }}
              >
                {isCompleted ? <Check size={10} className="stroke-[3]" /> : <Icon size={10} />}
              </div>

              <div className="space-y-0.5 -mt-0.5">
                <p className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline activity log logs */}
      <div className="mt-10 rounded-2xl border border-border bg-card/30 p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Timeline Activity Logs
        </h4>
        <div className="space-y-4 pt-2">
          {trackingHistory
            .slice()
            .reverse()
            .map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start text-xs font-normal">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${item.status === 'Cancelled' ? 'bg-destructive' : 'bg-primary'}`} />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold ${item.status === 'Cancelled' ? 'text-destructive' : 'text-foreground'}`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed leading-normal">
                    {item.notes}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default StatusTracker;
