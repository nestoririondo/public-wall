import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER } from "../constants/server";
import "../styles/Home.css";
import ModalImage from "react-modal-image";

const fetchImages = async (setImages, setCurrentWall) => {
  try {
    const response = await axios.get(`${SERVER}/images`);
    setImages(response.data);
    setCurrentWall(response.data[0].wall_id);
  } catch (error) {
    console.log(error);
  }
};

const checkNewImages = async (setImages, images) => {
  try {
    const response = await axios.get(`${SERVER}/images/count`);
    response.data > images.length ? fetchImages(setImages, setCurrentWall) : null;
    console.log(response.data, images.length);
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  const [images, setImages] = useState([]);
  const [currentWall, setCurrentWall] = useState(1);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    fetchImages(setImages, setCurrentWall);
    const intervalId = setInterval(
      () => checkNewImages(setImages, imagesRef.current),
      10000
    );
    return () => clearInterval(intervalId);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add("dragover");
  };

  const handleUpload = async (file, pos) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("pos", pos);
    formData.append("wall_id", currentWall);
    console.log("Formdata", formData);
    try {
      const response = await axios.post(`${SERVER}/images`, formData);
      setImages((prevImages) => [...prevImages, response.data.image]);
      setCurrentWall(response.data.wall_id);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const pos = e.target.attributes[0].value;
    const file = e.dataTransfer.files[0];
    handleUpload(file, pos);
  };

  const handleUploadClick = (e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      const pos = e.target.attributes.name.value;
      handleUpload(file, pos);
    };
    input.click();
  };

  const createCards = (amount) => {
    let tiles = [];
    for (let i = 0; i < amount; i++) {
      const image = images.find(
        (img) => img.pos === i && img.wall_id === currentWall
      );
      tiles.push(
        <div key={i} className="card">
          {!image && (
            <div
              name={i}
              className="dropzone"
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragLeave={(e) => e.target.classList.remove("dragover")}
              onDrop={handleDrop}
            ></div>
          )}
          {image && (
            <div className="image">
              <ModalImage
                small={`${SERVER}/uploads/${image.filename}`}
                large={`${SERVER}/uploads/${image.filename}`}
                hideZoom={true}
              />
            </div>
          )}
        </div>
      );
    }
    return tiles;
  };

  return (
    <div className="home">
      <div className="grid">{createCards(25)}</div>
    </div>
  );
};

export default Home;
