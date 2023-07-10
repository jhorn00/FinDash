# Development
This directory contains the files for deployment a developer environment.

## Notes
- At present, stopping the deployment will result in the database being cleared.
    - You should not be storing any critical data within this application (aside from the fact that there are not any security features), but if you are: *You have been warned...*

## Steps
The following assumes you are in a Linux environment with docker and docker-compose installed, along with an internet connection.
It is also assumed that if you are following these steps, you have this repository cloned locally.
1. Run the start script: ```./start.bash```
2. To stop: ```Ctrl+C``` (Recommended to let it stop gracefully)  

That's it! The setup is relatively straight-forward, so docker-compose and docker should handle it all for you.  

You can test your installation by opening localhost on a browser (or whatever IP your machine is available on).  

All client and server code changes should apply when the file is saved. When new files are added, new packages are added, docker changes are made, it is recommended to stop the developer environment and start it again.

## Troubleshooting
If you encounter strange behavior, such as main-branch files not producing an image that runs, experience says it is likely due to some sort of conflict with an existing image on the machine.
- If possible, clear out any old images present on the machine and attempt the start script again.
    - One option (**THIS WILL CLEAR ALL YOUR UNUSED IMAGES ON YOUR MACHINE**): ```docker image prune -a```
    - Another option: ```docker-compose down -v``` in the same directory as your docker-compose.yml

## Contents
- docker-compose.yml
    - Contains application environment configuration.
- start.bash
    - Contains commands required to run the release compose deployment
