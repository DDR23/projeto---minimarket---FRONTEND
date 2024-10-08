import DialogQrcode from "@/components/dialogCarrinho/DialogQrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import formatDate from "@/utils/formatDate";
import formatPrice from "@/utils/formatPrice";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  PRODUCT_CATEGORY: string;
  PRODUCT_DELETED: boolean;
  PRODUCT_NAME: string;
  PRODUCT_PRICE: number;
  PRODUCT_QUANTITY: number;
  PRODUCT_ID?: string;
}

interface Compra {
  _id: string;
  CART_PRICE: number;
  CART_PRODUCT: Array<{
    PRODUCT_ID: string;
    PRODUCT_QUANTITY: number;
  }>;
  CART_STATUS: string;
  CART_USER_ID: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PageCompraIdProps {
  compra: Compra | null;
  produtos: Product[];
}

const statusMap: { [key: string]: { label: string, color: string } } = {
  active: { label: 'Pendente', color: 'bg-orange-400' },
  completed: { label: 'Concluída', color: 'bg-green-500' },
  canceled: { label: 'Cancelada', color: 'bg-red-500' }
};

function getStatusLabelAndClass(status: string) {
  return statusMap[status] || { label: 'Desconhecido', color: 'bg-gray-500' };
}

export default function PageCompraId({ compra, produtos }: PageCompraIdProps) {
  const router = useRouter();

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center gap-2">
          <ChevronLeft onClick={() => router.back()} />
          <h1 className="text-lg font-semibold md:text-2xl">Detalhes da Compra</h1>
        </div>
        <div
          className="rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
        >
          <Card
            className="overflow-hidden w-full" x-chunk="dashboard-05-chunk-4"
          >
            <CardHeader className="flex flex-row items-start bg-muted/50 py-4">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-sm pr-5">
                  Nº da compra {compra?._id}
                </CardTitle>
                <CardDescription>{formatDate(compra?.createdAt)}</CardDescription>
              </div>
              <div className="ml-auto flex items-center !mt-0 gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${getStatusLabelAndClass(compra?.CART_STATUS || '').color}`} />
                <CardDescription className="text-[10px]">{getStatusLabelAndClass(compra?.CART_STATUS || '').label}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-4 text-sm">
              <div className="grid gap-4">
                <div className="font-semibold px-2">Produtos</div>
                <ScrollArea className="h-[40vh] w-full overflow-auto border py-2 rounded-lg">
                  <ul className="grid gap-3 mx-4">
                    {produtos.map((produto, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {produto.PRODUCT_NAME} x <span>{produto.PRODUCT_QUANTITY}</span>
                        </span>
                        <span>{formatPrice(produto.PRODUCT_PRICE * produto.PRODUCT_QUANTITY)}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-end gap-4 font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>{formatPrice(compra?.CART_PRICE)}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-between items-center bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Essa compra ainda nao foi paga?
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={compra?.CART_STATUS !== 'active'}>
                    <span>
                      pagar
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[28rem] max-w-[90vw]">
                  <DialogQrcode price={formatPrice(compra?.CART_PRICE)} />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}