import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import "./Upload.css";

// Interface to act as form data type
interface FormData {
  balance: string;
  files: File[];
  selectedAccount: string;
  newAccountName: string;
}

function Upload() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    balance: "",
    files: [] as File[],
    selectedAccount: "",
    newAccountName: "",
  });

  const [accountOptions, setAccountOptions] = useState<string[]>([]);
  useEffect(() => {
    fetchNames(); // Call the function to fetch the names when the component mounts
  }, []);

  const fetchNames = async () => {
    try {
      const response = await axios.get("/api/accounts/names");
      const accountNames = response.data; // Assuming the response data is an array of names
      setAccountOptions(accountNames);
    } catch (error) {
      console.log(error);
    }
  };

  // Balance text field handling
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // File selection handling
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, files });
  };

  // Submission handling
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { balance, files, selectedAccount, newAccountName } = formData;

    // Only send to database if balance is populated.
    if (!balance) {
      alert("Please enter the current account balance.");
      return;
    }

    // Only send to databse if account name is selected
    if (!selectedAccount) {
      alert("Please select an account.");
      return;
    }

    // If new account is selected, new account name must be populated
    if (selectedAccount === "new" && !newAccountName) {
      alert("Please give the new account a name.");
      return;
    }

    // Only send to database if files list is populated
    // The API has handling for this if it gets removed at some point
    if (files.length === 0) {
      alert("Please select files for upload.");
      return;
    }

    console.log("Balance:", balance);
    console.log("Files:", files);

    // Database API post with file list and balance
    await sendToDatabase();

    // Reset form data
    setFormData({
      balance: "",
      files: [],
      selectedAccount: "",
      newAccountName: "",
    });
  };

  const handleNewOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, newAccountName: value });
  };

  async function sendToDatabase() {
    const formDataToSend = new FormData();
    formDataToSend.append("balance", formData.balance);
    formData.files.forEach((file) => {
      formDataToSend.append(`files`, file);
    });
    formDataToSend.append("selectedAccount", formData.selectedAccount);
    formDataToSend.append("newAccountName", formData.newAccountName);

    await axios
      .post("/api/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  const remainingCharacters = 50 - formData.newAccountName.length;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="upload-form" className="mb-3">
          <Form.Label>Transactions CSV</Form.Label>
          <Form.Control
            type="file"
            name="files"
            accept=".csv"
            multiple
            onChange={handleFileChange}
          />
        </Form.Group>
        <Form.Group controlId="upload-form" className="mb-3">
          <Form.Label>Current Balance</Form.Label>
          <Form.Control
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            placeholder="Enter balance in USD ($)"
          />
        </Form.Group>
        <Form.Group controlId="upload-form" className="mb-3">
          <Form.Label>Select Account</Form.Label>
          <Form.Control
            className="mb-2"
            as="select"
            name="selectedAccount"
            value={formData.selectedAccount}
            onChange={handleChange}
          >
            <option value="">Select Account</option>
            {accountOptions.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
            <option value="new">New...</option>
          </Form.Control>
          {formData.selectedAccount === "new" && (
            <>
              <Form.Control
                type="text"
                name="newAccountName"
                value={formData.newAccountName}
                onChange={handleNewOptionChange}
                placeholder="Enter new account name"
                maxLength={50}
              />
              <p>{remainingCharacters} characters remaining</p>
            </>
          )}
        </Form.Group>
        <button
          type="submit"
          className="btn btn-success"
          disabled={
            !formData.balance ||
            !formData.files.length ||
            !formData.selectedAccount ||
            (formData.selectedAccount === "new" && !formData.newAccountName)
          }
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

export default Upload;
