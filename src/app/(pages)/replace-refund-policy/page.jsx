import React from "react";

export default function ReplaceRefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Refund & Balance Policy
        </h1>

        <section className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold">English</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              After an order is placed, the admin may refund the order when
              appropriate.
            </li>
            <li>
              When an order is refunded, the refund amount is added to the
              users account as Refund Balance.
            </li>
            <li>
              The user can reorder any product using this Refund Balance at
              checkout.
            </li>
            <li>
              Typical processing time for refunds is up to 1 business day.
            </li>
            <li>
              Refund Balance is non-withdrawable and can only be used to pay for
              orders on this website.
            </li>
            <li>
              If a payment dispute/chargeback is initiated externally, the
              corresponding Refund Balance may be adjusted.
            </li>
            <li>
              Orders paid fully with Refund Balance follow the same delivery,
              replacement and review policies as regular orders.
            </li>
            <li>
              Please ensure your account email and phone are accurate so we can
              notify you when a refund is completed.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">বাংলা</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              অর্ডার দেওয়ার পর প্রয়োজন অনুযায়ী অ্যাডমিন রিফান্ড দিতে পারেন।
            </li>
            <li>
              রিফান্ড হলে সেই পরিমাণ টাকা আপনার অ্যাকাউন্টে Refund Balance
              হিসেবে যোগ হয়।
            </li>
            <li>
              এই Refund Balance দিয়ে আপনি পরবর্তী সময়ে যে কোনো পণ্য পুনরায়
              অর্ডার করতে পারবেন।
            </li>
            <li>সাধারণত রিফান্ড সম্পন্ন হতে ১ (এক) কর্মদিবস সময় লাগে।</li>
            <li>
              Refund Balance উত্তোলন করা যাবে না; এটি শুধুমাত্র এই ওয়েবসাইটে
              অর্ডার পেমেন্টের জন্য ব্যবহারযোগ্য।
            </li>
            <li>
              বাহ্যিকভাবে পেমেন্ট বিরোধ/চার্জব্যাক উত্থাপন করা হলে সংশ্লিষ্ট
              Refund Balance সমন্বয় করা হতে পারে।
            </li>
            <li>
              Refund Balance দিয়ে প্রদত্ত অর্ডারেও ডেলিভারি, রিপ্লেসমেন্ট এবং
              রিভিউ নীতিমালা একইভাবে প্রযোজ্য।
            </li>
            <li>
              রিফান্ড সম্পন্ন হলে নোটিফিকেশন পেতে আপনার অ্যাকাউন্টের ইমেইল ও ফোন
              নম্বর আপডেট আছে কিনা নিশ্চিত করুন।
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
