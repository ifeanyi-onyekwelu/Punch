import crypto from "crypto";

const generateReferralLink = () => {
  const client_host = process.env.CLIENT_DOMAIN;
  return `${client_host}/user/register?ref=${crypto
    .randomBytes(16)
    .toString("hex")
    .slice(-30)}`;
};

const generateReferralCode = () => {
  const randomBytes = crypto.randomBytes(64).toString("hex");
  return `REF${randomBytes.slice(-6).toUpperCase()}`;
};

const generateToken = () => {
  return `${crypto.randomBytes(64).toString("hex").slice(-6)}`;
};

export default {
  generateReferralCode,
  generateReferralLink,
  generateToken,
};
