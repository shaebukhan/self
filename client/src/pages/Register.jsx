import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterImg from "../assets/register.jpg";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [auth, setAuth] = useAuth();



    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (password !== cpassword) {
                return toast.error("Password and Confirm Passwords are not Matching !!");
            }
            const res = await axios.post("http://localhost:8000/api/v1/auth/register", {
                name,
                email,
                password,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong !! ");
        }
    };

    useEffect(() => {
        // Check if there's a token and we're on the login/register page
        if (auth.token && (location.pathname === '/login' || location.pathname === '/register')) {
            // Redirect to dashboard and show toast
            toast.error("Already Registered && Logged in now  !!");
            navigate('/dashboard');
        }
    }, [auth.token, location.pathname, navigate]);

    return (
        <div className="container bg-white my-5 rounded-2">
            <h3 className="text-center card-title pt-3">Create an Account</h3>
            <p className="text-center card-text">Join for exclusive access !!</p>
            <div className="row">
                <div className="col-md-6">
                    <div className="card form-container">
                        <div className="card-body">

                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Full Name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter New Password" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="cpassword" value={cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Re-Enter Password" />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg mb-3">Create Account</button>
                                <Link to="/login" className="btn btn-secondary btn-lg mb-3">Sign In</Link>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-center">
                    <img className="img-fluid Auth-img" src={RegisterImg} alt="" />
                </div>
            </div>
        </div>
    );
};

export default Register;
