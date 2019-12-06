import crypto from "crypto";
import { hexToBytes, bytesToHex } from "./utils";

describe("hexToBytes", () => {
  it("hexToBytes", () => {
    const hex = "3007de";
    const bytes = hexToBytes(hex);
    expect(bytes.toString()).toBe([48, 7, 222].toString());
  });

  it("converts a random hex to bytes", async () => {
    const randomHex = await new Promise<string>((resolve, reject) => {
      crypto.randomBytes(16, (err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString("hex"));
      });
    });

    const bytes = hexToBytes(randomHex);
    expect(bytesToHex(bytes)).toBe(randomHex);
  });
});

describe("bytesToHex", () => {
  it("converts bytes to hex", () => {
    const bytes = new Uint8Array([90, 189, 6]);
    const hex = bytesToHex(bytes);
    expect(hex).toEqual("5abd06");
  });
});
