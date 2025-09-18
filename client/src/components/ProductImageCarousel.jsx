import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Portal } from "react-portal";
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize } from "react-icons/fi";
import { getProducImages } from "../services/productAPIServices";

const ProductImageCarousel = ({ productID, mainImage, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const productImages = await getProducImages(productID);

        setImages([mainImage, ...productImages.data]);
      } catch (error) {
        setImages([mainImage]);
      }
    };
    setShow(true);
    fetchImages();
    //   document.body.style.overflow = "hidden";
  }, []);

  const handleClose = () => {
    // document.body.style.overflow = "unset";
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  if (images.length < 1) return;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: show ? 1 : 0.95, opacity: show ? 1 : 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden"
          onClick={stopPropagation}
        >
          <button
            onClick={handleClose}
            className="absolute cursor-pointer top-4 right-4 z-20 p-1 md:p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors duration-200"
          >
            <FiX className="text-white" size={22} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex].image}
                alt={`Product image ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="min-w-full max-h-full object-contain"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors duration-200"
                >
                  <FiChevronLeft className="text-white" size={26} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors duration-200"
                >
                  <FiChevronRight className="text-white" size={26} />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-21 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-full text-xs backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl max-w-full overflow-x-auto md:overflow-visible">
              {images
                .slice(0, window.innerWidth < 768 ? 4 : images.length)
                .map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? "border-blue-500 scale-105"
                        : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

              {window.innerWidth < 768 && images.length > 4 && (
                <button
                  onClick={() => openInNewTab(`/product/${images[1].product}`)}
                  className="w-12 h-12 flex items-center justify-center bg-gray-700 text-white rounded-lg border-2 border-transparent hover:border-white/50"
                >
                  +{images.length - 4}
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => window.open(images[currentIndex].image, "_blank")}
            className="absolute cursor-pointer top-4 left-4 z-20 p-1.5 md:p-2.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors duration-200"
            title="Open in new tab"
          >
            <FiMaximize className="text-white" size={18} />
          </button>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default ProductImageCarousel;
