import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER } from "../constants/server";
import "../styles/Home.css";
import uploadimage from "../assets/icons/uploadimage.png";

const fetchImages = async (setImages) => {
  try {
    const response = await axios.get(`${SERVER}/images`);
    setImages(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  const [postImage, setPostImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages(setImages);
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
      setImages([...images, response.data]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (e) => {
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
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={(e) => e.target.classList.remove("dragover")}
              onDrop={handleDrop}
            ></div>
          )}
          {image && <img src={`${SERVER}/uploads/${image.filename}`} />}
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
