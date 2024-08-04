module.exports = {
  apps : [{
    name   : "GearChecker",
    script : "./app.js",
    out_file: "log.txt",
    env: {
      "NODE_ENV": "production"
    }
  }]
}
