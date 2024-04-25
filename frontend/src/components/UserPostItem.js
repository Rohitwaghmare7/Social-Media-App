import React, { useState, useContext, useRef } from "react";
import { Card, Image, Row, Col, Form, Modal, Button } from 'react-bootstrap';
import { FaRegUser, FaRegHeart, FaRegComment, FaPaperPlane, FaEllipsisV, FaTrash } from "react-icons/fa";
import defaultImage from '../images/default.jpg';
import '../index.css';
import PostContext from "../context/PostContext";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

// Function to convert image to base64
const ConvertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    });
};

export default function UserPostItem({ post }) {
    const [commentText, setCommentText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const { likePost, addComment, deletePost, updatePost } = useContext(PostContext);
    const fileInputRef = useRef(null);

    const handleCommentSubmit = () => {
        console.log("Comment submitted:", commentText);
        addComment(post._id, commentText);
        setCommentText('');
    };

    const handleLikeClick = () => {
        likePost(post._id);
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDropdownItemClick = (action) => {
        if (action === 'update') {
            console.log("Update clicked");
            setPostContent(post.content); // Set initial content for update
            setShowModal(true); // Open the modal for update
        } else if (action === 'delete') {
            console.log("Delete clicked");
            deletePost(post._id); // Call deletePost function with post ID
        }
        setShowDropdown(false); // Close the dropdown after clicking an option
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleTextareaChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleUpdatePost = async () => {
        try {
            let imageUrl = '';
            if (selectedFile) {
                imageUrl = await ConvertImageToBase64(selectedFile);
            }
            // Update the post with new content and image
            updatePost(post._id, postContent, imageUrl);
            setShowModal(false); // Close the modal after updating
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <Card className="mb-2 mt-2" style={{ maxWidth: '100%' }}>
                <Card.Body style={{ background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaRegUser style={{ marginRight: '10px', fontSize: '24px' }} />
                            <Card.Title style={{ margin: '0' }}>{post.username}</Card.Title>
                        </div>
                        <div>
                            <FaEllipsisV style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} onClick={handleDropdownToggle} />
                            {showDropdown && (
                                <div style={{ position: 'absolute', top: '55px', right: '0', background: 'white', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', borderRadius: '5px', zIndex: '999', minWidth: '120px', padding: '5px' }}>
                                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                                        <li style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleDropdownItemClick('update')}>Update</li>
                                        <li style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleDropdownItemClick('delete')}><FaTrash style={{ marginRight: '5px' }} />Delete</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <Row>
                        <Col sm={4} className="bg-dark d-flex align-items-center justify-content-center p-0">
                            <div style={{ height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image className="" src={post.imageUrl || defaultImage} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            </div>
                        </Col>
                        <Col sm={8}>
                            <div className="mt-2">
                                <h6 style={{ fontSize: '20px', fontWeight: 700 }}>{post.content}</h6>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                    <FaRegHeart style={{ fontSize: '16px', color: 'red' }} onClick={handleLikeClick} />
                                    <span style={{ fontSize: '17px', marginLeft: '5px' }}>{post.likes.length} Likes</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaRegComment style={{ fontSize: '16px', marginRight: '5px' }} />
                                    <span style={{ fontSize: '17px' }}>{post.comments.length} comments</span>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <div style={{ height: '100px' }}>
                                    {post.comments.map((comment) => (
                                        <div key={comment._id.$oid} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                                            <FaRegUser style={{ marginRight: '5px' }} />
                                            <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
                                                <strong>{comment.username}</strong> {comment.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <Form className="mt-3">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaRegUser style={{ marginRight: '10px' }} />
                                    <Form.Control
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <FaPaperPlane style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={handleCommentSubmit} />
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Modal for Update Post */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="image">
                                Upload Image
                            </label>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px' }}>
                                {selectedFile ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="Uploaded File" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                ) : (
                                    <MdOutlineAddPhotoAlternate className="text-gray-400" style={{ fontSize: '50px' }} onClick={handleIconClick} />
                                )}
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".jpeg,.png,.jpg" />
                            </div>
                        </div>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="postContent" className="form-label">Post Content</label>
                                <textarea className="form-control" id="postContent" rows="3" value={postContent} onChange={handleTextareaChange}></textarea>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleUpdatePost}>Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
