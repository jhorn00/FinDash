// Reads a CSV file and returns the relevant dataset
function readCSV(file : File) {
    // Function to read a csv
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target == null){
        return
      }
    };
    reader.readAsDataURL(file);
}

export default readCSV;
