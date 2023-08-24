import { create } from 'ipfs-http-client'
const projectId = "2LAjfHsBZfCMykeMYZKWNxwOjaD";
const projectSecret = "e155ed62f18b48da6d57b61820aeb647";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfs = create ({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});
export default ipfs;
