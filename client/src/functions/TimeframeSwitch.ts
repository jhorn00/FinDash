function TimeframeSwitch(e : any){
    switch (e.target.name) {
        case "1w": {
          return {interval: 1, unit: "weeks"};
        }
        case "1mo": {
          return {interval: 1, unit: "months"};
        }
        case "3mo": {
          return {interval: 3, unit: "months"};
        }
        case "6mo": {
          return {interval: 6, unit: "months"};
        }
        case "1yr": {
          return {interval: 12, unit: "months"};
        }
        case "2yr": {
          return {interval: 24, unit: "months"};
        }
        case "5yr": {
          return {interval: 60, unit: "months"};
        }
        case "10yr": {
          return {interval: 120, unit: "months"};
        }
        case "Max": {
          return {interval: 12000, unit: "months"}; // TODO: Better way to denote max
        }
        default: {
          console.log("Invalid timeframe passed to handler.");
          return {interval: -1, unit: "months"};
        }
      }
}

export default TimeframeSwitch;
