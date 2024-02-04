import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER } from "../constants/server";
import "../styles/Home.css";
import ModalImage from "react-modal-image";

const fetchImages = async (setImages) => {
  try {
    const response = await axios.get(`${SERVER}/images`);
    setImages(response.data);
  } catch (error) {
    console.log(error);
  }
};

const checkNewImages = async (setImages, images) => {
  try {
    const response = await axios.get(`${SERVER}/images/count`);
    response.data !== images.length ? fetchImages(setImages) : null;
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    fetchImages(setImages);
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

  const handleDrop = async (e) => {
    e.preventDefault();
    const pos = e.target.attributes[0].value;
    const file = e.dataTransfer.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("pos", pos);
    try {
      const response = await axios.post(`${SERVER}/images`, formData);
      console.log(response.status);
      setImages([...images, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadClick = (e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      const pos = e.target.attributes.name.value;
      const formData = new FormData();
      formData.append("image", file);
      formData.append("pos", pos);
      try {
        const response = await axios.post(`${SERVER}/images`, formData);
        setImages([...images, response.data]);
      } catch (error) {
        console.log(error);
      }
    };
    input.click();
  };

  const createCards = (amount) => {
    let tiles = [];
    for (let i = 0; i < amount; i++) {
      const image = images.find((img) => img.pos === i);
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
