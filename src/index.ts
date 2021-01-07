import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  HAP,
  Logging,
  Service,
} from 'homebridge';

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('AM2320TemperatureSensor', AM2320TemperatureSensor);
  api.registerAccessory('AM2320HumiditySensor', AM2320HumiditySensor);
};

interface SensorData {
  temperature: number;
  humidity: number;
}

class AM2320HumiditySensor implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly name: string;
  private humidity = 0;

  private readonly humidityService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig/*, api: API*/) {
    this.log = log;
    this.name = config.name;

    this.humidityService = new hap.Service.HumiditySensor(this.name);

    this.humidityService
      .getCharacteristic(hap.Characteristic.CurrentRelativeHumidity)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const sensorData: SensorData = await readSensorData();
          this.humidity = sensorData.humidity;
        } catch (err) {
          this.log.error(err);
        } finally {
          callback(undefined, this.humidity);
        }
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'adafruit')
      .setCharacteristic(hap.Characteristic.Model, 'AM2320');

    log.info('AM2320HumiditySensor finished initializing!');
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log('Identify!');
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.humidityService,
    ];
  }
}

class AM2320TemperatureSensor implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly name: string;
  private temperature = 0;

  private readonly temperatureService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig/*, api: API*/) {
    this.log = log;
    this.name = config.name;

    this.temperatureService = new hap.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(hap.Characteristic.CurrentTemperature)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const sensorData: SensorData = await readSensorData();
          this.temperature = sensorData.temperature;
        } catch (err) {
          this.log.error(err);
        } finally {
          callback(undefined, this.temperature);
        }
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'adafruit')
      .setCharacteristic(hap.Characteristic.Model, 'AM2320');

    log.info('AM2320TemperatureSensor finished initializing!');
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log('Identify!');
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.temperatureService,
    ];
  }
}

async function readSensorData(): Promise<SensorData> {
  const sensorScriptFile = `${__dirname}/../src/lib/read-am2320-sensor.py`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const spawn = require('child_process').spawn;
  const process = spawn('python3', [sensorScriptFile]);

  return new Promise((resolve, reject) => {
    process.stdout.on('data', data => {
      try {
        resolve(JSON.parse(data.toString()));
      } catch (err) {
        reject(err.toString());
      }
    });

    process.stderr.on('data', err => {
      reject(err.toString());
    });
  });
}