# Backend API
This code handles client requests for database access

## Toubleshooting
If node is unable to find a module in a container (when it is otherwise able to through npm run start):
1. Make sure you have rebuilt the container images
2. Run the following: `docker-compose down -v`
 * This will remove all docker compose volumes
3. Try starting the app again with `docker-compose up --build`

## Notes
TODO: Switch from ts-node to tsc for deployment, maybe for everything

## References
https://github.com/expressjs/multer
https://gist.github.com/HarshithaKP/ebc0e79800e5638fe827c157360378be
