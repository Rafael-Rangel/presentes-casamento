import { Header } from "@/components/Header";
import { NotFoundBody } from "@/components/not-found-body";

/** 404 global (URL sem correspondência): inclui header porque não passa pelo layout `(site)`. */
export default async function NotFound() {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">
        <NotFoundBody />
      </div>
    </>
  );
}
