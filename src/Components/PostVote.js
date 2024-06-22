import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const PostVote = ({ postId, initialVotes, userId }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(null);
  const apiURL = "http://localhost:3000";

  const fetchUserVote = async () => {
    try {
      const response = await fetch(
        `${apiURL}/post/isvoted/${userId}/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const voteData = await data.data;
        setUserVote(voteData);

        console.log(userVote);
      } else {
        console.error(
          "Failed to fetch user vote:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching user vote:", error);
    }
  };

  useEffect(() => {
    const fetchUserVoteData = async () => {
      await fetchUserVote();
    };
    fetchUserVoteData();
  }, [postId, userId, userVote]);

  const handleVote = async (voteType) => {
    const isUpvote = voteType === "1";
    if (isUpvote === userVote) {
      await removeVote();
    } else {
      const voteData = {
        userID: userId,
        postID: postId,
        vote: voteType,
      };

      const response = await fetch(`${apiURL}/post/vote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteData),
      });

      if (response.ok) {
        if (userVote !== null) {
          setVotes(isUpvote ? votes + 2 : votes - 2);
        } else {
          setVotes(isUpvote ? votes + 1 : votes - 1);
        }
        setUserVote(isUpvote);
      } else {
        console.error("Failed to vote:", response.status, response.statusText);
      }
    }
  };

  const removeVote = async () => {
    const response = await fetch(`${apiURL}/post/removeVote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userId,
        postID: postId,
      }),
    });

    if (response.ok) {
      setVotes(userVote === true ? votes - 1 : votes + 1);
      setUserVote(null);
    }
  };

  return (
    <div className="post-vote">
      <IconButton
        onClick={() => handleVote("1")}
        color={userVote === true ? "primary" : "default"}
      >
        <ThumbUpIcon />
      </IconButton>
      <span>{votes}</span>
      <IconButton
        onClick={() => handleVote("0")}
        color={userVote === false ? "secondary" : "default"}
      >
        <ThumbDownIcon />
      </IconButton>
    </div>
  );
};

export default PostVote;
