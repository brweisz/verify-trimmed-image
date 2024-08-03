#!/bin/bash

# Navigate to the circuits directory
cd circuits

# Check if powersOfTau28_hez_final_10.ptau file exists
if [ -f "powersOfTau28_hez_final_10.ptau" ]; then
  echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
  echo "Downloading powersOfTau28_hez_final_10.ptau"
  curl -o powersOfTau28_hez_final_10.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

# Compile the circuit
echo "Compiling circuit.circom..."
circom circuit.circom --r1cs --wasm --sym -o .

# Display information about the r1cs file
snarkjs r1cs info circuit.r1cs

# Start a new zkey and make a contribution
snarkjs groth16 setup circuit.r1cs powersOfTau28_hez_final_10.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

# Generate Solidity contract
snarkjs zkey export solidityverifier circuit_final.zkey ../contracts/verifier.sol

# Return to the previous directory
cd ..