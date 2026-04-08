import { hashPassword, sanitizeNextPath, validateCredentials } from "@/lib/auth";

describe("auth helpers", () => {
  it("hashPassword should produce stable SHA-256 hashes", async () => {
    await expect(hashPassword("limbi-user1-2026")).resolves.toBe(
      "54794102c841128422ed01916433b3010a8bd437415393a0b22964fcd60ed77b"
    );
  });

  it("validateCredentials should accept predefined users", async () => {
    await expect(
      validateCredentials({
        username: "user1",
        password: "limbi-user1-2026"
      })
    ).resolves.toEqual({
      id: "user1",
      username: "user1"
    });
  });

  it("validateCredentials should reject wrong passwords", async () => {
    await expect(
      validateCredentials({
        username: "user2",
        password: "wrong-password"
      })
    ).resolves.toBeNull();
  });

  it("sanitizeNextPath should keep only safe internal routes", () => {
    expect(sanitizeNextPath("/sets/abc?mode=learn")).toBe("/sets/abc?mode=learn");
    expect(sanitizeNextPath("/login")).toBe("/");
    expect(sanitizeNextPath("//evil.example")).toBe("/");
    expect(sanitizeNextPath("https://evil.example")).toBe("/");
    expect(sanitizeNextPath(null)).toBe("/");
  });
});
