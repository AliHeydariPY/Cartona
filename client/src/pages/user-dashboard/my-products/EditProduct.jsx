import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { useAtom } from "jotai";
import { userAtom } from "../../../atoms/userAtom";

import { productFormSchema } from "../../../validations/productForm";
import ProductNotFound from "../../../components/ProductNotFound";
import CreateCollectionPopup from "../../../components/pop-ups/CreateCollectionPopup";

import { errorToast, successToast } from "../../../utils/toast";
import {
  getMainCategories,
  getSubCategories,
  getProduct,
  getCategory,
  editProduct,
  getCollections,
  getCollection,
} from "../../../services/productAPIServices";

import HeaderSection from "../../../components/my-products/edit-product/HeaderSection";
import ImageUploadSection from "../../../components/my-products/edit-product/ImageUploadSection";
import BasicInfoSection from "../../../components/my-products/edit-product/BasicInfoSection";
import PricingSection from "../../../components/my-products/edit-product/PricingSection";
import DiscountSection from "../../../components/my-products/edit-product/DiscountSection";
import AmazingOfferSection from "../../../components/my-products/edit-product/AmazingOfferSection";
import CollectionSection from "../../../components/my-products/edit-product/CollectionSection";
import DescriptionSection from "../../../components/my-products/edit-product/DescriptionSection";
import ActionButtons from "../../../components/my-products/edit-product/ActionButtons";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user] = useAtom(userAtom);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState([]);
  const [firstImage, setFirstImage] = useState(true);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAmazingOffer, setIsAmazingOffer] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [collections, setCollections] = useState([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollectionEnabled, setIsCollectionEnabled] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const selectedProduct = await getProduct(id);
        setProduct(selectedProduct.data);
        initializeProductStates(selectedProduct.data);

        const category = await getCategory(selectedProduct.data.category);
        setSelectedCategory(category.data);

        await initializeCollections(selectedProduct.data);
      } catch {
        setNotFound(true);
      }
    };
    fetchData();
  }, [user]);

  const initializeProductStates = (productData) => {
    setHasDiscount(!!productData.discount_period);
    setIsAmazingOffer(!!productData.amazing_offer_period);
  };

  const initializeCollections = async (productData) => {
    const collectionsData = await getCollections();

    setCollections(() =>
      collectionsData.data.filter(
        (collection) => collection.storekeeper == user.storekeeper_id
      )
    );
    if (productData.collection) {
      const selectedColl = await getCollection(productData.collection);
      setIsCollectionEnabled(true);
      setSelectedCollection(selectedColl.data);
    } else {
      setIsCollectionEnabled(false);
    }
  };

  useEffect(() => {
    if (!selectedMainCategory) return;
    fetchSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!product) return;
    if (product.image) {
      setImage([product.image]);
    }
  }, [product]);

  useEffect(() => {
    loadMainCategories();
  }, []);

  const fetchSubCategories = async () => {
    const categories = await getSubCategories(selectedMainCategory.id);
    setSubCategories(categories.data);
  };

  const loadMainCategories = async () => {
    const categories = await getMainCategories();
    setMainCategories(categories.data);
  };

  const handleImageUpload = (e, slot) => {
    const file = e.target.files[0];
    if (file) {
      setImage((prev) => ({ ...prev, [slot]: file }));
    }
  };

  const handleRemoveImage = (slot) => {
    setImage((prev) => {
      const newImages = { ...prev };
      delete newImages[slot];
      return newImages;
    });
    setFirstImage(false);
  };

  const handleSubmit = (values) => {
    const formData = prepareFormData(values);

    editProduct(formData)
      .then(() => successToast("The product was successfully updated"))
      .catch(() => errorToast("There was a problem updating the product"));
  };

  const prepareFormData = (values) => {
    const formData = new FormData();
    formData.append("id", id);

    if (image[0]?.name) {
      formData.append("image", values.image);
    }

    const fields = [
      "name",
      "price",
      "stock_quantity",
      "discounted_price",
      "discount_percentage",
      "discount_period",
      "amazing_offer",
      "amazing_offer_period",
      "collection",
      "description",
      "images_set",
    ];

    fields.forEach((field) => {
      if (field === "category") {
        formData.append("category", Number(selectedCategory.id));
      } else {
        formData.append(field, values[field]);
      }
    });

    return formData;
  };

  if (notFound) return <ProductNotFound />;
  if (!product || !selectedCategory) return null;

  const initialValues = {
    id: id,
    image: image[0] || null,
    name: product.name || "",
    category: selectedCategory.id || "",
    price: product.price || "",
    stock_quantity: product.stock_quantity || "",
    description: product.description || "",
    discounted_price: product.discounted_price || "",
    discount_percentage: product.discount_percentage || "",
    discount_period: product.discount_period
      ? new Date(product.discount_period).toISOString().split("T")[0]
      : "",
    amazing_offer: product.amazing_offer || "",
    amazing_offer_period: product.amazing_offer_period
      ? new Date(product.amazing_offer_period).toISOString().split("T")[0]
      : "",
    collection: product.collection || "",
    images_set: product.images_set || [],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 2xl:p-8 border border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300">
        <HeaderSection onNavigateBack={() => navigate(-1)} />

        <Formik
          initialValues={initialValues}
          validationSchema={productFormSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              <ImageUploadSection
                image={image[0]}
                firstImage={firstImage}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                setFieldValue={setFieldValue}
              />

              <BasicInfoSection
                selectedCategory={selectedCategory}
                isCategoryOpen={isCategoryOpen}
                setIsCategoryOpen={setIsCategoryOpen}
                selectedMainCategory={selectedMainCategory}
                setSelectedMainCategory={setSelectedMainCategory}
                mainCategories={mainCategories}
                subCategories={subCategories}
                setSelectedCategory={setSelectedCategory}
                setFieldValue={setFieldValue}
              />

              <PricingSection />

              <DiscountSection
                hasDiscount={hasDiscount}
                setHasDiscount={setHasDiscount}
                setFieldValue={setFieldValue}
              />

              <AmazingOfferSection
                isAmazingOffer={isAmazingOffer}
                setIsAmazingOffer={setIsAmazingOffer}
                setFieldValue={setFieldValue}
              />

              <CollectionSection
                isCollectionEnabled={isCollectionEnabled}
                setIsCollectionEnabled={setIsCollectionEnabled}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                collections={collections}
                isCollectionOpen={isCollectionOpen}
                setIsCollectionOpen={setIsCollectionOpen}
                setFieldValue={setFieldValue}
                onCreateCollection={() => setIsCreatePopupOpen(true)}
              />

              <DescriptionSection />

              <ActionButtons />

              {isCreatePopupOpen && (
                <CreateCollectionPopup
                  onClose={() => setIsCreatePopupOpen(false)}
                  setCollections={setCollections}
                  setSelectedCollection={setSelectedCollection}
                  setFieldValue={setFieldValue}
                />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default EditProduct;
