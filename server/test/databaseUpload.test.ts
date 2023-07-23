import { describe, expect, test } from '@jest/globals';
import uploadRouter from '../src/Postgres/databaseUpload';
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const FormData = require('form-data');
const { Readable } = require('stream'); // Required for the file mock

describe('Upload Router', () => {
    test('TEST: No file list.', async () => {
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

    test('TEST: Invalid new account.', async () => {
        // Set up express
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use("/upload", uploadRouter);

        // Create form data for upload request
        const formDataToSend = new FormData();
        // Append test values
        formDataToSend.append("balance", "1000");
        // const junkFile = new File(["Junk data."], "junkFile.txt");
        const fileList = new Array<File>(1);
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
  
    // More test cases for other scenarios...
  
});
  