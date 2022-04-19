function processScriptArgs() {
  const args = process.argv.slice(2, process.argv.length);
  return args.reduce((acc, val) => {
    const [key, value] = val.split("=");

    if (key && value) {
      if (key === "headers") {
        return { ...acc, [key]: JSON.parse(value) || {} };
      }

      return { ...acc, [key]: value };
    }

    return acc;
  }, {});
}

module.exports = processScriptArgs;
