import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [posts, setPosts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
        setSelected(null); // Reset selected when opening modal
        setSelectedImage(""); // Reset selectedImage when opening modal
        setTitle(""); // Reset title when opening modal
        setDesc(""); // Reset desc when opening modal
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setImage(null); // Clear image state
        setSelectedImage(""); // Clear selectedImage state
        document.getElementById("MyForm").reset();
    };

    const handleLogout = () => {
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
        toast.info("Logged out");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setSelectedImage(""); // Clear selectedImage state when selecting a new image
    };

    const handleDelete = async (p) => {
        if (p && typeof p === 'object' && p._id) {
            try {
                const formData = new FormData();
                formData.append('_id', p._id);
                const url = `http://localhost:8000/api/v1/post/delete-post`;

                const res = await axios.post(url, formData);
                if (res.data.success) {
                    toast.success(res.data.message);
                    getAllPosts();

                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong !!");
            }
        } else {
            console.error('Invalid p object:', p);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            if (!title || !desc || !image || !auth.user.userId) {
                return toast.error("All Fields are Required !!");
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', desc);
            formData.append('image', image);
            formData.append('user_id', auth.user.userId);

            if (selected) {
                // If editing, append post ID
                formData.append('_id', selected._id);

            }

            const url = selected ? `http://localhost:8000/api/v1/post/update-post` : "http://localhost:8000/api/v1/post/save-post";
            const res = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                getAllPosts();
                setIsModalOpen(false);
                setImage(null);
                setSelected(null);
                setSelectedImage("");
                setTitle("");
                setDesc("");
                document.getElementById("MyForm").reset();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong !!");
        }
    };

    const getAllPosts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/v1/post/posts");
            if (data?.success) {
                const userPosts = data.posts.filter(post => post.user === auth.user.userId);
                setPosts(userPosts);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !!");
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    useEffect(() => {
        if (!auth.token) {
            toast.error("Login to Access !!");
            navigate('/login');
        }
    }, [auth.token, navigate]);

    const handleEdit = (p) => {
        if (p && typeof p === 'object' && p._id) {
            setSelected(p);
            setSelectedImage(p.image);
            setTitle(p.title);
            setDesc(p.description);
            setIsModalOpen(true);
        } else {
            console.error('Invalid p object:', p);
        }
    };

    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="card p-3">
                        <h3>User ID: {auth?.user?.userId}</h3>
                        <h3>Name: {auth?.user?.name}</h3>
                        <h3>Email: {auth?.user?.email}</h3>
                        <h3>Role: {auth?.user?.role}</h3>
                    </div>
                </div>
                <button onClick={showModal} className='btn btn-primary'>Add new Post</button>
                <button onClick={handleLogout} className='btn btn-danger'>Logout</button>

                <div className="row my-3">
                    {posts?.map((p) => (
                        <div className="col-md-4 mb-3" key={p._id}>
                            <div className="card">
                                <img style={{ height: "200px" }} src={`http://localhost:8000/uploads/${p.image}`} className=" img-fluid" alt={p.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.title}</h5>
                                    <p className="card-text">Description: {p.description}</p>
                                    <button onClick={() => handleEdit(p)} className='btn btn-primary'>Edit</button>
                                    <button onClick={() => handleDelete(p)} className='btn btn-danger'>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal open={isModalOpen} footer={null} onCancel={handleCancel}>
                <h4 className='text-uppercase mb-3'>Instagram Post</h4>
                <form onSubmit={handlePost} id='MyForm'>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Title</label>
                        <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Description</label>
                        <textarea className="form-control" value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder='Description' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Choose image</label>
                        <input className="form-control" accept="image/jpeg, image/png" type="file" onChange={handleImageChange} />
                    </div>

                    <div className="mb-3">
                        {/* Show existing image if editing */}
                        {selectedImage && (
                            <div className="text-center mb-3">
                                <img
                                    className=""
                                    src={`http://localhost:8000/uploads/${selectedImage}`}
                                    alt="Current Image"
                                    height={"150px"}
                                />
                            </div>
                        )}

                        {/* Show selected image if uploading */}
                        {image && (
                            <div className="text-center">
                                <img
                                    className=""
                                    src={URL.createObjectURL(image)}
                                    alt="Selected Image"
                                    height={"150px"}
                                />
                            </div>
                        )}
                    </div>
                    <button className='btn btn-primary'>{selected ? "Update" : "Post"}</button>
                </form>
            </Modal>
        </>
    );
};

export default Dashboard;
