import { assert } from "chai";
import "mocha";
const wasm_tester = require("circom_tester").wasm

const divideInBits = (num: bigint): Array<number> => {
  const binary_string = num.toString(2);
  const bit_length = 256;
  let padded_binary_string = binary_string.padStart(bit_length, '0');

  if (padded_binary_string.length > bit_length) {
    padded_binary_string = padded_binary_string.slice(-bit_length);
  
  }
  const bit_array = [];
  
  for (let char of padded_binary_string)
    bit_array.push(Number(char));
  
  return bit_array;
}

describe("Crop Checker Circuit TestCase", function () {
  let cropCheckerCircuit: any;
  const private_key_example = 1240981903890821;

  before(async function () {
    cropCheckerCircuit = await wasm_tester("../crop_checker_circuit.circom")
  })

  it("Should generate the witness successfully", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1", "1"
      ],
      pr_photo: [
        "1", "2",
        "2", "1"
      ],
      og_signature: [],
      camera_pk: divideInBits(BigInt(private_key_example))
    }
    const witness = await cropCheckerCircuit.calculateWitness(input)
    await cropCheckerCircuit.assertOut(witness, {})
  })
  it("Should fail because the og_photo size does not match", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1", "1"
      ],
      pr_photo: [
        "1", "2",
        "2", "1"
      ],
      og_signature: [],
      camera_pk: divideInBits(BigInt(private_key_example))
    }
    try {
      await cropCheckerCircuit.calculateWitness(input)
    } catch (err: any) {
      assert(err.message.includes("Assert Failed"))
    }
  })
  it("Should fail because the pr_photo does not match", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1", "1"
      ],
      pr_photo: [
        "1", "2",
        "2", "1"
      ],
      og_signature: [],
      camera_pk: divideInBits(BigInt(private_key_example))
    }
    try {
      await cropCheckerCircuit.calculateWitness(input)
    } catch (err) {
      if (err instanceof Error) {
        assert(err.message.includes("Assert Failed"))
      }
    }
  })
  it("Should fail because the signature is not correct", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1", "1"
      ],
      pr_photo: [
        "1", "2",
        "2", "1"
      ],
      og_signature: [],
      camera_pk: divideInBits(BigInt(private_key_example))
    }
    try {
      await cropCheckerCircuit.calculateWitness(input)
    } catch (err) {
      if (err instanceof Error) {
        assert(err.message.includes("Assert Failed"))
      }
    }
  })
})