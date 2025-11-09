"use client";
import React from "react";
import TitlePage from "../TitlePage/TitlePage";
import Loading from "../Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

export default function Question() {
  const {
    data: faqs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      return data?.faqs;
    },
  });
  if (isLoading) return <Loading />;
  return (
    <div className="w-full">
      {faqs?.length > 0 ? (
        faqs?.map((faq) => (
          <div key={faq._id}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value={`item-${faq._id}`}
                className="bg-blue-50  border-2 border-blue-100 px-3 rounded-md mb-4"
              >
                <AccordionTrigger className="text-lg font-semibold ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg text-gray-500 font-semibold">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))
      ) : (
        <div className="text-center text-2xl font-bold">No FAQs found</div>
      )}
    </div>
  );
}
