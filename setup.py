from setuptools import setup, find_packages
import os

# Define paths
CATKIN_SRC_DIR = os.path.expanduser("~/catkin_ws/src")

setup(
    name='my_package',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,  # Automatically include files listed in MANIFEST.in
    package_data={
        'my_package': [
            'app/static/js/*.js',
            'app/static/css/*.css',
            'app/templates/*.html',
        ],
    },
    install_requires=[
        'Flask',  # Example dependency, add your actual ones
        'some-other-library',
    ],
    data_files=[
        # Install the entire package in the catkin workspace
        (os.path.join(CATKIN_SRC_DIR, 'my_package'), ['README.md']),
        (os.path.join(CATKIN_SRC_DIR, 'my_package/static/js'), ['my_package/static/js/*.js']),
        (os.path.join(CATKIN_SRC_DIR, 'my_package/templates'), ['my_package/templates/*.html']),
    ],
    entry_points={
        'console_scripts': [
            'my_package_main = my_package.main:main',  # Entry point for running your app
        ],
    },
)
