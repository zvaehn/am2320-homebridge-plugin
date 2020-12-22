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
};

class AM2320TemperatureSensor implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly name: string;
  private temperature = 0;

  private readonly temperatureService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;

    this.temperatureService = new hap.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(hap.Characteristic.CurrentTemperature)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info('Current temperature is: ', this.temperature);
        callback(undefined, this.temperature);
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Custom Manufacturer')
      .setCharacteristic(hap.Characteristic.Model, 'Custom Model');

    log.info('Sensor finished initializing!');
  }

  getTemperature() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const spawn = require('child_process').spawn;
    const pythonProcess = spawn('python', ['lib/read-am2320-sensor.py']);

    pythonProcess.stdout.on('data', (data) => {
      this.log.debug(data);
      
      try {
        const sensorData = JSON.parse(data);
        this.temperature = sensorData.temperature;
      } catch (err) {
        this.log.error(err);
        this.temperature = 0;
      }
    });
    
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
