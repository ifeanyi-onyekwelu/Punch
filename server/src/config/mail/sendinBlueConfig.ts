import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

export let transactionEmailAPi: TransactionalEmailsApi | null = null;

const sendinBlueConfig = () => {
  const key = TransactionalEmailsApiApiKeys.apiKey;
  const value = process.env.BREVO_API_KEY || "";
  transactionEmailAPi = new TransactionalEmailsApi();
  transactionEmailAPi.setApiKey(key, value);
};

export default sendinBlueConfig;
