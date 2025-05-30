'use client';

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
    const { products } = useAppContext();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Derive unique categories from products
    const categories = useMemo(() => {
        const allCategories = products.map((p) => p.category || "Uncategorized");
        return ["All", ...new Set(allCategories)];
    }, [products]);

    // Filter logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                selectedCategory === "All" || product.category === selectedCategory;

            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col px-6 md:px-16 lg:px-32">
                {/* Header */}
                <div className="flex flex-col items-start pt-12">
                    <p className="text-2xl font-medium">All Products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full" />
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 w-full">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
                    />

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {categories.map((cat, i) => (
                            <option key={i} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-muted-foreground">
                            No products found.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
