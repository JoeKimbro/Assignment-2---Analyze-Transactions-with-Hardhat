import { artifacts } from "hardhat";
import { createPublicClient, http, decodeEventLog } from "viem";

// For local hardhat network, we'll use local settings
const useLocal = process.argv.includes('--network') && process.argv.includes('hardhat');

let RPC_URL: string;
let CHAIN_ID: number;

if (useLocal) {
  RPC_URL = "http://127.0.0.1:8545";
  CHAIN_ID = 31337;
} else {
  RPC_URL = process.env.RPC_URL!;
  CHAIN_ID = Number(process.env.CHAIN_ID!);
}

// Replace these with your actual transaction hashes from the interact.ts output
const HASHES = {
  tx1: "0xbfd8159909eb9a22323aeacbc54c7db9cb7e9295621b5072df0291867a7fd3a0",
  tx2: "0x64338aaaa6bcd8166114f06f8bc59d64fe86953721989bf9ebbcab3cc75dc110",
  tx3: "0xc0c421b4277a00afb57ce8f2ab1820459f5cd14465832dce80cae5bb928b2385",
};

async function analyze(hash: `0x${string}`, abi: any) {
  const chain = {
    id: CHAIN_ID,
    name: useLocal ? "hardhat" : `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } }
  };

  const pc = createPublicClient({ chain, transport: http(RPC_URL) });
  const tx = await pc.getTransaction({ hash });
  const rcpt = await pc.getTransactionReceipt({ hash });
  const block = await pc.getBlock({ blockNumber: rcpt.blockNumber });

  const baseFee = block.baseFeePerGas ?? 0n;
  const gasUsed = rcpt.gasUsed ?? 0n;
  const effective = rcpt.effectiveGasPrice ?? tx.gasPrice ?? 0n;
  const totalFee = gasUsed * effective;

  console.log(`\n=== ${hash} ===`);
  console.log("Status:", rcpt.status === "success" ? "Success" : "Fail");
  console.log("Block:", rcpt.blockNumber);
  console.log("Timestamp (UTC):", new Date(Number(block.timestamp) * 1000).toISOString());
  console.log("From:", tx.from);
  console.log("To:", tx.to);
  console.log("Nonce:", tx.nonce);
  console.log("Gas limit:", tx.gas);
  console.log("Gas used:", gasUsed);
  console.log("Base fee per gas:", baseFee);
  console.log("Max fee per gas:", tx.maxFeePerGas ?? 0n);
  console.log("Max priority fee per gas:", tx.maxPriorityFeePerGas ?? 0n);
  console.log("Effective gas price:", effective);
  console.log("Total fee (wei):", totalFee);

  // Decode events with proper typing
  for (const log of rcpt.logs) {
    try {
      const parsed = decodeEventLog({ 
        abi, 
        data: log.data, 
        topics: log.topics 
      }) as { eventName: string; args: any };
      
      console.log("Event:", parsed.eventName, parsed.args);
    } catch { 
      /* not a CampusCredit event */ 
    }
  }
}

async function main() {
  if (!RPC_URL || !CHAIN_ID) {
    throw new Error("Missing environment variables");
  }

  const { abi } = await artifacts.readArtifact("CampusCredit");
  
  await analyze(HASHES.tx1 as `0x${string}`, abi);
  await analyze(HASHES.tx2 as `0x${string}`, abi);
  await analyze(HASHES.tx3 as `0x${string}`, abi);
}

main().catch((e) => { 
  console.error(e); 
  process.exit(1); 
});