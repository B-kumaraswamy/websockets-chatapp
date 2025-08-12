// import { mailtrapClient, sender } from "./mailtrap.config.js";
import { sendEmail } from "./mailtrap.config.js";
import sgMail from "@sendgrid/mail";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

// export const sendVerificationEmail = async (email, verificationToken) => {
//   const recipient = [{ email }];

//   try {
//     const response = await mailtrapClient.send({
//       from: sender,
//       to: recipient,
//       subject: "Verify your email",
//       html: VERIFICATION_EMAIL_TEMPLATE.replace(
//         "{verificationCode}",
//         verificationToken
//       ),
//       category: "Email Verification",
//     });

//     console.log("Email sent successfully", response);
//   } catch (error) {
//     console.log("Error in sending verification email", error);
//   }
// };

export const sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );
  try {
    const response = await sendEmail({
      to: email,
      subject: "Verify your email",
      html,
    });

    console.log("Verification Email sent successfully", response);
  } catch (error) {
    console.log("Error in sending verification email", error);
  }
};

export const sendWelcomeMail = async (email, fullName) => {
  const recipient = [{ email }];
  try {
    const response = await sgMail.send({
      from: {
        email: "kumaraswamy491@gmail.com",
        name: "Kumaraswamy",
      },
      to: recipient,
      templateId: "d-b17ee2a79f974773a25b12681b5b05f7",
      dynamic_template_data: {
        name: fullName,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log("Error in sending welcome email", error);
  }
};

// export const sendResetPasswordEmail = async (email, resetUrl) => {
//   const recipient = [{ email }];
//   try {
//     const response = await mailtrapClient.send({
//       from: sender,
//       to: recipient,
//       subject: "Reset your password",
//       html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
//       category: "Password Reset",
//     });

//     console.log("Reset password email sent successfully", response);
//   } catch (error) {
//     console.log("Error in sending reset password email", error);
//   }
// };
export const sendResetPasswordEmail = async (email, resetUrl) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl);
  try {
    const response = await sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });

    console.log("Reset password email sent successfully", response);
  } catch (error) {
    console.log("Error in sending reset password email", error);
  }
};

// export const sendPasswordResetSuccessEmail = async (email) => {

//     const recipient = [{ email }];
//     try {
//       const response = await mailtrapClient.send({
//         from: sender,
//         to: recipient,
//         subject: "Password Reset Successfully",
//         html: PASSWORD_RESET_SUCCESS_TEMPLATE,
//         category: "Password Reset",
//       });

//       console.log("Password reset email sent successfully", response);
//     } catch (error) {
//       console.log("Error in sending password reset email", error);
//     }
// }
export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Error in sending password reset email", error);
  }
};
