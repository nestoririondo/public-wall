import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER } from "../constants/server";
import "../styles/Home.css";

const Home = () => {
  const [postImage, setPostImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${SERVER}/images`);
        setImages(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postImage) return;
    const formData = new FormData();
    formData.append("image", postImage[0]);
    formData.append("pos", e.target.name);
    console.log(formData);
    try {
      const response = await axios.post(`${SERVER}/images`, formData);
      setImages([...images, response.data]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createCards = (amount) => {
    let tiles = [];
    for (let i = 0; i < amount; i++) {
      const image = images.find((img) => img.pos === i);
      tiles.push(
        <div key={i} className="card">
          {!image && (
            <form onSubmit={handleSubmit} name={i}>
              <input
                onChange={(e) => setPostImage(e.target.files)}
                type="file"
              />
              <button type="submit">Upload</button>
            </form>
          )}
          {image && <img src={`${SERVER}/uploads/${image.filename}`} />}
        </div>
      );
    }
    return tiles;
  };

  return (
    <div className="Home">
      <div className="grid">{createCards(25)}</div>
    </div>
  );
};

export default Home;
