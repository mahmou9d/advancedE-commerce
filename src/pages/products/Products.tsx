import { Loading } from "@components/feedback";
import { Product } from "@components/eCommerce";
import GridList from "@components/common/GridList/GridList";
import useProducts from "@hooks/useProducts";

const Products = () => {
  const { loading, error, productsFullInfo, productPrefix } = useProducts();

  const title = productPrefix
    ? `${productPrefix.charAt(0).toUpperCase() + productPrefix.slice(1)} Products`
    : "Products";

  return (
    <div className="min-h-screen bg-slate-950 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Discover our latest collection
          </p>
          <div
            aria-hidden="true"
            className="mt-4 h-1 w-16 rounded-full bg-blue-600"
          />
        </header>

        <section aria-label="Product list">
          <Loading loading={loading} error={error} type="product">
            <GridList
              records={productsFullInfo}
              renderItem={(record) => <Product {...record} showOffer={false} />}
            />
          </Loading>
        </section>
      </div>
    </div>
  );
};

export default Products;
