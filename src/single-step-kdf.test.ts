import SingleStepKDF from "./single-step-kdf";
import { hexToBytes, bytesToHex } from "./utils";

describe("Single Step KDF sha256", () => {
  it("returns error if outlength is 0 or less", () => {
    const sharedSecret = hexToBytes(
      "A88B995FECBDF756515ED42BA53A6CCCA4F5936F69CF4D15352C94C592B347B1"
    );
    const fixedInfo = hexToBytes(
      "0499A6F42E83EA4F150A78780FFB562C9CDB9B7507BC5D28CBFBF8CC3EF0AF68B36E60CB10DB69127830F7F899492017089E3B73C83FCF0EBDF2C06B613C3F88B7"
    );

    expect(() => {
      SingleStepKDF.derive("sha256", sharedSecret, 0, fixedInfo);
    }).toThrow("outLengthBytes must be greatear than 0");
  });

  it("returns a valid AES key", () => {
    const sharedSecret = hexToBytes(
      "A88B995FECBDF756515ED42BA53A6CCCA4F5936F69CF4D15352C94C592B347B1"
    );
    const fixedInfo = hexToBytes(
      "0D69642D6165733235362D47434D4170706C650499A6F42E83EA4F150A78780FFB562C9CDB9B7507BC5D28CBFBF8CC3EF0AF68B36E60CB10DB69127830F7F899492017089E3B73C83FCF0EBDF2C06B613C3F88B7"
    );

    const kdf = SingleStepKDF.derive("sha256", sharedSecret, 32, fixedInfo);
    const kdfHex = bytesToHex(kdf).toUpperCase();
    expect(kdfHex).toBe(
      "083080D3D0C521C02CD3AE2134363D09EA50DFF914677FAB9E22F18F9C28A3B9"
    );
  });
});
