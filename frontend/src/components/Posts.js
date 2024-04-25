import React,{useContext,useEffect} from "react";
import PostContext from '../context/PostContext'
import PostItem from "./PostItem";

export default function Posts() {
    const context = useContext(PostContext);
    const { GetAllPosts , Posts} = context;

    useEffect(() => {
        GetAllPosts();
        // eslint-disable-next-line
    }, []);

  return (
     <div className="container">
            {Posts.map((post) => (
                <PostItem key={post._id} post={post} />
            ))}
        </div>
  )
}
