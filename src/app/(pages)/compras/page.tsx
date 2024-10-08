'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageCompras from '@/components/pages/compras/PageCompras';

interface Compra {
  _id: string;
  CART_USER_ID: string;
  CART_PRODUCT: {
    PRODUCT_ID: string;
    PRODUCT_QUANTITY: number;
    _id: string;
  }[];
  CART_PRICE: number;
  CART_STATUS: 'active' | 'completed' | 'canceled';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function CarrinhoPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCompras = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 404) {
          setCompras([]);
          setFetchLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch compras');
        }

        const data: Compra[] = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCompras(sortedData);
      } catch (error) {
        setFetchError((error as Error).message);
      } finally {
        setFetchLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCompras();
    }
  }, [isAuthenticated, router]);

  if (isLoading || fetchLoading) {
    return <Loading />;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return <PageCompras compras={compras} />;
}