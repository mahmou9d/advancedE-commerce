import { Category } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import GridList from "@components/common/GridList/GridList";
import useCategories from "@hooks/useCategories";

const Categories = () => {
  const { loading, error, records } = useCategories();

  return (
    <div className="min-h-screen bg-slate-950 py-10 sm:pt-14 sm:pb-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Categories
          </h1>
          <p className="mt-2 text-base text-slate-400">Browse our collection</p>
          <div
            aria-hidden="true"
            className="mt-4 h-1 w-16 rounded-full bg-blue-600"
          />
        </header>

        <section aria-label="Category list">
          <Loading loading={loading} error={error} type="category">
            <GridList
              records={records}
              renderItem={(record) => <Category {...record} />}
            />
          </Loading>
        </section>
      </div>
    </div>
  );
};

export default Categories;
