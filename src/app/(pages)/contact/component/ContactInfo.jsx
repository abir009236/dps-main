
"use client";
import { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

export default function ContactInfo() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetch("/api/admin/website-settings");
      const data = await res.json();
      setSettings(data || {});
    };
    loadSettings();
  }, []);
  return (
    <div className="xl:w-[30%] w-full flex flex-col gap-6">
      {/* Address */}
      <div className="flex items-center cursor-pointer bg-white hover:bg-primary hover:text-white transition-all duration-300 rounded-xl shadow-md p-6 gap-7">
        <div className="bg-primary text-white  rounded-full p-4 flex items-center justify-center">
          <MdLocationOn className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-bold text-2xl hover:text-white mb-1">Address</h2>
          <p className="text-base hover:text-white">
            {settings?.address || ""}
          </p>
        </div>
      </div>
      {/* Email */}
      <div className="flex items-center cursor-pointer bg-white hover:bg-primary hover:text-white transition-all duration-300 rounded-xl shadow-md p-6 gap-7">
        <div className="bg-primary text-white  rounded-full p-4 flex items-center justify-center">
          <MdEmail className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-bold text-2xl hover:text-white mb-1">
            Email Address
          </h2>
          <p className="text-base hover:text-white">
            {settings?.email || ""}
          </p>
        </div>
      </div>
      {/* Phone */}
      <div className="flex items-center cursor-pointer bg-white hover:bg-primary hover:text-white transition-all duration-300 rounded-xl shadow-md p-6 gap-7">
        <div className="bg-primary text-white  rounded-full p-4 flex items-center justify-center">
          <MdPhone className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-bold text-2xl hover:text-white mb-1">
            Phone Number
          </h2>
          <p className="text-base hover:text-white">
            {settings?.phoneNumber || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
