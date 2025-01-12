import "./App.css";
import Post from "./components/Post";
import Loader from "./components/Loader";
import { useState, useEffect, useRef } from "react";

async function getPosts(page = 1) {
  const url = `https://dummyjson.com/posts?limit=10&skip=${page * 10}`;
  const res = await fetch(url);
  const { posts } = await res.json();
  return posts;
}

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [farthestPage, setFarthestPage] = useState(1);
  const lastPostRef = useRef(null);

  useEffect(() => {
    getPosts(farthestPage)
      .then((posts) => setPosts(posts))
      .catch((err) => setPosts([]));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        const currentPage = posts.length / 10;
        if (entry.isIntersecting && farthestPage < currentPage + 1) {
          setIsLoading(true);
          const newFarthestPage = currentPage + 1;
          try {
            setFarthestPage(newFarthestPage);
            const newPosts = await getPosts(newFarthestPage);
            setPosts([...posts, ...newPosts]);
          } catch (error) {
            setFarthestPage(currentPage);
          }
          setIsLoading(false);
        }
      },
      { threshold: 0.5 }
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observer.unobserve(lastPostRef.current);
      }
    };
  }, [posts]);

  return (
    <div className="container">
      <div className="post-container">
        <div className="page-header">
          <h1>Posts</h1>
        </div>
        {posts?.map((post, idx) => {
          const isLastPost = idx === posts?.length - 1;
          return (
            <Post
              key={post.id}
              post={post}
              lastPostRef={isLastPost ? lastPostRef : null}
              isLastPost={isLastPost}
            />
          );
        })}
        {isLoading && <Loader />}
      </div>
    </div>
  );
}

export default App;
