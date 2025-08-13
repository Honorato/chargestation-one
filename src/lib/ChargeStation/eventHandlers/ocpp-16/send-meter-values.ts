import { ChargeStationEventHandler } from 'lib/ChargeStation/eventHandlers';
import { MeterValuesRequest } from 'schemas/ocpp/1.6/MeterValues';
import clock from 'lib/ChargeStation/clock';

const sendMeterValues: ChargeStationEventHandler = async ({
  chargepoint,
  session,
}) => {
  const now = clock.now();

  const meterValuesSampledData = chargepoint.configuration.getVariableValue(
    "MeterValuesSampledData")

  const sampledValue = [{
    value: session.kwhElapsed.toFixed(5),
    context: 'Sample.Periodic',
    measurand: 'Energy.Active.Import.Register',
    location: 'Outlet',
    unit: 'kWh',
  }];

  if (meterValuesSampledData?.toString().includes("SoC")) {
    sampledValue.push({
      value: session.stateOfCharge.toString(),
      context: 'Sample.Periodic',
      measurand: 'SoC',
      location: 'EV',
      unit: 'Percent',
    });
  }

  if (meterValuesSampledData?.toString().includes("Power.Active.Import")) {
    sampledValue.push({
      value: '7.0',
      context: 'Sample.Periodic',
      measurand: 'Power.Active.Import',
      location: 'Outlet',
      unit: 'kW',
    });
  }

  if (meterValuesSampledData?.toString().includes("Current.Import")) {
    sampledValue.push({
      value: '32.0',
      context: 'Sample.Periodic',
      measurand: 'Current.Import',
      location: 'Outlet',
      unit: 'A',
    });
  }

  if (meterValuesSampledData?.toString().includes("Voltage")) {
    sampledValue.push({
      value: '230',
      context: 'Sample.Periodic',
      measurand: 'Voltage',
      location: 'Outlet',
      unit: 'V',
    });
  }

  if (meterValuesSampledData?.toString().includes("Temperature")) {
    sampledValue.push({
      value: '36.0',
      context: 'Sample.Periodic',
      measurand: 'Temperature',
      location: 'Outlet',
      unit: 'Celcius',
    });
  }

  chargepoint.writeCall<MeterValuesRequest>('MeterValues', {
    connectorId: session.connectorId,
    transactionId: Number(session.transactionId),
    meterValue: [
      {
        timestamp: now.toISOString(),
        // @ts-ignore
        sampledValue: sampledValue,
      },
    ],
  });
};

export default sendMeterValues;
