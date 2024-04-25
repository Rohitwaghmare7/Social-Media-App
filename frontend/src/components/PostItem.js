import React, { useState, useContext } from "react";
import { Card, Image, Row, Col, Form } from 'react-bootstrap';
import { FaRegUser, FaRegHeart, FaRegComment, FaPaperPlane } from "react-icons/fa";
import defaultImage from '../images/default.jpg'
import '../index.css';
import PostContext from "../context/PostContext";

export default function PostItem({ post }) {
    const [commentText, setCommentText] = useState('');
    const { likePost, addComment } = useContext(PostContext);

    const handleCommentSubmit = () => {
        console.log("Comment submitted:", commentText);
        addComment(post._id, commentText)
        setCommentText('');
    };

    const handleLikeClick = () => {
        likePost(post._id);
    };

    return (
        <Card className="mb-2 mt-2" style={{ maxWidth: '100%' }}>
            <Card.Body style={{ background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '50px', borderBottom: '1px solid #ccc' }}>
                    <FaRegUser style={{ marginRight: '10px', fontSize: '24px' }} /> {/* Increased icon size */}
                    <Card.Title style={{ margin: '0' }}>{post.username}</Card.Title>
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
    );
}
