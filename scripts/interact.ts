import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits, formatUnits, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// For local hardhat network, we'll use local settings
const useLocal = process.argv.includes('--network') && process.argv.includes('hardhat');

let RPC_URL: string;
let CHAIN_ID: number;
let PRIVATE_KEY_RAW: string;

if (useLocal) {
  RPC_URL = "http://127.0.0.1:8545";
  CHAIN_ID = 31337;
  PRIVATE_KEY_RAW = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
} else {
  RPC_URL = process.env.RPC_URL!;
  CHAIN_ID = Number(process.env.CHAIN_ID!);
  PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");
}

// Your deployed contract address
const TOKEN = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const DECIMALS = 18;

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY_RAW) {
    throw new Error("Missing environment variables");
  }

  const { abi } = await artifacts.readArtifact("CampusCredit");
  
  const chain = {
    id: CHAIN_ID,
    name: useLocal ? "hardhat" : `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } }
  };

  const account = privateKeyToAccount(`0x${PRIVATE_KEY_RAW}`);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  // Use self as recipient for demo
  const acct2 = account.address;

  const balances = async (label: string) => {
    const balance = await publicClient.readContract({
      address: getAddress(TOKEN),
      abi,
      functionName: "balanceOf",
      args: [account.address]
    });
    console.log(`${label} | Balance: ${formatUnits(balance as bigint, DECIMALS)} CAMP`);
  };

  await balances("Before");

  // Tx #1 — transfer
  const tx1 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("100", DECIMALS)]
  });
  console.log("Tx1 hash:", tx1);
  
  const rcpt1 = await publicClient.waitForTransactionReceipt({ hash: tx1 });
  console.log("Tx1 mined in block:", rcpt1.blockNumber);

  // Tx #2 — another transfer
  const tx2 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("50", DECIMALS)]
  });
  console.log("Tx2 hash:", tx2);
  
  const rcpt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
  console.log("Tx2 mined in block:", rcpt2.blockNumber);

  // Tx #3 — approval
  const tx3 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "approve",
    args: [acct2, parseUnits("25", DECIMALS)]
  });
  console.log("Tx3 hash:", tx3);
  
  const rcpt3 = await publicClient.waitForTransactionReceipt({ hash: tx3 });
  console.log("Tx3 mined in block:", rcpt3.blockNumber);

  await balances("After");
  
  console.log("HASHES:", JSON.stringify({ tx1, tx2, tx3 }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});