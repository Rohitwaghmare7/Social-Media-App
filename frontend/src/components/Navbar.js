import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import PostContext from '../context/PostContext';
import '../App.css';

export default function Navbar() {
    const history = useNavigate();
    const { createPost } = useContext(PostContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [postContent, setPostContent] = useState('');
    const fileInputRef = useRef(null);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFile(null);
        setPostContent('');
    };

    const handleShowModal = () => setShowModal(true);

    const handleCreatePostClick = () => {
        handleShowModal();
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        history('/');
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleTextareaChange = (event) => {
        setPostContent(event.target.value);
    };

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

    const handleCreatePost = async () => {
        try {
            let imageUrl = '';
            if (selectedFile) {
                imageUrl = await ConvertImageToBase64(selectedFile);
            }
            createPost(postContent, imageUrl);
            handleCloseModal();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div>
            <nav className="navbar bg-dark navbar-dark">
                <div className="container-fluid">
                    <h1 className="navbar-brand mb-0 h1 text-light logo">Social Media</h1>
                    <div className="d-flex">
                        <Link to="/home" className="text-light me-3" style={{ textDecoration: 'none' }}>Feed</Link>
                        <Link to="/YourPost" className="text-light me-3" style={{ textDecoration: 'none' }}>Your Post</Link>
                        <span className="text-light me-3" onClick={handleCreatePostClick}>Create Post</span>
                        <span className="text-light me-3" onClick={handleLogoutClick}>Logout</span>
                    </div>
                </div>
            </nav>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
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
                                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} accept=".jpeg,.png,.jpg" />
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
                    <Button variant="primary" onClick={handleCreatePost}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
