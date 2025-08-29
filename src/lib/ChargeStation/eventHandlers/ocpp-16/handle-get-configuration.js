export default async function handleGetConfiguration({
  chargepoint,
  callMessageId,
  callMessageBody,
}) {
  const { key } = callMessageBody;

  if (key) {
    const configurationKey = [];
    const unknownKey = [];

    for (const k of key) {
      const value = chargepoint.configuration.getVariableValue(k);
      if (value === undefined || value === null) {
        unknownKey.push(k);
      } else {
        configurationKey.push({
          key: k,
          value: `${value}`,
          readonly: false,
        });
      }
    }
    return chargepoint.writeCallResult(callMessageId, { configurationKey, unknownKey })
  }

  const response = {
    configurationKey: chargepoint.configuration
      .getVariablesArray()
      .map((variable) => {
        return {
          key: variable.key,
          value: `${variable.value}`,
          readonly: false,
        };
      }),
    unknownKey: [],
  };
  chargepoint.writeCallResult(callMessageId, response);
}
