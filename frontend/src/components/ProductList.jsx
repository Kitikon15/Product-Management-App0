import React from "react";
import { Link } from "react-router";
import { Pencil, Trash2, Image as ImageIcon, PackageOpen } from "lucide-react";

const ProductList = ({ products, loading, error, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card bg-base-100 shadow-md animate-pulse">
            <div className="h-48 bg-base-300 w-full rounded-t-2xl"></div>
            <div className="card-body space-y-3">
              <div className="h-5 bg-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2"></div>
              <div className="h-8 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <span>เกิดข้อผิดพลาด: {error}</span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md py-12 text-center">
        <div className="card-body items-center justify-center">
          <PackageOpen className="size-16 text-base-content/40 mb-2" />
          <h3 className="text-xl font-semibold">ยังไม่มีข้อมูลสินค้า</h3>
          <p className="text-base-content/60 text-sm">
            คุณสามารถเริ่มต้นเพิ่มสินค้าใหม่ได้โดยคลิกปุ่ม &quot;เพิ่มสินค้า&quot;
          </p>
          <div className="card-actions mt-4">
            <Link to="/product/new" className="btn btn-primary">
              เพิ่มสินค้าชิ้นแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 overflow-hidden flex flex-col justify-between"
        >
          <div>
            <figure className="h-48 bg-base-200 relative overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center text-base-content/40">
                  <ImageIcon className="size-12 mb-1" />
                  <span className="text-xs">ไม่มีรูปภาพ</span>
                </div>
              )}
              <span className="badge badge-primary absolute top-3 right-3 font-semibold shadow">
                ฿{Number(product.price).toLocaleString()}
              </span>
            </figure>

            <div className="card-body p-5">
              <h2 className="card-title text-lg font-bold text-base-content line-clamp-1">
                {product.name}
              </h2>
              <p className="text-sm text-base-content/70 line-clamp-2 min-h-10">
                {product.description || "ไม่มีรายละเอียดสินค้า"}
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 border-t border-base-200/50 mt-2">
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-base-content/50">
                รหัส: #{product.id}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to={`/product/${product.id}/edit`}
                  className="btn btn-sm btn-outline btn-info gap-1"
                  title="แก้ไขสินค้า"
                >
                  <Pencil className="size-4" />
                  แก้ไข
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(product.id, product.name)}
                  className="btn btn-sm btn-outline btn-error gap-1"
                  title="ลบสินค้า"
                >
                  <Trash2 className="size-4" />
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
