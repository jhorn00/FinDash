import multer from "multer";
import express from "express";
const uploadRouter = express.Router();
import { handleUploadedData, UploadHandlerResponse } from "./databaseUtils";

const upload = multer({ dest: 'uploads/' });

// Handle user file uploads
uploadRouter.post("/", upload.array('files'), async (req, res) => {
    // Validate body and files
    if (!req.body || !req.files) {
      const message = "Body or 'files' invalid.";
      console.log(message);
      res.status(400).json({ success: false, message: message });
      return;
    }
    
    // Validate required body fields existence
    if (!req.body.balance || !req.body.selectedAccount) {
      const message = "'Balance' or 'selectedAccount' invalid.";
      console.log(message);
      res.status(400).json({ success: false, message: message });
      return;
    }

    // Validate new account fields
    if (req.body.selectedAccount === "new" && !req.body.newAccountName) {
      const message = "Selected account is 'new' and 'newAccountName' is invalid.";
      console.log(message);
      res.status(400).json({ success: false, message: message });
      return;
    }
    
    const balanceStr: string = req.body.balance;
    const selectedAccount: string = req.body.selectedAccount;
    const newAccountName: string = req.body.newAccountName;

    // Handle case where balance string is empty
    if (balanceStr.length === 0){
      res.status(400).json({ success: false, message: "Balance string was empty" });
      return;
    }

    // Convert balance to float
    const balance = parseFloat(balanceStr);

    // Handle case where balance cannot be converted to a number
    if (isNaN(balance)) {
      res.status(400).json({ success: false, message: "Balance could not be converted to float" });
      return;
    }

    const files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] = req.files;

    // Handle case where files is not an array
    if (!Array.isArray(files)) {
      res.status(400).json({ success: false, message: "Invalid files" });
      return;
    }

    // Handle case where files array contains nothing
    if (files.length == 0) {
      res.status(400).json({ success: false, message: "Files array was empty" });
      return;
    }

    // Handle the uploaded data and report success/failure
    const response: UploadHandlerResponse = await handleUploadedData(files, balance, selectedAccount, newAccountName);
    res.status(response.code).json({success: response.success, message: response.message});
});

export default uploadRouter;
