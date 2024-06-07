import { SendSmtpEmail } from "@getbrevo/brevo";
import { transactionEmailAPi } from "./sendinBlueConfig";

export const sendMail = async (
  receiverName: string,
  receiverEmail: string,
  subject: string,
  message: string
) => {
  try {
    console.log("API KEY HERE", process.env.BREVO_API_KEY);
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.to = [
      {
        email: receiverEmail,
        name: receiverName,
      },
    ];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = message;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_NAME || "",
      email: process.env.EMAIL_USER || "",
    };

    // send the email
    const emailData = await transactionEmailAPi?.sendTransacEmail(
      sendSmtpEmail
    );
    console.log("Email sent", emailData);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const sendMassMail = async (
  userList: { name: string; email: string }[],
  subject: string,
  message: string
) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.EMAIL_USER || "",
      name: process.env.EMAIL_NAME || "",
    };
    sendSmtpEmail.htmlContent = message;
    sendSmtpEmail.subject = subject;

    for (let user of userList) {
      sendSmtpEmail.to = [
        {
          email: user.email,
          name: user.name,
        },
      ];
    }
    const emailData = transactionEmailAPi?.sendTransacEmail(sendSmtpEmail);
    console.log("Mass mail sent!", emailData);
  } catch (err: any) {
    throw new Error(err);
  }
};
