module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    "transform": {
        "^.+\\.(j|t)sx?$": "ts-jest",
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    },
};
  