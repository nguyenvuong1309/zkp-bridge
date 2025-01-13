const { registerDao, listHistory, createWallet, listWallet, listDAO, withdraw } = require('./daoCheckUtils');
const { hashCommitment } = require("./utils")
const { ethers } = require("ethers");

async function main() {
    // Kết nối với ví Ethereum (thay thế bằng private key hoặc provider tương ứng)
    const wallet = new ethers.Wallet("6d367b56b547946e71291fca8656371b1be6d53a474d4d19934bf8748c6ad164", 
        new ethers.JsonRpcProvider("https://evm.shibuya.astar.network"));

    // Gọi hàm registerDao
    const daoPrefix = await registerDao(wallet, {
        name: 'My DAO',
        address: 'vuong',
        jurisdiction: 'US',
        isParent: true,
        parentId:  123
    });
    console.log('Registered DAO with ID:', daoPrefix);

    for (let i = 0; i < 3; i++) {
        console.log(`${daoPrefix}${i}`)
        const commitment = await hashCommitment(`${daoPrefix}${i}`, 'secret123');
        await createWallet(wallet, commitment, 0 );
    }
    // Gọi hàm listWallet
    const wallets = await listWallet(wallet, 6, 'secret123');
    console.log('Wallets:', wallets);

    // Gọi hàm listDAO
    const daos = await listDAO(wallet);
    console.log('DAOs:', daos);

    // Gọi hàm withdraw
    await withdraw(wallet, 
        '2718466746976700283212049778459672617585668271222412132424784069643556185335',
         'secret123', '60', '1000000000000000000', '100000000000000000');
    console.log('Withdrawn');

    // Gọi hàm listHistory
    const history = await listHistory('0x1234...');
    console.log('History:', history);
}

main().catch(console.error); 