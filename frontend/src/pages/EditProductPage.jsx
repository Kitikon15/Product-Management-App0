import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Loader2, AlertCircle, AlertTriangle, X } from "lucide-react";
import ProductHeader from "../components/ProductHeader";
import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../service/productService";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState(null); // { message, type: 'warning' | 'error' }
  const [productExists, setProductExists] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setAlertState(null);
        const data = await getProduct(id);
        if (data) {
          setName(data.name || "");
          setPrice(data.price !== undefined ? data.price : "");
          setDescription(data.description || "");
          setImage(data.image || "");
          setProductExists(true);
        } else {
          setProductExists(false);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setAlertState({
          message: err.message || "ไม่สามารถโหลดข้อมูลสินค้านี้ได้",
          type: "error",
        });
        setProductExists(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertState(null);

    // Validation using DaisyUI alert
    if (!name.trim()) {
      setAlertState({
        message: "กรุณาระบุชื่อสินค้า",
        type: "warning",
      });
      return;
    }
    if (price === "" || isNaN(price) || Number(price) < 0) {
      setAlertState({
        message: "กรุณาระบุราคาที่ถูกต้อง (ต้องเป็นตัวเลขที่ไม่ติดลบ)",
        type: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(id, {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image: image.trim(),
      });
      // Navigate to product page with DaisyUI success alert state
      navigate("/product", {
        state: {
          message: `แก้ไขข้อมูลสินค้า "${name.trim()}" สำเร็จเรียบร้อย!`,
          type: "success",
        },
      });
    } catch (err) {
      console.error("Failed to update product:", err);
      setAlertState({
        message: err.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/product");
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <ProductHeader />

        {/* DaisyUI Alert */}
        {alertState && (
          <div
            role="alert"
            className={`alert ${
              alertState.type === "warning"
                ? "alert-warning text-warning-content"
                : "alert-error text-error-content"
            } shadow-lg flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              {alertState.type === "warning" ? (
                <AlertTriangle className="size-6 shrink-0" />
              ) : (
                <AlertCircle className="size-6 shrink-0" />
              )}
              <span className="font-medium">{alertState.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlertState(null)}
              className="btn btn-ghost btn-xs btn-circle"
              title="ปิดการแจ้งเตือน"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="card bg-base-100 shadow-xl p-12 flex flex-col items-center justify-center">
            <Loader2 className="size-10 animate-spin text-primary mb-3" />
            <p className="text-base-content/70">กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        ) : !productExists ? (
          <div className="card bg-base-100 shadow-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">ไม่พบสินค้านี้ในระบบ</h3>
            <div className="card-actions justify-center mt-4">
              <Link to="/product" className="btn btn-outline gap-2">
                <ArrowLeft className="size-4" />
                กลับหน้ารายการสินค้า
              </Link>
            </div>
          </div>
        ) : (
          <ProductForm
            editingId={id}
            name={name}
            price={price}
            description={description}
            image={image}
            isSubmitting={isSubmitting}
            onNameChange={setName}
            onPriceChange={setPrice}
            onDescriptionChange={setDescription}
            onImageChange={setImage}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </main>
  );
};

export default EditProductPage;