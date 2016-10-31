module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single",
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "error",
            {
                allow: ["warn", "error"]
            }
        ]
    }
};
