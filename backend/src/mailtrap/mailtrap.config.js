// import { MailtrapClient } from "mailtrap";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
// const TOKEN = process.env.MAILTRAP_TOKEN;

const sgToken = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sgToken);

// export const mailtrapClient = new MailtrapClient({
//   token: TOKEN,
// });

// export const sender = {
//   email: "hello@demomailtrap.co",
//   name: "Kumaraswamy",
// };


// sendEmail.js
export const sendEmail = async ({ to, subject, html, templateId, dynamicTemplateData }) => {
  const msg = {
    to,
    from: {
      email: "kumaraswamy491@gmail.com",
      name: "Kumaraswamy",
    }, // Must be verified in SendGrid
  };

  if (templateId) {
    msg.templateId = templateId;
    msg.dynamic_template_data = dynamicTemplateData;
  } else {
    msg.subject = subject;
    msg.html = html;
  }

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent successfully", response);
    return response;
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    throw error;
  }
};


