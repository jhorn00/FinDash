import { describe, expect, test } from '@jest/globals';
import uploadRouter from '../src/Postgres/databaseUpload';
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

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
        // const fileList = new Array<File>();
        // fileList.forEach((file) => {
        //     formDataToSend.append(`files`, file);
        // });
        const selectedAccount = "Generic Account 1";
        formDataToSend.append("selectedAccount", selectedAccount);
        const newAccountName = "";
        formDataToSend.append("newAccountName", newAccountName);

        const response = await request(app)
            .post("/upload/")
            .send(formDataToSend);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ success: false, message: "Body or 'files' invalid." });
    });
  
    // More test cases for other scenarios...
  
});
  