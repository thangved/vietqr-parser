import { test, expect, describe, vi } from "vitest";
import { vietQRParser } from ".";

const VALID_RAW_VALUE =
  "00020101021138620010A00000072701320006970454011899MM25094M421751220208QRIBFTTA5303704540710000005802VN62270515MOMOW2W421751220804hehe6304F0F1";

const VALID_EXPECTED_IDS_VALUES = {
  "38": {
    "00": "A000000727",
    "01": { "00": "970454", "01": "99MM25094M42175122" },
    "02": "QRIBFTTA",
  },
  "53": "704",
  "54": "1000000",
  "58": "VN",
  "62": { "05": "MOMOW2W42175122", "08": "hehe" },
  "63": "F0F1",
  "00": "01",
  "01": "11",
};

const VALID_EXPECTED_PARSED_VALUE = {
  merchantAccountInformation: {
    guid: "A000000727",
    beneficiaryOrganization: {
      bnbId: "970454",
      customerId: "99MM25094M42175122",
    },
    serviceCode: "QRIBFTTA",
  },
  transactionCurrency: "704",
  transactionAmount: "1000000",
  countryCode: "VN",
  additionalDataFieldTemplate: {
    referenceLabel: "MOMOW2W42175122",
    purposeOfTransaction: "hehe",
  },
  crc: "F0F1",
  payloadFormatIndicator: "01",
  pointOfInitiationMethod: "11",
};

describe("VietQRParser.getKeysValues", () => {
  test("should be return a parsed value", () => {
    const rawValue = VALID_RAW_VALUE;
    const expectedValue = VALID_EXPECTED_IDS_VALUES;

    const actualValue = vietQRParser.getIdsValues(rawValue);

    expect(actualValue).toEqual(expectedValue);
  });

  test("should be return null", () => {
    const rawValue = "justarandomstring";
    const actualValue = vietQRParser.getIdsValues(rawValue);

    expect(actualValue).toBeNull();
  });
});

describe("VietQRParser.parse", () => {
  test("should be return a parsed value", () => {
    const rawValue = VALID_RAW_VALUE;
    const expectedValue = VALID_EXPECTED_PARSED_VALUE;

    const actualValue = vietQRParser.parse(rawValue);

    expect(actualValue).toEqual(expectedValue);
  });

  test("should be return null", () => {
    const rawValue = "justarandomstring";
    const actualValue = vietQRParser.parse(rawValue);
    expect(actualValue).toBeNull();
  });
});
