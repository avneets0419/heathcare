export type LoginFormData = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        role: "patient" | "doctor" | "admin";
    };
};