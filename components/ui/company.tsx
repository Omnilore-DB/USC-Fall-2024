import { useRouter } from "next/navigation";

export default function Company() {
  const router = useRouter();
  function redirectToHome() {
    router.push("/login");
  }

  return (
    <div className="flex flex-row items-center space-x-2">
      <button
        className="rounded-md px-4 py-2 text-2xl font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-800"
        onClick={redirectToHome}
      >
        Omnilore
      </button>
    </div>
  );
}
