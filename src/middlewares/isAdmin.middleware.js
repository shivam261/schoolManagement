import crypto from "crypto";

const generateRandomString = () => {
  return crypto.randomBytes(20).toString("hex");
};

const randomString = generateRandomString();
console.log(randomString);
