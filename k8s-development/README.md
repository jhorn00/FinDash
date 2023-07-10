# Kubernetes Configuration
This is a stretch goal for the project. Initially this project probably will not contain a kubernetes configuration. The main reason for that decision comes down to the timeline in which I would like to produce a usable application.

## Current Status
Presently, I am able to host the frontend on a cluster. There is a known configuration issue preventing components from talking to each other.

### Completed
- Kind installation script (Linux)
- Kubectl installation script (Linux)
- Cluster start script, which fully brings up and configures the kind cluster (loads images, preps ingress, loads pods/services, etc.)
- Cluster deletion script

## Resources
https://jamesdefabia.github.io/docs/getting-started-guides/docker/
https://computingforgeeks.com/how-to-run-local-kubernetes-clusters-in-docker/
https://github.com/kubernetes-sigs/kind
