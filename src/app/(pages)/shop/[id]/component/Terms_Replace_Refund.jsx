import React, { useState } from "react";
import { Shield, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TermsReplaceRefund() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-400">
      {/* Terms & Conditions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-black text-lg">Terms & Conditions</h3>
        </div>
        <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              More details
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[800px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Terms & Conditions</DialogTitle>
              <DialogDescription className="text-lg">
                প্রতিটা প্রতিষ্ঠানেরই কিছু নিয়ম কানুন থাকে। আমরাও তার ঊর্ধ্বে
                নই। আমরা আমাদের সকল "Terms & Conditions" গ্রাহক এবং আমাদের মধ্যে
                সুসম্পর্ক বজায় রাখার স্বার্থে আগেই পড়ে নেয়ার অনুরোধ করছি।
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-sm overflow-y-auto flex-1 pr-2">
              <div>
                <h1 className="font-bold text-2xl text-center mb-2">
                  Terms & Conditions (Bangla-Shortened)
                </h1>
                <h3 className="font-semibold mb-2 text-lg">Product Delivery</h3>
                <p className="text-gray-600 text-lg">
                  আমাদের সকল প্রডাক্টের অর্ডার শুধু মাত্র ড্যাশবোর্ডে করা হয়।
                  ইমেইল, মেসেঞ্জার কিংবা হোয়াটসঅ্যাপ এর মাধ্যমে ডেলিভারি করা
                  সম্ভব নয়। অর্ডারের জন্য সাইন আপ বা সাইন ইন করা বাধ্যতামূলক।
                  সাইন আপ ছাড়া কোন কাস্টমারকে ডেলিভারি প্রদান সম্ভব নয়। আমাদের
                  ডেলিভারি সম্পন্ন হওয়ার পরে কাষ্টমারের মোবাইলে মেসেজের মাধ্যমে
                  জানিয়ে দেওয়া হয় তাই অর্ডারের সময় সঠিক ফরম্যাটের হোয়াটসঅ্যাপ
                  নাম্বার ব্যাবহারের জন্য অনুরোধ রইলো। ইমেইলের মাধ্যমে কোন ধরনের
                  সাপোর্ট প্রদান করা হবেনা। অবশ্যই আমাদেরকে হোয়াটসএপ কিংবা
                  ফেসবুক পেইজে মেসেজ দিয়ে সার্ভিস নিতে হবে। প্রোডাক্ট ডেলিভারি
                  সময়- সর্বনিম্ন ৫ মিনিট থেকে সর্বোচ্চ ৩ ঘন্টা পর্যন্ত লাগতে
                  পারে। বিশেষ কারণে সর্বোচ্চ ২৪ ঘণ্টা পর্যন্ত ডেলিভারির সময়
                  লাগতে পারে। সেই ক্ষেত্রে গ্রাহকের সাথে আলোচনা পূর্বক সময় নেওয়া
                  হবে অন্যথায় রিফান্ড করা হবে। আর্জেন্ট ডেলিভারি রিকোয়েস্ট রাখা
                  হয়না। এই ক্ষেত্রে প্রোডাক্ট অর্ডার করার পূর্বে ডেলিভারি সময়
                  সম্পর্কে জেনেই অর্ডার করবেন।
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-lg">Warranty Policy</h4>
                <p className="text-gray-600 text-lg">
                  পারচেজ করার পর ভবিষ্যতে যদি কোন প্রোডাক্টে সমস্যা হয়, তাহলে
                  আমরা আপনাকে ফুল ওয়ারেন্টি করবো ইনশাআল্লাহ, এক্ষেত্রে কিছু
                  প্রোডাক্ট ওয়ারেন্টি করার জন্য নির্দিষ্ট সময়সীমা আছে সেই সময়
                  সীমা পার হলে আমরা ওয়ারেন্টি করতে পারবো না, অথবা সময়সীমার মধ্যে
                  থেকেও যদি আমাদের ডেলিভারির সাথে দেয়া কোন রুলস ভঙ্গ করা হয়
                  যেমনঃ- পলিসি ভায়োলেশন ইত্যাদি সেক্ষেত্রেও আমাদের হওতে
                  ওয়ারেন্টি প্রদান করা হবেনা। গ্রাহকের ভুল কিংবা ডিভাইসজনিত
                  কারণে কোনো প্রকার সমস্যা হলে ওয়ারেন্টি প্রযোজ্য হবে না। <br />{" "}
                  আমাদের সার্ভিস টাইম (সকাল ১০ টা থেকে রাত ১ টা পর্যন্ত)।
                  প্রোডাক্ট ওয়ারেন্টি চলাকালীন সময়ে আপনাকে আমরা উক্ত সময়ে
                  সার্ভিস দিতে সাপোর্ট দিতে সচেষ্ঠ থাকবো।। তবে প্রতিকূল
                  পরিস্থিতিতে সময়ের বিলম্ব ঘটতে পারে, এই ক্ষেত্রে অবশ্যই সময়
                  দিয়ে সহযোগিতা করতে হবে। <br />
                  আমাদের প্রতিটি প্রোডাক্টের সাথে সম্পুর্ন সময়ের জন্য ওয়ারেন্টি
                  পাবেন। ওয়ারেন্টি আওতাভুক্ত যেকোনো প্রোডাক্ট নির্ধারিত রুলস
                  (প্রোডাক্ট কেনার আগে এবং পরে স্পষ্ট লেখা থাকে) মেনে চললে আমরা
                  আপনাকে বিক্রয় পরবর্তী সেবা দিতে বদ্ধ পরিকর। <br />
                  তাছাড়া ক্লায়েন্ট সার্ভিস নিয়ে কোনো প্রকার সমস্যা পোহালে কিংবা
                  বুঝতে অসুবিধে হলে "Teamviewer/Anydesk" এর মাধ্যমেও সাপোর্ট
                  দেওয়া হবে। ইমেইলের মাধ্যমে কোন ধরনের সাপোর্ট প্রদান করা হবেনা।{" "}
                  <br />
                  অবশ্যই আমাদেরকে হোয়াটসএপ কিংবা ফেসবুক পেইজে মেসেজ দিয়ে সার্ভিস
                  নিতে হবে। আমাদের কোনো বিক্রয় প্রতিনিধির সাথে কোনো ধরনের
                  অসধাচরণ গা*লি কিংবা আ*পত্তিকর ভাষা প্রয়োগ করলে সাবস্ক্রিপশন্স
                  বিডি কর্তৃপক্ষ সাথে সাথেই উক্ত গ্রাহকের সাবস্ক্রিপশন বাতিল
                  করবে এবং ডিজিটাল সিকিউরিটি এক্ট এর আইন অনুযায়ী ব্যাবস্থাও
                  গ্রহণ করতে পারে। এই ক্ষেত্রে গ্রাহক কোনো প্রকার সার্ভিস এবং
                  রিফান্ড পাবেন না। আমরা জানি একজন ক্লায়েন্ট তার গুরুত্বপূর্ণ
                  কাজের জন্যই সাবস্ক্রিপশন নিয়ে থাকেন। তাই আমরা সবসময় চেষ্টা
                  করি যেকোনো সমস্যায় ক্লায়েন্টকে যত দ্রুত সম্ভব সাপোর্ট নিশ্চিত
                  করা যায়। যেহুতু এটি অনলাইন সাবস্ক্রিপশন তাই প্রতিকূল
                  পরিস্থিতিতে সাপোর্টে কিছুটা বিলম্ব ঘটতে পারে। এই ক্ষেত্রে আমরা
                  সর্বনিম্ব ১০ মিনিট থেকে সর্বোচ্চ ২৪ ঘন্টা পর্যন্ত সময় নিয়ে
                  থাকি। তাই ক্লায়েন্টকে অবশ্যই সেই সময় এবং ধৈর্য ধরার মানসিকতা
                  নিয়েই প্রোডাক্টস অর্ডার করতে হবে।
                </p>
              </div>
              <h1 className="font-bold text-2xl text-center my-5">
                Terms & Conditions (English-Shortened)
              </h1>
              <div>
                <h3 className="font-semibold mb-2 text-lg">Product Delivery</h3>
                <ul className="list-decimal list-inside text-lg">
                  <li>
                    All product orders can only be placed through the dashboard.
                    Delivery via email, Messenger, or WhatsApp is not possible.
                  </li>
                  <li>
                    Signing up or signing in is mandatory for placing an order.
                    Delivery cannot be provided to customers without signing up.
                  </li>
                  <li>
                    Once the delivery is completed, customers are notified via
                    SMS. Therefore, please ensure that a correctly formatted
                    WhatsApp number is used when placing an order.
                  </li>
                  <li>
                    No support will be provided via email. You must message us
                    on WhatsApp or our Facebook page to receive the service.
                  </li>
                  <li>
                    The delivery time for products can range from a minimum of 5
                    minutes to a maximum of 3 hours. In special cases, delivery
                    may take up to 24 hours. In such cases, the time will be
                    negotiated with the customer, otherwise, a refund will be
                    provided.
                  </li>
                  <li>
                    Urgent delivery requests are not accommodated. Please make
                    sure to understand the delivery time before placing an
                    order. Warranty Policy
                  </li>
                  <li>
                    {" "}
                    If any issues arise with a product after purchase, we will
                    provide a full warranty, InshaAllah. However, some products
                    have a specific time limit for warranty. If this time limit
                    is exceeded, we will not be able to provide a warranty.
                    Additionally, if any rules provided at the time of delivery
                    are violated, such as policy violations, no warranty will be
                    provided.
                  </li>
                  <li>
                    {" "}
                    No warranty will be applicable in cases of issues caused by
                    customer error or device-related problems.
                  </li>
                  <li>
                    Our service hours are from 10 AM to 1 AM. During the
                    warranty period, we will strive to provide support within
                    this time.
                  </li>
                  <li>
                    {" "}
                    You will receive a full-time warranty with each of our
                    products.
                  </li>
                  <li>
                    For any product covered under warranty, we are committed to
                    providing after-sales service as long as the specified rules
                    (clearly mentioned before and after purchasing the product)
                    are followed. Additionally, if any issues arise with the
                    client service or if there is any difficulty in
                    understanding, support will be provided through
                    “Teamviewer/Anydesk.”
                  </li>
                  <li>
                    No support will be provided via email. You must message us
                    on WhatsApp or our Facebook page to receive the service.
                  </li>
                  <li>
                    If any inappropriate behavior, such as abusive language, is
                    directed towards any of our sales representatives,
                    Subscriptions BD will immediately cancel the customers
                    subscription and may take legal action under the Digital
                    Security Act. In such cases, the customer will not receive
                    any service or refund.
                  </li>
                  <li>
                    We understand that a client subscribes to our service for
                    important work. Therefore, we always try to provide support
                    as quickly as possible for any issues. Since this is an
                    online subscription, delays in support may occur in adverse
                    situations. In such cases, we take a minimum of 10 minutes
                    to a maximum of 24 hours. Therefore, clients must order
                    products with the understanding and patience required for
                    this timeframe.
                  </li>
                </ul>
                <h1 className="font-bold text-xl text-center my-5">
                  For More Info{" "}
                  <a
                    href="/terms-and-condition"
                    className="text-blue-600 hover:underline"
                  >
                    Click Here
                  </a>
                </h1>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Replacement And Refund Policy */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-black text-lg">
            Replacement and Refund Policy
          </h3>
        </div>
        <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              More details
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[800px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Replacement And Refund Policy</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-sm overflow-y-auto flex-1 pr-2">
              <div>
                <h4 className="font-semibold mb-2 text-lg">
                  Return, Refund and Exchange Policy (Bangla-Shortened)
                </h4>
                <p className="text-gray-600 text-lg">
                  প্রতিটা প্রোডাক্টের নির্ধারিত রুলস প্রোডাক্ট কেনার আগেই জেনে
                  বুঝে অর্ডার করার অনুরোধ রইলো। প্রোডাক্ট কেনার পর প্রোডাক্টে
                  উল্লিখিত রুলসের বাইরে কোনো প্রকার মন্তব্য গ্রহযোগ্য হবে না।
                  সফলভাবে অর্ডার হবার পর কোন রিফান্ড প্রযোজ্য হবেনা তবে
                  অর্ডারকৃত প্রোডাক্টটি কনফার্ম না হওয়া পর্যন্ত প্রোডাক্ট
                  পরিবর্তন করে নেওয়া যাবে। <br /> অর্ডারকৃত ফিজিক্যাল প্রোডাক্ট
                  যদি ড্যামেজ অবস্থায় থাকে তবে রিটার্ন প্রযোজ্য হবে, অবশ্যই
                  আনবক্সিং ভিডিও থাকতে হবে। প্রোডাক্ট যদি স্টকে না থাকে
                  সেক্ষেত্রে রিফান্ড প্রযোজ্য হবে অন্যথায় এক্সচেঞ্জ করে দেওয়া
                  হবে।
                  <br /> বিকাশ, নগদ, রকেট সেন্ড মানি ও বিকাশ মার্চেন্ট গেটওয়ের
                  মাধ্যমে রিফান্ডের ক্ষেত্রে ১ কার্যদিবস সময় প্রযোজ্য হবে।{" "}
                  <br />
                  ক্রেতা যদি রিফান্ডের জন্য বিবেচিত হয়, সেক্ষেত্রে অর্ডার করার
                  সময় হতে ২৪ ঘণ্টার মধ্যে রিফান্ডের জন্য আবেদন করতে হবে।
                  অর্ডারকৃত প্রোডাক্টটি যদি উল্লিখিত বিবরণের সাথে সামাঞ্জস্যতা
                  না থাকে এবং নির্ধারিত সময়ের মধ্যে ডেলিভারি করতে ব্যর্থ হয়,
                  সেক্ষেত্রে রিফান্ড প্রযোজ্য হবে।
                  <br /> পারচেজ করার পর ভবিষ্যতে যদি কোন প্রোডাক্টে সমস্যা হয়,
                  তাহলে আমরা আপনাকে ফুল ওয়ারেন্টি করবো ইনশাআল্লাহ, এক্ষেত্রে
                  কিছু প্রোডাক্ট ওয়ারেন্টি করার জন্য নির্দিষ্ট সময়সীমা আছে সেই
                  সময় সীমা পার হলে আমরা ওয়ারেন্টি করতে পারবো না, অথবা সময়সীমার
                  মধ্যে থেকেও যদি আমাদের ডেলিভারির সাথে দেয়া কোন রুলস ভঙ্গ করা
                  হয় যেমনঃ- পলিসি ভায়োলেশন ইত্যাদি সেক্ষেত্রেও ওয়ারেন্টি প্রদান
                  করা হবেনা।
                  <br /> অনেক সময় পণ্য ডিলার কর্তৃক আনএভেইলেবল হয়ে যায় সে সময়ে
                  কাষ্টমারের সাথে আলোচনা করে পরবর্তী সিদ্ধান্ত নেওয়া হবে।
                  অর্ডারকৃত প্রোডাক্টটি ডেলিভারি করতে ব্যার্থ হলে ক্রেতাকে উক্ত
                  মূল্য রিফান্ড করে দেওয়া হবে।
                  <br />
                  রিফান্ডের ক্ষেত্রে MFS কর্তৃক ফি / চার্জ আমাদের সমস্যার কারণে
                  রিফান্ড করা হলে আমরা বহন করবো অন্যথায় ক্রেতাকে বহন করতে হবে।
                  গ্রাহকের ভুল কিংবা ডিভাইসজনিত কারণে কোনো প্রকার সমস্যা হলে
                  ওয়ারেন্টি প্রযোজ্য হবে না।
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-lg">
                  Return, Refund and Exchange Policy (English-Shortened)
                </h4>
                <ul className="text-gray-600 text-lg">
                  <li>
                    1. We request that you thoroughly understand the specific
                    rules for each product before placing an order. Once the
                    product is purchased, any comments beyond the specified
                    rules mentioned for the product will not be accepted.
                  </li>
                  <li>
                    2. After successfully placing an order, no refunds will be
                    applicable. However, you can exchange the ordered product
                    until it is confirmed.
                  </li>
                  <li>
                    {" "}
                    3. If the ordered physical product is received in a damaged
                    condition, a return will be applicable, provided that you
                    have an unboxing video. If the product is out of stock, a
                    refund will be issued; otherwise, it will be exchanged.
                  </li>
                  <li>
                    4. Refunds through bKash, Nagad, Rocket Send Money, and
                    bKash Merchant Gateway will require 1 business day.
                  </li>
                  <li>
                    5. Refunds through the SSLcommerz Gateway will take 7 to 10
                    business days.
                  </li>
                  <li>
                    6. If the customer is eligible for a refund, they must apply
                    for the refund within 24 hours of placing the order.
                  </li>
                  <li>
                    {" "}
                    7. If the delivered product does not match the specified
                    description or fails to be delivered within the stipulated
                    time, a refund will be applicable.
                  </li>
                  <li>
                    8. If any issues arise with a product after purchase, we
                    will provide a full warranty, InshaAllah. However, some
                    products have a specific time limit for warranty. If this
                    time limit is exceeded, we will not be able to provide a
                    warranty. Additionally, if any rules provided at the time of
                    delivery are violated, such as policy violations, no
                    warranty will be provided even within the time limit.
                  </li>
                  <li>
                    9. Sometimes, products become unavailable due to dealer
                    issues. In such cases, further decisions will be made in
                    consultation with the customer.
                  </li>
                  <li>
                    10. If we fail to deliver the ordered product, the customer
                    will be refunded the amount paid.
                  </li>
                  <li>
                    11. In the case of a refund, if the refund is issued due to
                    an issue on our part, we will bear the MFS fee/charge.
                    Otherwise, the customer will have to bear the cost.
                  </li>
                  <li>
                    12. No warranty will be applicable in cases of issues caused
                    by customer error or device-related problems.
                  </li>
                </ul>
              </div>
              <h1 className="font-bold text-xl text-center my-5">
                For More Info{" "}
                <a
                  href="/replace-refund-policy"
                  className="text-blue-600 hover:underline"
                >
                  Click Here
                </a>
              </h1>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
