import { useState, useEffect } from "react";
import "./Profile.css";
import Upload from "../Upload/Upload";
import { Button } from "react-bootstrap";
import axios from "axios";

function Profile() {
  const [accountOptions, setAccountOptions] = useState<string[]>([]);
  useEffect(() => {
    fetchNames(); // Call the function to fetch the names when the component mounts
  }, []);

  // TODO: Use this to pull an account list for edit/deletion
  const fetchNames = async () => {
    try {
      const response = await axios.get("/api/accounts/names");
      const accountNames = response.data; // Assuming the response data is an array of names
      setAccountOptions(accountNames);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadComplete = () => {
    fetchNames();
  };

  // TODO: Adapt this to delete specific accounts of the user
  async function clearDatabase() {
    console.log("clearing database");
    await axios
      .delete("/api/clear")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    fetchNames();
  }

  return (
    <div className="profile">
      <div className="upload">
        <Upload
          accountOptions={accountOptions}
          onUploadComplete={handleUploadComplete}
        />
      </div>
      <div className="deletion">
        <Button
          type="button"
          className="btn btn-danger"
          onClick={clearDatabase}
        >
          Clear Database
        </Button>
      </div>
    </div>
  );
}

export default Profile;
