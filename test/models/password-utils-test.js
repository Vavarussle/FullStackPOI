import { assert } from "chai";
import { hashPassword, comparePasswords, isHashedPassword } from "../../src/utils/password-utils.js";

suite("Password Utils tests", () => {
  test("hashPassword returns a hashed password", () => {
    const hashed = hashPassword("secret");

    assert.notEqual(hashed, "secret");
    assert.include(hashed, ":");
  });

  test("comparePasswords returns true for matching hashed password", () => {
    const hashed = hashPassword("secret");

    const result = comparePasswords("secret", hashed);

    assert.equal(result, true);
  });

  test("comparePasswords returns false for wrong hashed password", () => {
    const hashed = hashPassword("secret");

    const result = comparePasswords("wrongpassword", hashed);

    assert.equal(result, false);
  });

  test("comparePasswords supports old plain text password", () => {
    const result = comparePasswords("secret", "secret");
    assert.equal(result, true);
  });

  test("comparePasswords returns false for wrong old plain text password", () => {
    const result = comparePasswords("wrongpassword", "secret");
    assert.equal(result, false);
  });

  test("comparePasswords returns false for missing plain password", () => {
    const result = comparePasswords("", "secret");
    assert.equal(result, false);
  });

  test("comparePasswords returns false for missing stored password", () => {
    const result = comparePasswords("secret", "");
    assert.equal(result, false);
  });

  test("isHashedPassword returns false for empty password", () => {
    const result = isHashedPassword("");
    assert.equal(result, false);
  });

  test("isHashedPassword returns false for null password", () => {
    const result = isHashedPassword(null);
    assert.equal(result, false);
  });

  test("hashPassword returns hashed password unchanged", () => {
    const hashed = hashPassword("secret");
    const result = hashPassword(hashed);
    assert.equal(result, hashed);
  });

  test("comparePasswords returns false for invalid hashed format", () => {
    const result = comparePasswords("secret", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:not:valid");
    assert.equal(result, false);
  });

  test("isHashedPassword returns true for hashed password", () => {
    const hashed = hashPassword("secret");
    const result = isHashedPassword(hashed);
    assert.equal(result, true);
  });

  test("isHashedPassword returns false for plain password", () => {
    const result = isHashedPassword("secret");
    assert.equal(result, false);
  });

});