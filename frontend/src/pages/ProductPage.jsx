import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import ProductHeader from "../components/ProductHeader";
import ProductList from "../components/ProductList";
import { getProducts, deleteProduct } from "../service/productService";

const ProductPage = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DaisyUI Alert notification state
  const [alertInfo, setAlertInfo] = useState(null);

  // DaisyUI Modal delete confirmation state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Check for navigation alert message (from Add or Edit pages)
  useEffect(() => {
    if (location.state?.message) {
      setAlertInfo({
        message: location.state.message,
        type: location.state.type || "success",
      });
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setAlertInfo(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message || "ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Trigger modal when user clicks delete
  const handleDeleteClick = (id, name) => {
    setProductToDelete({ id, name });
  };

  // Perform delete after user confirms in DaisyUI modal
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setAlertInfo({
        message: `ลบสินค้า "${productToDelete.name}" สำเร็จเรียบร้อย!`,
        type: "success",
      });
      setProductToDelete(null);
      setTimeout(() => setAlertInfo(null), 4000);
    } catch (err) {
      setAlertInfo({
        message: `เกิดข้อผิดพลาดในการลบสินค้า: ${err.message}`,
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ProductHeader */}
        <ProductHeader />

        {/* DaisyUI Alert Notification */}
        {alertInfo && (
          <div
            role="alert"
            className={`alert ${
              alertInfo.type === "success"
                ? "alert-success text-success-content"
                : alertInfo.type === "warning"
                  ? "alert-warning text-warning-content"
                  : "alert-error text-error-content"
            } shadow-lg transition-all flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              {alertInfo.type === "success" ? (
                <CheckCircle2 className="size-6 shrink-0" />
              ) : alertInfo.type === "warning" ? (
                <AlertTriangle className="size-6 shrink-0" />
              ) : (
                <AlertCircle className="size-6 shrink-0" />
              )}
              <span className="font-medium">{alertInfo.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlertInfo(null)}
              className="btn btn-ghost btn-xs btn-circle"
              title="ปิดการแจ้งเตือน"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">รายการสินค้าทั้งหมด</h2>
            <p className="text-sm text-base-content/60">
              พบสินค้าทั้งหมด {products.length} รายการ
            </p>
          </div>
          <Link to="/product/new" className="btn btn-primary gap-2">
            <Plus className="size-5" />
            เพิ่มสินค้าใหม่
          </Link>
        </div>

        {/* ProductList */}
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onDelete={handleDeleteClick}
        />

        {/* DaisyUI Delete Confirmation Modal */}
        {productToDelete && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <div className="flex items-center gap-3 text-error mb-3">
                <div className="p-2 rounded-xl bg-error/10">
                  <AlertTriangle className="size-6" />
                </div>
                <h3 className="font-bold text-lg text-base-content">
                  ยืนยันการลบสินค้า
                </h3>
              </div>
              <p className="py-2 text-base-content/80 text-sm">
                คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า{" "}
                <span className="font-semibold text-base-content underline">
                  &quot;{productToDelete.name}&quot;
                </span>{" "}
                ออกจากระบบ?
              </p>
              <p className="text-xs text-error mt-1">
                * ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
              </p>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setProductToDelete(null)}
                  disabled={deleting}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-error gap-2 text-white"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  {deleting ? "กำลังลบ..." : "ยืนยันการลบ"}
                </button>
              </div>
            </div>
            <div
              className="modal-backdrop bg-black/50"
              onClick={() => !deleting && setProductToDelete(null)}
            ></div>
          </dialog>
        )}
      </div>
    </main>
  );
};

export default ProductPage;
