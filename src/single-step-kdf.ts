import crypto from "crypto";
import { Hash } from "./types";
import { hexToBytes } from "./utils";

class IllegalArgumentException extends Error {
  public constructor(msg: string) {
    super(msg);
  }
}

/**
 * Get expected hash length.
 *
 * @func
 * @alias hkdf.getHashLength
 * @param {string} hash - Hash algorithm
 * @returns {number} hash digest byte length
 *
 * @note Values are hardcoded with fallback for unknown algorithms.
 */
const getHashLength = (hash: string): number => {
  switch (hash) {
    case "sha256":
      return 32;
    case "sha512":
      return 64;
    case "sha224":
      return 28;
    case "sha384":
      return 48;
    case "sha3-256":
      return 32;
    case "sha3-512":
      return 64;
    case "sha3-224":
      return 28;
    case "sha3-384":
      return 48;
    case "blake2s256":
      return 32;
    case "blake2b512":
      return 64;
    case "sha1":
      return 20;
    case "md5":
      return 16;
    default: {
      return crypto.createHash(hash).digest().length;
    }
  }
};

const intTo4Bytes = (counter: number): Uint8Array => {
  return hexToBytes(counter.toString().padStart(7, "0"));
};

const checkOutLength = (outLengthBytes: number): void => {
  if (outLengthBytes <= 0) {
    throw new IllegalArgumentException(
      "outLengthBytes must be greatear than 0"
    );
  }
};

/**
 * KDM - a one step key derivation function as described in NIST SP 800-56C REV 1 Chapter 4.1.
 *
 * Derives a key with the given parameters. At the moment, just derivation using SHA-256 is available.
 *
 * @param hash           The hash to use.
 * @param sharedSecretZ  Known as `Z` in the spec: a byte string that represents the shared secret
 * @param outLengthBytes Knnown as `L` in the spec: positive integer that indicates the lenght (in bytes) of the secret
 *                       keying material to be derived; how long the output will be.
 * @param fixedInfo      A bit string of context-specific data that is appropiate for the relying key-establishment scheme.
 *                       FixedInfo may, for example, include appropriately formatted representations of the values of salt and/or L.
 *                       The inclusion of additional copies of the values of salt and L in FixedInfo would ensure that
 *                       each block of derived keying material is affected by all of the information
 *                       conveyed in OtherInput. See [SP 800-56A] and [SP 800-56B] for more detailed
 *                       recommendations concerning the format and content of FixedInfo.
 * @returns The derived keying material.
 * @throws IllegalArgumentException if `outLengthBytes` is 0 bytes.
 */
export const singleStepKDF = (
  hash: Hash,
  sharedSecretZ: Uint8Array,
  outLengthBytes: number,
  fixedInfo: Uint8Array
): Uint8Array => {
  checkOutLength(outLengthBytes);

  // sha256 is 32 byte long block
  const digestByteLength = getHashLength("sha256");

  const buffer = Buffer.alloc(outLengthBytes);

  const reps = Math.ceil(outLengthBytes / digestByteLength);
  /*
     1. If L > 0, then set reps = [L / H_outputBits]
        otherwise, output an error indicator and exit
        this process without performing the remaining
        actions (i.e., omitting steps 2 through 8).
     2. If reps > (2^32 −1), then output an error indicator
        and exit this process without performing the remaining
        actions (i.e., omitting steps 3 through 8).
     3. Initialize a big-endian 4-byte unsigned integer
        counter as 0x00000000, corresponding to a 32-bit
        binary representation of the number zero.
     4. If counter || Z || FixedInfo is more tha
        max_H_inputBits bits long, then output an
        error indicator and exit this process without
        performing any of the remaining actions (i.e.,
        omitting steps 5 through 8).
     5. Initialize Result(0) as an empty bit string
        (i.e., the null string).
     6. For i = 1 to reps, do the following:
        6.1 Increment counter by 1.
        6.2 Compute K(i) = H(counter || Z || FixedInfo).
        6.3 Set Result(i) = Result(i – 1) ||K(i).
     7. Set DerivedKeyingMaterial equal to the leftmost L
        bits of Result(reps).
     8. Output DerivedKeyingMaterial.
     */
  let counter = 1;
  let outputLenSum = 0;

  do {
    crypto
      .createHash(hash)
      .update(intTo4Bytes(counter))
      .update(sharedSecretZ)
      .update(fixedInfo)
      .digest()
      .copy(
        buffer,
        0,
        0,
        reps === counter ? outLengthBytes - outputLenSum : digestByteLength
      );

    outputLenSum += digestByteLength;
  } while (counter++ < reps);
  return new Uint8Array(buffer.toJSON().data);
};
