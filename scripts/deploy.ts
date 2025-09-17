import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  // Check if we should use local settings based on environment or command line
  const useLocal = process.argv.includes('--network') && process.argv.includes('hardhat');
  
  // Load ABI + bytecode compiled by Hardhat
  const { abi, bytecode } = await artifacts.readArtifact("CampusCredit");
  
  // Ensure the bytecode has the 0x prefix
  const formattedBytecode = bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`;

  let RPC_URL: string;
  let CHAIN_ID: number;
  let PRIVATE_KEY_RAW: string;

  if (useLocal) {
    // Use local Hardhat network settings
    RPC_URL = "http://127.0.0.1:8545";
    CHAIN_ID = 31337; // Default Hardhat chain ID
    // Use the first default Hardhat account
    PRIVATE_KEY_RAW = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  } else {
    // Use environment variables for other networks
    RPC_URL = process.env.RPC_URL!;
    CHAIN_ID = Number(process.env.CHAIN_ID!);
    PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");
    
    if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY_RAW) {
      throw new Error("Missing env RPC_URL/CHAIN_ID/PRIVATE_KEY");
    }
  }

  // Viem chain object
  const chain = {
    id: CHAIN_ID,
    name: useLocal ? "hardhat" : `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  };

  const account = privateKeyToAccount(`0x${PRIVATE_KEY_RAW}`);
  const wallet = createWalletClient({
    account,
    chain,
    transport: http(RPC_URL),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_URL),
  });

  // 1,000,000 CAMP (18 decimals)
  const initialSupply = parseUnits("1000000", 18);

  try {
    console.log(`Deploying to network: ${useLocal ? 'hardhat (local)' : 'didlab'}`);
    console.log(`Chain ID: ${CHAIN_ID}`);
    console.log(`RPC URL: ${RPC_URL}`);
    console.log(`Deployer: ${account.address}`);

    // Deploy the contract
    const hash = await wallet.deployContract({
      abi,
      bytecode: formattedBytecode as `0x${string}`,
      args: [initialSupply],
    });

    console.log("Deploy tx:", hash);

    // Wait for the transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const address = receipt.contractAddress!;
    
    console.log("CampusCredit deployed at:", address);
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});