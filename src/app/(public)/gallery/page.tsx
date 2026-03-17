"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeUp,
  staggerContainer,
  fadeUpItem,
} from "@/src/animations/animation";
import Footer from "@/src/components/Footer";

interface GalleryImage {
  id: number;
  url: string;
  galleryId: number;
}

interface Gallery {
  id: number;
  title: string;
  images: GalleryImage[];
}

const API_URL = "/api/gallery";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGalleryTitle, setSelectedGalleryTitle] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (Array.isArray(data)) {
        setGalleries(data);
      } else {
        console.error("Invalid response format:", data);
        setGalleries([]);
      }
    } catch (err) {
      console.error("Failed to fetch galleries", err);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (imageUrl: string, galleryTitle: string) => {
    setSelectedImage(imageUrl);
    setSelectedGalleryTitle(galleryTitle);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedGalleryTitle("");
  };

  // Close lightbox on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedImage]);

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Gallery
            </h1>
            <p className="text-xl text-purple-100">
              Explore our collection of memorable moments and achievements
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {loading ? (
            <div className="space-y-12 md:space-y-20">
              {/* Loading Skeletons */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  {/* Skeleton Header */}
                  <div className="bg-linear-to-r from-slate-300 to-slate-400 px-6 md:px-8 py-6">
                    <div className="h-8 md:h-9 bg-slate-200/50 rounded w-1/3 mb-2"></div>
                    <div className="h-4 md:h-5 bg-slate-200/50 rounded w-20"></div>
                  </div>

                  {/* Skeleton Images Grid */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                        <div
                          key={j}
                          className="aspect-square bg-slate-200 rounded-xl"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <motion.div
              className="text-center py-16 md:py-20"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-xl md:text-2xl text-slate-600 font-semibold">
                No galleries available yet.
              </p>
              <p className="text-slate-500 mt-2">
                Check back soon for updates!
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-12 md:space-y-20"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {galleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  variants={fadeUpItem}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Gallery Title */}
                  <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 md:px-8 py-5 md:py-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {gallery.title}
                    </h2>
                    <p className="text-blue-100 mt-1 text-sm md:text-base">
                      {gallery.images.length}{" "}
                      {gallery.images.length === 1 ? "photo" : "photos"}
                    </p>
                  </div>

                  {/* Gallery Images Grid */}
                  <div className="p-4 md:p-8">
                    {gallery.images.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <svg
                          className="w-16 h-16 mx-auto text-slate-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-slate-500 text-sm md:text-base">
                          No images in this gallery
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {gallery.images.map((img, index) => (
                          <motion.div
                            key={img.id}
                            variants={fadeUpItem}
                            className="group relative aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 ring-2 ring-transparent hover:ring-blue-500"
                            onClick={() => openLightbox(img.url, gallery.title)}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src={img.url}
                              alt={`${gallery.title} - Image ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4">
                                <p className="text-white text-xs md:text-sm font-medium">
                                  Click to view
                                </p>
                              </div>
                            </div>
                            {/* Image number badge */}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {index + 1}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-2 right-2 md:top-4 md:right-4 cursor-pointer text-white text-3xl md:text-4xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-all z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                ×
              </motion.button>

              {/* ESC hint */}
              <motion.div
                className="hidden md:block absolute top-4 left-4 text-white/70 text-sm bg-black/30 px-3 py-2 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Press <kbd className="px-2 py-1 bg-white/20 rounded">ESC</kbd>{" "}
                to close
              </motion.div>

              <motion.div
                className="relative max-w-7xl w-full mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-[70vh] md:h-[80vh]">
                  <Image
                    src={selectedImage}
                    alt={selectedGalleryTitle}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="100vw"
                    priority
                  />
                </div>
                {selectedGalleryTitle && (
                  <motion.div
                    className="text-center mt-3 md:mt-4 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 md:px-6 md:py-3 inline-block mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-white text-sm md:text-lg font-medium">
                      {selectedGalleryTitle}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
