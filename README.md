# KRATOS LIFE DETECTION GUI

## USAGE 

Open the ros package in the terminal and install all python dependencies

```
pip install -r requirements.txt 
```

If you do not have **pip**,
```
python -m ensurepip --upgrade
python get-pip.py
```

Ensuring that you are still in the same directory, open the flask app like so
```
flask run --debug
```

then proceed to launch all the files in the src 
```
rosrun kratosgui_python <file_name>.py
```
## SETUP
navigate to the ```config.py``` file in the requisite subdirectory and change the topic names accordingly. These are the variables that will be used throughout the modules so make sure they are correct. 
> **IMPORTANT** : do remember to copy and paste the same ```config.py``` file to all the subdirectories to make sure that the same system variables are used everywhere 
## TESTING 

### NOTE: this part is NOT compulsory, you do not need to do it every time
#### When using the tester or any other files in this, MAKE SURE the topic names are correct, pretty much the only thing that matters

take yourself to the ```.test``` folder, with testing for each websocket. 

The order of sensors to websockets is as follows: 

1. BME280: [ws://localhost:8765](ws://localhost:8765)
2. Multichannel gas sensor: [ws://localhost:8766](ws://localhost:8766)
3. SGP30: [ws://localhost:8767](ws://localhost:8767)
4. Spectrometer: [ws://localhost:8768](ws://localhost:8768)
5. Temperature sensor: [ws://localhost:8769](ws://localhost:8769)

you will find the tester file for each websocket titled ```<websocket_port>_tester.py```, run it like so
```
python3 <websocket_port>_tester.py
```

once you do, use ```websocat``` to see if the data is being published in the following format 

### using ```websocat```
install it using ```wget``` and setting its permissions to make it a system-wide command
```
sudo wget -qO /usr/local/bin/websocat https://github.com/vi/websocat/releases/latest/download/websocat.x86_64-unknown-linux-musl
sudo chmod a+x /usr/local/bin/websocat
```
then recieve the data in the websocket using the following command
```
websocat ws://localhost:<websocket_port>
```

