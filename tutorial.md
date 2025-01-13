# cách thay đổi chiều cao của cây merkle.
- Trong file packages/contracts/circuits/withdraw.circom, thay đổi giá trị tham số levels của template Withdraw từ 4 thành 6:
- Trong file packages/contracts/test/daoCheck.js, thay đổi giá trị hằng số LEVELS từ 4 thành 6:
- Trong file packages/client/src/hooks/useDAOCheck.js, thay đổi kích thước mảng zeros từ 24 thành 48 (vì 2^6 = 64, và proof sẽ có 64 phần tử):
- Trong file packages/contracts/contracts/DAOCheck.sol, thay đổi kiểu dữ liệu của tham số _proof trong các hàm updateRoot, withdraw và withdrawDuty từ uint256[24] thành uint256[48]:
- Trong file packages/contracts/contracts/Verifier.sol, thay đổi kiểu dữ liệu của tham số _proof trong các hàm verifyProof từ uint256[24] thành uint256[48]:
- Cuối cùng, bạn cần biên dịch lại mạch withdraw.circom và tạo lại tệp withdraw.zkey tương ứng với chiều cao mới của cây Merkle. Chạy lệnh sau trong thư mục packages/contracts/circuits:

- run 'npx hardhat compile'

```
circom withdraw.circom --r1cs --wasm --sym
snarkjs groth16 setup withdraw.r1cs pot12_final.ptau withdraw.zkey
snarkjs zkey export verificationkey withdraw.zkey verification_key.json
```


Tạo Mới Powers of Tau:
```
snarkjs powersoftau new bn128 15 pot15_0000.ptau
snarkjs powersoftau contribute pot15_0000.ptau pot15_0001.ptau --name="First Contributor" -v

snarkjs powersoftau contribute pot15_0001.ptau pot15_0002.ptau --name="Second Contributor" -v
snarkjs powersoftau prepare phase2 pot15_0001.ptau pot15_final.ptau
snarkjs plonk setup withdraw.r1cs pot15_final.ptau withdraw.zkey

```