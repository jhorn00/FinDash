import moment, { Moment } from "moment";

// Interface for database net worth responses
interface BalanceData {
    id: number;
    account_id: number;
    date_val: string;
    balance: string;
}

export function processBalance (rows: any){
    const newBalance = {
        xData: Array<Moment>(),
        yData: Array<number>(),
    };
    try{
        rows.forEach((element: BalanceData) => {
            // Moment conversion gets weird without date format specified.
            // Even if you use UTC it shifts the date unless a difference is added.
            const parsedDate = moment(element.date_val, 'YYYY-MM-DD');
            newBalance.xData.push(parsedDate);
            // Parsing to float fails with $
            const dollarRemoved = element.balance.replace("$", "");
            // Parsing to float with comma only takes digits before comma
            const commaRemoved = dollarRemoved.replace(",", "");
            // Parse to float
            const yDataNumeric = parseFloat(commaRemoved);
            if (!isNaN(yDataNumeric) && parsedDate.isValid()) {
                newBalance.yData.push(yDataNumeric);
            }
            else{
                console.log("processNetWorth: Faulty date-value pair found");
            }
        });
    }
    catch (error){
        console.error("Error processing net worth data: ", error);
    }
    return newBalance;
}
