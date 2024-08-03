import { assert } from "chai";
import "mocha";
const wasm_tester = require("circom_tester").wasm

describe("Crop Checker Circuit TestCase", function () {
  let cropCheckerCircuit: any;

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
      camera_pk: "13208123981239021890213",
      og_photo_hash: "9913471608845011231399089837629140426825278724184336904104410352444837118765"
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
      camera_pk: "13208123981239021890213",
      og_photo_hash: "9913471608845011231399089837629140426825278724184336904104410352444837118765"
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
        "2"
      ],
      camera_pk: "13208123981239021890213",
      og_photo_hash: "9913471608845011231399089837629140426825278724184336904104410352444837118765"
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
      camera_pk: "13208123981239021890213",
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
      camera_pk: "13208123981239021890213",
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
})