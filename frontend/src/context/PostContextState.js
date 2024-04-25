import React, { useState } from 'react';
import PostContext from './PostContext';

const PostState = (props) => {
    const host = "http://localhost:5000";

    const PostInitial = [];
    const UserPostInitial = [];

    const [Posts, setPosts] = useState(PostInitial);
    const [UserPosts, setUserPosts] = useState(UserPostInitial);

    const GetAllPosts = async () => {
        const url = `${host}/api/posts/allposts`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        setPosts(json);
    };

    const likePost = async (postId) => {
        try {
   
            const authToken = localStorage.getItem("token");
    
            const url = `${host}/api/posts/postlike/${postId}/like`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after liking
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            dislikePost(postId);
            console.error("Error liking post:", error.message);
        }
    };
    

    const dislikePost = async (postId) => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/dislikepost/${postId}/dislike`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after disliking
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            console.error("Error disliking post:", error.message);
        }
    };

    const addComment = async (postId, content) => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/addcomment/${postId}/comments`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after adding comment
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            console.error("Error adding comment:", error.message);
        }
    };

    const createPost = async (content, imageUrl) => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/createpost`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
                body: JSON.stringify({ content, imageUrl }),
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after creating a new post
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            console.error("Error creating post:", error.message);
        }
    };

    const getUserPosts = async () => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/userposts`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
            });
            const json = await response.json();
            setUserPosts(json);
        } catch (error) {
            console.error("Error fetching user posts:", error.message);
        }
    };

    const deletePost = async (postId) => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/deletepost/${postId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after deleting the post
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    const updatePost = async (postId, content, imageUrl) => {
        try {
            const authToken = localStorage.getItem("token");
            const url = `${host}/api/posts/updatepost/${postId}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authToken
                },
                body: JSON.stringify({ content, imageUrl }),
            });
            const data = await response.json();
            console.log(data);
            // Update the posts after updating the post
            GetAllPosts();
            getUserPosts();
        } catch (error) {
            console.error("Error updating post:", error.message);
        }
    };

    return (
        <PostContext.Provider value={{ Posts, GetAllPosts, likePost, dislikePost, addComment ,createPost, getUserPosts , UserPosts , deletePost ,updatePost}}>
            {props.children}
        </PostContext.Provider>
    );
};

export default PostState;
