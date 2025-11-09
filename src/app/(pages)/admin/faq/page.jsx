"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AdminFAQ() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const {
    data: faqs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin_faqs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      return data?.faqs;
    },
    enabled: !!session,
  });

  if (isLoading) {
    return <Loading />;
  }

  const handleAddFaq = async () => {
    if (formData.question.trim() === "" || formData.answer.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const newFaq = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFaq),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data?.message);
        refetch();
        setFormData({ question: "", answer: "" });
        setIsAddDialogOpen(false);
      } else {
        const data = await res.json();
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Failed to add FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaq = async () => {
    if (formData.question.trim() === "" || formData.answer.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }
    const updatedFaq = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
    };
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/faq?id=${editingFaq._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFaq),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data?.message);
        refetch();
        setFormData({ question: "", answer: "" });
        setEditingFaq(null);
        setIsEditDialogOpen(false);
      } else {
        const data = await res.json();
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Failed to update FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (_id) => {
    Swal.fire({
      title: "Are you sure to delete?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00BEFA",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/faq?id=${_id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            const data = await res.json();
            toast.success(data?.message);
            refetch();
          } else {
            const data = await res.json();
            toast.error(data?.message);
          }
        } catch (error) {
          toast.error("Failed to delete FAQ");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const openEditDialog = (faq) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ question: "", answer: "" });
    setEditingFaq(null);
  };

  return (
    <div className="mb-20 overflow-hidden ">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                Frequently Asked Questions
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                Manage your FAQ content and help customers find answers quickly
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="primary"
                  onClick={() => resetForm()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Add FAQ</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl font-semibold text-primary text-center">
                    Add New FAQ
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="question"
                      className="text-sm font-medium text-gray-800 "
                    >
                      Question
                    </Label>
                    <Input
                      id="question"
                      placeholder="Enter the question..."
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="answer"
                      className="text-sm font-medium text-gray-800 "
                    >
                      Answer
                    </Label>
                    <Textarea
                      id="answer"
                      placeholder="Enter the answer..."
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border cursor-pointer border- hover:bg-transparent hover:text-primary w-full sm:w-auto"
                  >
                    <span className="text-sm sm:text-base">Cancel</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddFaq}
                    className="w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span className="text-sm sm:text-base">
                      {loading ? "Adding..." : "Add FAQ"}
                    </span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="">
          {faqs?.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 text-lg sm:text-xl">
                No FAQs found. Add your first FAQ to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-gray-200">
                      <TableHead className="font-semibold text-gray-900">
                        SL
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Question
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Answer
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs?.map((faq, index) => (
                      <TableRow
                        key={faq._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="font-medium text-gray-900">
                            {faq.question.slice(0, 50)} ...
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-gray-700 text-sm line-clamp-2">
                            {faq.answer.slice(0, 80)} ...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(faq)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFaq(faq._id)}
                              className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {faqs?.map((faq, index) => (
                  <FaqCard
                    key={faq._id}
                    faq={faq}
                    index={index}
                    onEdit={() => openEditDialog(faq)}
                    onDelete={() => handleDeleteFaq(faq._id)}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Edit FAQ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-question"
                className="text-sm font-medium text-gray-700 "
              >
                Question
              </Label>
              <Input
                id="edit-question"
                placeholder="Enter the question..."
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-answer"
                className="text-sm font-medium text-gray-700 "
              >
                Answer
              </Label>
              <Textarea
                id="edit-answer"
                placeholder="Enter the answer..."
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer w-full sm:w-auto"
            >
              <span className="text-sm sm:text-base">Cancel</span>
            </Button>
            <Button
              onClick={() => handleEditFaq()}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">
                {loading ? "Updating..." : "Update FAQ"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// FaqCard component for mobile view
const FaqCard = ({ faq, index, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            #{index + 1} • FAQ
          </h4>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Question:</span>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {faq.question}
          </p>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Answer:</span>
          <p className="text-xs text-gray-600 mt-1 line-clamp-3">
            {faq.answer}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 text-blue-600 hover:text-blue-700"
        >
          <Edit className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Delete</span>
        </Button>
      </div>
    </div>
  );
};
