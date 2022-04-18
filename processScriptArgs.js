function processScriptArgs() {
  let headersMatching = null;
  const args = process.argv.slice(2, process.argv.length);
  return args.reduce((acc, val) => {
    const [key, value] = val.split("=");

    //Skip storing value into acc if the key is matchingType
    if (key === "matchingType") {
      headersMatching = value | "any";
      return acc;
    }

    if (key && value) {
      if (key === "headers" && headersMatching) {
        return { ...acc, [key]: JSON.parse(value) || {} };
      }

      return { ...acc, [key]: value };
    }

    return acc;
  }, {});
}

module.exports = processScriptArgs;
