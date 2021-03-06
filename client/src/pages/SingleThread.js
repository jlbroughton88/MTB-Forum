import CommentFeed from "./CommentFeed";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStatusUrl } from "../contexts/statusUrl";
import { useUser } from "../contexts/user";
import axios from "axios";
import "./styles/SingleThread.scss";

const SingleThread = () => {
  const { serverUrl } = useStatusUrl();
  const { user } = useUser();
  const { categoryUrl, id } = useParams();
  const [topic, setTopic] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${serverUrl}/api/get-single-thread/${id}`)
      .then((res) => {
        setTopic({
          title: res.data.title,
          mainText: res.data.main_text,
          username: res.data.username,
          category: res.data.category,
          dateCreated: res.data.date_created,
          timeCreated: res.data.time_created,
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <span></span>
      </div>
    );
  }

  return (
    <div className="singleThreadParent">
      <Link className="backButton" to={`/forum/${categoryUrl}/1`}>
        Back
      </Link>
      <div className="threadInfoParent">
        <h1 className="title">{topic.title}</h1>
        <p className="mainText">{topic.mainText}</p>
        <span className="usernameParent">
          Posted by &nbsp;<p className="username">{topic.username}</p>
        </span>
        <div className="dateTime">
          <p className="time">{topic.timeCreated}</p>
          <p className="date">{topic.dateCreated}</p>
        </div>
      </div>

      <CommentFeed id={id} />
    </div>
  );
};

export default SingleThread;
