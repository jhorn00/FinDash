import pgClient from "./postgresClient";
import fs from "fs";
import express from "express";
import multer from "multer";
import { handleNetWorth, iterateNetWorthData, NetWorthType } from "../NetWorth/netWorthUtils";
import { insertTransactions } from "../Transaction/transactionUtils";
import { getUserFromUsername } from "../User/userUtils";
import { AccountType, createAccount, getAccountFromUserIdAccountName } from "../Account/accountUtils";
import { handleBalances, iterateBalanceData } from "../Balance/balanceUtils";
const parse = require('csv-parse').parse;

interface UploadHandlerResponse {
    code: number;
    success: boolean;
    message: string;
    dates?: string[];
    values?: number[];
}

// Iterates over the uploaded files and executes handling for each
// Returns a an UploadHandlerResponse
// This is async because it needs to await an async function it uses (parseFileContents)
async function handleUploadedData(files: Express.Multer.File[], balance: number, selectedAccount: string, newAccountName: string): Promise<UploadHandlerResponse> {
    // Arrays to hold all data prior to insertion
    const dates = Array<string>();
    const values = Array<number>();

    // Handle each file
    for(const file of files) {
        // Gather file contents before proceeding
        const data = fs.readFileSync(file.path) // We would have to await these results if using the async function anyway

        // Parse file contents and return if failure
        const response = await parseFileContents(data);
        if(!response.success){
            return response;
        }

        // Append data if applicable
        if(response.dates && response.values){
            dates.push(...response.dates);
            values.push(...response.values);
        }
        
        // Remove the file once its data has been processed
        fs.unlinkSync(file.path);
    }

    // TODO: real user handling
    const username = "generic_user";
    const user = await getUserFromUsername(username);
    const user_id = user.id;
    var account_name = selectedAccount;

    // If all files were parsed successfully, create new accounts as needed
    if (selectedAccount === "new"){
        const accountCreated = await createAccount(user_id, newAccountName)
            .catch((error) => {
                console.error('Error occurred:', error); // Handle error
            });
        // This will be triggered on falsy values (including undefined)
        if (!accountCreated){
            console.log("Account creation failed.");
            return {code: 400, success: false, message: 'Error: Parsed files but could not create new account.'}
        }
        console.log("Created new account " + newAccountName);
        account_name = newAccountName;
    }


    // Get account id for insertion
    const account = await getAccountFromUserIdAccountName(user_id, account_name);
    if (account === null){
        return {code: 400, success: false, message: "Error: Encountered problem resolving account with name '" + account_name + "'. It does not exist or has duplicates."};
    }

    const account_id = account.id;

    // Create user id array for easy insertion with the rest of the query
    const accountIds = new Array<number>(dates.length).fill(account_id);




    // If all files were parsed successfully, insert into tables
    insertToTables(dates, values, accountIds, balance);

    return {code: 200, success: true, message: 'Success: Files were parsed and inserted properly.'};
}

// Inserts file data to tables
// This is async because it needs to await async functions it uses (insertTransactions, handleNetWorth)
async function insertToTables(dates: string[], values: number[], accountIds: number[], currentBalance: number) {
    // Database insertion for transactions
    // The transactions table must be fully constructed before moving on
    await insertTransactions(dates, values, accountIds);
    // TODO: insertion error handling

    // Adjust user balances
    const balanceData = await handleBalances(accountIds[0], currentBalance); // TODO: real id handoff

    // Push to balances table
    await iterateBalanceData(balanceData);
  
    // Calculate networths data
    const netWorthData = await handleNetWorth();
    
    // Push to networths table
    await iterateNetWorthData(netWorthData);
}

// Accepts a file Buffer type and attempts to parse it
// Returns an UploadHanderResponse
// This is async because it needs to await an async function it uses (parse)
// It is also nice to be able to spin off async function calls as-needed for data handling
async function parseFileContents(data: Buffer): Promise<UploadHandlerResponse> {
    // Lists to store valid dates and values
    var dates = Array<string>();
    var values = Array<number>();
    try{
        // TODO: define records type
        const response = await new Promise<UploadHandlerResponse>((resolve, reject) => {
            parse(data, {columns: ['date', 'value']}, (err: Error, records: any) => {
                // If the format differs from a simple 2-column csv (or other)
                if (err) {
                    // Log error
                    console.error(err);
                    // Issue error response
                    reject({code: 400, success: false, message: "An error occurred. Check the file format."});
                    return;
                }
                
                // Make sure records was populated correctly (this has been triggered in the past)
                if (!records || !records.length){
                    reject({code: 400, success: false, message: "ERROR: File record is undefined or does not possess a length."});
                    return;
                }
            
                // If records are empty
                if (records.length == 0){
                    reject({code: 400, success: false, message: "ERROR: File record is empty (no data found)."});
                    return;
                }
            
                // Validate content types
                for (var key in records) {
                    const row = records[key];
                    
                    // Date
                    // Check that the date column contains parse-able Dates
                    const parsedDate = Date.parse(row.date); // TODO: See if there are better defined methods
                    if (isNaN(parsedDate)){
                        console.log("Invalid type discovered! Expected valid Date format.");
                        reject({code: 400, success: false, message: "ERROR: Date column contains non-date type(s) or unaccepted date format."});
                        return;
                    }
                    // Insert valid date into dates list
                    dates.push(String(row.date));
                
                    // Value
                    // Check that the value column contains floats
                    const numberValue = Number(row.value);
                    if (isNaN(numberValue)){
                        console.log("Invalid type of: " + typeof numberValue + " Expected type number.");
                        reject({code: 400, success: false, message: "ERROR: Value column contains non-number type(s)."});
                        return;
                    }
                    // Insert valid value into values list
                    values.push(numberValue);
                }
                // Console typing confirmation
                console.log("File data has valid typing.");
            
                // This *should* always pass, but check anyway
                if (dates.length != values.length){
                    // This should not happen
                    reject({code: 400, success: false, message: "ERROR: dates and values are different lengths."});
                    return;
                }
                resolve({code: 200, success: true, message: 'Success: File contents parsed properly.', dates: dates, values: values});
            });
        });
        
        // Return successfully with all fields populated
        return {code: 200, success: true, message: "Success: File contents parsed properly.", dates: dates, values: values};
    }
    catch (errResponse) {
        console.error("Error parsing file contents: ", errResponse);
        return {code: 400, success: false, message: "ERROR: Failed to parse file."};
    }
}


export { handleUploadedData, UploadHandlerResponse };
