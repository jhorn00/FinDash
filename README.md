# FinanceDashboard
Financial dashboard application aimed at data visualization from user transaction data.  

<u>Given significant time constraints</u>, prioritizing "completeness" took precedence over polish for the initial project.  

Subdirectories contain their own READMEs for instructions, troubleshooting, etc.

## Status
This project is a work-in-progress. [The author](https://github.com/jhorn00) works full-time as a SWE and lacks the time to work this project daily, weekly, or even monthly. Progress will continue, one way or another.  

[A sample release is available to mess with here](http://dawsonhorn.net/). Please do not upload any personal identifiable data. Note that all users share the same user at the moment (ideally too little traffic to matter right now). Acceptable uploads are CSVs with a date column followed by a number column, no column headers for now. There are some sample files provided in the repo under ```samples/```.

## Future Plans
The following are planned features or improvements:
- Users
    - This is a pretty crucial feature that has yet to be implemented. The database and queries have been prepared for such an addition, it just needs to be written up for the client and server.
- Stability
    - A good deal of error checking is needed throughout the project.
- More Data
    - Much more could be learned from currently supported transaction data.
- SSL/TLS for Hosted Release
    - Certificates are in the works, but a few things take priority. Namely, long-term hosting solution and ironing-out the existing application.
- Kubernetes Manifests
    - Some work has already been done to set up the manifests for Kubernetes, but priority for this falls below basic functionality and security.

### Distant Future (merely ideas)
- Brokerage Account export support

## Author
- [James Dawson Horn](https://github.com/jhorn00)
