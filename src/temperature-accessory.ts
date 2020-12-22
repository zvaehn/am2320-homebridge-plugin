import {
  Service,
  PlatformAccessory,
  CharacteristicGetCallback,
} from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class TemperaturePlatformAccessory {
  private service: Service;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private states = {
    temperature: 0,
    humidity: 0,
  };

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, '@zvaehn')
      .setCharacteristic(this.platform.Characteristic.Model, 'AM2320-Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '0000-1111-2222-3333');

    // get the TemperatureSensor service if it exists, otherwise create a new TemperatureSensor service
    // you can create multiple services for each accessory
    this.service =
      this.accessory.getService(this.platform.Service.TemperatureSensor) ||
      this.accessory.addService(this.platform.Service.TemperatureSensor);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the Temperature Characteristic
    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.getTemperature.bind(this));               // GET - bind to the `getTemperature` method below

    // register handlers for the Humidity Characteristic
    // this.service
    //   .getCharacteristic(this.platform.Characteristic.CurrentHumidity)
    //   .on('set', this.setBrightness.bind(this));       // SET - bind to the 'setBrightness` method below

 
    /**
     * Updating characteristics values asynchronously.
     * 
     * Example showing how to update the state of a Characteristic asynchronously instead
     * of using the `on('get')` handlers.
     * Here we change update the motion sensor trigger states on and off every 10 seconds
     * the `updateCharacteristic` method.
     * 
     */
    // let motionDetected = false;
    // setInterval(() => {
    //   // EXAMPLE - inverse the trigger
    //   motionDetected = !motionDetected;

    //   // push the new value to HomeKit
    //   motionSensorOneService.updateCharacteristic(this.platform.Characteristic.MotionDetected, motionDetected);
    //   motionSensorTwoService.updateCharacteristic(this.platform.Characteristic.MotionDetected, !motionDetected);

    //   this.platform.log.debug('Triggering motionSensorOneService:', motionDetected);
    //   this.platform.log.debug('Triggering motionSensorTwoService:', !motionDetected);
    // }, 10000);
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  // setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {

  //   // implement your own code to turn your device on/off
  //   this.states.On = value as boolean;

  //   this.platform.log.debug('Set Characteristic On ->', value);

  //   // you must call the callback function
  //   callback(null);
  // }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   * 
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   * 
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  getTemperature(callback: CharacteristicGetCallback) {
    const temp = this.states.temperature;
    this.platform.log.debug('Get Characteristic Temperature ->', temp);

    // you must call the callback function
    // the first argument should be null if there were no errors
    // the second argument should be the value to return
    callback(null, temp);
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, changing the Brightness
   */
  // setBrightness(value: CharacteristicValue, callback: CharacteristicSetCallback) {

  //   // implement your own code to set the brightness
  //   this.states.Brightness = value as number;

  //   this.platform.log.debug('Set Characteristic Brightness -> ', value);

  //   // you must call the callback function
  //   callback(null);
  // }

}
