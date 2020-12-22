import time
import board
import busio
import adafruit_am2320
import json

# create the I2C shared bus
i2c = busio.I2C(board.SCL, board.SDA)
am = adafruit_am2320.AM2320(i2c)

data = {
  "temperature": am.temperature,
  "humidity": am.relative_humidity
}

print(json.dumps(data))

