"use server";
import { ethers } from "ethers";

const abi = [
  "function makeFlashLoan(address token0, uint256[] memory amounts0, address[] memory tokens1) external",
  "function owner() view returns (address)",
  "function withdraw(address _tokenAddress, address _to, uint256 _amount) external",
];

const ERC20_ABI = [
  // Read-Only Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // State-Changing Functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const contractAddress = "0x26c93490449e3578E960854E3342D759c6c75C02";

const network = "matic";
const alchemyApiKey = "Fkhrqq6FnqtaSk2RsFO-J432v1VFl4Px";

const provider = ethers.getDefaultProvider(network, {
  alchemy: alchemyApiKey,
});

export async function getBalance(DATA: any) {
  const { token } = DATA;

  if (!token)
    return JSON.stringify({ success: false, error: "fill all the fields" });

  const coin = new ethers.Contract(token, ERC20_ABI, provider);

  const decimals = await coin.decimals();

  try {
    //const symbol = await coin.symbol(contractAddress);
    const balance1 = await coin.balanceOf(contractAddress);
    const balance = ethers.formatUnits(balance1, decimals); // + " " + (symbol || "");

    return JSON.stringify({
      success: true,
      balance,
    });
  } catch (error: any) {
    console.log("error is ", error);
    return JSON.stringify({
      success: false,
      error: error.reason ? error.reason : "error",
    });
  }
}

export async function fArb(DATA: any) {
  const { token0, token1, amount, privateKey } = DATA;

  if (!token0 || !token1 || !amount || !privateKey)
    return JSON.stringify({ success: false, error: "fill all the fields" });

  try {
    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const coin = new ethers.Contract(token0, ERC20_ABI, wallet);

    const owner = await contract.owner();
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      return JSON.stringify({
        success: false,
        error: "You are not the owner of the contract",
      });
    }

    const decimals = await coin.decimals();
    const amountToSend = ethers.parseUnits(amount, decimals);

    try {
      // Call the makeFlashLoan function
      const tx = await contract.makeFlashLoan(token0, [amountToSend], [token1]);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt.hash);
      return JSON.stringify({
        success: true,
        hash: "Transaction Hash : " + receipt.hash,
      });
    } catch (error: any) {
      /*
      let reason: string | null = error.reason.toString();
      if (reason?.startsWith("Arbitrage not profitable: got")) {
        const got = parseInt(
          reason
            .split(", expected more than : ")[0]
            .replace("Arbitrage not profitable: got ", "")
        );
        const expected = parseInt(reason.split(", expected more than : ")[1]);

        reason =
          "Arbitrage not profitable: " +
          got * 10 ** -decimals +
          ", expected more than : " +
          expected * 10 ** -decimals;
      }
      console.log(reason);*/
      return JSON.stringify({ success: false, error: error.reason || "error" });
    }
  } catch (error: any) {
    console.log("error is ", error);
    return JSON.stringify({
      success: false,
      error: "error",
    });
  }
}

export async function withdraw(DATA: any) {
  const { token, amount, privateKey, receiver } = DATA;

  if (!token || !receiver || !privateKey)
    return JSON.stringify({ success: false, error: "fill all the fields" });

  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  const coin = new ethers.Contract(token, ERC20_ABI, wallet);

  const owner = await contract.owner();
  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    return JSON.stringify({
      success: false,
      error: "You are not the owner of the contract",
    });
  }

  const decimals = await coin.decimals();
  const amountToSend = ethers.parseUnits(amount, decimals);

  try {
    const tx = await contract.withdraw(token, receiver, amountToSend);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt.hash);
    return JSON.stringify({
      success: true,
      hash: "Transaction Hash : " + receipt.hash,
    });
  } catch (error: any) {
    console.log("error is ", error);
    return JSON.stringify({
      success: false,
      error: error.reason ? error.reason : "error",
    });
  }
}
