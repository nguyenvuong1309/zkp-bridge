

// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  try {
    // Lấy contract factory
    const FTMTransfer = await hre.ethers.getContractFactory("FTMTransfer");
    
    // Triển khai contract
    const ftmTransfer = await FTMTransfer.deploy();
    
    console.log("Triển khai đang chờ...");
    
    // Đợi quá trình triển khai hoàn tất
    await ftmTransfer.waitForDeployment();
    
    // Lấy địa chỉ của contract
    const address = await ftmTransfer.getAddress();
    
    console.log("FTMTransfer đã được triển khai tại:", address);
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in main:", error);
    process.exit(1);
  });