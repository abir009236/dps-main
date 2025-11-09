import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongoose";
import Setting from "@/models/Setting";

export async function POST(request) {
  try {
    await connectDB();

    const { firstName, lastName, email, phone, message } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Get email settings from database
    const settings = await Setting.findOne();
    if (!settings) {
      return NextResponse.json(
        { error: "Email configuration not found" },
        { status: 500 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.emailUser,
        pass: settings.emailPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: settings.emailUser,
      to: settings.email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #00befa; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone/WhatsApp:</strong> ${phone || "Not provided"}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #00befa; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #333;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This message was sent from the contact form on your website.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
