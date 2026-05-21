import crypto from "crypto";

export function isHashedPassword(password) {
  if (!password) {
    return false;
  }

  return password.indexOf(":") !== -1;
}

export function hashPassword(password) {
  if (isHashedPassword(password)) {
    return password;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  return `${salt}:${hashedPassword}`;
}

export function comparePasswords(plainPassword, storedPassword) {
  if (!plainPassword || !storedPassword) {
    return false;
  }

  if (!isHashedPassword(storedPassword)) {
    return plainPassword === storedPassword;
  }

  const parts = storedPassword.split(":");
  if (parts.length !== 2) {
    return false;
  }

  const salt = parts[0];
  const originalHash = parts[1];
  const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512").toString("hex");

  return hashedPassword === originalHash;
}