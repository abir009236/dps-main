"use client";
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const METHODS = [
  { key: "bkash", label: "Bkash Personal", type: "number" },
  { key: "rocket", label: "Rocket Personal", type: "number" },
  { key: "nagad", label: "Nagad Personal", type: "number" },
  { key: "uddoktapay", label: "Uddoktapay", type: "apiKey" },
];

export default function AddWallet() {
  const [config, setConfig] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [value, setValue] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const selectedMethod = useMemo(
    () => METHODS.find((m) => m.key === selected),
    [selected]
  );

  const load = useCallback(async () => {
    setConfigLoading(true);
    const res = await fetch("/api/admin/wallet", { cache: "no-store" });
    const data = await res.json();
    if (data?.success)
      setConfig((prev) => (prev === data.wallet ? prev : data.wallet));
    setConfigLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onOpenFor = useCallback(
    (key) => {
      const current = config?.[key] || {};
      setSelected(key);
      setEnabled(Boolean(current.enabled));
      setValue(current.number || current.apiKey || "");
      setIsEditing(true);
      setOpen(true);
    },
    [config]
  );

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      // Client validation
      const isNumberMethod = selectedMethod?.type === "number";
      if (!selected) return;
      if (isNumberMethod) {
        const elevenDigits = /^\d{11}$/;
        if (!elevenDigits.test(String(value || ""))) {
          toast.error("Invalid number");
          return;
        }
      } else {
        if (!value) {
          toast.error("API Key is required");
          return;
        }
      }
      const body = {
        method: selected,
        enabled: isEditing ? enabled : true,
        number: selectedMethod?.type === "number" ? value : undefined,
        apiKey: selectedMethod?.type === "apiKey" ? value : undefined,
      };
      const res = await fetch("/api/admin/wallet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Wallet updated successfully");
        setConfig(data.wallet);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedMethod, selected, enabled, value]);

  const onDelete = useCallback(async (key) => {
    const result = await Swal.fire({
      title: "Delete Wallet?",
      text: "This will clear the configuration for this method.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;
    const res = await fetch(`/api/admin/wallet?method=${key}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data?.success) {
      setConfig(data.wallet ?? null);
      await Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  }, []);

  return (
    <div className="mb-20 overflow-hidden ">
      <Card className="bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-primary mb-4 sm:mb-0">
            Add Your Wallet Info
          </CardTitle>
          <CardAction className="w-full sm:w-auto">
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                  setSelected("");
                  setValue("");
                  setEnabled(true);
                  setIsEditing(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsEditing(false);
                    setSelected("");
                    setValue("");
                    setEnabled(true);
                    setOpen(true);
                  }}
                >
                  <span className="text-sm sm:text-base">Add Wallet</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    {isEditing ? "Edit Wallet" : "Add Wallet"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selected} onValueChange={setSelected}>
                      <SelectTrigger size="sm" className="w-full bg-white">
                        <SelectValue placeholder="Select Wallet" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900">
                        {METHODS.map((m) => (
                          <SelectItem key={m.key} value={m.key}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selected ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        {selectedMethod?.type === "number"
                          ? `Enter ${
                              METHODS.find((m) => m.key === selected)?.label
                            } Number`
                          : "Enter Uddoktapay API Key"}
                      </label>
                      <Input
                        placeholder={
                          selectedMethod?.type === "number"
                            ? "01XXXXXXXXX"
                            : "API Key"
                        }
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ) : null}
                  {isEditing && selected ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={enabled ? "enabled" : "disabled"}
                        onValueChange={(v) => setEnabled(v === "enabled")}
                      >
                        <SelectTrigger size="sm" className="w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="cursor-pointer hover:bg-red-400 hover:text-white w-full sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-sm sm:text-base">Cancel</span>
                  </Button>
                  <Button
                    onClick={onSubmit}
                    disabled={!selected || loading}
                    className="cursor-pointer w-full sm:w-auto"
                    variant="primary"
                  >
                    <span className="text-sm sm:text-base">
                      {loading ? "Saving..." : "Submit"}
                    </span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {configLoading ? (
            <div className="space-y-4">
              {METHODS.map((m) => (
                <SkeletonCard key={m.key} label={m.label} />
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {METHODS.map((m) => (
                      <WalletRow
                        key={m.key}
                        method={m}
                        row={config?.[m.key]}
                        onOpenFor={onOpenFor}
                        onDelete={onDelete}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {METHODS.map((m) => (
                  <WalletCard
                    key={m.key}
                    method={m}
                    row={config?.[m.key]}
                    onOpenFor={onOpenFor}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const WalletRow = memo(function WalletRow({
  method,
  row,
  onOpenFor,
  onDelete,
}) {
  const display = method.type === "number" ? row?.number : row?.apiKey;
  return (
    <TableRow>
      <TableCell className="font-medium">{method.label}</TableCell>
      <TableCell className="truncate max-w-[320px]">{display || "-"}</TableCell>
      <TableCell>
        {row?.enabled ? (
          <span className="text-green-600 bg-green-200 px-2 py-1 rounded-full font-semibold">
            Enabled
          </span>
        ) : (
          <span className="text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold">
            Disabled
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer  hover:bg-blue-400 hover:text-white"
            onClick={() => onOpenFor(method.key)}
          >
            <Pencil className="size-4 " />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer  hover:bg-red-400 hover:text-white"
            onClick={() => onDelete(method.key)}
          >
            <Trash2 className="size-4 " />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

const WalletCard = memo(function WalletCard({
  method,
  row,
  onOpenFor,
  onDelete,
}) {
  const display = method.type === "number" ? row?.number : row?.apiKey;
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            {method.label}
          </h4>
          <p className="text-xs text-gray-600 mt-1 truncate">
            {display || "Not configured"}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row?.enabled
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {method.type === "number" ? "Phone Number" : "API Key"}
          </span>
          <span className="text-xs text-gray-500">
            {display ? "Configured" : "Not set"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-blue-400 hover:text-white"
            onClick={() => onOpenFor(method.key)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-red-400 hover:text-white"
            onClick={() => onDelete(method.key)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

const SkeletonCard = memo(function SkeletonCard({ label }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
});

const SkeletonRow = memo(function SkeletonRow({ label }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
});
