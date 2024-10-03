import React, { useState, useEffect, useRef } from "react";
import { getMockData, MockData } from "../mock/MockData";

const InfiniteScroll = () => {
  const [items, setItems] = useState<MockData[]>([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isEnd) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isEnd]);

  useEffect(() => {
    if (!isEnd) {
      fetchData();
    }
  }, [page]);

  const fetchData = async () => {
    const { datas, isEnd } = await getMockData(page);
    setItems((prevItems) => [...prevItems, ...datas]);
    setIsEnd(isEnd);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>상품 리스트</h1>

      <div style={styles.fixedTotalPrice}>
        <h2>총 합계: ${totalPrice}</h2>
      </div>

      {items.map((item) => (
        <div key={item.productId} style={styles.itemContainer}>
          <p style={styles.itemText}>
            {item.productName} - ${item.price}
          </p>
        </div>
      ))}

      <div ref={observerRef} style={styles.loadingContainer}>
        <p>{isEnd ? "더 이상 데이터가 없습니다." : "로딩 중..."}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#F5F5F5",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  header: {
    color: "#2F4F4F",
    textAlign: "center",
    marginBottom: "20px",
  },
  fixedTotalPrice: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#2F4F4F",
    color: "#fff",
    padding: "8px",
    borderRadius: "8px",
  },
  itemContainer: {
    border: "2px solid #2F4F4F",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  itemText: {
    color: "#2F4F4F",
    fontSize: "16px",
  },
  loadingContainer: {
    height: "30px",
    backgroundColor: "#efefef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
};

export default InfiniteScroll;
