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

    test('should respond with 400 if body or files are invalid', async () => {
        // Create form data for upload request
        const formDataToSend = new FormData();
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
  
    test('TEST: Empty file list.', async () => {
        // Create form data for upload request
        const formDataToSend = new FormData();
        // Append test values
        formDataToSend.append("balance", "1000");
        const fileList = new Array<File>();
        fileList.forEach((file) => {
            formDataToSend.append(`files`, file);
        });
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

    test('TEST: Failure to parse single file.', async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";

        // Create a fake file
        const fakeFileContents = "This is a fake file content.";
        const fakeFile = new Blob([fakeFileContents], { type: "text/plain" }); // Use the native Blob constructor

        const buffer = Buffer.from(await fakeFile.arrayBuffer());
        const response = await request(app)
            .post(endpoint)
            .set('Content-Type', `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach('files', buffer, 'fake_file.txt');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "ERROR: Failed to parse file." });
    });

    test('TEST: Failure to parse multiple files.', async () => {
        // Set request data
        const endpoint = "/upload/";
        const balance = "1000";
        const selectedAccount = "Generic Account 1";
        const newAccountName = "";
    
        // Create fake files
        const fakeFileContents1 = "5/8/2023,234.56\n5/9/2023,-123.45\n";
        const fakeFileContents2 = "4/3/2023,100\n";
    
        const fakeFile1 = new Blob([fakeFileContents1], { type: "text/plain" });
        const fakeFile2 = new Blob([fakeFileContents2], { type: "text/plain" });
    
        const buffer1 = Buffer.from(await fakeFile1.arrayBuffer());
        const buffer2 = Buffer.from(await fakeFile2.arrayBuffer());
    
        const response = await request(app)
            .post(endpoint)
            .set('Content-Type', `multipart/form-data`)
            .field("balance", balance)
            .field("selectedAccount", selectedAccount)
            .field("newAccountName", newAccountName)
            .attach('files', buffer1, 'fake_file_1.txt') // Attach the first fake file
            .attach('files', buffer2, 'fake_file_2.txt'); // Attach the second fake file
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ success: false, message: "ERROR: Failed to parse file." });
    });
  
});
  