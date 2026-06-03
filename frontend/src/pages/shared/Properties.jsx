import React, { useEffect, useRef, useState } from 'react'
import { propertiesStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import { HiFilter, HiSearch, HiX } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import axios from 'axios';
import PropertyCard from '../../components/common/PropertyCard';

const Properties = () => {
    const navigate = useNavigate();
    const {user,token} = useAuth();
    const location = useLocation();
    const [propertyList, setPropertyList] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState({
        city: "",
        propertyType: [],
        bhk: "",
        maxPrice: 100000000,
        amenities: [],
        furnishing: [],
        sort: "latest",
    });

    const propertyTypes = [
        { label: "Flat/Apartment", value: "flat" },
        { label: "Independent House/Villa", value: "villa" },
        { label: "Penthouse", value: "penthouse" },
        { label: "Commercial", value: "commercial" },
    ];
    const bhkOptions = ["1", "2", "3", "4", "5+"];
    const furnishingOptions = [
        { label: "Furnished", value: "furnished" },
        { label: "Semi-Furnished", value: "semi-furnished" },
        { label: "Unfurnished", value: "unfurnished" },
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const city = queryParams.get("city") || "";
        const type = queryParams.get("type") || "";
        const bhk = queryParams.get("bhk") || "";

        const initialFilters = {
            ...filters,
            city,
            propertyType: type ? [type] : [],
            bhk,
        };

        setFilters(initialFilters);
        fetchProperties(initialFilters);
        if (user) {
            fetchWishlist();
        }
    }, [location.search, user]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlistedIds(
                res.data
                    .filter((item) => item.property)
                    .map((item) => String(item.property._id)),
            );
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));
            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${propertyId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                setWishlistedIds((prev) => [...prev, propertyId]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const fetchProperties = async (currentFilters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentFilters.city) params.append("city", currentFilters.city);
            if (currentFilters.propertyType.length > 0)
                params.append("propertyType", currentFilters.propertyType.join(","));
            if (currentFilters.bhk) params.append("bhk", currentFilters.bhk);
            if (currentFilters.maxPrice)
                params.append("maxPrice", currentFilters.maxPrice);
            if (currentFilters.furnishing && currentFilters.furnishing.length > 0)
                params.append("furnishing", currentFilters.furnishing.join(","));
            if (currentFilters.sort) params.append("sort", currentFilters.sort);

            const res = await axios.get(`${API_URL}/api/property?${params.toString()}`);
            setPropertyList(res.data.properties);
            setError(null);
        } catch (err) {
            setError("Failed to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTimer = useRef(null);

    const debouncedFetch = (updatedFilters) => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchTimer.current = setTimeout(() => {
            fetchProperties(updatedFilters);
        }, 500);
    };

    const handleCheckboxChange = (category, value) => {
        const current = [...(filters[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }
        const updatedFilters = { ...filters, [category]: current };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        const updatedFilters = { ...filters, maxPrice: value };
        setFilters(updatedFilters);
        debouncedFetch(updatedFilters);
    };

    const handleBhkSelect = (value) => {
        const updatedFilters = {
            ...filters,
            bhk: filters.bhk === value ? "" : value,
        };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        const updatedFilters = { ...filters, sort: newSort };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const resetFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        const reset = {
            city: "",
            propertyType: [],
            bhk: "",
            maxPrice: 100000000,
            amenities: [],
            furnishing: [],
            sort: "latest",
        };
        setFilters(reset);
        navigate("/properties");
        fetchProperties(reset);
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />

            <div className={s.container}>

                {/* Mobile Filter Button */}
                <div className={s.mobileFilterButtonWrapper}>
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className={s.mobileFilterButton}
                    >
                        <HiFilter /> Show Filters & Search
                    </button>
                </div>

                {/* Mobile Overlay */}
                {showMobileFilters && (
                    <div
                        className={s.mobileOverlay}
                        onClick={() => setShowMobileFilters(false)}
                    />
                )}

                <div className={s.layout}>

                    {/* Sidebar Filters */}
                    <aside className={`${s.sidebar} ${showMobileFilters ? s.sidebarVisible : s.sidebarHidden}`}>

                        {/* Sidebar Header */}
                        <div className={s.sidebarHeader}>
                            <div className={s.sidebarTitleWrapper}>
                                <HiFilter className={s.sidebarTitleIcon} />
                                <h2 className={s.sidebarTitle}>Filters</h2>
                            </div>
                            <div className={s.sidebarHeaderActions}>
                                <button onClick={resetFilters} className={s.resetButton}>
                                    Reset
                                </button>
                                <button
                                    className={s.closeMobileFilters}
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    <HiX />
                                </button>
                            </div>
                        </div>

                        {/* Filter Inputs */}
                        <div className={s.filtersScrollArea}>

                            {/* City Search */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Search by City</label>
                                <div className={s.searchInputWrapper}>
                                    <HiSearch className={s.searchIcon}/>
                                    <input
                                        type="text"
                                        placeholder="Enter city..."
                                        value={filters.city}
                                        onChange={(e) => {
                                            const updatedFilters = { ...filters, city: e.target.value };
                                            setFilters(updatedFilters);
                                            debouncedFetch(updatedFilters);
                                        }}
                                        className={s.searchInput}
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Property Type</label>
                                <div className={s.checkboxGroup}>
                                    {propertyTypes.map((type) => (
                                        <label key={type.value} className={s.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={s.checkbox}
                                                checked={filters.propertyType.includes(type.value)}
                                                onChange={() => handleCheckboxChange("propertyType", type.value)}
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* BHK */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>BHK</label>
                                <div className={s.bhkGroup}>
                                    {bhkOptions.map((bhk) => (
                                        <button
                                            key={bhk}
                                            onClick={() => handleBhkSelect(bhk)}
                                            className={`${s.bhkButton} ${filters.bhk === bhk ? s.bhkButtonActive : s.bhkButtonInactive}`}
                                        >
                                            {bhk}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Max Price */}
                            <div className={s.filterSection}>
                                <div className={s.priceHeader}>
                                    <label className={s.filterLabel}>Max Price</label>
                                    <span className={s.priceValue}>
                                        ₹{(filters.maxPrice / 100000).toFixed(0)}L
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="500000"
                                    max="100000000"
                                    step="500000"
                                    value={filters.maxPrice}
                                    onChange={handlePriceChange}
                                    className={s.priceSlider}
                                />
                                <div className={s.priceLabels}>
                                    <span>₹5L</span>
                                    <span>₹10Cr</span>
                                </div>
                            </div>

                            {/* Furnishing */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Furnishing</label>
                                <div className={s.checkboxGroup}>
                                    {furnishingOptions.map((option) => (
                                        <label key={option.value} className={s.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={s.checkbox}
                                                checked={filters.furnishing.includes(option.value)}
                                                onChange={() => handleCheckboxChange("furnishing", option.value)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className={s.mainContent}>

                        {/* Content Header */}
                        <div className={s.contentHeader}>
                            <p className={s.resultCount}>
                                <strong className={s.resultCountStrong}>
                                    {propertyList.length}
                                </strong> properties found
                            </p>
                            <div className={s.headerControls}>
                                <div className={s.sortControl}>
                                    <span className={s.sortLabel}>Sort:</span>
                                    <select
                                        onChange={handleSortChange}
                                        value={filters.sort}
                                        className={s.sortSelect}
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className={`${s.propertyList} ${s.skeletonGrid}`}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={s.skeletonCard}></div>
                                ))}
                            </div>

                        /* Error State */
                        ) : error ? (
                            <div className={s.errorContainer}>
                                <p>{error}</p>
                                <button
                                    onClick={() => fetchProperties(filters)}
                                    className={s.errorButton}
                                >
                                    Try Again
                                </button>
                            </div>

                        /* Empty State */
                        ) : propertyList.length === 0 ? (
                            <div className={s.emptyContainer}>
                                <div className={s.emptyIconWrapper}>
                                    <HiFilter className={s.emptyIcon} size={32} />
                                </div>
                                <h3 className={s.emptyTitle}>No properties found</h3>
                                <p className={s.emptyText}>
                                    Try adjusting your filters to see more results
                                </p>
                                <button onClick={resetFilters} className={s.emptyButton}>
                                    Reset Filters
                                </button>
                            </div>

                        /* Properties Grid */
                        ) : (
                            <div className={`${s.propertyList} ${s.propertyListGrid}`}>
                                {propertyList.map((property) => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        // renderActions={false}
                                        isWishlisted={wishlistedIds.includes(String(property._id))}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {showMobileFilters && (
                <div onClick={() => setShowMobileFilters(false)} className={s.mobileOverlay} />
            )}
        </div>
    );
};

export default Properties;