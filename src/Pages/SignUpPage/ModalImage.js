import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import { apiURL } from "../../Config/Config";
import { withRouter } from "react-router";

const ModalImage = (props) => {
  const userId = props.userId;
  const [photo, setphoto] = useState(null);
  const [profileImg, setProfileImg] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImg(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setphoto(e.target.files[0]);
  };
  const cancelImg = () => {
    setProfileImg(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
  };
  const savePhoto = () => {
    let data = new FormData();
    data.append("image", photo);
    fetch(apiURL + "/user/image/" + userId, {
      method: "post",
      headers: {
        // authorization: `Bearer ${this.props.auth.token}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        props.goToLogin();
      }).catch((err) => {console.log(err);});
  };

  return (
    <>

      <Modal
        className="ModalImage"
        show={props.show}
        onHide={() => props.goToLogin()}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Ajouter une photo de profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pageph">
            <div className="container">
              <div className="img-holder">
                <img
                  src={profileImg}
                  alt=""
                  id="img"
                  className="img"
                  onClick={cancelImg}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                name="image-upload"
                id="input"
                onChange={imageHandler}
              />
              <div className="label">
                <label className="image-upload" htmlFor="input">
                  <InsertPhotoIcon />
                  choisir votre photo
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={savePhoto}>
            Enregistrer la photo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withRouter(ModalImage);
