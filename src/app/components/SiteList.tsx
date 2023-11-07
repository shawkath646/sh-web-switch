import 'server-only';
import Item from '../components/Item';
import getData from "../lib/getData";

export default async function SiteList() {

  const siteList = await getData();

  return (
      <>
          <p className="text-2xl text-blue-300 mt-10 lg:mt-0">Site List</p>
          {siteList.length < 1 ? (
              <div className="w-full h-48 flex items-center justify-center">
                <p>No site added to list.</p>
              </div>
            ) : (
              <ul className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {siteList.map((e, k) => {
                  const createdAtDate = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt.seconds * 1000);
                  return <Item key={k} e={{ ...e, createdAt: createdAtDate }} />;
                })}
              </ul>
          )}
      </>
  );
}