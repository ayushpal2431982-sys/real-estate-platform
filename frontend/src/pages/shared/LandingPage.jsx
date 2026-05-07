import React, { useEffect, useState } from 'react'
import {landingPageStyles as s} from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import { HiCurrencyDollar, HiHome, HiLightningBolt, HiLocationMarker, HiOfficeBuilding, HiSearch, HiShieldCheck, HiVideoCamera } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
import axios from 'axios';
import banner from "../../assets/bannerimage.png";

const LandingPage = () => {

    const navigate = useNavigate();
    const {user, token} = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [propertyType, setPropertyType] = useState("Select Type");
    const [propertyCounts, setPropertyCounts] = useState({
        flat: 0,
        villa: 0,
        penthouse: 0,
        commercial: 0
    });

    const [wishlistedIds, setWishlistedIds] = useState([]);

    useEffect(() => {
        fetchProperties();
        fetchCounts();
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}`},
            });
            setWishlistedIds(
                res.data
                .filter((item) => item.property)
                .map((item) => String(item.property._id)),
            );
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlited = wishlistedIds.includes(propertyId);
            if (isWishlited) {
                await axios.delete(`${API_URL}/api/wishlist${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));
            } else {
                await axios.post(`${API_URL}/api/wishlist/${propertyId}`, {}, {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setWishlistedIds((prev) => [...prev, propertyId]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const fetchCounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/property/counts`);
            if(res.data.success) {
                setPropertyCounts(res.data.counts);
            }
        } catch (err) {
            console.error("Failed to fetch property counts:", err);
        }
    };

    const fetchProperties = async (search = "") => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/property?city=${search}`);
            setProperties(res.data.properties || res.data || []);
            setError(null);
        } catch (err) {
            setError("Failed to load properties. Please try again");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append("city", searchTerm);
        if (propertyType !== "Select Type") params.append("type", propertyType);
        navigate(`/properties?${params.toString()}`);
    };

    const categories = [
        { name: "Modern Flats", count: propertyCounts.flat || 0, icon: <HiOfficeBuilding size={32} />, type: "flat" },
        { name: "Luxury Villas", count: propertyCounts.villa || 0, icon: <HiHome size={32} />, type: "villa" },
        { name: "Penthouse", count: propertyCounts.penthouse || 0, icon: <HiOfficeBuilding size={32} />, type: "penthouse" },
        { name: "Commercial", count: propertyCounts.commercial || 0, icon: <HiOfficeBuilding size={32} />, type: "commercial" },
    ];
  
    const features = [
        { title: "Verified Trust", desc: "Every listing is strictly audited for ownership, condition, and legality.", icon: <HiShieldCheck size={24} /> },
        { title: "Smart Search", desc: "Our AI-driven algorithms help you find the best matches based on preferences.", icon: <HiLightningBolt size={24} /> },
        { title: "Best Value", desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.", icon: <HiCurrencyDollar size={24} /> },
        { title: "Virtual Tours", desc: "High-definition 3D tours allow you to experience the property from home.", icon: <HiVideoCamera size={24} /> },
    ];

    return (
        <div className={s.bgMain}>
            <Navbar />

            <section className={s.heroSection}>
                <div className={s.heroContent}>
                    <span className={s.badge}>Trusted by 20,000+ homeowners</span>
                    <h1 className={s.heroTitle}>
                        Find Your <span className={s.textGradient}>Perfect</span> Next Chapter.
                    </h1>
                    <p className={s.heroSubtitle}>
                        Experience the most advanced real estate search platform. Discovered
                        verified listings, connect with top agents, and find a place you'll love.
                    </p>

                    {/* ✅ Both fields inside form, side by side */}
                    <form onSubmit={handleSearch} className={s.searchForm}>

                        {/* Location Field */}
                        <div className={s.searchField}>
                            <div className={s.textPrimary}>
                                <HiLocationMarker size={26} />
                            </div>
                            <div className={s.flexCol}>
                                <label className={s.labelSmall}>Location</label>
                                <input
                                    type="text"
                                    placeholder="Where are you looking?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={s.inputTransparent}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={s.searchDivider}></div>

                        {/* Property Type Field */}
                        <div className={s.searchField}>
                            <div className={s.textPrimary}>
                                <HiHome size={26} />
                            </div>
                            <div className={s.flexCol}>
                                <label className={s.labelSmall}>Property Type</label>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className={`${s.inputTransparent} cursor-pointer`}
                                >
                                    <option value="Select Type">Select Type</option>
                                    <option value="flat">Flat/Apartment</option>
                                    <option value="villa">Villa/House</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                        </div>
                        {/* Search Button */}
                        <button type="submit" className={s.searchButton}>
                           <HiSearch size={22} /> Search
                        </button>
                    </form>

                    {/*  stats   */}
                    <div className={s.statsContainer}>
                        <div className={s.statItemFlex}>
                            <h3 className={s.statNumber}>12k+</h3>
                            <p className={s.statLabel}>Ready Properties</p>
                        </div>
                        <div className={s.statItemBorder}>
                        <h3 className={s.statNumber}>500+</h3>
                        <p className={s.statLabel}>Agent Network</p>
                        </div>
                        <div className={s.statItemBorder}>
                        <h3 className={s.statNumber}>4.9/5</h3>
                        <p className={s.statLabel}>User Rating</p>
                        </div>
                    </div>
                </div>
                {/*  hero image  */}
                <div className={s.heroImageContainer}>
                    <div className={s.imageWrapper}>
                        <img src={banner} alt="banner" className={s.heroImage} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;