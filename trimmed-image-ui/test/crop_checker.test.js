
//const assert = require('chai');
require("mocha");
const wasm_tester = require("circom_tester").wasm;

describe("Crop Checker Circuit TestCase", function () {
  let cropCheckerCircuit;

  before(async function () {
    cropCheckerCircuit = await wasm_tester("./circuit/crop_checker_circuit_test.circom")
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
      og_photo_hash: "3787385741029080642174659206471460199738583318311926895716925657054944127477"
    }
    const witness = await cropCheckerCircuit.calculateWitness(input)
    await cropCheckerCircuit.assertOut(witness, {})
  })
  it("Should fail because the og_photo size does not match", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1"
      ],
      pr_photo: [
        "1", "2",
        "2", "1"
      ],
      og_photo_hash: "3787385741029080642174659206471460199738583318311926895716925657054944127477"
    }
    try {
      await cropCheckerCircuit.calculateWitness(input)
    } catch (err) {
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
        "2"
      ],
      og_photo_hash: "3787385741029080642174659206471460199738583318311926895716925657054944127477"
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
      og_photo_hash: "21309471238940857124958149031345489676354579051"
    }
    try {
      await cropCheckerCircuit.calculateWitness(input)
    } catch (err) {
      if (err instanceof Error) {
        assert(err.message.includes("Assert Failed"))
      }
    }
  })
  it("Should fail because the crop pixel-check is not correct", async function () {
    let input = {
      og_photo: [
        "1", "1", "1",
        "1", "2", "2",
        "2", "1", "1"
      ],
      pr_photo: [
        "2", "2",
        "1", "1"
      ],
      og_photo_hash: "3787385741029080642174659206471460199738583318311926895716925657054944127477"
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