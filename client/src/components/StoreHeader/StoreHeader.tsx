import React, { useEffect, useState } from "react";
import { Store, emptyStore } from "src/interfaces";
import { fetchJson } from "src/utils";
import { STORE_API } from "src/constants";

function StoreHeader({ storeId }: { storeId: string | null }) {
  const [curStore, setCurStore] = useState<Store>(emptyStore());

  // fetch list of users
  const fetchStore = async () => {
    let data = {
      "store-id": storeId,
    };
    const stores = await fetchJson("POST", data, STORE_API);
    setCurStore(stores);
  };

  useEffect(() => {
    fetchStore();
  }, []);

  return (
    <div className="StoreHeader">
      <a href="/home">back</a>
      <h3>
        [{curStore.latitude},{curStore.longitude}]
      </h3>
      {curStore["store-id"] && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr key={curStore["store-id"]}>
              <td>{curStore["store-id"]}</td>
              <td>{curStore.name}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreHeader;