interface ParsedValue extends Record<string, string | ParsedValue> {}

class VietQRParser {
  private NESTED_IDS = {
    38: {
      "01": true,
    },
    62: true,
    64: true,
  };

  private IDS_TO_NAMES = {
    "00": "payloadFormatIndicator",
    "01": "pointOfInitiationMethod",
    "38": {
      ".": "merchantAccountInformation",
      "00": "guid",
      "01": {
        ".": "beneficiaryOrganization",
        "00": "bnbId",
        "01": "customerId",
      },
      "02": "serviceCode",
    },
    "52": "merchantCategoryCode",
    "53": "transactionCurrency",
    "54": "transactionAmount",
    "55": "tipOrConvenienceIndicator",
    "56": "valueOfConvenienceFeeFixed",
    "57": "valueOfConvenienceFeePercentage",
    "58": "countryCode",
    "59": "merchantName",
    "60": "merchantCity",
    "61": "postalCode",
    "62": {
      ".": "additionalDataFieldTemplate",
      "01": "billNumber",
      "02": "mobileNumber",
      "03": "storeLabel",
      "04": "loyaltyNumber",
      "05": "referenceLabel",
      "06": "customerLabel",
      "07": "terminalLab",
      "08": "purposeOfTransaction",
      "09": "additionalConsumerDataRequest",
    },
    "63": "crc",
    "64": "merchantInformationLanguageTemplate",
  };

  isNested(path: Array<string>, parent: Record<string, any>): boolean {
    if (path.length === 0) return false;
    if (path.length === 1) return !!parent[path[0]];
    if (!parent[path[0]]) return false;
    return this.isNested(path.slice(1), parent[path[0]]);
  }

  mapKeys(value: any, keys: any): Record<string, any> {
    const result = Object.keys(value).reduce((prev, current) => {
      const key = keys[current as never];
      return {
        ...prev,
        ...(key
          ? typeof key === "object"
            ? {
                [key["."]]: this.mapKeys(value[current], key),
              }
            : {
                [keys[current as never]]: value[current],
              }
          : {
              [current]: value[current],
            }),
      };
    }, {});

    return result;
  }

  getIdsValues(content: string, parent?: Array<string>): ParsedValue | null {
    let _content = content;
    const result: ParsedValue = {};

    while (_content.length) {
      const [id, len] = [_content.slice(0, 2), +_content.slice(2, 4)];

      if (isNaN(len)) return null;

      _content = _content.slice(4);

      const value = _content.slice(0, len);
      if (value.length !== len) return null;

      _content = _content.slice(len);

      result[id] = this.isNested(
        [...(parent ? parent : []), id],
        this.NESTED_IDS
      )
        ? this.getIdsValues(value, [...(parent ? parent : []), id])!
        : value;
    }

    return result;
  }

  parse(content: string) {
    const idsValues = this.getIdsValues(content);
    if (!idsValues) return null;

    const result = this.mapKeys(idsValues, this.IDS_TO_NAMES);

    return result;
  }
}

export const vietQRParser = new VietQRParser();
