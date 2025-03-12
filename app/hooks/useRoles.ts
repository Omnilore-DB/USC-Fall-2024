import { useEffect, useState } from "react";

export const useRoles = () => {
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/roles');
                const data = await response.json();
                setRoles(data || []);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };

        fetchRoles();
    }, []);

    return roles;
};
