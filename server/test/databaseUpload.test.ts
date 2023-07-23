import { describe, expect, test } from '@jest/globals';
import uploadRouter from '../src/Postgres/databaseUpload';
import request from "supertest";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

describe('Upload Router', () => {
    let app: Application;

    beforeAll(() => {
        // Set up express
        app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/upload", uploadRouter);
    });

    it("should respond with 400 if 'balance' string cannot be parsed to float", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "A"; // Testing error in this field
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";

        // Create a fake file
        const fakeFileContents = "5/8/2023,100.00\n";
        const fakeFile = new Blob([fakeFileContents], { type: "text/plain" });
        const buffer = Buffer.from(await fakeFile.arrayBuffer());

        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach("files", buffer, "fake_file.txt");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "Balance could not be converted to float" });
    });

    it("should respond with 400 if 'balance' string is empty", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = ""; // Testing error in this field
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";

        // Create a fake file
        const fakeFileContents = "5/8/2023,100.00\n";
        const fakeFile = new Blob([fakeFileContents], { type: "text/plain" });
        const buffer = Buffer.from(await fakeFile.arrayBuffer());

        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach("files", buffer, "fake_file.txt");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "'Balance' or 'selectedAccount' invalid." });
    });

    it("should respond with 400 if 'selectedAccount' string is empty", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = ""; // Testing error in this field
        const newAccountName = "";

        // Create a fake file
        const fakeFileContents = "5/8/2023,100.00\n";
        const fakeFile = new Blob([fakeFileContents], { type: "text/plain" });
        const buffer = Buffer.from(await fakeFile.arrayBuffer());

        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach("files", buffer, "fake_file.txt");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "'Balance' or 'selectedAccount' invalid." });
    });

    it("should respond with 400 if 'files' field does not exist as attachment", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";

        // Testing absence of fake file buffer
        
        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "Files array was empty" });
    });

    it("should respond with 400 if 'files' does not exist in FormData", async () => {
        // Create form data for upload request
        const formDataToSend = new FormData();

        // Testing absence of files in FormData

        // Append test values
        formDataToSend.append("balance", "1000");
        const selectedAccount = "Generic Account 1";
        formDataToSend.append("selectedAccount", selectedAccount);
        const newAccountName = "";
        formDataToSend.append("newAccountName", newAccountName);

        const response = await request(app)
            .post("/upload/")
            .send(formDataToSend);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "Body or 'files' invalid." });
    });

    it("should return 400 if passed a single unparseable file", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";

        // Create a fake file
        const fakeFileContents = "This is a fake file content."; // Testing error in this field
        const fakeFile = new Blob([fakeFileContents], { type: "text/plain" });

        const buffer = Buffer.from(await fakeFile.arrayBuffer());
        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach("files", buffer, "fake_file.txt");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "ERROR: Failed to parse file." });
    });

    it("should return 400 if passed multiple files and one is unparseable", async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";
    
        // Create fake files
        const fakeFileContents1 = "5/8/2023,234.56\n5/9/2023,-123.45\n";
        const fakeFileContents2 = "4/3/2023,1A00\n"; // Testing error in this field
    
        const fakeFile1 = new Blob([fakeFileContents1], { type: "text/plain" });
        const fakeFile2 = new Blob([fakeFileContents2], { type: "text/plain" });
    
        const buffer1 = Buffer.from(await fakeFile1.arrayBuffer());
        const buffer2 = Buffer.from(await fakeFile2.arrayBuffer());
    
        const response = await request(app)
            .post(endpoint)
            .set("Content-Type", `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach("files", buffer1, "fake_file_1.txt")
            .attach("files", buffer2, "fake_file_2.txt");
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "ERROR: Failed to parse file." });
    });
  
});
  