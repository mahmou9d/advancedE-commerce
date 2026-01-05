import { ChangeEvent, useRef, useState } from "react";
import "./Admin.css";
import { IoMdImages } from "react-icons/io";
import { Button, Spinner, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { TProduct } from "@customTypes/product";
import actAddProduct from "@store/products/act/actAddProduct";
import actEditProduct from "@store/products/act/actEditProduct";
import actDeleteProduct from "@store/products/act/actDeleteProduct";
import actGetProductsByCatPrefix from "@store/products/act/actGetProductsByCatPrefix";
import { useLocation, useNavigate } from "react-router-dom";
import { Loading } from "@components/feedback";

const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const API_KEY = "cabad257b34a18c7d587555fd97270e9";

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error("Error Uploading product");
  return data.data.url;
};

const Admin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.products);

  const location = useLocation();
  const product = location.state as TProduct | null;

  const [title, setTitle] = useState<string>(product?.title || "");
  const [offer, setOffer] = useState<number>(product?.offer as number);
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [limit, setLimit] = useState<number>(product?.max || 0);
  const [catprefix, setCatprefix] = useState<string>(product?.cat_prefix || "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.img || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting1, setIsSubmitting1] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !price ||
      !limit ||
      !catprefix ||
      (!imagePreview && !product?.img)
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    let finalImageURL = product?.img || "";

    try {
      if (imageFile) {
        finalImageURL = await uploadToImgBB(imageFile);
      }

      if (product?.id) {
        const updatedProduct = {
          ...product,
          title,
          offer,
          price,
          max: limit,
          img: finalImageURL,
          cat_prefix: catprefix,
        };

        await dispatch(
          actEditProduct({ product: updatedProduct, imageFile: null })
        );
        alert("✅ Product modified successfully");
      } else {
        const newProduct: Omit<TProduct, "id"> = {
          title,
          price,
          offer,
          max: limit,
          img: finalImageURL,
          cat_prefix: catprefix,
        };

        await dispatch(actAddProduct(newProduct));
        await dispatch(
          actGetProductsByCatPrefix(newProduct.cat_prefix as string)
        );
        alert("✅ Product Added successfully");
      }

      setTitle("");
      setPrice(0);
      setOffer(0);
      setLimit(0);
      setCatprefix("");
      setImageFile(null);
      setImagePreview(null);
      navigate("/", { replace: true });
    } catch (error) {
      alert("❌ An error occurred while submitting the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete a product ?"
    );
    if (!confirmDelete) return;

    setIsSubmitting1(true);
    try {
      await dispatch(actDeleteProduct(product.id as string));
      alert("🗑️ Product successfully deleted");
      navigate("/", { replace: true });
    } catch (err) {
      alert("❌ Product deleted failed");
    } finally {
      setIsSubmitting1(false);
    }
  };

  return (
    <Loading loading={loading} error={error} type="cart">
      <div className="center">
        {imagePreview ? (
          <div className="button1" style={{ marginTop: "10px" }}>
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: "100%", borderRadius: "10px", height: "100%" }}
              onClick={handleClick}
            />
          </div>
        ) : (
          <button className="button1" onClick={handleClick}>
            <IoMdImages style={{ fontSize: "160px" }} />
          </button>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="left">
          <Form.Group>
            <Form.Label className="font">Title</Form.Label>
            <Form.Control
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="font">Category</Form.Label>
            <Form.Select
              className="input"
              value={catprefix}
              onChange={(e) => setCatprefix(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="shoes">Shoes</option>
              <option value="electronics">Electronics</option>
              <option value="sport">Sport</option>
              <option value="kids">Kids</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
            </Form.Select>
          </Form.Group>

          <div className="price">
            <Form.Group>
              <Form.Label className="font">Price</Form.Label>
              <Form.Control
                className="input"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="font">Offer</Form.Label>
              <Form.Control
                className="input"
                type="number"
                value={offer}
                onChange={(e) => setOffer(Number(e.target.value))}
                placeholder="0"
              />
            </Form.Group>
          </div>

          <Form.Group>
            <Form.Label className="font">Limit</Form.Label>
            <Form.Control
              className="input"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              placeholder="0"
            />
          </Form.Group>

          <div className="toggleGroup">
            <Button
              style={{ width: "100%", marginTop: "10px" }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                </>
              ) : product?.id ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>

            {product?.id && (
              <Button
                variant="danger"
                style={{ width: "100%", marginTop: "10px" }}
                onClick={handleDelete}
                disabled={isSubmitting1}
              >
                {isSubmitting1 ? (
                  <>
                    <Spinner animation="border" size="sm" />
                  </>
                ) : (
                  "Delete Product"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default Admin;
