module.exports = {
    "env": {
        "es6": true,
        "mocha": true,
        "node": true
    },
    "globals": {
        "should": true,
        "expect": true
    },
    "plugins": [
        "chai-expect"
    ],
    "rules": {
        "chai-expect/missing-assertion": "error",
        "chai-expect/terminating-properties": "error",
        "chai-expect/no-inner-compare": "error"
      }
};
