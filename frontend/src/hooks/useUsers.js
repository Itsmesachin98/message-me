import { useState, useEffect } from "react";

const useUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/users");
                const data = await res.json();

                setUsers(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    return users;
};

export default useUsers;
