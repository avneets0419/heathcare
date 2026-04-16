import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getPatients = async (req: Request, res: Response) => {
    try {
        const { search = "", status = "", condition = "" } = req.query;
        const whereClause: any = {};

        if (search) {
            whereClause.OR = [
                {
                    name: { contains: String(search), mode: "insensitive" },
                },
                {
                    email: { contains: String(search), mode: "insensitive" },
                },
            ];
        }

        if (status) whereClause.status = String(status);
        if (condition) whereClause.condition = String(condition);

        const patients = await prisma.patient.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        res.json(patients);
    } catch (error) {
        console.error("Get Patients Error:", error);
        res.status(500).json({ error: "Failed to fetch patients" });
    }
};

export const createPatient = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, status, condition } = req.body;
        if (!name || !email || !phone) {
            return res
                .status(400)
                .json({ error: "Name, email and phone are required" });
        }

        const patient = await prisma.patient.create({
            data: {
                name,
                email,
                phone,
                status,
                condition,
            },
        });

        res.status(201).json(patient);
    } catch (error: any) {
        // ✅ FIX: handle duplicate email error
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Email already exists" });
        }

        console.error("Create Patient Error:", error);
        res.status(500).json({ error: "Failed to create patient" });
    }
};

// ✅ UPDATE Patient
export const updatePatient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, phone, status, condition } = req.body;

        const updatedPatient = await prisma.patient.update({
            where: { id },

            // ✅ FIX: prevent overwriting with undefined
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(status && { status }),
                ...(condition && { condition }),
            },
        });

        res.json(updatedPatient);
    } catch (error) {
        console.error("Update Patient Error:", error);
        res.status(500).json({ error: "Failed to update patient" });
    }
};

// ✅ DELETE Patient
export const deletePatient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.patient.delete({
            where: { id },
        });

        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        console.error("Delete Patient Error:", error);
        res.status(500).json({ error: "Failed to delete patient" });
    }
};