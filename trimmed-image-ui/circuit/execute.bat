@echo off
if exist powersOfTau28_hez_final_10.ptau (
  echo powersOfTau28_hez_final_10.ptau already exists. Skipping.
) else (
  echo Downloading powersOfTau28_hez_final_10.ptau
  powershell -Command "Invoke-WebRequest -Uri https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau -OutFile powersOfTau28_hez_final_10.ptau"
)

echo Compiling circuit.circom...

REM compile circuit
circom crop_checker_circuit.circom --r1cs --wasm --sym -o .
call snarkjs r1cs info crop_checker_circuit.r1cs

REM Start a new zkey and make a contribution
call snarkjs groth16 setup crop_checker_circuit.r1cs powersOfTau28_hez_final_10.ptau crop_checker_circuit_0000.zkey
call snarkjs zkey contribute crop_checker_circuit_0000.zkey crop_checker_circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
call snarkjs zkey export verificationkey crop_checker_circuit_final.zkey verification_key.json

REM generate solidity contract
call snarkjs zkey export solidityverifier crop_checker_circuit_final.zkey verifier.sol

cd ..