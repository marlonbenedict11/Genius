"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart, currency, convertToUGX } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        if (!Array.isArray(products)) return;

        const product = products.find((product) => product._id === id);
        if (product) {
            setProductData(product);
            setMainImage(product.images?.[0] || null);
        }
    }, [id, products]);

    if (!productData) return <Loading />;

    const {
        name = "Product Name",
        description = "No description available.",
        offerPrice = 0,
        price = 0,
        images = [],
        category = "General",
    } = productData;

    // Format price in UGX
    const formatPrice = (price) => {
        if (currency === 'UGX') {
            return new Intl.NumberFormat('en-UG', {
                style: 'currency',
                currency: 'UGX',
                maximumFractionDigits: 0
            }).format(convertToUGX ? convertToUGX(price) : price);
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Product Images */}
                    <div className="px-5 lg:px-16 xl:px-20">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                            <Image
                                src={mainImage || "/fallback.jpg"}
                                alt="Product image"
                                className="w-full h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        className="w-full h-auto object-cover mix-blend-multiply"
                                        width={1280}
                                        height={720}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">{name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {[...Array(4)].map((_, i) => (
                                    <Image
                                        key={i}
                                        className="h-4 w-4"
                                        src={assets.star_icon}
                                        alt="star_icon"
                                    />
                                ))}
                                <Image className="h-4 w-4" src={assets.star_dull_icon} alt="star_dull_icon" />
                            </div>
                            <p>(4.5)</p>
                        </div>
                        <p className="text-gray-600 mt-3">{description}</p>
                        <div className="text-3xl font-medium mt-6">
                            {formatPrice(offerPrice)}
                            {offerPrice < price && (
                                <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                    {formatPrice(price)}
                                </span>
                            )}
                        </div>

                        <hr className="bg-gray-600 my-6" />

                        <div className="overflow-x-auto">
                            <table className="table-auto border-collapse w-full max-w-72">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Brand</td>
                                        <td className="text-gray-800/50">Generic</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Color</td>
                                        <td className="text-gray-800/50">Multi</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Category</td>
                                        <td className="text-gray-800/50">{category}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center mt-10 gap-4">
                            <button
                                onClick={() => addToCart(productData._id)}
                                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    addToCart(productData._id);
                                    router.push("/cart");
                                }}
                                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition rounded"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">
                            Featured <span className="text-orange-600">Products</span>
                        </p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                        {products
                            .filter((p) => p._id !== id)
                            .slice(0, 5)
                            .map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                    </div>
                    <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                        See more
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;