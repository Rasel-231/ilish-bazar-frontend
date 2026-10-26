"use client";

import { useEffect, useState } from "react";

type FishProduct = {
  id: number;
  name: string;
};

const FishProducts = () => {
  const [fish, setFish] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const response = await fetch("/ilish.json");
        const data: FishProduct[] = await response.json();
        setFish(data);
      } catch {
        setError("Failed to load fish products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFish();
  }, []);

  if (loading) {
    return <p>Loading fish products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {fish.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default FishProducts;
