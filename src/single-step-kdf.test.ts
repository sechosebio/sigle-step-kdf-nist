import SingleStepKDF, { hexToBytes, bytesToHex } from "./single-step-kdf";
import crypto from "crypto";

describe("utils", () => {
  it("hexToBytes", () => {
    const hex = "3007de";
    const bytes = hexToBytes(hex);
    expect(bytes.toString()).toBe([48, 7, 222].toString());
  });

  it("bytesToHex/1", () => {
    const bytes = new Uint8Array([90, 189, 6]);
    const hex = bytesToHex(bytes);
    expect(hex).toEqual("5abd06");
  });

  it("hexToBytes with random hex", async () => {
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

describe("Single Step KDF", () => {
  it("returns error if outlength is 0 or less", () => {
    const sharedSecret = hexToBytes(
      "A88B995FECBDF756515ED42BA53A6CCCA4F5936F69CF4D15352C94C592B347B1"
    );
    const fixedInfo = hexToBytes(
      "0499A6F42E83EA4F150A78780FFB562C9CDB9B7507BC5D28CBFBF8CC3EF0AF68B36E60CB10DB69127830F7F899492017089E3B73C83FCF0EBDF2C06B613C3F88B7"
    );

    expect(() => {
      SingleStepKDF.derive(sharedSecret, 0, fixedInfo);
    }).toThrow("outLengthBytes must be greatear than 0");
  });

  it("returns a valid AES key", () => {
    const sharedSecret = hexToBytes(
      "A88B995FECBDF756515ED42BA53A6CCCA4F5936F69CF4D15352C94C592B347B1"
    );
    const fixedInfo = hexToBytes(
      "0D69642D6165733235362D47434D4170706C650499A6F42E83EA4F150A78780FFB562C9CDB9B7507BC5D28CBFBF8CC3EF0AF68B36E60CB10DB69127830F7F899492017089E3B73C83FCF0EBDF2C06B613C3F88B7"
    );

    const kdf = SingleStepKDF.derive(sharedSecret, 32, fixedInfo);
    const kdfHex = bytesToHex(kdf).toUpperCase();
    expect(kdfHex).toBe(
      "083080D3D0C521C02CD3AE2134363D09EA50DFF914677FAB9E22F18F9C28A3B9"
    );
  });
});
