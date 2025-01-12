import React from "react";

function Post({ post, lastPostRef, isLastPost }) {
  const { id, userId, title, body, tags, views, reactions } = post;

  return (
    <div id={id} className="post" ref={isLastPost ? lastPostRef : null}>
      <h1 className="post-title">{title}</h1>
      <p className="post-body">{body}</p>

      <div className="tag-container">
        {tags?.map((tag) => (
          <div className="tag">
            <p>{tag}</p>
          </div>
        ))}
      </div>

      <div className="interaction-container">
        <p>{views} views</p>
        <div className="reactions-container">
          <p>{reactions?.likes} 👍</p>
          <p>{reactions?.dislikes} 👎</p>
        </div>
      </div>
    </div>
  );
}

export default Post;
