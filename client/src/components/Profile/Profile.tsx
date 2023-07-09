import "./Profile.css";
import Deletion from "../Deletion/Deletion";
import Upload from "../Upload/Upload";

function Profile() {
  return (
    <div className="profile">
      <div className="upload">
        <Upload />
      </div>
      <div className="deletion">
        <Deletion />
      </div>
    </div>
  );
}

export default Profile;
