const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

router.post(
    "/createpost",
    fetchUser,
    [
      body("content", "Content must be at least 5 characters long").isLength({ min: 5 }),
      // Add validation for other fields if needed
    ],
    async (req, res) => {
      try {
        const { content, imageUrl } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // Fetch username from the user ID
        const user = await User.findById(req.user.id);
        const username = user.username;

        const post = new Post({ content, imageUrl, userId: req.user.id, username });
        const savedPost = await post.save();
        res.json(savedPost);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
      }
    }
);


// Fetch All Posts
router.get('/allposts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

// Update Post
router.put('/updatepost/:postId', fetchUser, async (req, res) => {
    try {
        const { content, imageUrl } = req.body;
        let post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).send("Not allowed to update this post");
        }
        post.content = content;
        post.imageUrl = imageUrl;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

// Delete Post
router.delete('/deletepost/:postId', fetchUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).send("Not allowed to delete this post");
        }
        await post.remove();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

// Fetch User Specific Posts
router.get('/userposts', fetchUser, async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(userPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});


// Like Post
router.post('/postlike/:postId/like', fetchUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        // Check if the post is already liked by the user
        if (post.likes.includes(req.user.id)) {
            return res.status(400).send("Post already liked by the user");
        }
        post.likes.push(req.user.id);
        await post.save();
        res.json({ message: "Post liked successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

// Dislike Post
router.post('/dislikepost/:postId/dislike', fetchUser, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        // Check if the post is already liked by the user
        if (!post.likes.includes(req.user.id)) {
            return res.status(400).send("Post is not liked by the user");
        }
        // Remove the user's ID from the likes array to dislike the post
        post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
        await post.save();
        res.json({ message: "Post disliked successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

// Add Comment
router.post('/addcomment/:postId/comments', fetchUser, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const newComment = {
            userId: req.user.id,
            content
        };
        post.comments.push(newComment);
        await post.save();
        res.json({ message: "Comment added successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occurred");
    }
});

module.exports = router;
