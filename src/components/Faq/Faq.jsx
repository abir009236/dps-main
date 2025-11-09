"use client";
import React from "react";
import TitlePage from "../TitlePage/TitlePage";
import Question from "./Question";
import FaqImage from "./FaqImage";

export default function Faq() {
  return (
    <div className="my-20">
      <TitlePage
        title="Find Answers to Your Questions"
        description="Welcome to FAQ section"
        buttonText="FAQS"
      />

      <div className="flex flex-col-reverse justify-center items-center md:flex-row gap-7">
        <Question />
        <FaqImage />
      </div>
    </div>
  );
}
