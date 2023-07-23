import { describe, expect, test } from '@jest/globals';
import uploadRouter from '../src/Postgres/databaseUpload';
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

describe('Upload Router', () => {
    test('should respond with 400 if body or files are invalid', async () => {
        // Set up express
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/upload", uploadRouter);

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
        // Set up express
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/upload", uploadRouter);

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
        // Set up express
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/upload", uploadRouter);

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
  
});
  