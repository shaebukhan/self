import { Link } from "react-router-dom";
import LoginImg from "../assets/login.jpg";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";


const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();



    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
                email, password
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/dashboard");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong !! ");
        }

    };
    useEffect(() => {
        // Check if there's a token
        if (auth.token) {
            // Redirect to login page
            toast.error("Already Logged in now  !!");
            navigate('/dashboard');
        }
    }, [auth.token, navigate]);
    return (
        <div className="container my-5 rounded-2 bg-white">

            <div className="row">
                <div className="col-md-6 d-flex align-items-center flex-column">
                    <h3 className="card-title pt-3  text-center">Login</h3>
                    <p className="card-text text-center">Unlock Your World !!</p>
                    <form onSubmit={handleLogin} className="w-100">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Enter Your Email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder="Enter Password" />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg mb-3">Login</button>
                        <Link to="/" className="btn btn-secondary btn-lg mb-3">Sign Up</Link>
                    </form>
                </div>
                <div className="col-md-6">
                    <img className="img-fluid Auth-img" src={LoginImg} alt="" />
                </div>
            </div>
        </div>


    );
};

export default Login;
