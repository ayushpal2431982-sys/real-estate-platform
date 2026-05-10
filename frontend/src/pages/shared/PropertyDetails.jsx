import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { propertyDetailsStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiry, setInquiry] = useState({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    const [inquiryStatus, setInquiryStatus] = useState({
      loading: false,
      success: false,
      error: null,
    });
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const fetchDetails  = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/property/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}`}: {},
                });
                setProperty(res.data.property);
                setSimilarProperties(res.data.similarProperties || []);

                if (user && user.role === "buyer") {
                    const wishRes = await axios.get(`${API_URL}/api/wishlist`, {
                        headers: {Authorization: `Bearer ${token}`},
                    });
                    const found = wishRes.data.some((item) => item.property?._id === id);
                    setIsInWishlist(found); 
                }
                setLoading(false);
            } 
            
            catch (err) {
                setError("Failed to load property details.");
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user, token]);

    //to handle wishlist toggle
    const handleWishlistToggle = async () => {
        if(!user) return nevigate("/login");
        try {
            
        } 
        
        catch (error) {
            
        }
    }

  return (
    <div className={s.pageContainer}>
        <Navbar/>
    </div>
  )
}

export default PropertyDetails