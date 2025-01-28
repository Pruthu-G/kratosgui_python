#!/usr/bin/env python3 
import rospy
import subprocess 

spectro=subprocess.Popen(["rosrun","kratosgui_another_one","socket_for_spectro.py"])