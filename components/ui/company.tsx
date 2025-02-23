
import { useRouter } from 'next/navigation';

export default function Company() {
    const router = useRouter();
    function redirectToHome() {
        router.push('/login');
    }

    return (
        <div className="flex flex-row items-center space-x-2">
            <button className="text-2xl font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-md" onClick={redirectToHome}>
                Omnilore
            </button>
        </div>
    );
}