#!/usr/bin/env python3
import rospy
from std_msgs.msg import Float64MultiArray
import random
import config
def generate_random_data():
    """Generate a list of 18 random float values."""
    return [abs(random.uniform(-10, 10)) for _ in range(18)]

def random_publisher():
    rospy.init_node('random_publisher', anonymous=True)
    pub = rospy.Publisher(config.TEMP, Float64MultiArray, queue_size=10)
    rate = rospy.Rate(1) 

    while not rospy.is_shutdown():
        msg = Float64MultiArray()
        msg.data = generate_random_data()
        rospy.loginfo(f"Publishing: {msg.data}")
        pub.publish(msg)
        
        rate.sleep()

if __name__ == '__main__':
    try:
        random_publisher()
    except rospy.ROSInterruptException:
        pass