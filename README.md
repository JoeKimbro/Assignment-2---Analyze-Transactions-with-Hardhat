<<<<<<< HEAD
# Assignment-2---Analyze-Transactions-with-Hardhat

Deliverables (report.md)
Part A — Deployment
• Contract address, symbol, decimals, initial supply (human & raw).
<img width="1371" height="858" alt="1" src="https://github.com/user-attachments/assets/395666f2-388d-4438-ba5a-83ab76ee6036" />
**Contract Address Highlighted in the photo**
• Compiler version (0.8.24) & scripts used. 
**See Project Stack**

Part B — Transaction Details (tx1/tx2/tx3)
• Status, block, timestamp (UTC).
<img width="1362" height="860" alt="3" src="https://github.com/user-attachments/assets/bdc1457c-efbe-4c5e-be5b-eadf9aa0d74d" />

• From / To (EOA vs contract).
<img width="1339" height="847" alt="4" src="https://github.com/user-attachments/assets/d2d25b96-b65f-497c-a5d6-1d4646be143d" />

• Nonce, gas limit, gas used.
<img width="1363" height="853" alt="5" src="https://github.com/user-attachments/assets/d0e5fa65-7fd4-4551-983a-f773a0607864" />

• Base fee, max fee, max priority fee.
<img width="1334" height="838" alt="6" src="https://github.com/user-attachments/assets/ca84853e-8adb-4f9f-b56d-4995eaf237b2" />

• Effective gas price, total fee (wei).
<img width="1417" height="860" alt="7" src="https://github.com/user-attachments/assets/8f92190b-b30a-463d-a7a3-d237efbb72c8" />

• Events: list Transfer/Approval with raw values + human conversions (18 decimals).

Part C — Fee Comparison (tx1 vs tx2)
• Which landed first?
**tx1 landed first**
• Which had higher effective gas price and priority tip?
**TXT2 had better effective gas**
• Brief EIP-1559 explanation (base fee + tip).

Part D — Decimals & Conversion
• Show raw vs human for one event amount (value / 1e18).
Screenshots
• Deploy, Interact, Analyze (terminal outputs).
<img width="1362" height="860" alt="3" src="https://github.com/user-attachments/assets/9c967408-0bbf-416e-80f9-43490edf8772" />
<img width="1371" height="858" alt="1" src="https://github.com/user-attachments/assets/30e214fe-46a0-40f2-a347-70c2426f6d13" />
=======
# Sample Hardhat 3 Beta Project (`node:test` and `viem`)

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
>>>>>>> master
