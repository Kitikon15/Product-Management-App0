import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, AlertTriangle, X } from "lucide-react";
import ProductHeader from "../components/ProductHeader";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../service/productService";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState(null); // { message, type: 'warning' | 'error' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertState(null);

    // Validation using DaisyUI alert instead of window.alert
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
      await createProduct({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image: image.trim(),
      });
      // Navigate to product page with DaisyUI success alert state
      navigate("/product", {
        state: {
          message: `เพิ่มสินค้า "${name.trim()}" สำเร็จเรียบร้อย!`,
          type: "success",
        },
      });
    } catch (err) {
      console.error("Failed to create product:", err);
      setAlertState({
        message: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลสินค้า",
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

        <ProductForm
          editingId={null}
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
      </div>
    </main>
  );
};

export default AddProductPage;