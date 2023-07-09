import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

async function clearDatabase() {
  console.log("clearing database");
  await axios
    .delete("/api/clear")
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
}

function Deletion() {
  return (
    <div>
      <Button type="button" className="btn btn-danger" onClick={clearDatabase}>
        Clear Database
      </Button>
    </div>
  );
}

export default Deletion;
