import React,{useContext,useEffect} from "react";
import PostContext from '../context/PostContext'
import UserPostItem from "./UserPostItem";
import '../App.css';

export default function YourPost() {
  const context = useContext(PostContext);
  const { getUserPosts , UserPosts} = context;

  useEffect(() => {
    getUserPosts();
    // eslint-disable-next-line
}, []);

  return (
    <div className="container">
      <h2 className="mt-3 mb-2">your posts</h2>
            {UserPosts.map((post) => (
                <UserPostItem key={post._id} post={post} />
            ))}
        </div>
  )
}
