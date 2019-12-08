[![npm](https://img.shields.io/npm/v/single-step-kdf-nist)](https://www.npmjs.com/package/single-step-kdf-nist)
[![Build Status](https://travis-ci.org/sechosebio/single-step-kdf-nist.svg?branch=master)](https://travis-ci.org/sechosebio/single-step-kdf-nist)
[![Maintainability](https://api.codeclimate.com/v1/badges/1ab74c42039ea1c279f8/maintainability)](https://codeclimate.com/github/sechosebio/single-step-kdf-nist/maintainability)

# Single Step KDF (NIST SP 800-56C)

Single-Step Key Derivation function following [NIST SP 800-56C revision 1, chapter 4](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-56Cr1.pdf) in TypeScript/JavaScript fully compatible with NodeJS.

## Quick start

Add dependency to your proyect:

- Yarn:

`yarn add single-step-kdf-nist`

- npm:

`npm i single-step-kdf-nist`

Simple example:

```

import { singleStepKDF, hexToBytes, bytesToHex } from "single-step-kdf";

const hexSingleStepKDF = () => {
  const sharedSecretString = "test";
  const sharedSecret: Uint8Array = hexToBytes(sharedSecretString);
  const fixedInfo = JSON.stringify({ info: "some info" });

  const kdf = singleStepKDF(
    "sha256",
    sharedSecret,
    32,
    hexToBytes(fixedInfo)
  );

  return bytesToHex(kdf).toUpperCase();
};

```

# Build

Use yarn to build the project.

`yarn build`

# Test

`yarn test`

# TODO

Implement different H-Functions:

- [x] Message digest.
- [ ] HMAC.
- [ ] KMAC.

Others:

- [ ] Improve README.

# License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
